<template>
  <div class="maintenance-work-order-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="工单编号" prop="code">
          <el-input
            v-model="queryParams.code"
            class="!w-200px"
            clearable
            placeholder="请输入工单编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="保养状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择保养状态"
            clearable
            class="!w-200px"
          >
            <el-option
              v-for="item in searchStatusOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTimeRange">
          <el-date-picker
            v-model="createTimeRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="!w-240px"
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

    <!-- ==================== 主表列表 ==================== -->
    <ContentWrap>
      <div class="table-toolbar">
        <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;快速工单
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
        <el-button
          v-hasPermi="[PERMI.UPDATE]"
          plain
          type="warning"
          :disabled="selectedIds.length !== 1"
          @click="handleDispatch"
        >
          <Icon icon="ep:user" class="mr-5px" />&nbsp;派工
        </el-button>
        <el-button
          v-hasPermi="[PERMI.UPDATE]"
          plain
          type="success"
          :disabled="selectedIds.length !== 1"
          @click="handleComplete"
        >
          <Icon icon="ep:check" class="mr-5px" />&nbsp;完成工单
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
        <el-table-column label="保养单号" align="center" prop="code" width="160" />
        <el-table-column label="保养状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getMaintenanceWorkStatusType(scope.row.status)">
              {{ eamEnumStore.getMaintenanceWorkStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center" prop="planName" min-width="180" />
        <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
        <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="180" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="120" />
        <el-table-column label="设备型号" align="center" prop="equipmentModel" width="120" />
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="120" />
        <el-table-column label="保养开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="保养完成时间" align="center" prop="endTime" width="160" />
        <el-table-column label="保养用时" align="center" prop="useTime" width="100" />
        <el-table-column label="保养人" align="center" prop="personName" width="100" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button
              link
              class="btn-other"
              v-hasPermi="[PERMI.QUERY]"
              @click="openForm('view', scope.row)"
            >
              &nbsp;查看
            </el-button>
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              :disabled="scope.row.status !== '1'"
              @click="openForm('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              :disabled="scope.row.status !== '1'"
              @click="handleDelete(scope.row)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <!-- ==================== 下方：保养项子表（只读） ==================== -->
    <ContentWrap>
      <div class="item-section-header">保养项明细</div>
      <el-table
        v-loading="itemLoading"
        :data="itemList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养部位" align="center" prop="maintenancePart" min-width="200" />
        <el-table-column label="保养标准说明" align="center" prop="remark" min-width="200" />
        <el-table-column label="是否已保养" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag
              v-if="scope.row.status != null && scope.row.status !== ''"
              :type="eamEnumStore.getMaintenanceWorkItemStatusType(scope.row.status)"
            >
              {{ eamEnumStore.getMaintenanceWorkItemStatusText(scope.row.status) }}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="处理备注" align="center" prop="dealRemark" min-width="200" />
        <el-table-column label="排序" align="center" prop="seq" width="80" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      </el-table>
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <WorkOrderForm ref="formRef" @success="onFormSuccess" />

    <!-- 人员选择弹窗（派工用） -->
    <PersonSelectDialog ref="personDialogRef" @confirm="onDispatchPersonConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import * as WorkOrderApi from '@/api/eam/maintenanceWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import WorkOrderForm from './form.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'

defineOptions({ name: 'EamMaintenanceWorkOrder' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:maintenanceWorkOrder:query',
  CREATE: 'eam:maintenanceWorkOrder:create',
  UPDATE: 'eam:maintenanceWorkOrder:update',
  DELETE: 'eam:maintenanceWorkOrder:delete'
}

// ==================== 搜索条件 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<WorkOrderApi.WorkOrderVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined as string | undefined,
  status: undefined as string | undefined,
  createTime_begin: undefined as string | undefined,
  createTime_end: undefined as string | undefined
})
const queryFormRef = ref()
const createTimeRange = ref<string[]>([])

/** 搜索状态下拉仅显示 1/2/3（不显示已完成4） */
const searchStatusOptions = computed(() => {
  return eamEnumStore.getMaintenanceWorkStatusList.filter((item) =>
    ['1', '2', '3'].includes(item.value)
  )
})

// ==================== 列表选中状态 ====================
const selectedIds = ref<string[]>([])
const selectedRows = ref<WorkOrderApi.WorkOrderVo[]>([])
const currentRow = ref<WorkOrderApi.WorkOrderVo | null>(null)

// ==================== 主表列表 ====================
const getList = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (createTimeRange.value && createTimeRange.value.length === 2) {
      queryParams.createTime_begin = createTimeRange.value[0]
      queryParams.createTime_end = createTimeRange.value[1]
    } else {
      queryParams.createTime_begin = undefined
      queryParams.createTime_end = undefined
    }

    const res = await WorkOrderApi.getWorkOrderPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
      status: queryParams.status,
      createTime_begin: queryParams.createTime_begin,
      createTime_end: queryParams.createTime_end
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0

    // 刷新后更新当前选中行引用
    if (currentRow.value) {
      const found = list.value.find((r) => r.id === currentRow.value!.id)
      if (found) {
        currentRow.value = found
      } else {
        clearSubSection()
      }
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearSubSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  createTimeRange.value = []
  queryParams.createTime_begin = undefined
  queryParams.createTime_end = undefined
  clearSubSection()
  handleQuery()
}

const handleSelectionChange = (rows: WorkOrderApi.WorkOrderVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
  selectedRows.value = rows
}

const getRowClassName = ({ row }: { row: WorkOrderApi.WorkOrderVo }) => {
  return currentRow.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: WorkOrderApi.WorkOrderVo) => {
  if (row.id === currentRow.value?.id) return
  currentRow.value = row
  getItemList()
}

// ==================== 主表 CRUD ====================
const formRef = ref()

const openForm = (mode: 'create' | 'edit' | 'view', row?: WorkOrderApi.WorkOrderVo) => {
  formRef.value.open(mode, row)
}

const handleDelete = async (row: WorkOrderApi.WorkOrderVo) => {
  if (row.status !== '1') {
    message.warning('仅未开始状态的工单可删除')
    return
  }
  try {
    await message.delConfirm()
    await WorkOrderApi.deleteWorkOrder(row.id)
    message.success('删除成功')
    if (row.id === currentRow.value?.id) {
      clearSubSection()
    }
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  // 校验选中行状态
  const invalid = selectedRows.value.some((r) => r.status !== '1')
  if (invalid) {
    message.warning('请只选择未开始状态的工单')
    return
  }
  try {
    await message.delConfirm()
    await WorkOrderApi.batchDeleteWorkOrder(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearSubSection()
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const onFormSuccess = () => {
  getList()
}

// ==================== 派工 ====================
const personDialogRef = ref()
const dispatchTargetRow = ref<WorkOrderApi.WorkOrderVo | null>(null)

const handleDispatch = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '1') {
    message.warning('仅未开始状态的工单可派工')
    return
  }
  dispatchTargetRow.value = row
  personDialogRef.value?.open()
}

const onDispatchPersonConfirm = async (user: {
  id: number
  nickname: string
  username: string
}) => {
  if (!dispatchTargetRow.value) return
  try {
    await WorkOrderApi.dispatchWorkOrder({
      id: dispatchTargetRow.value.id,
      personSn: user.username,
      personName: user.nickname
    })
    message.success('派工成功')
    dispatchTargetRow.value = null
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // API 异常
  }
}

// ==================== 完成工单 ====================
const handleComplete = async () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (!row.startTime) {
    message.warning('请选择已开始的工单')
    return
  }
  try {
    await ElMessageBox.confirm('确认要完成该工单吗？', '提示', { type: 'warning' })
    await WorkOrderApi.completeWorkOrder({
      code: row.code,
      startTime: row.startTime,
      endTime: row.endTime
    })
    message.success('完成工单成功')
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 保养项子表（只读） ====================
const itemLoading = ref(false)
const itemList = ref<WorkOrderApi.WorkOrderItemVo[]>([])

const getItemList = async () => {
  if (!currentRow.value) return
  itemLoading.value = true
  try {
    const res = await WorkOrderApi.getWorkOrderItemPage({
      pageNo: 1,
      pageSize: 1000,
      workCode: currentRow.value.code
    })
    itemList.value = res.records ?? []
  } finally {
    itemLoading.value = false
  }
}

// ==================== 公共方法 ====================
const clearSubSection = () => {
  currentRow.value = null
  itemList.value = []
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadMaintenanceWorkOrderEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.maintenance-work-order-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-header {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式
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
