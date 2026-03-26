<template>
  <!-- 搜索区域 -->
  <ContentWrap>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="auto">
      <el-form-item label="维修单号" prop="repairCode">
        <el-input
          v-model="queryParams.repairCode"
          placeholder="请输入维修单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="报修工单号" prop="failureWorkOrderCode">
        <el-input
          v-model="queryParams.failureWorkOrderCode"
          placeholder="请输入报修工单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="equipmentSn">
        <el-input
          v-model="queryParams.equipmentSn"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="equipmentMode">
        <el-input
          v-model="queryParams.equipmentMode"
          placeholder="请输入设备型号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="item in statusOptionsForSearch"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表区域 -->
  <ContentWrap>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['eam:repairWorkOrder:create']"
        >
          <Icon icon="ep:plus" /> 创建快速工单
        </el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="维修单号" align="center" prop="repairCode" width="160" />
      <el-table-column label="维修状态" align="center" prop="status" width="100">
        <template #default="{ row }">
          <el-tag
            :type="eamEnumStore.getRepairWorkOrderStatusType(row.status)"
            size="small"
          >
            {{ eamEnumStore.getRepairWorkOrderStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维修人员" align="center" prop="repairPersonName" width="100" />
      <el-table-column label="维修开始时间" align="center" prop="repairBeginTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="维修结束时间" align="center" prop="repairEndTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" width="150" />
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName" width="120" />
      <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120" />
      <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="120" />
      <el-table-column label="故障描述" align="center" prop="remark" width="150" />
      <el-table-column label="紧急程度" align="center" prop="repairDegreeText" width="100" />
      <el-table-column label="故障等级" align="center" prop="breakdownLevelText" width="100" />
      <el-table-column label="故障时间" align="center" prop="breakdownTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="故障来源" align="center" prop="sourceType" width="100">
        <template #default="{ row }">
          {{ eamEnumStore.getRepairWorkOrderSourceText(row.sourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="停机时长" align="center" prop="shutdownDurationText" width="100" />
      <el-table-column label="确认人" align="center" prop="confirmPersonName" width="100" />
      <el-table-column label="报修工单号" align="center" prop="failureWorkOrderCode" width="160" />
      <el-table-column label="报修时间" align="center" prop="presentTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="报修人" align="center" prop="presentPersonName" width="100" />
      <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" fixed="right" width="280">
        <template #default="{ row }">
          <el-button
            v-if="row.status === '1'"
            link
            type="primary"
            @click="openForm('update', row)"
            v-hasPermi="['eam:repairWorkOrder:update']"
          >编辑</el-button>
          <el-button
            v-if="row.status === '1'"
            link
            type="primary"
            @click="handlePublish(row)"
            v-hasPermi="['eam:repairWorkOrder:publish']"
          >发布工单</el-button>
          <el-button
            link
            type="primary"
            @click="openDetail(row)"
            v-hasPermi="['eam:repairWorkOrder:query']"
          >查看</el-button>
          <el-button
            v-if="row.status === '2'"
            link
            type="primary"
            @click="handleAssign(row)"
            v-hasPermi="['eam:repairWorkOrder:assign']"
          >派工</el-button>
          <el-button
            v-if="row.status === '2' || row.status === '3'"
            link
            type="warning"
            @click="openRevokeDialog(row)"
            v-hasPermi="['eam:repairWorkOrder:revoke']"
          >撤单</el-button>
          <el-button
            v-if="['3', '4', '5'].includes(row.status)"
            link
            type="primary"
            @click="openReassignDialog(row)"
            v-hasPermi="['eam:repairWorkOrder:reassign']"
          >重新派工</el-button>
          <el-button
            v-if="row.status === '5'"
            link
            type="success"
            @click="handleConfirmComplete(row)"
            v-hasPermi="['eam:repairWorkOrder:confirm']"
          >完成工单</el-button>
          <el-button
            v-if="(row.status === '1' || row.status === '2') && row.sourceType === 'ks'"
            link
            type="danger"
            @click="handleDelete(row.id)"
            v-hasPermi="['eam:repairWorkOrder:delete']"
          >删除</el-button>
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

  <!-- 创建/编辑表单弹窗 -->
  <RepairWorkOrderForm ref="formRef" @success="getList" />

  <!-- 详情弹窗 -->
  <RepairWorkOrderDetail ref="detailRef" />

  <!-- ==================== 撤单弹窗 ==================== -->
  <Dialog v-model="revokeDialogVisible" title="撤单" width="500px">
    <el-form ref="revokeFormRef" :model="revokeForm" label-width="100px">
      <el-form-item label="维修单号">
        <el-input v-model="revokeForm.repairCode" disabled />
      </el-form-item>
      <el-form-item label="撤单原因" prop="reason">
        <el-input v-model="revokeForm.reason" type="textarea" :rows="4" placeholder="请输入撤单原因" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="revokeDialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="revokeLoading" @click="submitRevoke">确 定</el-button>
    </template>
  </Dialog>

  <!-- ==================== 重新派工弹窗 ==================== -->
  <Dialog v-model="reassignDialogVisible" title="重新派工" width="500px">
    <el-form ref="reassignFormRef" :model="reassignForm" :rules="reassignRules" label-width="100px">
      <el-form-item label="维修单号">
        <el-input v-model="reassignForm.repairCode" disabled />
      </el-form-item>
      <el-form-item label="维修人员" prop="repairPersonName">
        <div class="selector-wrap">
          <el-input
            v-model="reassignForm.repairPersonName"
            readonly
            placeholder="请选择维修人员"
            class="selector-input"
          >
            <template #suffix>
              <el-icon
                v-if="reassignForm.repairPersonName"
                class="clear-icon"
                @click.stop="clearReassignPerson"
              >
                <CircleClose />
              </el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="openReassignPersonSelect">选择</el-button>
        </div>
      </el-form-item>
      <el-form-item label="原因" prop="reason">
        <el-input v-model="reassignForm.reason" type="textarea" :rows="4" placeholder="请输入重新派工原因" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="reassignDialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="reassignLoading" @click="submitReassign">确 定</el-button>
    </template>
  </Dialog>

  <!-- ==================== 人员选择弹窗（派工 + 重新派工共用） ==================== -->
  <PersonSelectDialog ref="personDialogRef" @confirm="handlePersonConfirm" />
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/formatTime'
import * as RepairWorkOrderApi from '@/api/eam/repairWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import RepairWorkOrderForm from './form.vue'
import RepairWorkOrderDetail from './detail.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'

defineOptions({ name: 'EamRepairWorkOrder' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const loading = ref(true)
const list = ref<RepairWorkOrderApi.RepairWorkOrderVo[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repairCode: undefined as string | undefined,
  failureWorkOrderCode: undefined as string | undefined,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  equipmentMode: undefined as string | undefined,
  status: undefined as string | undefined
})
const queryFormRef = ref()
const createTimeRange = ref<[string, string] | undefined>()

/** 搜索下拉状态选项：排除"已完成"(status=6)，只显示前 5 项 */
const statusOptionsForSearch = computed(() => {
  return eamEnumStore.getRepairWorkOrderStatusList.filter((item) => item.value !== '6')
})

/** 创建时间 90 天限制 */
const disabledDate = (date: Date) => {
  if (!createTimeRange.value || createTimeRange.value.length === 0) return false
  const start = createTimeRange.value[0]
  if (!start) return false
  const startDate = new Date(start)
  const diff = Math.abs(date.getTime() - startDate.getTime())
  return diff > 90 * 24 * 60 * 60 * 1000
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params: RepairWorkOrderApi.RepairWorkOrderDto = {
      ...queryParams,
      createTime_begin: createTimeRange.value?.[0],
      createTime_end: createTimeRange.value?.[1]
    }
    // 默认排除"已完成"：status 未选择时传 1,2,3,4,5
    // if (!params.status) {
    //   params.status = '1,2,3,4,5'
    // }
    const res = await RepairWorkOrderApi.getRepairWorkOrderPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  createTimeRange.value = undefined
  handleQuery()
}

// ==================== 创建/编辑 ====================

const formRef = ref()
const openForm = (type: string, row?: RepairWorkOrderApi.RepairWorkOrderVo) => {
  formRef.value.open(type, row)
}

// ==================== 详情 ====================

const detailRef = ref()
const openDetail = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  detailRef.value.open(row)
}

// ==================== 发布工单 ====================

const handlePublish = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '1') {
    message.warning('维修工单状态不为[草稿]，无法发布')
    return
  }
  await message.confirm('是否确认发布该工单?', '确认')
  await RepairWorkOrderApi.publishOrder(row as any)
  message.success('发布成功')
  await getList()
}

// ==================== 派工 ====================

/** 当前操作类型：assign=派工, reassign=重新派工 */
const personSelectAction = ref<'assign' | 'reassign'>('assign')
const currentActionRow = ref<RepairWorkOrderApi.RepairWorkOrderVo>()
const personDialogRef = ref()

const handleAssign = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '2') {
    message.warning('维修工单状态不为[待分配]，无法派工')
    return
  }
  personSelectAction.value = 'assign'
  currentActionRow.value = row
  personDialogRef.value?.open()
}

const handlePersonConfirm = async (user: { id: number; nickname: string; username: string }) => {
  if (personSelectAction.value === 'assign' && currentActionRow.value) {
    // 派工
    await RepairWorkOrderApi.assignOrder({
      id: currentActionRow.value.id,
      repairPersonSn: user.username,
      repairPersonName: user.nickname
    })
    message.success('派工成功')
    await getList()
  } else if (personSelectAction.value === 'reassign') {
    // 重新派工 - 回填到重新派工表单
    reassignForm.repairPersonSn = user.username
    reassignForm.repairPersonName = user.nickname
  }
}

// ==================== 撤单 ====================

const revokeDialogVisible = ref(false)
const revokeLoading = ref(false)
const revokeFormRef = ref()
const revokeForm = reactive({
  id: '' as string,
  repairCode: '',
  reason: ''
})

const openRevokeDialog = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '2' && row.status !== '3') {
    message.warning('维修工单状态不为[待分配]或[已分配]，无法撤单')
    return
  }
  revokeForm.id = row.id
  revokeForm.repairCode = row.repairCode
  revokeForm.reason = ''
  revokeDialogVisible.value = true
}

