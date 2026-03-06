<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" title="包装层级详情" width="1000">
    <div class="detail-container" v-loading="formLoading">
      <!-- 基本信息 -->
      <div class="detail-header">
        <p class="detail-description">物料包装层级详细信息展示</p>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label class="info-label">关联物料:</label>
              <span class="info-value">{{ materialInfo }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label class="info-label">规则名称:</label>
              <span class="info-value">{{ formData.ruleName || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="info-item">
              <label class="info-label">描述信息:</label>
              <span class="info-value">{{ formData.description || '-' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 包装单元详情 -->
      <div class="package-definition">
        <div class="section-header">
          <el-icon><Box /></el-icon>
          <span>包装单元详情</span>
        </div>

        <div class="package-levels">
          <div 
            v-for="(level, index) in formData.packageLevels" 
            :key="index"
            class="package-level-item">
            
            <!-- 主要信息行 -->
            <div class="main-info-row">
              <div class="info-group">
                <label class="field-label">单位类型</label>
                <span class="field-value">{{ level.unitType || '-' }}</span>
              </div>

              <div class="info-group">
                <label class="field-label">单位代码</label>
                <span class="field-value">{{ level.unitCode || '-' }}</span>
              </div>

              <div class="info-group">
                <label class="field-label">{{ getConversionLabel(index) }}</label>
                <span class="field-value">{{ level.conversionRatio || 1 }}</span>
              </div>

              <div class="info-group">
                <label class="field-label">条码类型</label>
                <span class="field-value">{{ getBarcodeTypeLabel(level.barcodeType) }}</span>
              </div>
            </div>

            <!-- 尺寸和操作行 -->
            <div class="dimensions-operations-row">
              <div class="dimensions-group">
                <div class="dimension-item">
                  <label>长:</label>
                  <span class="dimension-value">{{ level.lengthMm || 0 }} mm</span>
                </div>

                <div class="dimension-item">
                  <label>宽:</label>
                  <span class="dimension-value">{{ level.widthMm || 0 }} mm</span>
                </div>

                <div class="dimension-item">
                  <label>高:</label>
                  <span class="dimension-value">{{ level.heightMm || 0 }} mm</span>
                </div>
              </div>

              <div class="operations-group">
                <div class="switch-item">
                  <el-tag :type="level.allowDisassemble ? 'success' : 'info'" size="small">
                    {{ level.allowDisassemble ? '允许拆包' : '不允许拆包' }}
                  </el-tag>
                </div>
                <div class="switch-item">
                  <el-tag :type="level.isDefaultReceiving ? 'success' : 'info'" size="small">
                    {{ level.isDefaultReceiving ? '默认收货' : '非默认收货' }}
                  </el-tag>
                </div>
                <div class="switch-item">
                  <el-tag :type="level.isDefaultShipping ? 'success' : 'info'" size="small">
                    {{ level.isDefaultShipping ? '默认发货' : '非默认发货' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />关 闭
      </el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as MaterialPackageApi from '@/api/mdm/materialPackage'
import * as MaterialApi from '@/api/mdm/material'
import { Box } from '@element-plus/icons-vue'
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'

defineOptions({ name: 'MaterialPackageDetail' })

const dialogVisible = ref(false)
const formLoading = ref(false)

// 物料选项数据
const materialOptions = ref<MaterialApi.MaterialDto[]>([])
// 条码类型字典选项
const barcodeTypeOptions = getStrDictOptions(DICT_TYPE.MATERIAL_PACKAGE_BARCODE_TYPE)

const formData = ref({
  id: undefined,
  materialId: undefined,
  ruleName: '',
  description: '',
  packageLevels: []
})

/** 获取物料信息显示文本 */
const materialInfo = computed(() => {
  if (!formData.value.materialId) return '-'
  const material = materialOptions.value.find(m => m.id === formData.value.materialId)
  return material ? `${material.materialCode} - ${material.materialName}` : '-'
})

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

/** 获取换算标签 */
const getConversionLabel = (index: number) => {
  if (index === 0) return '基础换算量'
  const prevLevel = formData.value.packageLevels[index - 1]
  return `包含${prevLevel?.unitType || '单品'}数量`
}

/** 获取条码类型标签 */
const getBarcodeTypeLabel = (barcodeType: string) => {
  if (!barcodeType) return '-'
  const dict = barcodeTypeOptions.find(dict => dict.value === barcodeType)
  return dict ? dict.label : barcodeType
}

/** 打开详情弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  formLoading.value = true
  
  try {
    // 加载物料选项
    await loadMaterialOptions()
    
    // 获取详情数据
    const data = await MaterialPackageApi.getMaterialPackageById(id)
    formData.value = {
      ...data,
      ruleName: data.packageName || '',
      packageLevels: data.packageLevels || []
    }
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.detail-container {
  .detail-header {
    margin-bottom: 24px;
    
    .detail-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      .info-label {
        font-weight: 500;
        color: #606266;
        min-width: 80px;
        margin-right: 12px;
      }
      
      .info-value {
        color: #303133;
        flex: 1;
      }
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
    }

    .package-levels {
      .package-level-item {
        background: #ffffff;
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        
        &:last-child {
          margin-bottom: 0;
        }

        .main-info-row {
          display: flex;
          align-items: flex-start;
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
            
            .field-value {
              color: #303133;
              font-size: 14px;
              padding: 8px 0;
              border-bottom: 1px solid #f0f2f5;
            }
          }
        }

        .dimensions-operations-row {
          display: flex;
          align-items: flex-start;
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
              
              .dimension-value {
                color: #303133;
                font-size: 13px;
                font-weight: 500;
              }
            }
          }
          
          .operations-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            
            .switch-item {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
