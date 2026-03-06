<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px">
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          class="!w-200px"
          clearable
          placeholder="请输入物料编码"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          class="!w-200px"
          clearable
          placeholder="请输入物料名称"
        />
      </el-form-item>
      <el-form-item label="物料状态" prop="materialStatus">
        <el-select
          v-model="queryParams.materialStatus"
          placeholder="请选择物料状态"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in materialStatusList"
            :key="dict.value" :label="dict.text" :value="dict.value"/>
        </el-select>
      </el-form-item>  
        <el-form-item label="物料分类" prop="materialCategory">
        <el-select
          v-model="queryParams.materialCategory"
          placeholder="请选择物料分类"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in materialCategoryList"
            :key="dict.value" :label="dict.text" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
          placeholder="请选择供应商"
          clearable
          filterable
          class="!w-200px">
          <el-option
            v-for="supplier in supplierList"
            :key="supplier.id"
            :label="`${supplier.supplierCode} - ${supplier.supplierName}`"
            :value="supplier.id"/>
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
      <!-- <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport" >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button> -->
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
      <el-table-column label="物料编码" align="center" width="140" prop="materialCode" show-overflow-tooltip />
      <el-table-column label="名称/描述" align="center" width="200" show-overflow-tooltip>
        <template #default="scope">
          <div style="text-align: left;">
            <div style="font-weight: 500; color: #303133;">{{ scope.row.materialName }}</div>
            <div style="font-size: 12px; color: #909399; margin-top: 2px;">{{ scope.row.description || '-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" align="center" width="150" prop="specification" show-overflow-tooltip />
      <el-table-column label="分类" align="center" width="120" prop="materialCategoryText" show-overflow-tooltip />
      <el-table-column label="基本单位" align="center" width="100" prop="baseUnitText" show-overflow-tooltip />
      <el-table-column label="物理属性 (mm | kg)" align="center" width="160" show-overflow-tooltip>
        <template #default="scope">
          <div style="text-align: left; font-size: 12px; color: #606266;">
            <div>LWH: {{ scope.row.lengthMm || 0 }}*{{ scope.row.widthMm || 0 }}*{{ scope.row.heightMm || 0 }}</div>
            <div style="margin-top: 2px;">GW: {{ scope.row.grossWeightKg || 0 }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="存储要求" align="center" width="120" show-overflow-tooltip>
        <template #default="scope">
          <div style="text-align: center;">
            <!-- 第一行：存储环境类型 -->
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
              <Icon icon="ep:box" style="margin-right: 4px; color: #409EFF;" />
              <span style="font-size: 12px; color: #303133;">
                {{ getDictLabel(DICT_TYPE.MATERIAL_STORAGE_CONDITION, scope.row.baseStorageCondition) || '-' }}
              </span>
            </div>
            <!-- 第二行：特殊存储条件 -->
            <div style="font-size: 11px; color: #909399;">
              {{ scope.row.storageCondition || '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管控" align="center" width="100" show-overflow-tooltip>
        <template #default="scope">
          <div style="text-align: center;">
            <!-- 启用批次管理的物料 -->
            <div v-if="scope.row.batchManagementEnabled">
              <el-tag size="small" type="primary" style="margin-bottom: 4px;">
                批次管理
              </el-tag>
              <div style="font-size: 11px; color: #606266; display: flex; align-items: center; justify-content: center;">
                <Icon icon="ep:barcode" style="margin-right: 2px;" />
                {{ scope.row.barcodeRuleName || '-' }}
              </div>
            </div>
            <!-- 普通管控 -->
            <div v-else style="color: #909399; font-size: 12px;">
              普通
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.materialStatus === 'A' ? 'success' : 'danger'" 
            size="small"
            style="display: inline-flex; align-items: center;">
            <!-- <Icon
              :icon="scope.row.materialStatus === 'A' ? 'ep:check' : 'ep:close'"
              style="margin-right: 4px;" /> -->
            <span>{{ scope.row.materialStatusText }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="250" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']">
            编辑
          </el-button>
          <el-button
            link
            :class="scope.row.materialStatus === 'A' ? 'btn-other' : 'btn-edit'"
            @click="handleToggleStatus(scope.row.id, scope.row.materialStatus)"
            v-hasPermi="['']">
            {{ scope.row.materialStatus === 'A' ? '停用' : '启用' }}
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['']">
            删除
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
  <MaterialForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as MaterialApi from '@/api/mdm/material'
import * as SupplierApi from '@/api/mdm/cooperpartners/supplier'
import download from '@/utils/download'
import MaterialForm from './form.vue'
import { DICT_TYPE,getDictLabel } from '@/utils/dict'

defineOptions({ name: 'MaterialPage' })

const message = useMessage()
const { t } = useI18n()

const materialStatusList = ref<EnumEntityOption[]>([])
const materialCategoryList = ref<EnumEntityOption[]>([])
const materialBaseUnitList = ref<EnumEntityOption[]>([])
const supplierList = ref<SupplierApi.CooperpartnersSupplierDto[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  materialStatus: '',
  materialCategory: '',
  materialCode: '',
  materialName: '',
  supplierId: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询物料管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialApi.getMaterialPage(queryParams)
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
    await MaterialApi.deleteMaterialById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 切换状态操作 */
const handleToggleStatus = async (id: number, currentStatus: string) => {
  try {
    const isActive = currentStatus === 'A'
    const action = isActive ? '停用' : '启用'
    const confirmText = `确定要${action}该物料档案吗？${isActive ? '停用后将无法在业务中使用。' : '启用后可以正常使用。'}`
    
    // 状态切换的二次确认
    await message.confirm(confirmText, `${action}确认`)
    // 调用切换状态API
    await MaterialApi.toggleMaterialStatusById(id)
    message.success(`物料档案已${action}`)
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: MaterialApi.MaterialDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await MaterialApi.exportMaterial(queryParams)
    download.excel(data, '物料管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getMaterialStatusList = async () => {
  try {
    const result = await MaterialApi.listOfStatus()
    materialStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialStatusList.value = []
  }
}

const listOfCategory = async () => {
  try {
    const result = await MaterialApi.listOfCategory()
    materialCategoryList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialCategoryList.value = []
  }
}

const listOfBaseUnit = async () => {
  try {
    const result = await MaterialApi.listOfBaseUnit()
    materialBaseUnitList.value = result || []
  } catch (error) {
    console.error('获取基础单位列表失败:', error)
    materialBaseUnitList.value = []
  }
}

const getSupplierList = async () => {
  try {
    const result = await SupplierApi.listOfCooperpartnersSupplier({} as SupplierApi.CooperpartnersSupplierDto)
    supplierList.value = result || []
  } catch (error) {
    console.error('获取供应商列表失败:', error)
    supplierList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getMaterialStatusList()
  listOfCategory()
  listOfBaseUnit()
  getSupplierList()
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
