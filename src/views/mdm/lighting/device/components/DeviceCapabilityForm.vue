<!-- Author [Kiro AI],  Since 2026-03-04,  Copyright (c) 2025-2026  -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('mdm.lighting.device.capabilityTitle')"
    width="600px"
    :close-on-click-modal="false">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="loading">
      <el-form-item :label="t('mdm.lighting.device.deviceNameLabel')">
        <el-input v-model="deviceName" disabled />
      </el-form-item>
      <el-form-item :label="t('mdm.lighting.device.supportedActionsLabel')" prop="supportedActions">
        <el-checkbox-group v-model="formData.supportedActions">
          <el-checkbox
            v-for="action in mdmEnumStore.getActionTypeList"
            :key="action.value"
            :label="action.value">
            {{ action.text }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('mdm.lighting.device.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        {{ t('mdm.lighting.device.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as DeviceApi from '@/api/mdm/lighting/device'
import { useMdmEnumStore } from '@/store/modules/enums'

const message = useMessage()
const { t } = useI18n()
const mdmEnumStore = useMdmEnumStore()

const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const deviceName = ref('')
const deviceId = ref(0)
const deviceVersion = ref(0)

const formData = reactive({
  supportedActions: [] as string[]
})

const formRules = {
  supportedActions: [
    { 
      required: true, 
      message: t('mdm.lighting.device.selectActions'), 
      trigger: 'change',
      validator: (_rule: any, value: string[], callback: any) => {
        if (!value || value.length === 0) {
          callback(new Error(t('mdm.lighting.device.selectActions')))
        } else {
          callback()
        }
      }
    }
  ]
}

/** 打开对话框 */
const open = async (row: DeviceApi.LightingDevicePageVo) => {
  dialogVisible.value = true
  deviceId.value = row.id
  deviceName.value = row.deviceName
  deviceVersion.value = row.version
  
  // 解析支持的动作（处理字符串或数组）
  const actions = getSupportedActions(row.supportedActions)
  formData.supportedActions = [...actions]
  
  // 重置表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

/** 解析支持的动作（处理字符串或数组） */
const getSupportedActions = (supportedActions: string | string[] | undefined): string[] => {
  if (!supportedActions) {
    return []
  }
  
  // 如果已经是数组，直接返回
  if (Array.isArray(supportedActions)) {
    return supportedActions
  }
  
  // 如果是字符串，按逗号分割并去除空格
  if (typeof supportedActions === 'string') {
    return supportedActions
      .split(',')
      .map(action => action.trim())
      .filter(action => action.length > 0)
  }
  
  return []
}

/** 提交表单 */
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    await DeviceApi.updateDeviceCapability({
      id: deviceId.value,
      supportedActions: formData.supportedActions,
      version: deviceVersion.value
    })
    
    message.success(t('mdm.lighting.device.capabilitySuccess'))
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新设备能力失败:', error)
    }
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
