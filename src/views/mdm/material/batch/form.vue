<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <!-- 描述文字 -->
    <div style="color: #909399; font-size: 14px; margin-bottom: 20px;">
      为物料定义生命周期内的批次追踪维度。
    </div>

    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="0px"
      class="batch-form">

      <!-- 关联物料和批次号生成规则 -->
      <div class="form-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="form-item-wrapper">
              <label class="form-label required">关联物料 (SKU)</label>
              <el-select
                v-model="formData.materialId"
                placeholder="选择物料"
                style="width: 100%;"
                filterable
                @change="handleMaterialChange">
                <el-option
                  v-for="material in materialList"
                  :key="material.id"
                  :label="`${material.materialCode} - ${material.materialName}`"
                  :value="material.id">
                  <div class="material-option">
                    <div class="material-code">{{ material.materialCode }}</div>
                    <div class="material-name">{{ material.materialName }}</div>
                    <!-- <div class="material-spec">{{ material.specification || '无规格' }}</div> -->
                  </div>
                </el-option>
              </el-select>
              <div class="form-hint">仅显示已开启"批次管理"的物料</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item-wrapper">
              <label class="form-label required">批次号生成规则</label>
              <el-select
                v-model="formData.batchRuleId"
                placeholder="选择生成规则"
                style="width: 100%;">
                <el-option
                  v-for="rule in materialBatchRuleList"
                  :key="rule.value"
                  :label="rule.text"
                  :value="rule.value"/>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 标准批次属性 (核心维度) -->
      <div class="collapsible-section">
        <div class="section-header" @click="toggleSection('standard')">
          <span class="section-title">标准批次属性 (核心维度)</span>
          <Icon :icon="standardExpanded ? 'ep:arrow-up' : 'ep:arrow-down'" />
        </div>
        <div v-show="standardExpanded" class="section-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:calendar" class="switch-icon production" />
                  <span class="switch-label">生产日期</span>
                </div>
                <el-switch v-model="formData.productionDateEnabled" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:warning" class="switch-icon expiry" />
                  <span class="switch-label">有效期/失效日期</span>
                </div>
                <el-switch v-model="formData.expiryDateEnabled" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:check" class="switch-icon quality" />
                  <span class="switch-label">质量状态</span>
                </div>
                <el-switch v-model="formData.qualityStatusEnabled" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:location" class="switch-icon origin" />
                  <span class="switch-label">原产地</span>
                </div>
                <el-switch v-model="formData.originEnabled" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:user" class="switch-icon supplier" />
                  <span class="switch-label">供应商批次号</span>
                  <span class="switch-hint">向上游追溯</span>
                </div>
                <el-switch v-model="formData.supplierBatchEnabled" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:document" class="switch-icon production-order" />
                  <span class="switch-label">生产工单/批次</span>
                  <span class="switch-hint">制造追溯</span>
                </div>
                <el-switch v-model="formData.productionOrderEnabled" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="switch-item">
                <div class="switch-content">
                  <Icon icon="ep:refresh" class="switch-icon retest" />
                  <span class="switch-label">复验日期</span>
                </div>
                <el-switch v-model="formData.retestDateEnabled" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 自定义属性 (行业特定) -->
      <div class="collapsible-section">
        <div class="section-header" @click="toggleSection('custom')">
          <span class="section-title">自定义属性 (行业特定)</span>
          <Icon :icon="customExpanded ? 'ep:arrow-up' : 'ep:arrow-down'" />
        </div>
        <div v-show="customExpanded" class="section-content">
          <div v-for="(attr, index) in customAttributes" :key="index" class="custom-attribute-item">
            <el-row :gutter="20" align="middle">
              <el-col :span="10">
                <span class="attribute-label">属性名称</span>
              </el-col>
              <el-col :span="10">
                <span class="attribute-label">类型</span>
              </el-col>
              <el-col :span="4">
                <span class="attribute-label">操作</span>
              </el-col>
            </el-row>
            <el-row :gutter="20" align="middle" style="margin-top: 8px;">
              <el-col :span="10">
                <el-input v-model="attr.name" placeholder="如: 炉号" />
              </el-col>
              <el-col :span="10">
                <el-select v-model="attr.type" style="width: 100%;">
                  <el-option label="文本" value="TEXT" />
                  <el-option label="数字" value="NUMBER" />
                  <el-option label="日期" value="DATE" />
                  <el-option label="布尔" value="BOOLEAN" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <div class="delete-btn-wrapper">
                  <el-button type="danger" text @click="removeCustomAttribute(index)">
                    <Icon icon="ep:delete" />
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="add-attribute-btn" @click="addCustomAttribute">
            <Icon icon="ep:plus" />
            <span>添加自定义属性</span>
          </div>
        </div>
      </div>

    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保存配置</el-button>
    </template>
  </Dialog>

</template>
<script lang="ts" setup>
import * as MaterialBatchApi from '@/api/mdm/material/batch'
import * as MaterialApi from '@/api/mdm/material'

defineOptions({ name: 'MaterialBatchForm' })

const { t } = useI18n()
const message = useMessage()

