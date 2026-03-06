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
      <el-form-item label="库区编码" prop="areaCode">
        <el-input
          v-model="queryParams.areaCode"
          class="!w-200px"
          clearable
          placeholder="请输入库区编码"
        />
      </el-form-item>
      <el-form-item label="库区类型" prop="areaType">
        <el-select
            v-model="queryParams.areaType"
            placeholder="请选择库区类型"
            clearable
            class="!w-200px">
          <el-option
                v-for="warehouseType in warehouseAreaTypeList"
                  :key="warehouseType.value" :label="warehouseType.text" :value="warehouseType.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="库区状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-200px">
          <el-option
                v-for="wareshouseStatus in warehouseAreaStatusList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="ABC分类" prop="abcClass">
        <el-select
            v-model="queryParams.abcClass"
            placeholder="请选择ABC分类"
            clearable
            class="!w-200px">
          <el-option
                v-for="abcClass in warehouseAbcClassList"
                  :key="abcClass.value" :label="abcClass.text" :value="abcClass.value"/>
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
      <el-table-column label="库区编码" align="center" width="180" prop="areaCode" />
      <el-table-column label="库区名称" align="center" width="180" prop="areaName" />
      <el-table-column label="ABC分类" align="center" width="100" prop="areaAbcClassText" />
      <el-table-column label="库区类型" align="center" width="100" prop="areaTypeText" />
      <el-table-column label="状态" align="center" width="100" prop="areaStatusText" />
      <el-table-column label="库区属性" align="center" width="180" prop="areaAttributes" />
      <el-table-column label="描述" align="center" width="180" prop="description" />
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
  <WarehouseAreaForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as WarehouseAreaApi from '@/api/mdm/warehouse/area'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import WarehouseAreaForm from './form.vue'

defineOptions({ name: 'WarehouseAreaPage' })

const message = useMessage()
const { t } = useI18n()

const warehouseAreaStatusList = ref<EnumEntityOption[]>([])
const warehouseAreaTypeList = ref<EnumEntityOption[]>([])
const warehouseAbcClassList = ref<EnumEntityOption[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  areaType: '',
  status: '',
  abcClass: '',
  areaCode: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询库区管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseAreaApi.getWarehouseAreaPage(queryParams)
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
    await WarehouseAreaApi.deleteWarehouseAreaById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: WarehouseAreaApi.WarehouseAreaDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await WarehouseAreaApi.deleteWarehouseAreaByIds(checkedIds.value)
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
    const data = await WarehouseAreaApi.exportWarehouseArea(queryParams)
    download.excel(data, '库区管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getWarehouseAreaTypeList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfAreaType()
    warehouseAreaTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    warehouseAreaTypeList.value = []
  }
}

const getWarehouseAreaStatusList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfStatus()
    warehouseAreaStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseAreaStatusList.value = []
  }
}

const getWarehouseAbcClassList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfAbcClass()
    warehouseAbcClassList.value = result || []
  } catch (error) {
    console.error('获取ABC分类列表失败:', error)
    warehouseAbcClassList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getWarehouseAreaTypeList()
  getWarehouseAreaStatusList()
  getWarehouseAbcClassList()
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