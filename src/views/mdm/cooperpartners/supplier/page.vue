<!-- Author [陈建峰],  Since 2026-01-20 15:37:08,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="供应商编码" prop="supplierCode">
        <el-input
          v-model="queryParams.supplierCode"
          class="!w-200px"
          clearable
          placeholder="请输入供应商编码"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          class="!w-200px"
          clearable
          placeholder="请输入供应商名称"
        />
      </el-form-item>
      <el-form-item label="供应商类型" prop="supplierType">
        <el-select
          v-model="queryParams.supplierType"
          class="!w-200px"
          clearable
          placeholder="请选择供应商类型"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SUPPLIER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合作状态" prop="cooperationStatus">
        <el-select
          v-model="queryParams.cooperationStatus"
          class="!w-200px"
          clearable
          placeholder="请选择合作状态"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COOPERATION_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="评估等级" prop="evalLevel">
        <el-select
          v-model="queryParams.evalLevel"
          class="!w-200px"
          clearable
          placeholder="请选择评估等级"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SUPPLIER_EVALUATION_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />&nbsp;搜索</el-button
        >
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />&nbsp;重置</el-button
        >
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button v-hasPermi="['']" plain type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport"
      >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button>
      <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch"
      >
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <!--      <el-table-column align="center" label="主键" prop="id" />-->
      <el-table-column align="center" label="供应商编码" prop="supplierCode">
        <template #default="scope">
          <div class="flex justify-center items-center gap-1">
            <Icon icon="ep:van" />
            <span>{{ scope.row.supplierCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商名称" prop="supplierName" />
      <el-table-column align="center" label="供应商类型" prop="supplierType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SUPPLIER_TYPE" :value="scope.row.supplierType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="合作状态" prop="cooperationStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COOPERATION_STATUS" :value="scope.row.cooperationStatus" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="评估等级" prop="evalLevel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SUPPLIER_EVALUATION_LEVEL" :value="scope.row.evalLevel" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" prop="primaryContact">
        <template #default="scope">
          <div class="flex flex-col">
            <span>{{ scope.row.primaryContact }}</span>
            <span>{{ scope.row.contactPhone }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="近期绩效 (合格率 | 准时率)" prop="recentQualifiedRate">
        <template #default="scope">
          <div class="flex flex-col">
            <span
              v-if="scope.row.recentQualifiedRate"
              class="flex justify-center items-center gap-1"
            >
              <Icon color="#40BC6F" icon="ep:circle-check" />
              {{ scope.row.recentQualifiedRate }}</span
            >
            <span v-if="scope.row.recentOtdRate" class="flex justify-center items-center gap-1">
              <Icon color="#155DFC" icon="ep:alarm-clock" />
              {{ scope.row.recentOtdRate }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="130">
        <template #default="scope">
          <el-button
            v-hasPermi="['']"
            class="btn-edit"
            link
            @click="viewsMaterials(scope.row.id, scope.row.supplierName)"
            >查看物料清单</el-button
          >
          <el-button
            v-hasPermi="['']"
            class="btn-edit"
            link
            @click="openForm('update', scope.row.id)"
            >&nbsp;编辑
          </el-button>
          <el-button v-hasPermi="['']" class="btn-delete" link @click="handleDelete(scope.row.id)"
            >&nbsp;删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <CooperpartnersSupplierForm ref="formRef" @success="getList" />
  <ViewMaterialsModel ref="viewsMaterialsRef"/>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as CooperpartnersSupplierApi from '@/api/mdm/cooperpartners/supplier'
import CooperpartnersSupplierForm from './form.vue'
import download from '@/utils/download'
import ViewMaterialsModel from '@/views/mdm/cooperpartners/supplier/ViewMaterialsModel.vue'
defineOptions({ name: 'CooperpartnersSupplierPage' })
const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  supplierType: '',
  cooperationStatus: '',
  supplierCode: '',
  supplierName: '',
  evalLevel: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)
/** 查询供应商管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CooperpartnersSupplierApi.getCooperpartnersSupplierPage(queryParams)
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
    await CooperpartnersSupplierApi.deleteCooperpartnersSupplierById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: CooperpartnersSupplierApi.CooperpartnersSupplierDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await CooperpartnersSupplierApi.deleteCooperpartnersSupplierByIds(checkedIds.value)
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
    const data = await CooperpartnersSupplierApi.exportCooperpartnersSupplier(queryParams)
    download.excel(data, '供应商管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 查看物料清单 **/
const viewsMaterialsRef = ref<InstanceType<typeof ViewMaterialsModel>>()
const viewsMaterials = (id: number, name: string) => {
  viewsMaterialsRef.value?.open(id, name)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097ba;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}
</style>
