<!-- Author [Kiro AI],  Since 2026-03-05,  Copyright (c) 2025-2026  -->
<template>
  <Dialog v-model="dialogVisible" :title="t('mdm.lighting.device.executeTaskTitle')" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading">
      <el-form-item :label="t('mdm.lighting.device.deviceName')" v-if="deviceName">
        <el-input v-model="deviceName" disabled />
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.bizType')" prop="bizType">
        <el-input
          v-model="formData.bizType"
          :placeholder="t('mdm.lighting.device.bizTypePlaceholder')"
          clearable />
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.bizId')" prop="bizId">
        <el-input
          v-model="formData.bizId"
          :placeholder="t('mdm.lighting.device.bizIdPlaceholder')"
          clearable />
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.taskType')" prop="taskType">
        <el-select
          v-model="formData.taskType"
          :placeholder="t('mdm.lighting.device.taskTypePlaceholder')"
          class="w-full">
          <el-option
            v-for="dict in mdmEnumStore.getTaskTypeList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.targetType')" prop="targetType">
        <el-select
          v-model="formData.targetType"
          :placeholder="t('mdm.lighting.device.targetTypePlaceholder')"
          class="w-full">
          <el-option
            v-for="dict in mdmEnumStore.getTargetTypeList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.targetExpression')" prop="targetExpression">
        <el-input
          v-model="formData.targetExpression"
          :placeholder="t('mdm.lighting.device.targetExpressionPlaceholder')"
          clearable />
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.actionType')" prop="action">
        <el-select
          v-model="formData.action"
          :placeholder="t('mdm.lighting.device.actionTypePlaceholder')"
          class="w-full">
          <el-option
            v-for="dict in filteredActionTypeList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
        <div v-if="supportedActions.length === 0" class="el-form-item__error" style="position: relative; top: 0;">
          {{ t('mdm.lighting.device.noSupportedActions') }}
        </div>
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.executionStrategy')" prop="executionStrategy">
        <el-select
          v-model="formData.executionStrategy"
          :placeholder="t('mdm.lighting.device.executionStrategyPlaceholder')"
          class="w-full">
          <el-option
            v-for="dict in mdmEnumStore.getExecutionStrategyList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.priority')" prop="priority">
        <el-input-number
          v-model="formData.priority"
          :min="0"
          :max="100"
          :placeholder="t('mdm.lighting.device.priorityPlaceholder')"
          class="w-full" />
      </el-form-item>
      
      <el-form-item :label="t('mdm.lighting.device.metadata')" prop="metadata">
        <el-input
          v-model="formData.metadata"
          type="textarea"
          :rows="3"
          :placeholder="t('mdm.lighting.device.metadataPlaceholder')"
          maxlength="500"
          show-word-limit />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as TaskApi from '@/api/mdm/lighting/task'
import * as DeviceApi from '@/api/mdm/lighting/device'
import { useMdmEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'ExecuteTaskForm' })

const message = useMessage()
const { t } = useI18n()
const mdmEnumStore = useMdmEnumStore()

const dialogVisible = ref(false)
const formLoading = ref(false)
const formRef = ref()

const deviceId = ref<number>(0)
const deviceName = ref<string>('')
const deviceIotId = ref<string>('')
const supportedActions = ref<string[]>([])

const formData = reactive<TaskApi.TaskCreateDto>({
  taskType: 'LOCATION_PICK',
  bizType: '',
  bizId: '',
  targetType: 'LOCATION_RANGE',
  targetExpression: '',
  action: '',
  executionStrategy: 'IMMEDIATE',
  priority: 0,
  metadata: ''
})

const formRules = reactive({
  bizType: [{ required: true, message: t('mdm.lighting.device.bizTypeRequired'), trigger: 'blur' }],
  bizId: [{ required: true, message: t('mdm.lighting.device.bizIdRequired'), trigger: 'blur' }],
  taskType: [{ required: true, message: t('mdm.lighting.device.taskTypeRequired'), trigger: 'change' }],
  targetType: [{ required: true, message: t('mdm.lighting.device.targetTypeRequired'), trigger: 'change' }],
  targetExpression: [{ required: true, message: t('mdm.lighting.device.targetExpressionRequired'), trigger: 'blur' }],
  action: [{ required: true, message: t('mdm.lighting.device.actionTypeRequired'), trigger: 'change' }],
  executionStrategy: [{ required: true, message: t('mdm.lighting.device.executionStrategyRequired'), trigger: 'change' }]
})

/** 过滤后的动作类型列表（只显示设备支持的动作） */
const filteredActionTypeList = computed(() => {
  if (supportedActions.value.length === 0) {
    // 如果设备未配置支持的动作，返回所有动作类型
    return mdmEnumStore.getActionTypeList
  }
  
  // 只返回设备支持的动作类型
  return mdmEnumStore.getActionTypeList.filter(action => 
    supportedActions.value.includes(action.value)
  )
})

/** 打开对话框 */
const open = async (row: DeviceApi.LightingDevicePageVo) => {
  dialogVisible.value = true
  resetForm()
  
  deviceId.value = row.id || 0
  deviceName.value = row.deviceName || ''
  deviceIotId.value = row.iotDeviceId || ''
  formData.bizId = row.iotDeviceId || ''
  
  // 解析设备支持的动作类型
  if (row.supportedActions) {
    if (Array.isArray(row.supportedActions)) {
      supportedActions.value = row.supportedActions
    } else {
      supportedActions.value = row.supportedActions
        .split(',')
        .map(action => action.trim())
        .filter(action => action.length > 0)
    }
  } else {
    supportedActions.value = []
  }
  
  // 加载所有需要的枚举
  await Promise.all([
    mdmEnumStore.loadTaskType(),
    mdmEnumStore.loadTargetType(),
    mdmEnumStore.loadActionType(),
    mdmEnumStore.loadExecutionStrategy()
  ])
}

/** 重置表单 */
const resetForm = () => {
  formData.taskType = 'LOCATION_PICK'
  formData.bizType = ''
  formData.targetType = 'LOCATION_RANGE'
  formData.targetExpression = ''
  formData.action = ''
  formData.executionStrategy = 'IMMEDIATE'
  formData.priority = 0
  formData.metadata = ''
  formRef.value?.clearValidate()
}

/** 提交表单 */
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  
  formLoading.value = true
  try {
    const result = await TaskApi.createAndExecuteTask(formData)
    
    message.success(
      t('mdm.lighting.device.executeTaskSuccess') + 
      `（成功: ${result.successCommands || 0}/${result.totalCommands || 0}）`
    )
    
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('执行任务失败:', error)
    message.error(t('mdm.lighting.device.executeTaskFailed'))
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })

const emit = defineEmits(['success'])
</script>
