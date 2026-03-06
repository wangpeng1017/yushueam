<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="formType === 'create' ? '新增包装层级' : '编辑包装层级'" width="1000">
    <div class="form-container" v-loading="formLoading">
      <!-- 表单头部信息 -->
      <div class="form-header">
        <p class="form-description">定义物料的多级包装单位及其换算关系（例如：1箱 = 12个）。</p>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关联物料" required>
              <el-select 
                v-model="formData.materialId" 
                placeholder="请选择物料"
                filterable
                :disabled="formType === 'update'"
                @change="handleMaterialChange"
                style="width: 100%">
                <el-option
                  v-for="material in materialOptions"
                  :key="material.id"
                  :label="`${material.materialCode} - ${material.materialName}`"
                  :value="material.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则名称" required>
              <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="描述信息">
              <el-input 
                v-model="formData.description" 
                type="textarea" 
                :rows="2"
                maxlength="50"
                show-word-limit
                placeholder="请输入描述信息（最多50个字符）" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 包装单元定义 -->
      <div class="package-definition">
        <div class="section-header">
          <el-icon><Box /></el-icon>
          <span>包装单元定义</span>
          <el-button 
            type="primary" 
            link 
            @click="addPackageLevel"
            class="add-level-btn">
            <el-icon><Plus /></el-icon>
            添加上级单位
          </el-button>
        </div>

        <div class="package-levels">
          <div 
            v-for="(level, index) in formData.packageLevels" 
            :key="index"
            class="package-level-item">
            
            <!-- 主要信息行 -->
            <div class="main-info-row">
              <div class="info-group">
                <label class="field-label">单位类型 <span class="required">*</span></label>
                <el-select 
                  :model-value="getUnitTypeValue(level.unitType)" 
                  placeholder="选择单位" 
                  class="field-input"
                  :class="{ 'is-error': !level.unitType }"
                  @change="onUnitTypeChange(level, $event)">
                  <el-option
                    v-for="dict in getAvailableUnitTypes(index)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value" />
                </el-select>
                <div v-if="!level.unitType" class="error-message">请选择单位类型</div>
              </div>

              <div class="info-group">
                <label class="field-label">单位代码 <span class="required">*</span></label>
                <el-input 
                  v-model="level.unitCode" 
                  placeholder="请输入单位代码" 
                  class="field-input"
                  :class="{ 'is-error': !level.unitCode }" />
                <div v-if="!level.unitCode" class="error-message">请输入单位代码</div>
              </div>

              <div class="info-group">
                <label class="field-label">{{ getConversionLabel(index) }} <span class="required">*</span></label>
                <el-input-number 
                  v-model="level.conversionRatio"
                  :min="1" 
                  :disabled="index === 0"
                  class="field-input"
                  :class="{ 'is-error': !level.conversionRatio || level.conversionRatio < 1 }" />
                <div v-if="!level.conversionRatio || level.conversionRatio < 1" class="error-message">
                  {{ index === 0 ? '基础换算量必须为1' : '换算量必须大于等于1' }}
                </div>
              </div>

              <div class="info-group">
                <label class="field-label">条码类型</label>
                <el-select v-model="level.barcodeType" placeholder="选择类型" class="field-input">
                  <el-option
                    v-for="dict in barcodeTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </div>

              <div class="action-group">
                <el-button 
                  v-if="canDeleteLevel(index)"
                  type="danger" 
                  text
                  @click="removePackageLevel(index)"
                  class="delete-btn">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 尺寸和操作行 -->
            <div class="dimensions-operations-row">
              <div class="dimensions-group">
                <div class="dimension-item">
                  <label>长</label>
                  <div class="dimension-control">
                    <el-button 
                      size="small" 
                      text 
                      @click="level.lengthMm = Math.max(0, (level.lengthMm || 0) - 1)"
                      class="dimension-btn">
                      <el-icon><Minus /></el-icon>
                    </el-button>
                    <el-input-number 
                      v-model="level.lengthMm" 
                      :min="0" 
                      size="small" 
                      :controls="false"
                      class="dimension-input" />
                    <el-button 
                      size="small" 
                      text 
                      @click="level.lengthMm = (level.lengthMm || 0) + 1"
                      class="dimension-btn">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>

                <div class="dimension-item">
                  <label>宽</label>
                  <div class="dimension-control">
                    <el-button 
                      size="small" 
                      text 
                      @click="level.widthMm = Math.max(0, (level.widthMm || 0) - 1)"
                      class="dimension-btn">
                      <el-icon><Minus /></el-icon>
                    </el-button>
                    <el-input-number 
                      v-model="level.widthMm" 
                      :min="0" 
                      size="small" 
                      :controls="false"
                      class="dimension-input" />
                    <el-button 
                      size="small" 
                      text 
                      @click="level.widthMm = (level.widthMm || 0) + 1"
                      class="dimension-btn">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>

                <div class="dimension-item">
                  <label>高</label>
                  <div class="dimension-control">
                    <el-button 
                      size="small" 
                      text 
                      @click="level.heightMm = Math.max(0, (level.heightMm || 0) - 1)"
                      class="dimension-btn">
                      <el-icon><Minus /></el-icon>
                    </el-button>
                    <el-input-number 
                      v-model="level.heightMm" 
                      :min="0" 
                      size="small" 
                      :controls="false"
                      class="dimension-input" />
                    <el-button 
                      size="small" 
                      text 
                      @click="level.heightMm = (level.heightMm || 0) + 1"
                      class="dimension-btn">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="operations-group">
                <div class="switch-item">
                  <el-switch v-model="level.allowDisassemble" size="small" />
                  <span>允许拆包</span>
                </div>
                <div class="switch-item">
                  <el-switch 
                    v-model="level.isDefaultReceiving" 
                    size="small" 
                    @change="handleDefaultReceiveChange(index)" />
                  <span>默认收货</span>
                </div>
                <div class="switch-item">
                  <el-switch 
                    v-model="level.isDefaultShipping" 
                    size="small" 
                    @change="handleDefaultShipChange(index)" />
                  <span>默认发货</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">
        <Icon icon="ep:check" class="mr-5px" />确 定
      </el-button>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />取 消
      </el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MaterialPackageApi from '@/api/mdm/materialPackage'
