<template>
  <ContentWrap>
    <!-- 搜索栏 -->
    <el-form v-if="searchFields && searchFields.length"
      class="-mb-15px" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item v-for="f in searchFields" :key="f.prop" :label="f.label" :prop="f.prop">
        <el-input v-model="queryParams[f.prop]" class="!w-200px" clearable
          :placeholder="`请输入${f.label}`" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <!-- 工具栏 -->
    <div class="mb-10px" v-if="enableCreate">
      <el-button type="primary" plain @click="$emit('create')">
        <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" border
      @row-dblclick="handleRowDblClick">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column v-for="col in columns" :key="col.prop"
        :label="col.label" :prop="col.prop" align="center"
        :width="col.width" :min-width="col.minWidth"
        :show-overflow-tooltip="true">
        <template v-if="col.formatter || col.tag" #default="{ row }">
          <el-tag v-if="col.tag" :type="col.tag(row)" size="small">{{ row[col.prop] }}</el-tag>
          <span v-else-if="col.formatter">{{ col.formatter(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="enableDetail || $slots.action" label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <el-button v-if="enableDetail" link type="primary" @click="openDetail(scope.row)">
            <Icon icon="ep:view" class="mr-3px" />详情
          </el-button>
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination class="mt-15px"
      :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="loadList" />
  </ContentWrap>

  <!-- 详情对话框 -->
  <el-dialog v-model="detailVisible" :title="detailTitle" width="900px">
    <el-descriptions :column="2" border>
      <el-descriptions-item v-for="col in detailColumns" :key="col.prop" :label="col.label" :span="col.span || 1">
        <el-tag v-if="col.tag" :type="col.tag(detailData)" size="small">{{ detailData[col.prop] }}</el-tag>
        <span v-else>{{ detailData[col.prop] || '--' }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import request from '@/config/axios'

const props = defineProps<{
  apiPath: string
  columns: Array<{ prop: string; label: string; width?: string | number; minWidth?: string | number; formatter?: (row: any) => string; tag?: (row: any) => string }>
  searchFields?: Array<{ prop: string; label: string }>
  enableCreate?: boolean
  enableDetail?: boolean
  detailTitleProp?: string
  /** 详情对话框额外字段定义；不传则使用 columns */
  detailExtraColumns?: Array<{ prop: string; label: string; span?: number; tag?: (row: any) => string }>
}>()

defineEmits<{
  (e: 'create'): void
}>()

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const queryParams = reactive<any>({ pageNo: 1, pageSize: 10 })

const detailVisible = ref(false)
const detailData = ref<any>({})
const detailTitle = computed(() => {
  if (!detailData.value) return '详情'
  const title = props.detailTitleProp ? detailData.value[props.detailTitleProp] : ''
  return title ? `详情 - ${title}` : '详情'
})
const detailColumns = computed(() => {
  if (props.detailExtraColumns && props.detailExtraColumns.length) return props.detailExtraColumns
  return props.columns.map(c => ({ prop: c.prop, label: c.label, tag: c.tag }))
})

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({ url: props.apiPath, params: queryParams })
    list.value = res?.records || res?.list || []
    total.value = res?.total || 0
  } catch (e) {
    console.error('Load list failed:', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNo = 1
  loadList()
}

function resetQuery() {
  Object.keys(queryParams).forEach(k => {
    if (k !== 'pageNo' && k !== 'pageSize') queryParams[k] = ''
  })
  queryParams.pageNo = 1
  loadList()
}

function openDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function handleRowDblClick(row: any) {
  if (props.enableDetail) openDetail(row)
}

onMounted(() => loadList())

defineExpose({ loadList, queryParams, openDetail })
</script>