const submitRevoke = async () => {
  revokeLoading.value = true
  try {
    await RepairWorkOrderApi.revokeOrder({
      id: revokeForm.id,
      reason: revokeForm.reason
    })
    message.success('撤单成功')
    revokeDialogVisible.value = false
    await getList()
  } finally {
    revokeLoading.value = false
  }
}

// ==================== 重新派工 ====================

const reassignDialogVisible = ref(false)
const reassignLoading = ref(false)
const reassignFormRef = ref()
const reassignForm = reactive({
  id: '' as string,
  repairCode: '',
  repairPersonSn: '',
  repairPersonName: '',
  reason: ''
})
const reassignRules = {
  repairPersonName: [{ required: true, message: '请选择维修人员', trigger: 'change' }]
}

const openReassignDialog = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (!['3', '4', '5'].includes(row.status)) {
    message.warning('维修工单当前状态无法重新派工')
    return
  }
  reassignForm.id = row.id
  reassignForm.repairCode = row.repairCode
  reassignForm.repairPersonSn = ''
  reassignForm.repairPersonName = ''
  reassignForm.reason = ''
  reassignDialogVisible.value = true
}

const openReassignPersonSelect = () => {
  personSelectAction.value = 'reassign'
  personDialogRef.value?.open()
}

const clearReassignPerson = () => {
  reassignForm.repairPersonSn = ''
  reassignForm.repairPersonName = ''
}

