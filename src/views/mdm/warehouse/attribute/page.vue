<!-- Author [陈建峰],  Since 2026-01-19 16:47:27,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px">
      <el-form-item label="属性名称" prop="attributeName">
        <el-input
          v-model="queryParams.attributeName"
          class="!w-200px"
          clearable
          placeholder="请输入属性名称"
        />
      </el-form-item>
      <el-form-item label="所属仓库" prop="warehouseId">
         <el-select
         class="!w-200px"
          v-model="queryParams.warehouseId" placeholder="请选择所属仓库" clearable>
              <el-option
                v-for="warehouse in warehouseList"
                :key="warehouse.id"
                :label="warehouse.warehouseName"
                :value="warehouse.id"/>
            </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索</el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button
        v-hasPermi="['']"
        plain
        type="primary"
        @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport" >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button>
      <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch">
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="关联仓库" align="center" width="180" prop="warehouseName" />
      <el-table-column label="属性名称" align="center" width="180" prop="attributeName" />
      <el-table-column label="温控与环境" align="center" width="180" prop="storageEnvironmentText" />
      <el-table-column label="存储偏好" align="center" width="180" prop="storageUnitPreference" />
      <el-table-column label="物料类型" align="center" width="180" prop="materialType" />
      <el-table-column label="库存周转特征" align="center" width="120" prop="inventoryTurnoverFeatureText" />
      <el-table-column label="清洁度等级" align="center" width="120" prop="cleanlinessLevelText" />
      <el-table-column label="安全等级" align="center" width="120" prop="securityLevelText" />
      <el-table-column label="作业模式" align="center" width="180" prop="operationMode" />
      <el-table-column label="作业时间" align="center" width="160" prop="operationTime" />
      <el-table-column label="最大存储容量" align="center" width="120" prop="maxStorageCapacity" />
      <el-table-column label="盘点周期" align="center" width="100" prop="inventoryCyclePeriodText" />
      <el-table-column label="消防等级" align="center" width="100" prop="fireSafetyLevelText" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"/>
      <el-table-column label="操作" align="center" min-width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']">&nbsp;编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['']">&nbsp;删除
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
  <WarehouseAttributeForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as WarehouseAttributeApi from '@/api/mdm/warehouse/attribute'
import * as WarehouseApi from '@/api/mdm/warehouse'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import WarehouseAttributeForm from './form.vue'

defineOptions({ name: 'WarehouseAttributePage' })

const message = useMessage()
const { t } = useI18n()

const warehouseList = ref<WarehouseApi.WarehouseDto[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warehouseId: undefined,
  attributeName: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询仓库属性管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseAttributeApi.getWarehouseAttributePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WarehouseAttributeApi.deleteWarehouseAttributeById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: WarehouseAttributeApi.WarehouseAttributeDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await WarehouseAttributeApi.deleteWarehouseAttributeByIds(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await WarehouseAttributeApi.exportWarehouseAttribute(queryParams)
    download.excel(data, '仓库属性管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getWarehouseList = async () => {
  try {
    const result = await WarehouseApi.listOfWarehouse({} as any)
    warehouseList.value = result || []
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    warehouseList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getWarehouseList()
})
</script>
<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097BA;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #D54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #A5D867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}
</style>