const materialList = ref<MaterialApi.MaterialDto[]>([])
const materialBatchStatusList = ref<EnumEntityOption[]>([])
const materialBatchRuleList = ref<EnumEntityOption[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')

// 折叠区域状态
const standardExpanded = ref(true)
const customExpanded = ref(true)

// 自定义属性
const customAttributes = ref([
  { name: '', type: 'TEXT' }
])

const formData = ref({
  id: undefined,
  materialId: '',
  batchRuleId: '',
  batchStatus: undefined,
  // 标准批次属性开关
  productionDateEnabled: true,
  expiryDateEnabled: false,
  qualityStatusEnabled: true,
  originEnabled: false,
  supplierBatchEnabled: false,
  productionOrderEnabled: false,
  retestDateEnabled: false
})
const formRules = reactive({
  materialId: [
      {
        required: true,
        message: '请输入关联物料',
        trigger: 'blur'
      }
  ],
  batchRuleId: [
    {
      required: true,
      message: '请选择批次规则码',
      trigger: 'blur'
    }
  ],
  batchStatus: [
      {
      required: true,
      message: '请选择批次状态',
      trigger: 'blur'
    }
  ]
})
const formRef = ref()
const emit = defineEmits(['success'])

const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      const data = formData.value as unknown as MaterialBatchApi.MaterialBatchSaveDto
      await MaterialBatchApi.createMaterialBatch(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as MaterialBatchApi.MaterialBatchUpdateDto
      await MaterialBatchApi.updateMaterialBatch(data)
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
  formData.value = {
    id: undefined,
    materialId: '',
    batchRuleId: '',
    batchStatus: undefined,
    // 重置标准批次属性开关
    productionDateEnabled: true,
    expiryDateEnabled: false,
    qualityStatusEnabled: true,
    originEnabled: false,
    supplierBatchEnabled: false,
    productionOrderEnabled: false,
    retestDateEnabled: false
  } as any
  
  // 重置自定义属性
  customAttributes.value = [{ name: '', type: 'TEXT' }]
  
  formRef.value?.resetFields()
}

/** 切换折叠区域 */
const toggleSection = (section: string) => {
  if (section === 'standard') {
    standardExpanded.value = !standardExpanded.value
  } else if (section === 'custom') {
    customExpanded.value = !customExpanded.value
  }
}

/** 添加自定义属性 */
const addCustomAttribute = () => {
  customAttributes.value.push({ name: '', type: 'TEXT' })
}

/** 删除自定义属性 */
const removeCustomAttribute = (index: number) => {
  if (customAttributes.value.length > 1) {
    customAttributes.value.splice(index, 1)
  }
}

/** 处理物料选择变化 */
const handleMaterialChange = async (materialId: number) => {
  if (!materialId) {
    return
  }
  
  try {
    // 编辑模式下传递当前记录ID以排除自身
    const excludeId = formType.value === 'update' ? formData.value.id : undefined
    await MaterialBatchApi.validateMaterial(materialId, excludeId)
    // 校验通过，无需处理
  } catch (error: any) {
    // 校验失败，显示错误信息并清空选择
    message.error(error.msg || '该物料已存在批次配置，不能重复添加')
    formData.value.materialId = ''
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
        formData.value = await MaterialBatchApi.getMaterialBatchById(id)
    } finally {
        formLoading.value = false
    }
  }
}

const getMaterialList = async () => {
  try {
    const result = await MaterialApi.listOfMaterial({materialStatus: 'A'} as any)
    materialList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialList.value = []
  }
}

const listOfStatus = async () => {
  try {
    const result = await MaterialBatchApi.listOfStatus()
    materialBatchStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialBatchStatusList.value = []
  }
}

const listOfBatchRule = async () => {
  try {
    const result = await MaterialBatchApi.listOfBatchRule()
    materialBatchRuleList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialBatchRuleList.value = []
  }
}

defineExpose({ open })

onMounted(() => {
  getMaterialList()
  listOfStatus()
  listOfBatchRule()
})

</script>
<style lang="scss" scoped>
.batch-form {
  .form-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e4e7ed;
  }
}

.form-item-wrapper {
  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 8px;
    
    &.required::after {
      content: ' *';
      color: #f56c6c;
    }
  }
  
  .form-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}

.collapsible-section {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background: #f0f2f5;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }
  
  .section-content {
    padding: 20px;
  }
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 12px;
  
  .switch-content {
    display: flex;
    align-items: center;
    flex: 1;
    
    .switch-icon {
      font-size: 16px;
      margin-right: 12px;
      
      &.production {
        color: #409EFF;
      }
      
      &.expiry {
        color: #E6A23C;
      }
      
      &.quality {
        color: #67C23A;
      }
      
      &.origin {
        color: #909399;
      }
      
      &.supplier {
        color: #9C27B0;
      }
      
      &.production-order {
        color: #FF9800;
      }
      
      &.retest {
        color: #607D8B;
      }
    }
    
    .switch-label {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-right: 8px;
    }
    
    .switch-hint {
      font-size: 12px;
      color: #909399;
    }
  }
}

.custom-attribute-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .attribute-label {
    font-size: 12px;
    color: #909399;
    font-weight: 500;
  }
  
  .delete-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}

.add-attribute-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8f9fa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409EFF;
    background: rgba(64, 158, 255, 0.05);
    
    span {
      color: #409EFF;
    }
  }
  
  span {
    font-size: 14px;
    color: #909399;
    margin-left: 8px;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-switch) {
  --el-switch-on-color: #409EFF;
}

/* 物料选择下拉框样式 */
.material-option {
  padding: 4px 0;
  
  .material-code {
    font-weight: 500;
    color: #303133;
    font-size: 13px;
    line-height: 1.2;
  }
  
  .material-name {
    color: #606266;
    font-size: 12px;
    margin-top: 2px;
    line-height: 1.2;
  }
  
  .material-spec {
    color: #909399;
    font-size: 11px;
    margin-top: 2px;
    line-height: 1.2;
  }
}

/* 限制下拉框最大高度 */
:deep(.el-select-dropdown) {
  max-height: 400px;
}

:deep(.el-select-dropdown__wrap) {
  max-height: 400px;
}

:deep(.el-select-dropdown__list) {
  max-height: 400px;
  overflow-y: auto;
}
</style>
