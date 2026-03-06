<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="策略编码" prop="strategyCode">
        <el-input
          v-model="formData.strategyCode"
          placeholder="请输入策略编码"
          :disabled="formType === 'update'"
        />
      </el-form-item>
      <el-form-item label="策略名称" prop="strategyName">
        <el-input v-model="formData.strategyName" placeholder="请输入策略名称" />
      </el-form-item>
      <el-form-item label="策略类型" prop="strategyType">
        <el-select
          v-model="formData.strategyType"
          placeholder="请选择策略类型"
          class="!w-full"
          :disabled="formType === 'update'"
        >
          <el-option
            v-for="item in strategyTypeOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务场景" prop="bizScene">
        <el-input v-model="formData.bizScene" placeholder="请输入业务场景，如ASN_INBOUND" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="ENABLED">启用</el-radio>
          <el-radio value="DISABLED">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'

defineOptions({ name: 'StrategyForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const strategyTypeOptions = ref<StrategyApi.EnumEntity[]>([])
const formData = ref({
  id: undefined,
  strategyCode: '',
  strategyName: '',
  strategyType: '',
  bizScene: '',
  status: 'ENABLED',
  remark: ''
})
const formRules = reactive({
  strategyCode: [{ required: true, message: '策略编码不能为空', trigger: 'blur' }],
  strategyName: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }],
  strategyType: [{ required: true, message: '策略类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})
const formRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增策略' : '编辑策略'
  formType.value = type
  resetForm()
  // 获取策略类型枚举
  if (strategyTypeOptions.value.length === 0) {
    try {
      strategyTypeOptions.value = await StrategyApi.getStrategyTypeList()
    } catch {
      strategyTypeOptions.value = []
    }
  }
  if (id) {
    formLoading.value = true
    try {
      const data = await StrategyApi.getStrategyById(id)
      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as unknown as StrategyApi.StrategySaveDto
    if (formType.value === 'create') {
      await StrategyApi.createStrategy(data)
      message.success(t('common.createSuccess'))
    } else {
      await StrategyApi.updateStrategy(data as StrategyApi.StrategyUpdateDto)
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
    strategyType: '',
    bizScene: '',
    status: 'ENABLED',
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
