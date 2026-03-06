<!-- Author [陈建峰],  Since 2026-01-27 10:18:01,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <div class="max-h-[600px] overflow-auto">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <div class="flex flex-col gap-4">
          <!-- 基础信息 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>基础信息</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="策略编码" prop="strategyCode">
                  <el-input
                    v-model="formData.strategyCode"
                    placeholder="请输入策略编码"
                    :disabled="formType === 'update'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="策略名称" prop="strategyName">
                  <el-input v-model="formData.strategyName" placeholder="请输入策略名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="物料分类" prop="materialCategories">
                  <el-select
                    v-model="formData.materialCategories"
                    placeholder="请选择物料分类"
                    filterable
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="category in categoryList"
                      :key="category.value"
                      :label="category.text"
                      :value="category.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- 生成规则 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>生成规则</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="策略类型" prop="strategyType">
                  <el-select
                    v-model="formData.strategyType"
                    placeholder="请选择策略类型"
                    clearable
                    @change="handleStrategyTypeChange"
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_BATCH_STRATEGY_TYPE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.strategyType === 'system_auto'">
                <el-form-item label="前缀" prop="prefix">
                  <el-input v-model="formData.prefix" placeholder="请输入前缀" />
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.strategyType === 'system_auto'">
                <el-form-item label="日期格式" prop="dateFormat">
                  <el-select v-model="formData.dateFormat" placeholder="请选择日期格式" clearable>
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_BATCH_DATE_FORMAT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.strategyType === 'system_auto'">
                <el-form-item label="流水号长度" prop="snLength">
                  <el-input v-model="formData.snLength" placeholder="请输入流水号长度" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- 有效期管控 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>有效期管控</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="自动计算有效期" prop="validityPeriod">
                  <el-switch
                    v-model="formData.validityPeriod"
                    active-value="yes"
                    inactive-value="no"
                    @change="handleValidityPeriodChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.validityPeriod === 'yes'">
                <el-form-item label="保质期时长" prop="validityDuration">
                  <el-input v-model="formData.validityDuration" placeholder="请输入保质期时长" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.validityPeriod === 'yes'">
                <el-form-item label="保质期时长单位" prop="validityUnit">
                  <el-select
                    v-model="formData.validityUnit"
                    placeholder="请选择保质期时长单位"
                    clearable
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_BATCH_VALIDITY_UNIT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- 状态流转 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>状态流转</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入库默认状态" prop="circulationStatus">
                  <el-select
                    v-model="formData.circulationStatus"
                    placeholder="请选择入库默认状态"
                    clearable
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_BATCH_CIRCULATION_STATUS)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="临期自动冻结(天)" prop="circulationExpiration">
                  <el-input
                    v-model="formData.circulationExpiration"
                    placeholder="请输入临期自动冻结(天)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- 强制追溯 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>强制追溯</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="强制追溯" prop="forceTrace">
                  <el-switch v-model="formData.forceTrace" active-value="yes" inactive-value="no" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- 状态与备注 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>状态与备注</span>
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
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false"
        ><Icon icon="ep:close" class="mr-5px" />取 消</el-button
      >
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        ><Icon icon="ep:check" class="mr-5px" />保存配置</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as StrategyBatchApi from '@/api/mdm/strategyBatch'
import * as MaterialApi from '@/api/mdm/material'

defineOptions({ name: 'StrategyBatchForm' })

const { t } = useI18n()
const message = useMessage()

const categoryList = ref<any[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  strategyCode: '',
  strategyName: '',
  materialCategories: [],
  strategyType: '',
  prefix: '',
  dateFormat: '',
  snLength: undefined,
  validityPeriod: 'no',
  validityDuration: undefined,
  validityUnit: '',
  circulationStatus: '',
  circulationExpiration: undefined,
  forceTrace: 'no',
  status: 'E',
  remark: ''
})
const formRules = reactive({
  strategyCode: [
    {
      required: true,
      message: '请输入策略编码',
      trigger: 'blur'
    },
    {
      max: 32,
      min: 1,
      message: '输入字符长度不合规',
      trigger: 'blur'
    }
  ],
  strategyName: [
    {
      required: true,
      message: '请输入策略名称',
      trigger: 'blur'
    },
    {
      max: 50,
      min: 1,
      message: '输入字符长度不合规',
      trigger: 'blur'
    }
  ],
  materialCategories: [
    {
      required: true,
      message: '请选择生效条件-物料分类',
      trigger: 'change'
    }
  ],
  strategyType: [
    {
      required: true,
      message: '请选择策略类型',
      trigger: 'change'
    }
  ],
  prefix: [
    {
      required: computed(() => formData.value.strategyType === 'system_auto'),
      message: '请输入前缀',
      trigger: 'blur'
    },
    {
      max: 32,
      message: '输入字符长度不合规',
      trigger: 'blur'
    }
  ],
  dateFormat: [
    {
      required: computed(() => formData.value.strategyType === 'system_auto'),
      message: '请选择日期格式',
      trigger: 'change'
    }
  ],
  snLength: [
    {
      required: computed(() => formData.value.strategyType === 'system_auto'),
      message: '请输入流水号长度',
      trigger: 'blur'
    },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
      trigger: 'blur'
    }
  ],
  validityPeriod: [],
  validityDuration: [
    {
      required: computed(() => formData.value.validityPeriod === 'yes'),
      message: '请输入保质期时长',
      trigger: 'blur'
    },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
      trigger: 'blur'
    }
  ],
  validityUnit: [
    {
      required: computed(() => formData.value.validityPeriod === 'yes'),
      message: '请选择保质期时长单位',
      trigger: 'change'
    }
  ],
  circulationStatus: [],
  circulationExpiration: [
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
      trigger: 'blur'
    }
  ],
  forceTrace: [],
  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'change'
    }
  ],
  remark: [
    {
      max: 500,
      message: '输入字符长度不合规',
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
      const data = formData.value as unknown as StrategyBatchApi.StrategyBatchSaveDto
      await StrategyBatchApi.createStrategyBatch(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as StrategyBatchApi.StrategyBatchUpdateDto
      await StrategyBatchApi.updateStrategyBatch(data)
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
    strategyCode: '',
    strategyName: '',
    materialCategories: [],
    strategyType: '',
    prefix: '',
    dateFormat: '',
    snLength: undefined,
    validityPeriod: 'no',
    validityDuration: undefined,
    validityUnit: '',
    circulationStatus: '',
    circulationExpiration: undefined,
    forceTrace: 'no',
    status: 'E',
    remark: ''
  } as any
  formRef.value?.resetFields()
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
      formData.value = await StrategyBatchApi.getStrategyBatchById(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 策略类型变更处理 */
const handleStrategyTypeChange = (val: string) => {
  if (val !== 'system_auto') {
    formData.value.prefix = ''
    formData.value.dateFormat = ''
    formData.value.snLength = undefined
  }
  formRef.value?.clearValidate(['prefix', 'dateFormat', 'snLength'])
}

/** 自动计算有效期变更处理 */
const handleValidityPeriodChange = (val: string) => {
  if (val !== 'yes') {
    formData.value.validityDuration = undefined
    formData.value.validityUnit = ''
  }
  formRef.value?.clearValidate(['validityDuration', 'validityUnit'])
}

const getCategoryList = async () => {
  try {
    const result = await MaterialApi.listOfCategory()
    categoryList.value = result || []
  } catch (error) {
    console.error('获取物料分类列表失败:', error)
    categoryList.value = []
  }
}

onMounted(() => {
  getCategoryList()
})

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
</style>