const submitReassign = async () => {
  const valid = await reassignFormRef.value?.validate().catch(() => false)
  if (!valid) return
  reassignLoading.value = true
  try {
    await RepairWorkOrderApi.reassignOrder({
      id: reassignForm.id,
      repairPersonSn: reassignForm.repairPersonSn,
      repairPersonName: reassignForm.repairPersonName,
      reason: reassignForm.reason
    })
    message.success('重新派工成功')
    reassignDialogVisible.value = false
    await getList()
  } finally {
    reassignLoading.value = false
  }
}

// ==================== 完成工单 ====================

const handleConfirmComplete = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '5') {
    message.warning('维修工单状态不为[待确认]，无法操作')
    return
  }
  await message.confirm('是否确认完成该工单?', '确认')
  await RepairWorkOrderApi.confirmComplete({ id: row.id })
  message.success('操作成功')
  await getList()
}

// ==================== 删除 ====================

const handleDelete = async (id: string) => {
  await message.confirm('确认删除该数据？', '提示')
  await RepairWorkOrderApi.deleteRepairWorkOrder(id)
  message.success('删除成功')
  await getList()
}

// ==================== 初始化 ====================

onMounted(async () => {
  await Promise.all([
    eamEnumStore.loadRepairWorkOrderStatus(),
    eamEnumStore.loadRepairWorkOrderSource()
  ])
  await getList()
})
</script>

<style lang="scss" scoped>
.selector-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}

.selector-input {
  flex: 1;
}

.clear-icon {
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}
</style>
