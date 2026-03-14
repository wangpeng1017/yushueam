<template>
  <Dialog v-model="dialogVisible" :title="title" :width="width">
    <!-- 搜索区域 -->
    <el-form
      v-if="searchColumns.length > 0"
      class="-mb-15px"
      :model="searchParams"
      :inline="true"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item v-for="col in searchColumns" :key="col.prop" :label="col.label">
        <el-input
          v-model="searchParams[col.prop]"
          :placeholder="'请输入' + col.label"
          clearable
          class="!w-200px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
        </el-button>
        <el-button @click="handleReset">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      class="mt-10px"
      @current-change="handleCurrentChange"
      @row-dblclick="handleRowDblclick"
    >
      <el-table-column
        v-for="col in displayColumns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :width="col.width"
        :min-width="col.minWidth"
        align="center"
      />
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-if="showPagination"
      :total="total"
      v-model:page="pageNo"
      v-model:limit="pageSize"
      @pagination="loadData"
    />

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="!selectedRow" @click="handleConfirm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
defineOptions({ name: 'TableSelectDialog' })

export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  searchable?: boolean
}

export interface FieldMapping {
  from: string
  to: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
    columns: TableColumn[]
    fetchApi: (params: any) => Promise<any>
    fieldMapping: FieldMapping[]
    showPagination?: boolean
    /** 是否为分页接口，如果是则从 records/total 中取数据 */
    paginated?: boolean
  }>(),
  {
    title: '选择',
    width: '800px',
    showPagination: true,
    paginated: true
  }
)

const emit = defineEmits<{
  (e: 'select', row: any, mapping: Record<string, any>): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = ref(10)
const selectedRow = ref<any>(null)
const searchParams = reactive<Record<string, any>>({})

/** 可搜索列 */
const searchColumns = computed(() => props.columns.filter((col) => col.searchable))

/** 展示列 */
const displayColumns = computed(() => props.columns)

/** 加载数据 */
const loadData = async () => {
  loading.value = true
  try {
    const params: any = { ...searchParams }
    if (props.showPagination) {
      params.pageNo = pageNo.value
      params.pageSize = pageSize.value
    }
    const res = await props.fetchApi(params)
    if (props.paginated) {
      tableData.value = res?.records ?? []
      total.value = res?.total ?? 0
    } else {
      // 非分页接口，直接拿数组
      tableData.value = Array.isArray(res) ? res : []
      total.value = tableData.value.length
    }
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleSearch = () => {
  pageNo.value = 1
  loadData()
}

/** 重置搜索 */
const handleReset = () => {
  searchColumns.value.forEach((col) => {
    searchParams[col.prop] = undefined
  })
  handleSearch()
}

/** 行选中 */
const handleCurrentChange = (row: any) => {
  selectedRow.value = row
}

/** 行双击选中确认 */
const handleRowDblclick = (row: any) => {
  selectedRow.value = row
  handleConfirm()
}

/** 确认选择 */
const handleConfirm = () => {
  if (!selectedRow.value) return
  const mapped: Record<string, any> = {}
  props.fieldMapping.forEach((m) => {
    mapped[m.to] = selectedRow.value[m.from]
  })
  emit('select', selectedRow.value, mapped)
  dialogVisible.value = false
}

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  selectedRow.value = null
  // 重置搜索参数
  searchColumns.value.forEach((col) => {
    searchParams[col.prop] = undefined
  })
  pageNo.value = 1
  loadData()
}

defineExpose({ open })
</script>
