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
      <el-form-item label="单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)" prop="unitType">
        <el-select
            v-model="queryParams.unitType"
            placeholder="请选择单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)"
            clearable
            class="!w-200px">
          <!-- <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MATERIAL_MATERIALPACKAGEUNIT_UNITTYPE)"
            :key="dict.value" :label="dict.label" :value="dict.value"/> -->
        </el-select>
      </el-form-item>
      <el-form-item label="条码/标签类型" prop="barcodeType">
        <el-select
            v-model="queryParams.barcodeType"
            placeholder="请选择条码/标签类型"
            clearable
            class="!w-200px">
          <!-- <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MATERIAL_MATERIALPACKAGEUNIT_BARCODETYPE)"
            :key="dict.value" :label="dict.label" :value="dict.value"/> -->
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
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="关联主表ID" align="center" prop="packageId" />
      <el-table-column label="单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)" align="center" prop="unitType" />
      <el-table-column label="单位代码，例如：EA, CTN, PTL" align="center" prop="unitCode" />
      <el-table-column label="换算关系" align="center" prop="conversionRatio" />
      <el-table-column label="长(mm)，数值(小数)，>0" align="center" prop="lengthMm" />
      <el-table-column label="宽(mm)，数值(小数)，>0" align="center" prop="widthMm" />
      <el-table-column label="高(mm)，数值(小数)，>0" align="center" prop="heightMm" />
      <el-table-column label="重量(kg)，数值(小数)，>0" align="center" prop="weightKg" />
      <el-table-column label="体积(m³)，数值(小数)，>0" align="center" prop="volumeM3" />
      <el-table-column label="条码/标签类型" align="center" prop="barcodeType" />
      <el-table-column label="是否允许拆包" align="center" prop="allowDisassemble" />
      <el-table-column label="是否为默认收货包装" align="center" prop="isDefaultReceiving" />
      <el-table-column label="是否为默认发货包装" align="center" prop="isDefaultShipping" />
      <el-table-column label="层级级别" align="center" prop="level" />
      <el-table-column label="父级换算ID" align="center" prop="parentUnitId" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"/>
      <el-table-column label="数据标识：0=正常，1=已删除" align="center" prop="deleted" />
      <el-table-column label="操作" align="center" min-width="130" fixed="right">
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
  <MaterialPackageUnitForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as MaterialPackageUnitApi from '@/api/mdm/materialPackageUnit'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import MaterialPackageUnitForm from './form.vue'

defineOptions({ name: 'MaterialPackageUnitPage' })

const message = useMessage()
const { t } = useI18n()

const warehouseTypeList = ref<EnumEntityOption[]>([])
const warehouseStatusList = ref<EnumEntityOption[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  unitType: '',
  barcodeType: '',
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询物料包装单元定义列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialPackageUnitApi.getMaterialPackageUnitPage(queryParams)
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
    await MaterialPackageUnitApi.deleteMaterialPackageUnitById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: MaterialPackageUnitApi.MaterialPackageUnitDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await MaterialPackageUnitApi.deleteMaterialPackageUnitByIds(checkedIds.value)
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
    const data = await MaterialPackageUnitApi.exportMaterialPackageUnit(queryParams)
    download.excel(data, '物料包装单元定义.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
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