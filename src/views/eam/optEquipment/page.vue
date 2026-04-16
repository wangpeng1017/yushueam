<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="设备编号" prop="equipmentSn">
        <el-input
          v-model="queryParams.equipmentSn"
          class="!w-200px"
          clearable
          maxlength="15"
          placeholder="请输入设备编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          class="!w-200px"
          clearable
          maxlength="21"
          placeholder="请输入设备名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备标识" prop="equipmentTag">
        <el-input
          v-model="queryParams.equipmentTag"
          class="!w-200px"
          clearable
          maxlength="21"
          placeholder="请输入设备标识"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="equipmentType">
        <el-select
          v-model="queryParams.equipmentType"
          placeholder="请选择设备类型"
          clearable
          filterable
          class="!w-200px"
        >
          <el-option
            v-for="item in equipmentTypeOptions"
            :key="item.typeCode"
            :label="item.typeName"
            :value="item.typeCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资产状态" prop="equipmentStatus">
        <el-select
          v-model="queryParams.equipmentStatus"
          placeholder="请选择资产状态"
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="item in eamEnumStore.getEquipmentStatusList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态" prop="operationStatus">
        <el-select
          v-model="queryParams.operationStatus"
          placeholder="请选择运行状态"
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="item in eamEnumStore.getOperationStatusList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
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

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button
        v-hasPermi="[PERMI.DELETE]"
        plain
        type="danger"
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
      <!-- TODO: 后端导出接口返回 null，导出功能暂不可用 -->
      <!-- <el-button
        v-hasPermi="[PERMI.EXPORT]"
        plain
        type="success"
        @click="handleExport"
      >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button> -->
    </div>

    <!-- 设备分类 Tabs -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="mb-10px">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane
        v-for="tab in categoryTabs"
        :key="tab.categoryCode"
        :label="tab.categoryName"
        :name="tab.categoryCode"
      />
    </el-tabs>

    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="设备编号" align="center" prop="equipmentSn" width="120" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="150" />
      <el-table-column label="设备类型编码" align="center" prop="equipmentType" width="120" />
      <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" min-width="120" />
      <el-table-column label="设备分类编码" align="center" prop="equipmentCategory" width="120" />
      <el-table-column
        label="设备分类描述"
        align="center"
        prop="equipmentCategoryDesc"
        min-width="120"
      />
      <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120">
        <template #default="scope">
          {{ eamEnumStore.getEquipmentModeText(scope.row.equipmentMode) }}
        </template>
      </el-table-column>
      <el-table-column label="设备标识" align="center" prop="equipmentTag" width="100" />
      <el-table-column label="排序号" align="center" prop="sequenceNumber" width="80" />
      <el-table-column label="位置号" align="center" prop="locationSn" width="100" />
      <el-table-column label="供应商编号" align="center" prop="equipmentSupplier" width="120" />
      <el-table-column
        label="供应商名称"
        align="center"
        prop="equipmentSupplierName"
        min-width="120"
      />
      <el-table-column label="资产状态" align="center" prop="equipmentStatus" width="100">
        <template #default="scope">
          {{ eamEnumStore.getEquipmentStatusText(scope.row.equipmentStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="运行状态" align="center" prop="operationStatus" width="100">
        <template #default="scope">
          <span
            class="operation-status-dot"
            :class="getOperationStatusClass(scope.row.operationStatus)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="启停用状态" align="center" prop="equipmentRevstop" width="100">
        <template #default="scope">
          {{ eamEnumStore.getEquipmentRevstopText(scope.row.equipmentRevstop) }}
        </template>
      </el-table-column>
      <el-table-column label="购置时间" align="center" prop="equipmentPurchase" width="120" />
      <el-table-column label="投入运营时间" align="center" prop="equipmentOperating" width="120" />
      <!-- 宇树扩展字段 -->
      <el-table-column label="所属车间" align="center" prop="workshopName" width="110" />
      <el-table-column label="所属产线" align="center" prop="productionLineName" width="110" />
      <el-table-column label="责任人" align="center" prop="responsiblePersonName" width="100" />
      <el-table-column label="维保单位" align="center" prop="maintenanceUnit" width="100" />
      <el-table-column label="设备厂家" align="center" prop="manufacturer" width="100" />
      <el-table-column label="系统版本" align="center" prop="systemVersion" width="140" />
      <el-table-column label="通讯协议" align="center" prop="commProtocol" width="110" />
      <el-table-column label="通讯接口" align="center" prop="commInterface" width="150" />
      <el-table-column label="设备来源" align="center" prop="equipmentSource" width="90" />
      <!-- <el-table-column label="创建人" align="center" prop="createBy" width="100" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <!-- <el-table-column label="修改人" align="center" prop="updateBy" width="100" />
      <el-table-column
        label="修改时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      /> -->
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            link
            class="btn-other"
            v-hasPermi="[PERMI.QUERY]"
            @click="openDetail(scope.row.id)"
          >
            &nbsp;查看
          </el-button>
          <el-button
            link
            class="btn-edit"
            v-hasPermi="[PERMI.UPDATE]"
            @click="openForm('update', scope.row.id)"
          >
            &nbsp;编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            v-hasPermi="[PERMI.DELETE]"
            @click="handleDelete(scope.row.id)"
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

  <!-- 新增/编辑弹窗 -->
  <EquipmentForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <EquipmentDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'
import EquipmentForm from './form.vue'
import EquipmentDetail from './detail.vue'

defineOptions({ name: 'EamOptEquipment' })

const message = useMessage()
const { t } = useI18n()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识集中定义 ====================
const PERMI = {
  CREATE: 'eam:optEquipment:create',
  UPDATE: 'eam:optEquipment:update',
  DELETE: 'eam:optEquipment:delete',
  QUERY: 'eam:optEquipment:query',
  EXPORT: 'eam:optEquipment:export'
}

// ==================== 搜索下拉数据 ====================
const equipmentTypeOptions = ref<any[]>([])
const loadEquipmentTypeOptions = async () => {
  try {
    const data = await EquipmentApi.getEquipmentTypeAllList()
    equipmentTypeOptions.value = data || []
  } catch (error) {
    console.error('加载设备类型列表失败:', error)
  }
}

// ==================== 设备分类 Tabs ====================
const activeTab = ref('all')
const categoryTabs = ref<any[]>([])
const loadCategoryTabs = async () => {
  try {
    const res = await EquipmentApi.getEquipmentCategoryList()
    categoryTabs.value = res?.records ?? []
  } catch (error) {
    console.error('加载设备分类列表失败:', error)
  }
}
const handleTabChange = () => {
  queryParams.pageNo = 1
  getList()
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<EquipmentApi.OptEquipmentVo[]>([])
const selectedIds = ref<string[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  equipmentTag: undefined as string | undefined,
  equipmentType: undefined as string | undefined,
  equipmentStatus: undefined as string | undefined,
  operationStatus: undefined as string | undefined
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params: any = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      equipmentSn: queryParams.equipmentSn,
      equipmentName: queryParams.equipmentName,
      equipmentTag: queryParams.equipmentTag,
      equipmentType: queryParams.equipmentType,
      equipmentStatus: queryParams.equipmentStatus,
      operationStatus: queryParams.operationStatus
    }
    // Tab 分类过滤
    if (activeTab.value !== 'all') {
      params.equipmentCategory = activeTab.value
    }
    const res = await EquipmentApi.getEquipmentPage(params)
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
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 多选改变 */
const handleSelectionChange = (rows: EquipmentApi.OptEquipmentVo[]) => {
  selectedIds.value = rows.map((row) => row.id!)
}

// ==================== 运行状态彩色圆点 ====================
const getOperationStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    RUN: 'status-run',
    FAILURE: 'status-failure',
    STANDBY: 'status-standby',
    CLOSE: 'status-close'
  }
  return classMap[status] || ''
}

// ==================== 新增/编辑 ====================
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

// ==================== 详情 ====================
const detailRef = ref()
const openDetail = (id: string) => {
  detailRef.value.open(id)
}

// ==================== 删除 ====================
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    await EquipmentApi.deleteEquipment(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 批量删除 ====================
const handleBatchDelete = async () => {
  try {
    await message.delConfirm('是否确认删除选中的数据？')
    await EquipmentApi.deleteEquipmentBatch(selectedIds.value.join(','))
    message.success(t('common.delSuccess'))
    selectedIds.value = []
    await getList()
  } catch {}
}

// ==================== 初始化 ====================
onMounted(async () => {
  // 并行加载枚举、设备类型、设备分类
  await Promise.all([
    eamEnumStore.loadEquipmentEnums(),
    loadEquipmentTypeOptions(),
    loadCategoryTabs()
  ])
  // 加载列表数据
  await getList()
})
</script>

<style lang="scss" scoped>
.operation-status-dot {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.status-run {
  background: #3f9901;
}

.status-failure {
  background: #e13d35;
}

.status-standby {
  background: #f0c803;
}

.status-close {
  background: #989b9a;
}

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
