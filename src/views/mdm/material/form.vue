<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <!-- 描述文字 -->
    <div style="color: #909399; font-size: 14px; margin-bottom: 20px;">
      管理物料的基础信息、物理属性、存储要求及管控规则。
    </div>

    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <div 
        v-for="(tab) in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key">
        {{ tab.label }}
      </div>
    </div>

    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="160px"
      class="material-form">

      <!-- 基础信息 Tab -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input 
                v-model="formData.materialCode" 
                placeholder="请输入物料编码" 
                maxlength="32"
                show-word-limit
                style="width: 280px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料分类" prop="materialCategory">
              <el-select
                v-model="formData.materialCategory"
                placeholder="请选择物料分类"
                style="width: 280px;">
                <el-option
                  v-for="category in materialCategoryList"
                  :key="category.value" 
                  :label="category.text" 
                  :value="category.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料名称" prop="materialName">
              <el-input 
                v-model="formData.materialName" 
                placeholder="请输入物料名称" 
                maxlength="64"
                show-word-limit
                style="width: 280px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基本计量单位" prop="baseUnit">
              <el-select
                v-model="formData.baseUnit"
                placeholder="请选择基本计量单位"
                style="width: 280px;">
                <el-option
                  v-for="unit in materialBaseUnitList"
                  :key="unit.value" 
                  :label="unit.text" 
                  :value="unit.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specification">
              <el-input 
                v-model="formData.specification" 
                placeholder="请输入规格型号" 
                maxlength="128"
                show-word-limit
                style="width: 280px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料状态" prop="materialStatus">
              <el-select
                v-model="formData.materialStatus"
                placeholder="请选择物料状态"
                style="width: 280px;">
                <el-option
                  v-for="status in materialStatusList"
                  :key="status.value" 
                  :label="status.text" 
                  :value="status.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="供应商" prop="supplierIds">
              <el-select
                v-model="selectedSupplierIds"
                multiple
                placeholder="请选择供应商"
                style="width: 100%;"
                clearable
                filterable
                value-key="id">
                <el-option
                  v-for="supplier in supplierList"
                  :key="supplier.id"
                  :label="`${supplier.supplierCode} - ${supplier.supplierName}`"
                  :value="supplier.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input 
                v-model="formData.description" 
                type="textarea"
                :rows="3"
                placeholder="请输入物料描述信息" 
                maxlength="80"
                show-word-limit
                style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 物理与存储 Tab -->
      <div v-show="activeTab === 'physical'" class="tab-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="长 (mm)" prop="lengthMm">
              <el-input-number 
                v-model="formData.lengthMm" 
                :min="0"
                :max="99999999.99"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 220px !important;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽 (mm)" prop="widthMm">
              <el-input-number 
                v-model="formData.widthMm" 
                :min="0"
                :max="99999999.99"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 220px !important;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高 (mm)" prop="heightMm">
              <el-input-number 
                v-model="formData.heightMm" 
                :min="0"
                :max="99999999.99"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 220px !important;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="毛重 (kg)" prop="grossWeightKg">
              <el-input-number 
                v-model="formData.grossWeightKg" 
                :min="0"
                :max="99999999.99"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="净重 (kg)" prop="netWeightKg">
              <el-input-number 
                v-model="formData.netWeightKg" 
                :min="0"
                :max="99999999.99"
                :precision="2"
                placeholder="0"
                controls-position="right"
                style="width: 200px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="存储环境类型" prop="baseStorageCondition">
              <el-select
                v-model="formData.baseStorageCondition"
                placeholder="请选择存储环境类型"
                style="width: 200px;">
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.MATERIAL_STORAGE_CONDITION)"
                  :key="dict.value" 
                  :label="dict.label" 
                  :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特殊存储条件" prop="storageCondition">
              <el-input 
                v-model="formData.storageCondition" 
                placeholder="请输入特殊存储条件" 
                maxlength="200"
                show-word-limit
                style="width: 200px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 管控规则 Tab -->
      <div v-show="activeTab === 'control'" class="tab-content">
        <div class="control-section">
          <el-checkbox v-model="formData.batchManagementEnabled" class="batch-checkbox">
            <div class="checkbox-content">
              <div class="checkbox-title">启用批次管理</div>
              <div class="checkbox-desc">启用后，所有出入库操作必须指定批次号，支持有效期和生产日期追溯。</div>
            </div>
          </el-checkbox>
        </div>

        <div class="barcode-section" style="margin-top: 24px;">
          <div class="section-title">条码规则</div>
          <el-form-item prop="barcodeRuleId" class="barcode-form-item">
            <template #label>
              <span class="barcode-label">关联条码生成规则代码</span>
            </template>
            <el-select 
              v-model="formData.barcodeRuleId" 
              placeholder="请选择条码生成规则代码"
              style="width: 350px;"
              clearable>
              <el-option
                v-for="rule in materialBatchList"
                :key="rule.id"
                :label="rule.batchRule"
                :value="rule.id"/>
            </el-select>
          </el-form-item>
        </div>
      </div>

    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保存物料档案</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MaterialApi from '@/api/mdm/material'
