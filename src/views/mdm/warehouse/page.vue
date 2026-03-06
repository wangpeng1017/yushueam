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
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          class="!w-200px"
          clearable
          placeholder="请输入仓库编码"
        />
      </el-form-item>
      <el-form-item label="仓库类型" prop="warehouseType">
        <el-select
            v-model="queryParams.warehouseType"
            placeholder="请选择仓库类型"
            clearable
            class="!w-200px">
          <el-option
                v-for="warehouseType in warehouseTypeList"
                  :key="warehouseType.value" :label="warehouseType.text" :value="warehouseType.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="存储类型" prop="storageType">
        <el-select
            v-model="queryParams.storageType"
            placeholder="请选择存储类型"
            clearable
            class="!w-200px">
          <el-option
                v-for="storageTypeOption in warehouseStorageTypeList"
                  :key="storageTypeOption.value" :label="storageTypeOption.text" :value="storageTypeOption.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态仓库"
          clearable
          class="!w-200px">
          <el-option
                v-for="statusOption in warehouseStatusList"
                  :key="statusOption.value" :label="statusOption.text" :value="statusOption.value"/>
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
      <el-table-column label="仓库编码" align="center" width="180" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" width="180" prop="warehouseName" />
      <el-table-column label="仓库类型" align="center" width="100" prop="warehouseTypeText" />
      <el-table-column label="存储类型" align="center" width="100" prop="storageTypeText" />
      <el-table-column label="仓库状态" align="center" width="100" prop="statusText" />
      <el-table-column label="地址位置" align="center" width="180" prop="address" />
      <el-table-column label="负责人姓名" align="center" width="100" prop="contactPerson" />
      <el-table-column label="联系电话" align="center" width="120" prop="contactPhone" />
      <el-table-column label="仓库面积(m²)" align="center" width="100" prop="size" />
      <el-table-column label="仓库容积" align="center" width="100" prop="capacity" />
      <el-table-column label="启用日期" align="center" width="180" prop="enableDate" :formatter="dateFormatter2" />
      <el-table-column label="停用日期" align="center" width="180" prop="disableDate" :formatter="dateFormatter2" />
<!--      <el-table-column label="描述" align="center" prop="description" />-->
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
      @pagination="getList"/>
  </ContentWrap>
  <WarehouseForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as WarehouseApi from '@/api/mdm/warehouse'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import WarehouseForm from './form.vue'

defineOptions({ name: 'WarehousePage' })

const message = useMessage()
const { t } = useI18n()

const warehouseTypeList = ref<EnumEntityOption[]>([])
const warehouseStatusList = ref<EnumEntityOption[]>([])
const warehouseStorageTypeList = ref<EnumEntityOption[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warehouseType: '',
  storageType: '',
  status: undefined,
  warehouseCode: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询仓库管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseApi.getWarehousePage(queryParams)
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
    await WarehouseApi.deleteWarehouseById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: WarehouseApi.WarehouseDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await WarehouseApi.deleteWarehouseByIds(checkedIds.value)
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
    const data = await WarehouseApi.exportWarehouse(queryParams)
    download.excel(data, '仓库数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getWarehouseTypeList = async () => {
  try {
    const result = await WarehouseApi.listOfType()
    warehouseTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    warehouseTypeList.value = []
  }
}

const getWarehouseStatusList = async () => {
  try {
    const result = await WarehouseApi.listOfStatus()
    warehouseStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseStatusList.value = []
  }
}

const getWarehouseStorageTypeList = async () => {
  try {
    const result = await WarehouseApi.listOfStorageType()
    warehouseStorageTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库存储类型列表失败:', error)
    warehouseStorageTypeList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getWarehouseTypeList()
  getWarehouseStatusList()
  getWarehouseStorageTypeList()
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
