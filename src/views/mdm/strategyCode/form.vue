<!-- Author [陈建峰],  Since 2026-02-09 00:00:00,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1100">
    <div class="max-h-[600px] overflow-auto">
      <el-row :gutter="20">
        <!-- 左侧：表单区域 -->
        <el-col :span="15">
          <el-form
            ref="formRef"
            v-loading="formLoading"
            :model="formData"
            :rules="formRules"
            label-position="top"
          >
            <!-- Tab 切换 -->
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基础定义" name="basic">
                <div class="flex flex-col gap-4">
                  <el-card shadow="never">
                    <template #header>
                      <div class="card-header">
                        <span>基础信息</span>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="规则编号" prop="ruleCode">
                          <el-input
                            v-model="formData.ruleCode"
                            placeholder="请输入规则编号"
                            :disabled="formType === 'update'"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="规则名称" prop="ruleName">
                          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="适用系统" prop="applicableSystem">
                          <el-select
                            v-model="formData.applicableSystem"
                            placeholder="请选择适用系统"
                            clearable
                            :disabled="formType === 'update'"
                          >
                            <el-option
                              v-for="dict in getStrDictOptions(
                                DICT_TYPE.STRATEGY_CODE_APPLICABLE_SYSTEM
                              )"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="规则类型" prop="ruleType">
                          <el-select
                            v-model="formData.ruleType"
                            placeholder="请选择规则类型"
                            clearable
                            :disabled="formType === 'update'"
                          >
                            <el-option
                              v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_CODE_RULE_TYPE)"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="段分隔符" prop="separatorCode">
                          <el-input
                            v-model="formData.separatorCode"
                            placeholder="留空则无分隔符"
                            maxlength="10"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="流水号重置周期" prop="resetCycle">
                          <el-select
                            v-model="formData.resetCycle"
                            placeholder="请选择重置周期"
                            clearable
                          >
                            <el-option
                              v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_CODE_RESET_CYCLE)"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注说明" prop="remark">
                          <el-input
                            type="textarea"
                            v-model="formData.remark"
                            placeholder="请输入备注说明"
                            :rows="3"
                            maxlength="500"
                            show-word-limit
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>

                  <!-- 状态 -->
                  <el-card shadow="never">
                    <template #header>
                      <div class="card-header">
                        <span>状态设置</span>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                          <el-radio-group v-model="formData.status">
                            <el-radio
                              v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_STATUS)"
                              :key="dict.value"
                              :value="dict.value"
                            >
                              {{ dict.label }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
              </el-tab-pane>

              <el-tab-pane label="规则结构设计" name="segments">
                <!-- 添加段按钮组 -->
                <div class="mb-16px">
                  <span class="mr-10px text-14px font-500">添加段:</span>
                  <el-button size="small" type="danger" plain @click="addSegment('FIXED')">
                    <Icon icon="ep:edit" class="mr-4px" />T 固定字符
                  </el-button>
                  <el-button size="small" type="primary" plain @click="addSegment('DATE')">
                    <Icon icon="ep:calendar" class="mr-4px" />日期时间
                  </el-button>
                  <el-tooltip content="功能开发中" placement="top">
                    <el-button size="small" type="success" plain disabled>
                      <Icon icon="ep:collection" class="mr-4px" />属性变量
                    </el-button>
                  </el-tooltip>
                  <el-button size="small" type="warning" plain @click="addSegment('SEQUENCE')">
                    <Icon icon="ep:odometer" class="mr-4px" /># 流水号
                  </el-button>
                  <el-tooltip content="功能开发中" placement="top">
                    <el-button size="small" type="info" plain disabled>
                      <Icon icon="ep:circle-check" class="mr-4px" />校验位
                    </el-button>
                  </el-tooltip>
                </div>

                <!-- 段配置列表 -->
                <div class="flex flex-col gap-4">
                  <el-card
                    v-for="(segment, index) in formData.segments"
                    :key="index"
                    shadow="never"
                    class="segment-card"
                  >
                    <div class="flex items-start gap-16px">
                      <!-- 拖拽手柄和序号 -->
                      <div class="flex items-center gap-8px pt-8px">
                        <Icon icon="ep:rank" class="cursor-move text-gray-400" />
                        <el-tag
                          :type="getSegmentTagColor(segment.segmentType)"
                          size="large"
                          round
                          effect="dark"
                          class="segment-number"
                        >
                          {{ index + 1 }}
                        </el-tag>
                      </div>

                      <!-- 段内容 -->
                      <div class="flex-1">
                        <!-- 固定字符段 -->
                        <el-row v-if="segment.segmentType === 'FIXED'" :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="段描述">
                              <el-input v-model="segment.segmentDesc" placeholder="请输入段描述" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="固定值">
                              <el-input v-model="segment.fixedValue" placeholder="请输入固定值" />
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <!-- 日期时间段 -->
                        <el-row v-if="segment.segmentType === 'DATE'" :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="段描述">
                              <el-input v-model="segment.segmentDesc" placeholder="请输入段描述" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="日期格式">
                              <el-select v-model="segment.dateFormat" placeholder="请选择日期格式">
                                <el-option
                                  v-for="dict in getStrDictOptions(
                                    DICT_TYPE.STRATEGY_CODE_DATE_FORMAT
                                  )"
                                  :key="dict.value"
                                  :label="dict.label"
                                  :value="dict.value"
                                />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <!-- 流水号段 -->
                        <template v-if="segment.segmentType === 'SEQUENCE'">
                          <el-row :gutter="16">
                            <el-col :span="12">
                              <el-form-item label="段描述">
                                <el-input
                                  v-model="segment.segmentDesc"
                                  placeholder="请输入段描述"
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="位数长度">
                                <el-input-number
                                  v-model="segment.snLength"
                                  :min="1"
                                  :max="10"
                                  controls-position="right"
                                  style="width: 100%"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="16">
                            <el-col :span="12">
                              <el-form-item label="补位字符">
                                <el-input
                                  v-model="segment.padChar"
                                  placeholder="默认0"
                                  maxlength="1"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </template>
                      </div>

                      <!-- 操作按钮 -->
                      <div class="flex flex-col gap-4px pt-8px">
                        <el-button link :disabled="index === 0" @click="moveSegment(index, 'up')">
                          <Icon icon="ep:arrow-up" />
                        </el-button>
                        <el-button
                          link
                          :disabled="index === formData.segments.length - 1"
                          @click="moveSegment(index, 'down')"
                        >
                          <Icon icon="ep:arrow-down" />
                        </el-button>
                        <el-button link class="btn-delete" @click="removeSegment(index)">
                          <Icon icon="ep:delete" />
                        </el-button>
                      </div>
                    </div>
                  </el-card>

                  <!-- 空状态 -->
                  <el-empty
                    v-if="!formData.segments.length"
                    description="暂无编码段，请点击上方按钮添加"
                    :image-size="80"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>

        <!-- 右侧：预览面板 -->
        <el-col :span="9">
          <el-card shadow="never" class="preview-card">
            <template #header>
              <div class="card-header flex items-center gap-6px">
                <Icon icon="ep:view" class="text-primary" />
                <span>编码效果预览</span>
              </div>
            </template>

            <!-- 生成结果 -->
            <div class="mb-16px">
              <div class="text-12px text-gray-500 mb-4px">生成结果</div>
              <div
                class="text-20px font-bold break-all"
                :class="previewCode ? 'text-dark' : 'text-gray-300'"
              >
                {{ previewCode || '请配置编码段' }}
              </div>
            </div>

            <el-divider />

            <!-- 解析详情 -->
            <div class="mb-16px" v-if="formData.segments.length">
              <div class="text-12px text-gray-500 mb-8px">解析详情</div>
              <div
                v-for="(seg, idx) in formData.segments"
                :key="idx"
                class="flex items-center justify-between py-6px"
              >
                <div class="flex items-center gap-8px">
                  <el-tag
                    :type="getSegmentTagColor(seg.segmentType)"
                    size="small"
                    round
                    effect="plain"
                  >
                    {{ idx + 1 }}
                  </el-tag>
                  <span class="text-13px">{{
                    seg.segmentDesc || getSegmentTypeName(seg.segmentType)
                  }}</span>
                </div>
                <span class="text-13px font-mono text-gray-600">
                  {{ getSegmentPreviewValue(seg) }}
                </span>
              </div>
            </div>

            <el-divider />

            <!-- 规则校验说明 -->
            <div class="mb-16px">
              <div class="flex items-center gap-6px mb-8px">
                <Icon icon="ep:warning" class="text-warning" />
                <span class="text-14px font-500">规则校验说明</span>
              </div>
              <div class="text-13px text-gray-600 leading-relaxed">
                <p class="mb-6px">
                  <span class="font-500 text-dark">唯一性校验：</span>
                  系统将基于配置的"全局"周期自动重置流水号，确保生成的编码在同一周期内唯一。
                </p>
                <p class="mb-6px">
                  <span class="font-500 text-dark">格式补位：</span>
                  对于长度不足的动态字段（如流水号），系统将自动使用补位字符在左侧进行补位，以保持编码长度整齐。
                </p>
                <p>
                  <span class="font-500 text-dark">校验位算法：</span>
                  当前未启用校验位，建议在编码末尾添加校验段以提高数据准确性。
                </p>
              </div>
            </div>

            <!-- 应用场景提示 -->
            <div class="bg-blue-50 rounded-8px p-12px" v-if="formData.ruleType">
              <div class="text-13px font-500 text-primary mb-4px">应用场景提示</div>
              <div class="text-12px text-gray-600">
                {{ getSceneTip(formData.ruleType) }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />取 消
      </el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">
        <Icon icon="ep:check" class="mr-5px" />保存规则
      </el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as StrategyCodeApi from '@/api/mdm/strategyCode'

defineOptions({ name: 'StrategyCodeForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const activeTab = ref('basic')

const formData = ref({
  id: undefined as number | undefined,
  ruleCode: '',
  ruleName: '',
  ruleType: '',
  applicableSystem: '',
  separatorCode: '',
  resetCycle: '',
  status: 'E',
  remark: '',
  segments: [] as StrategyCodeApi.StrategyCodeSegmentDto[]
})

const formRules = reactive({
  ruleCode: [
    { required: true, message: '请输入规则编号', trigger: 'blur' },
    { max: 32, min: 1, message: '输入字符长度不合规', trigger: 'blur' }
  ],
  ruleName: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { max: 50, min: 1, message: '输入字符长度不合规', trigger: 'blur' }
  ],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  applicableSystem: [{ required: true, message: '请选择适用系统', trigger: 'change' }],
  resetCycle: [{ required: true, message: '请选择流水号重置周期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '输入字符长度不合规', trigger: 'blur' }]
})

const formRef = ref()
const emit = defineEmits(['success'])

// ==================== 预览计算 ====================

/** 格式化日期示例 */
const formatDateExample = (dateFormat?: string) => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  switch (dateFormat) {
    case 'YYYYMMDD':
      return `${y}${m}${d}`
    case 'YYYYMM':
      return `${y}${m}`
    case 'YYYY':
      return `${y}`
    default:
      return `${y}${m}${d}`
  }
}

/** 编码效果预览 */
const previewCode = computed(() => {
  if (!formData.value.segments?.length) return ''
  const parts = formData.value.segments.map((seg) => {
    switch (seg.segmentType) {
      case 'FIXED':
        return seg.fixedValue || ''
      case 'DATE':
        return formatDateExample(seg.dateFormat)
      case 'SEQUENCE':
        return '1'.padStart(seg.snLength || 4, seg.padChar || '0')
      default:
        return ''
    }
  })
  return parts.filter(Boolean).join(formData.value.separatorCode || '')
})

/** 获取段类型对应的tag颜色 */
const getSegmentTagColor = (segmentType: string) => {
  switch (segmentType) {
    case 'FIXED':
      return 'danger'
    case 'DATE':
      return ''
    case 'SEQUENCE':
      return 'warning'
    default:
      return 'info'
  }
}

/** 获取段类型名称 */
const getSegmentTypeName = (segmentType: string) => {
  switch (segmentType) {
    case 'FIXED':
      return '固定字符'
    case 'DATE':
      return '日期'
    case 'SEQUENCE':
      return '流水号'
    default:
      return ''
  }
}

/** 获取段预览值 */
const getSegmentPreviewValue = (seg: StrategyCodeApi.StrategyCodeSegmentDto) => {
  switch (seg.segmentType) {
    case 'FIXED':
      return seg.fixedValue || '-'
    case 'DATE':
      return formatDateExample(seg.dateFormat).substring(0, 6) + '...'
    case 'SEQUENCE':
      return '#'.repeat(seg.snLength || 4)
    default:
      return ''
  }
}

/** 获取应用场景提示文本 */
const getSceneTip = (ruleType: string) => {
  const tips: Record<string, string> = {
    material_code: '物料编码建议包含大类、中类信息，便于通过编码直接识别物料归属。',
    batch_no: '批次号建议包含日期和流水号，便于追溯生产批次和入库时间。',
    zone_code: '库区编码建议简洁明了，便于仓库人员快速识别区域。',
    location_code: '库位编码建议包含库区、巷道、货架、层、位等信息，便于精确定位。',
    asn_code: 'ASN单编码建议包含入库类型和日期，便于快速识别单据来源。',
    outbound_code: '出库单编码建议包含出库类型标识和日期，便于区分不同出库业务。',
    inbound_code: '入库单编码建议包含入库类型和日期信息，便于单据管理和追溯。'
  }
  return tips[ruleType] || '请根据业务需要合理配置编码规则段。'
}

// ==================== 段管理 ====================

/** 添加段 */
const addSegment = (type: string) => {
  // 流水号段只能有一个
  if (type === 'SEQUENCE' && formData.value.segments.some((s) => s.segmentType === 'SEQUENCE')) {
    message.warning('只能添加一个流水号段')
    return
  }
  const defaultDesc: Record<string, string> = {
    FIXED: '前缀',
    DATE: '日期',
    SEQUENCE: '流水号'
  }
  formData.value.segments.push({
    sortOrder: formData.value.segments.length + 1,
    segmentType: type,
    segmentDesc: defaultDesc[type] || '',
    fixedValue: type === 'FIXED' ? '' : undefined,
    dateFormat: type === 'DATE' ? 'YYYYMMDD' : undefined,
    snLength: type === 'SEQUENCE' ? 4 : undefined,
    padChar: type === 'SEQUENCE' ? '0' : undefined
  })
}

/** 移动段 */
const moveSegment = (index: number, direction: 'up' | 'down') => {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= formData.value.segments.length) return
  const segments = formData.value.segments
  ;[segments[index], segments[target]] = [segments[target], segments[index]]
  segments.forEach((seg, idx) => (seg.sortOrder = idx + 1))
}

/** 删除段 */
const removeSegment = (index: number) => {
  formData.value.segments.splice(index, 1)
  formData.value.segments.forEach((seg, idx) => (seg.sortOrder = idx + 1))
}

// ==================== 表单操作 ====================

/** 提交表单 */
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 自定义校验：至少一个编码段
  if (!formData.value.segments.length) {
    message.warning('请至少添加一个编码段')
    activeTab.value = 'segments'
    return
  }
  // 校验每个段的必填字段
  for (let i = 0; i < formData.value.segments.length; i++) {
    const seg = formData.value.segments[i]
    if (!seg.segmentDesc) {
      message.warning(`第 ${i + 1} 段的段描述不能为空`)
      activeTab.value = 'segments'
      return
    }
    if (seg.segmentType === 'FIXED' && !seg.fixedValue) {
      message.warning(`第 ${i + 1} 段（固定字符）的固定值不能为空`)
      activeTab.value = 'segments'
      return
    }
    if (seg.segmentType === 'DATE' && !seg.dateFormat) {
      message.warning(`第 ${i + 1} 段（日期时间）的日期格式不能为空`)
      activeTab.value = 'segments'
      return
    }
    if (seg.segmentType === 'SEQUENCE' && (!seg.snLength || seg.snLength < 1)) {
      message.warning(`第 ${i + 1} 段（流水号）的位数长度不能为空`)
      activeTab.value = 'segments'
      return
    }
  }
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      const data = formData.value as unknown as StrategyCodeApi.StrategyCodeSaveDto
      await StrategyCodeApi.createStrategyCode(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as StrategyCodeApi.StrategyCodeUpdateDto
      await StrategyCodeApi.updateStrategyCode(data)
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
    ruleCode: '',
    ruleName: '',
    ruleType: '',
    applicableSystem: '',
    separatorCode: '',
    resetCycle: '',
    status: 'E',
    remark: '',
    segments: []
  }
  activeTab.value = 'basic'
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增编码规则' : '编辑编码规则'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StrategyCodeApi.getStrategyCodeById(id)
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__header {
    padding: 12px 20px;
    background: #f5f7fa;
  }

  &:hover {
    box-shadow: unset;
  }

  .el-form-item__label {
    display: flex;
  }

  .card-header {
    font-weight: 500;
    color: #303133;
  }
}

.segment-card {
  :deep(.el-card__body) {
    padding: 16px;
  }
}

.segment-number {
  min-width: 28px;
  text-align: center;
}

.preview-card {
  position: sticky;
  top: 0;

  :deep(.el-card__header) {
    background: #f0f9ff;
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-tabs__header) {
  margin-bottom: 16px;
}

// 优化流水号按钮hover效果
:deep(.el-button--warning.is-plain) {
  &:hover {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
  }
}
</style>