import * as MaterialBatchApi from '@/api/mdm/material/batch'
import * as SupplierApi from '@/api/mdm/cooperpartners/supplier'
import {DICT_TYPE, getStrDictOptions } from '@/utils/dict'

defineOptions({ name: 'MaterialForm' })

const { t } = useI18n()
const message = useMessage()

const materialBatchList = ref<MaterialBatchApi.MaterialBatchDto[]>([])
const materialStatusList = ref<EnumEntityOption[]>([])
const materialCategoryList = ref<EnumEntityOption[]>([])
const materialBaseUnitList = ref<EnumEntityOption[]>([])
const supplierList = ref<SupplierApi.CooperpartnersSupplierDto[]>([])

// 供应商选择相关
const selectedSupplierIds = ref<string[]>([]) // 用于多选的数组

// 标签页配置
const activeTab = ref('basic')
const tabs = [
  { key: 'basic', label: '基础信息' },
  { key: 'physical', label: '物理与存储' },
  { key: 'control', label: '管控规则' }
]

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  materialCode: '',
  materialName: '',
  materialIds: '',
  specification: '',
  materialCategory: '',
  baseUnit: '',
  packageUnit: '',
  conversionRate: undefined,
  lengthMm: undefined,
  widthMm: undefined,
  heightMm: undefined,
  volumeM3: undefined,
  netWeightKg: undefined,
  grossWeightKg: undefined,
  baseStorageCondition: '',
  storageCondition: '',
  storageEnvironment: '',
  batchManagementEnabled: false,
  barcodeRuleId: '',
  minStock: undefined,
  maxStock: undefined,
  purchaseUnit: '',
  purchaseSpec: undefined,
  manufacturer: '',
  supplierIds: '',
  materialStatus: '',
  description: '',
})
const formRules = reactive({
  materialCode: [
      {
        required: true,
        message: '请输入物料编码',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  materialName: [
      {
        required: true,
        message: '请输入物料名称',
        trigger: 'blur'
      },
      {
        max: 64,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  materialIds: [
      {
        max: 128,
        message: "物料类型长度不大于128字符",
        trigger: 'blur'
      }
  ],
  specification: [
      {
        max: 128,
        message: "规格型号长度不大于128字符",
        trigger: 'blur'
      }
  ],
  materialCategory: [
      {
        required: true,
        message: '请输入物料分类',
        trigger: 'blur'
      }
  ],
  baseUnit: [
      {
        required: true,
        message: '请输入基本计量单位',
        trigger: 'blur'
      }
  ],
  lengthMm: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "长度应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  widthMm: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "宽度应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  heightMm: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "高度应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  volumeM3: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "体积应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  netWeightKg: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "净重应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  grossWeightKg: [
      {
        type: 'number' as const,
        min: 0,
        max: 99999999.99,
        message: "毛重应在0-99999999.99之间",
        trigger: 'blur'
      }
  ],
  storageCondition: [
      {
        max: 200,
        message: "特殊存储条件长度不大于200字符",
        trigger: 'blur'
      }
  ],
  barcodeRuleId: [
      // {
      //   max: 128,
      //   message: "输入字符长度不合规",
      //   trigger: 'blur'
      // }
  ],
  minStock: [
      // {
      //   min: 0,
      //   message: "最小库存大于等于0",
      //   trigger: 'blur'
      // }
  ],
  maxStock: [
      // {
      //   min: 0,
      //   message: "最大库存大于等于0",
      //   trigger: 'blur'
      // }
  ],
  purchaseUnit: [
  ],
  purchaseSpec: [
  ],
  manufacturer: [
      {
        max: 128,
        message: "生产厂家长度不大于128字符",
        trigger: 'blur'
      }
  ],
  supplierIds: [
      {
        max: 500,
        message: "供应商信息长度不大于500字符",
        trigger: 'blur'
      }
  ],
  materialStatus: [
      {
        required: true,
        message: '请输入物料状态',
        trigger: 'blur'
      }
  ],
  description: [
      {
        max: 80,
        message: "描述长度不大于80字符",
        trigger: 'blur'
      }
  ],
})
const formRef = ref()
const emit = defineEmits(['success'])

const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  
  // 将供应商ID数组转换为逗号分隔的字符串
  formData.value.supplierIds = selectedSupplierIds.value.join(',')
  
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      const data = formData.value as unknown as MaterialApi.MaterialSaveDto
      await MaterialApi.createMaterial(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as MaterialApi.MaterialUpdateDto
      await MaterialApi.updateMaterial(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  activeTab.value = 'basic' // 重置到第一个标签页
  selectedSupplierIds.value = [] // 重置供应商选择
  formData.value = {
    id: undefined,
    materialCode: '',
    materialName: '',
    materialIds: '',
    specification: '',
    materialCategory: '',
    baseUnit: '',
    packageUnit: '',
    conversionRate: undefined,
    lengthMm: undefined,
    widthMm: undefined,
    heightMm: undefined,
    volumeM3: undefined,
    netWeightKg: undefined,
    grossWeightKg: undefined,
    baseStorageCondition: '',
    storageCondition: '',
    storageEnvironment: '',
    batchManagementEnabled: false,
    barcodeRuleId: '',
    minStock: undefined,
    maxStock: undefined,
    purchaseUnit: '',
    purchaseSpec: undefined,
    manufacturer: '',
    supplierIds: '',
    materialStatus: 'A', // 默认可用
    description: '',
  } as any
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  
  // 先加载基础数据，确保供应商列表加载完成
  await Promise.all([
    getMaterialStatusList(),
    listOfCategory(),
    listOfBaseUnit(),
    getSupplierList()
  ])
  
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
        formData.value = await MaterialApi.getMaterialById(id)

        // 将逗号分隔的供应商ID字符串转换为数组
        // 确保供应商列表已加载完成后再设置选中值
        if (formData.value.supplierIds) {
          const supplierIdStrings = formData.value.supplierIds
            .split(',')
            .filter(id => id.trim())
          // 转换为数字数组，并验证ID是否在供应商列表中存在
          selectedSupplierIds.value = supplierIdStrings
            .map(id => id.trim())
            .filter(id => supplierList.value.some(supplier => supplier.id === id))
        } else {
          selectedSupplierIds.value = []
        }
    } finally {
        formLoading.value = false
    }
  } else {
    // 新增时设置默认值
    formData.value.materialStatus = 'A'
    selectedSupplierIds.value = []
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
    console.log('供应商列表加载完成:', supplierList.value.length, '个供应商')
  } catch (error) {
    console.error('获取供应商列表失败:', error)
    supplierList.value = []
  }
}

defineExpose({ open })

// 监听供应商选择变化，同步到表单数据用于验证
watch(selectedSupplierIds, (newVal) => {
  formData.value.supplierIds = newVal.join(',')
}, { deep: true })

// 移除 onMounted，改为在 open 时加载
// onMounted(() => {
//   getMaterialStatusList()
//   listOfCategory()
//   listOfBaseUnit()
// })

</script>
<style lang="scss" scoped>
.tab-navigation {
  display: flex;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
  gap: 4px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s ease;
  
  &:hover {
    color: #409EFF;
    background: rgba(64, 158, 255, 0.1);
  }
  
  &.active {
    background: #ffffff;
    color: #303133;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.material-form {
  .tab-content {
    padding: 8px 0;
  }
}

.control-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e4e7ed;
}

.batch-checkbox {
  :deep(.el-checkbox__label) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 8px;
  }
}

.checkbox-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.checkbox-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.checkbox-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.barcode-section {
  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
  }
}

// 表单项样式优化
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.barcode-form-item {
  :deep(.el-form-item__label) {
    width: 160px !important;
    min-width: 160px;
  }
}

.barcode-label {
  display: inline-block;
  white-space: nowrap;
  font-size: 13px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 6px;
}

/* 长宽高输入框宽度 */
:deep(.el-input-number) {
  width: 220px !important;
}

/* 供应商多选框样式优化 */
:deep(.el-select__tags) {
  max-height: none !important;
  overflow: visible !important;
  flex-wrap: wrap;
}

:deep(.el-select__tags .el-tag) {
  max-width: calc(50% - 6px);
  margin-right: 6px;
  margin-bottom: 4px;
  height: auto;
  line-height: 1.4;
  padding: 4px 8px;
}

:deep(.el-select__tags .el-tag .el-tag__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

:deep(.el-select__tags .el-tag .el-tag__close) {
  margin-left: 4px;
}

/* 确保输入框能够自适应高度 */
:deep(.el-select .el-input .el-input__wrapper) {
  min-height: 32px;
  height: auto;
  padding: 4px 8px;
}

:deep(.el-select .el-input .el-input__inner) {
  height: auto;
  min-height: 24px;
}
</style>
