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
      <el-form-item label="库位编码" prop="locationCode">
        <el-input
          v-model="queryParams.locationCode"
          class="!w-200px"
          clearable
          placeholder="请输入库位编码"
        />
      </el-form-item>
      <el-form-item label="库位类型" prop="locationType">
        <el-select
            v-model="queryParams.locationType"
            placeholder="请选择库位类型"
            clearable
            class="!w-200px">
          <el-option
                v-for="wareshouseStatus in warehouseLocationTypeList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-200px">
          <el-option
                v-for="wareshouseStatus in warehouseLocationStatusList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="拣选属性" prop="pickingType">
        <el-select
            v-model="queryParams.pickingType"
            placeholder="请选择拣选属性"
            clearable
            class="!w-200px">
          <el-option
                v-for="wareshouseStatus in warehouseLocationPickingTypeList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
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
      <!-- <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch">
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button> -->
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="所属仓库" align="center" width="180" prop="warehouseName" />
      <el-table-column label="所属库区" align="center" width="180" prop="warehouseAreaName" />
      <el-table-column label="库位编码" align="center" width="120" prop="locationCode" />
      <el-table-column label="库位名称" align="center" width="120" prop="locationName" />
      <el-table-column label="库位类型" align="center" width="120" prop="locationTypeText" />
      <el-table-column label="状态" align="center" width="120" prop="statusText" />
      <el-table-column label="储位属性" align="center" width="180" prop="storageAttributes" />
      <el-table-column label="最大容量" align="center" width="100" prop="maxCapacity" />
      <el-table-column label="最小容量" align="center" width="100" prop="minCapacity" />
      <el-table-column label="长度（mm）" align="center" width="120" prop="lengthMm" />
      <el-table-column label="宽度（mm）" align="center" width="120" prop="widthMm" />
      <el-table-column label="高度（mm）" align="center" width="120" prop="heightMm" />
      <el-table-column label="承重（kg）" align="center" width="120" prop="loadCapacityKg" />
      <!-- <el-table-column label="存储环境" align="center" width="120" prop="storageEnvironment" /> -->
      <el-table-column label="存储级别" align="center" width="120" prop="storageLevelText" />
      <el-table-column label="拣选属性" align="center" width="120" prop="pickingTypeText" />
      <el-table-column label="巷道" align="center" width="100" prop="aisle" />
      <el-table-column label="排" align="center" width="100" prop="rowW" />
      <el-table-column label="列" align="center" width="100" prop="columnW" />
      <el-table-column label="层" align="center" width="100" prop="level" />
<!--      <el-table-column label="X坐标" align="center" width="120" prop="xCoordinate" />-->
<!--      <el-table-column label="Y坐标" align="center" width="120" prop="yCoordinate" />-->
<!--      <el-table-column label="Z坐标" align="center" width="120" prop="zCoordinate" />-->
      <el-table-column label="启用日期" align="center" width="160" prop="enableDate"  :formatter="dateFormatter2" />
      <el-table-column label="停用日期" align="center" width="160" prop="disableDate"  :formatter="dateFormatter2" />
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
  <WarehouseLocationForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as WarehouseLocationApi from '@/api/mdm/warehouse/location'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import WarehouseLocationForm from './form.vue'

defineOptions({ name: 'WarehouseLocationPage' })

const message = useMessage()
const { t } = useI18n()

const warehouseLocationStatusList = ref<EnumEntityOption[]>([])
const warehouseLocationTypeList = ref<EnumEntityOption[]>([])
const warehouseLocationPickingTypeList = ref<EnumEntityOption[]>([])
const storageLevelList = ref<EnumEntityOption[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  locationType: '',
  status: undefined,
  pickingType: '',
  locationCode: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询库位管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseLocationApi.getWarehouseLocationPage(queryParams)
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
    await WarehouseLocationApi.deleteWarehouseLocationById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: WarehouseLocationApi.WarehouseLocationDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await WarehouseLocationApi.deleteWarehouseLocationByIds(checkedIds.value)
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
    const data = await WarehouseLocationApi.exportWarehouseLocation(queryParams)
    download.excel(data, '库位管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getWarehouseLocationStatusList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfLocationStatus()
    warehouseLocationStatusList.value = result || []
  } catch (error) {
    warehouseLocationStatusList.value = []
  }
}

const getWarehouseLocationTypeList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfLocationType()
    warehouseLocationTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库位置类型列表失败:', error)
    warehouseLocationTypeList.value = []
  }
}

const getWarehouseLocationPickingTypeList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfPickingType()
    warehouseLocationPickingTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseLocationPickingTypeList.value = []
  }
}

const getStorageLevelList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfStorageLevel()
    storageLevelList.value = result || []
  } catch (error) {
    console.error('获取存储等级列表失败:', error)
    storageLevelList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getWarehouseLocationStatusList()
  getWarehouseLocationTypeList()
  getWarehouseLocationPickingTypeList()
  getStorageLevelList()
  getList()
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