import * as MaterialApi from '@/api/mdm/material'
import { Box, Plus, Delete, Minus } from '@element-plus/icons-vue'
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'

defineOptions({ name: 'MaterialPackageForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const formLoading = ref(false)
const formType = ref('')

// 物料选项数据
const materialOptions = ref<MaterialApi.MaterialDto[]>([])
// 包装单位字典选项
const unitTypeOptions = getStrDictOptions(DICT_TYPE.MATERIAL_PACKAGE_UNIT)
// 条码类型字典选项
const barcodeTypeOptions = getStrDictOptions(DICT_TYPE.MATERIAL_PACKAGE_BARCODE_TYPE)

const formData = ref({
  id: undefined,
  materialId: undefined,
  ruleName: '',
  description: '',
  packageLevels: [
    {
      unitType: '',  // 移除默认值
      unitCode: '',  // 移除默认值
      conversionRatio: 1,  // 保留默认值
      barcodeType: 'SN',  // 保留默认值
      lengthMm: undefined,  // 移除默认值
      widthMm: undefined,  // 移除默认值
      heightMm: undefined,  // 移除默认值
      allowDisassemble: false,
      isDefaultReceiving: false,
      isDefaultShipping: false  // 修改为false
    }
  ]
})

const formRef = ref()
const emit = defineEmits(['success'])

/** 获取物料列表 */
const loadMaterialOptions = async () => {
  try {
    const query = {
      materialStatus: 'ACTIVE' // 只获取激活状态的物料
    } as MaterialApi.MaterialDto
    const data = await MaterialApi.listOfMaterial(query)
    materialOptions.value = data || []
  } catch (error) {
    console.error('获取物料列表失败:', error)
    materialOptions.value = []
  }
}

/** 校验物料是否已存在包装层级配置 */
const validateMaterialPackage = async (materialId: number) => {
  if (!materialId || formType.value === 'update') {
    return true // 编辑模式不需要校验
  }
  
  try {
    const result = await MaterialPackageApi.validateMaterialPackageExists(materialId)
    return !result // 如果不存在则返回true（校验通过）
  } catch (error) {
    console.error('校验物料包装配置失败:', error)
    return true // 校验失败时允许继续
  }
}

/** 物料选择变更处理 */
const handleMaterialChange = async (materialId: number) => {
  if (!materialId || formType.value === 'update') {
    return
  }
  
  const isValid = await validateMaterialPackage(materialId)
  if (!isValid) {
    // 找到选中的物料信息用于提示
    const selectedMaterial = materialOptions.value.find(m => m.id === materialId)
    const materialInfo = selectedMaterial ? `${selectedMaterial.materialCode} - ${selectedMaterial.materialName}` : '该物料'
    
    message.warning(`${materialInfo} 已存在包装层级配置，请选择其他物料`)
    // 清空选择
    formData.value.materialId = undefined
  }
}

/** 单位类型改变时更新单位代码 */
const onUnitTypeChange = (level: any, unitTypeValue: string) => {
  if (unitTypeValue) {
    // 根据选中的value找到对应的label
    const selectedDict = unitTypeOptions.find(dict => dict.value === unitTypeValue)
    if (selectedDict) {
      // 检查是否重复
      const isDuplicate = formData.value.packageLevels.some(
        (existingLevel, index) => 
          existingLevel !== level && existingLevel.unitType === selectedDict.label
      )
      
      if (isDuplicate) {
        message.warning(`单位类型"${selectedDict.label}"已存在，请选择其他类型`)
        return
      }
      
      // 使用字典的label作为unitType
      level.unitType = selectedDict.label
      // 根据单位类型自动生成单位代码，使用value作为代码
      level.unitCode = unitTypeValue
    }
  }
}

/** 根据unitType(label)获取对应的value用于select显示 */
const getUnitTypeValue = (unitTypeLabel: string) => {
  if (!unitTypeLabel) return ''
  const dict = unitTypeOptions.find(dict => dict.label === unitTypeLabel)
  return dict ? dict.value : ''
}

/** 获取可用的单位类型选项（排除已使用的） */
const getAvailableUnitTypes = (currentIndex: number) => {
  const usedUnitTypes = formData.value.packageLevels
    .map((level, index) => index !== currentIndex ? level.unitType : null)
    .filter(Boolean)
  
  return unitTypeOptions.filter(dict => !usedUnitTypes.includes(dict.label))
}

/** 判断是否可以删除层级 */
const canDeleteLevel = (index: number) => {
  // 层级为1（index为0）的不允许删除
  if (index === 0) return false
  // 至少保留一个层级
  if (formData.value.packageLevels.length <= 1) return false
  return true
}

/** 获取换算标签 */
const getConversionLabel = (index: number) => {
  if (index === 0) return '基础换算量 (固定1)'
  const prevLevel = formData.value.packageLevels[index - 1]
  return `包含多少个(${prevLevel?.unitType || '单品'})`
}

/** 验证包装层级数据 */
const validatePackageLevels = () => {
  const errors: string[] = []
  
  formData.value.packageLevels.forEach((level, index) => {
    // 验证必填字段
    if (!level.unitType) {
      errors.push(`第${index + 1}层包装单位类型不能为空`)
    }
    if (!level.unitCode) {
      errors.push(`第${index + 1}层单位代码不能为空`)
    }
    if (!level.conversionRatio || level.conversionRatio < 1) {
      errors.push(`第${index + 1}层换算量必须大于等于1`)
    }
  })
  
  // 验证单位类型不重复
  const unitTypes = formData.value.packageLevels.map(level => level.unitType).filter(Boolean)
  const duplicateTypes = unitTypes.filter((type, index) => unitTypes.indexOf(type) !== index)
  if (duplicateTypes.length > 0) {
    errors.push(`单位类型不能重复: ${[...new Set(duplicateTypes)].join(', ')}`)
  }
  
  return errors
}

/** 添加包装层级 */
const addPackageLevel = () => {
  const newLevel = {
    unitType: '',  // 移除默认值
    unitCode: '',  // 移除默认值
    conversionRatio: 10,  // 保留默认值
    barcodeType: 'SKU',  // 保留默认值
    lengthMm: undefined,  // 移除默认值
    widthMm: undefined,  // 移除默认值
    heightMm: undefined,  // 移除默认值
    allowDisassemble: true,
    isDefaultReceiving: false,
    isDefaultShipping: false
  }
  formData.value.packageLevels.push(newLevel)
}

/** 删除包装层级 */
const removePackageLevel = (index: number) => {
  if (!canDeleteLevel(index)) {
    message.warning('层级1不允许删除，且至少保留一个包装层级')
    return
  }
  
  // 删除当前层级及其所有子级层级
  const levelsToRemove = formData.value.packageLevels.length - index
  formData.value.packageLevels.splice(index, levelsToRemove)
  
  // message.success(`已删除第${index + 1}层及其子级层级`)
}

/** 处理默认收货变更 */
const handleDefaultReceiveChange = (currentIndex: number) => {
  const currentLevel = formData.value.packageLevels[currentIndex]
  
  // 如果当前项被选中，则取消其他项的选中状态
  if (currentLevel.isDefaultReceiving) {
    formData.value.packageLevels.forEach((level, index) => {
      if (index !== currentIndex) {
        level.isDefaultReceiving = false
      }
    })
  }
}

/** 处理默认发货变更 */
const handleDefaultShipChange = (currentIndex: number) => {
  const currentLevel = formData.value.packageLevels[currentIndex]
  
  // 如果当前项被选中，则取消其他项的选中状态
  if (currentLevel.isDefaultShipping) {
    formData.value.packageLevels.forEach((level, index) => {
      if (index !== currentIndex) {
        level.isDefaultShipping = false
      }
    })
  }
}

/** 提交表单 */
const submitForm = async () => {
  try {
    formLoading.value = true
    
    // 验证必填字段
    if (!formData.value.materialId) {
      message.error('请选择关联物料')
      return
    }
    if (!formData.value.ruleName) {
      message.error('请输入规则名称')
      return
    }

    // 新增时校验物料是否已存在包装层级配置
    if (formType.value === 'create') {
      const isValid = await validateMaterialPackage(formData.value.materialId)
      if (!isValid) {
        const selectedMaterial = materialOptions.value.find(m => m.id === formData.value.materialId)
        const materialInfo = selectedMaterial ? `${selectedMaterial.materialCode} - ${selectedMaterial.materialName}` : '该物料'
        message.error(`${materialInfo} 已存在包装层级配置，请选择其他物料`)
        return
      }
    }

    // 验证包装层级数据
    const validationErrors = validatePackageLevels()
    if (validationErrors.length > 0) {
      message.error(validationErrors[0])
      return
    }

    // 构建包装层级数据，使用level建立父子关系
    const packageUnits = formData.value.packageLevels.map((level, index) => {
      return {
        unitType: level.unitType,
        unitCode: level.unitCode,
        conversionRatio: level.conversionRatio,
        lengthMm: level.lengthMm || 0,
        widthMm: level.widthMm || 0,
        heightMm: level.heightMm || 0,
        weightKg: 0, // 可以后续扩展
        volumeM3: 0, // 可以后续扩展
        barcodeType: level.barcodeType,
        allowDisassemble: level.allowDisassemble,
        isDefaultReceiving: level.isDefaultReceiving,
        isDefaultShipping: level.isDefaultShipping,
        level: index + 1, // 层级从1开始，自然形成父子关系
        description: `${level.unitType}包装单位`
      }
    })

    const submitData = {
      materialId: formData.value.materialId,
      packageName: formData.value.ruleName,
      description: formData.value.description || '',
      materialPackageUnitList: packageUnits
    }

    if (formType.value === 'create') {
      // 使用API层的创建方法
      await MaterialPackageApi.createMaterialPackage(submitData)
      message.success(t('common.createSuccess'))
    } else {
      // 使用API层的更新方法
      await MaterialPackageApi.updateMaterialPackage({
        id: formData.value.id!,
        ...submitData
      })
      message.success(t('common.updateSuccess'))
    }
    
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
    message.error('操作失败，请重试')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    materialId: undefined,
    ruleName: '',
    description: '',
    packageLevels: [
      {
        unitType: '',  // 移除默认值
        unitCode: '',  // 移除默认值
        conversionRatio: 1,  // 保留默认值
        barcodeType: 'SN',  // 保留默认值
        lengthMm: undefined,  // 移除默认值
        widthMm: undefined,  // 移除默认值
        heightMm: undefined,  // 移除默认值
        allowDisassemble: false,
        isDefaultReceiving: false,
        isDefaultShipping: false  // 修改为false
      }
    ]
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  formType.value = type
  resetForm()
  
  // 加载物料选项
  await loadMaterialOptions()
  
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await MaterialPackageApi.getMaterialPackageById(id)
      // 转换后端数据到表单格式
      formData.value = {
        ...data,
        ruleName: data.packageName || '',
        packageLevels: data.packageLevels || formData.value.packageLevels
      }
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.form-container {
  .form-header {
    margin-bottom: 24px;
    
    .form-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.5;
    }
  }

  .package-definition {
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e4e7ed;
      
      .el-icon {
        margin-right: 8px;
        color: #409eff;
      }
      
      span {
        font-weight: 500;
        font-size: 16px;
        flex: 1;
      }
      
      .add-level-btn {
        font-size: 14px;
        
        .el-icon {
          margin-right: 4px;
        }
      }
    }

    .package-levels {
      .package-level-item {
        background: #ffffff;
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
        }
        
        &:last-child {
          margin-bottom: 0;
        }

        .main-info-row {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 20px;
          
          .info-group {
            flex: 1;
            min-width: 0;
            
            .field-label {
              display: block;
              font-size: 13px;
              color: #606266;
              margin-bottom: 6px;
              font-weight: 500;
            }
            
            .field-input {
              width: 100%;
              
              &.is-error {
                :deep(.el-input__wrapper) {
                  border-color: #f56c6c;
                  box-shadow: 0 0 0 1px #f56c6c inset;
                }
                
                :deep(.el-select__wrapper) {
                  border-color: #f56c6c;
                  box-shadow: 0 0 0 1px #f56c6c inset;
                }
              }
            }
            
            .error-message {
              color: #f56c6c;
              font-size: 12px;
              margin-top: 4px;
              line-height: 1.2;
            }
            
            .required {
              color: #f56c6c;
              margin-left: 2px;
            }
          }
          
          .action-group {
            flex-shrink: 0;
            width: 40px;
            display: flex;
            justify-content: center;
            
            .delete-btn {
              color: #f56c6c;
              padding: 8px;
              
              &:hover {
                background-color: #fef0f0;
                color: #f56c6c;
              }
            }
          }
        }

        .dimensions-operations-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #f0f2f5;
          
          .dimensions-group {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            
            .dimension-item {
              display: flex;
              align-items: center;
              gap: 8px;
              
              label {
                font-size: 12px;
                color: #909399;
                font-weight: 500;
                min-width: 16px;
              }
              
              .dimension-control {
                display: flex;
                align-items: center;
                gap: 4px;
                
                .dimension-btn {
                  width: 24px;
                  height: 24px;
                  padding: 0;
                  color: #909399;
                  
                  &:hover {
                    color: #409eff;
                    background-color: #ecf5ff;
                  }
                  
                  .el-icon {
                    font-size: 12px;
                  }
                }
                
                .dimension-input {
                  width: 80px;
                  
                  :deep(.el-input__inner) {
                    text-align: center;
                    padding: 0 8px;
                  }
                  
                  :deep(.el-input-number__decrease),
                  :deep(.el-input-number__increase) {
                    display: none;
                  }
                }
              }
            }
          }
          
          .operations-group {
            display: flex;
            gap: 24px;
            
            .switch-item {
              display: flex;
              align-items: center;
              gap: 8px;
              
              span {
                font-size: 13px;
                color: #606266;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 16px;
  
  .el-form-item__label {
    font-weight: 500;
    color: #303133;
  }
}

:deep(.el-select),
:deep(.el-input) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-switch) {
  --el-switch-on-color: #409eff;
}
</style>
