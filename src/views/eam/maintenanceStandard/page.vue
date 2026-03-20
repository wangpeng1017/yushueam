<template>
  <div class="maintenance-standard-page">
    <!-- ==================== 上方：标准列表区域 ==================== -->
    <ContentWrap>
      <!-- 搜索区 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="标准编号" prop="code">
          <el-input
            v-model="queryParams.code"
            class="!w-200px"
            clearable
            placeholder="请输入标准编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标准名称" prop="name">
          <el-input
            v-model="queryParams.name"
            class="!w-200px"
            clearable
            placeholder="请输入标准名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 主表列表 -->
    <ContentWrap>
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <el-button
          v-hasPermi="[PERMI.CREATE]"
          plain
          type="primary"
          @click="openStandardForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="标准编号" align="center" prop="code" width="140" />
        <el-table-column label="标准名称" align="center" prop="name" min-width="200" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
        <el-table-column label="排序" align="center" prop="seq" width="80" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template #default="scope">
            <el-button
              link
              class="btn-other"
              v-hasPermi="[PERMI.QUERY]"
              @click="openStandardForm('view', scope.row)"
            >
              &nbsp;查看
            </el-button>
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openStandardForm('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handleDelete(scope.row)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <!-- ==================== 下方：标准项清单区域 ==================== -->
    <ContentWrap>
      <div class="item-section-title">标准项清单</div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.CREATE]"
          plain
          type="primary"
          :disabled="!currentStandardCode"
          @click="openItemForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="itemSelectedIds.length === 0"
          @click="handleItemBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
        </el-button>
      </div>

      <el-table
        v-loading="itemLoading"
        :data="itemList"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleItemSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养部位" align="center" prop="maintenancePart" min-width="200" />
        <el-table-column label="保养标准" align="center" prop="remark" min-width="200" />
        <el-table-column label="排序" align="center" prop="seq" width="80" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="140">
          <template #default="scope">
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openItemForm('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handleItemDelete(scope.row)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 子表分页 -->
      <Pagination
        :total="itemTotal"
        v-model:page="itemQueryParams.pageNo"
        v-model:limit="itemQueryParams.pageSize"
        @pagination="getItemList"
      />
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <StandardForm ref="standardFormRef" @success="onStandardFormSuccess" />
    <ItemForm ref="itemFormRef" @success="onItemFormSuccess" />
  </div>
</template>

<script lang="ts" setup>
import * as StandardApi from '@/api/eam/maintenanceStandard'
import StandardForm from './form.vue'
import ItemForm from './item-form.vue'

defineOptions({ name: 'EamMaintenanceStandard' })

const message = useMessage()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:maintenanceStandard:query',
  CREATE: 'eam:maintenanceStandard:create',
  UPDATE: 'eam:maintenanceStandard:update',
  DELETE: 'eam:maintenanceStandard:delete'
}

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<StandardApi.StandardVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  code: undefined as string | undefined,
  name: undefined as string | undefined
})
const queryFormRef = ref()
const selectedIds = ref<string[]>([])
const currentStandardCode = ref('')

const getList = async () => {
  loading.value = true
  try {
    const res = await StandardApi.getStandardPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
      name: queryParams.name
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearItemSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  clearItemSection()
  handleQuery()
}

const handleSelectionChange = (rows: StandardApi.StandardVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
}

// 行样式：高亮选中行
const getRowClassName = ({ row }: { row: StandardApi.StandardVo }) => {
  return currentStandardCode.value === row.code ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: StandardApi.StandardVo) => {
  if (row.code === currentStandardCode.value) {
    return
  }
  currentStandardCode.value = row.code
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
  getItemList()
}

// ==================== 主表 CRUD ====================
const standardFormRef = ref()

const openStandardForm = (mode: 'create' | 'edit' | 'view', row?: StandardApi.StandardVo) => {
  standardFormRef.value.open(mode, row)
}

const handleDelete = async (row: StandardApi.StandardVo) => {
  try {
    await message.delConfirm()
    await StandardApi.deleteStandard(row.id)
    message.success('删除成功')
    // 如果删除的是当前选中标准，清空子表
    if (row.code === currentStandardCode.value) {
      clearItemSection()
    }
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  try {
    await message.delConfirm()
    await StandardApi.batchDeleteStandard(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearItemSection()
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const onStandardFormSuccess = () => {
  getList()
}

// ==================== 子表：标准项清单 ====================
const itemLoading = ref(false)
const itemTotal = ref(0)
const itemList = ref<StandardApi.StandardItemVo[]>([])
const itemQueryParams = reactive({
  pageNo: 1,
  pageSize: 5
})
const itemSelectedIds = ref<string[]>([])

const getItemList = async () => {
  if (!currentStandardCode.value) {
    return
  }
  itemLoading.value = true
  try {
    const res = await StandardApi.getStandardItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      maintenanceStandardCode: currentStandardCode.value
    })
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

const handleItemSelectionChange = (rows: StandardApi.StandardItemVo[]) => {
  itemSelectedIds.value = rows.map((r) => r.id)
}

const clearItemSection = () => {
  currentStandardCode.value = ''
  itemList.value = []
  itemTotal.value = 0
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
}

// ==================== 标准项 CRUD ====================
const itemFormRef = ref()

const openItemForm = (mode: 'create' | 'edit', row?: StandardApi.StandardItemVo) => {
  itemFormRef.value.open(mode, currentStandardCode.value, row)
}

const handleItemDelete = async (row: StandardApi.StandardItemVo) => {
  try {
    await message.delConfirm()
    await StandardApi.deleteStandardItem(row.id)
    message.success('删除成功')
    itemSelectedIds.value = []
    getItemList()
  } catch {
    // 用户取消
  }
}

const handleItemBatchDelete = async () => {
  try {
    await message.delConfirm()
    await StandardApi.batchDeleteStandardItem(itemSelectedIds.value.join(','))
    message.success('批量删除成功')
    itemSelectedIds.value = []
    getItemList()
  } catch {
    // 用户取消
  }
}

const onItemFormSuccess = () => {
  getItemList()
}

// ==================== 初始化 ====================
onMounted(async () => {
  await getList()
})
</script>

<style lang="scss" scoped>
.maintenance-standard-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式（与其他模块保持一致）
:deep(.el-button.btn-edit) {
  color: #0097ba;

  &:hover {
    color: rgb(0 151 186 / 75%);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>
