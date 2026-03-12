<!-- Author [Kiro AI],  Since 2026-03-04,  Copyright (c) 2025-2026  -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('mdm.lighting.device.detailTitle')"
    width="800px"
    :close-on-click-modal="false">
    <el-descriptions :column="2" border v-loading="loading">
      <el-descriptions-item :label="t('mdm.lighting.device.deviceId')">
        {{ deviceData.iotDeviceId }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.deviceName')">
        {{ deviceData.deviceName }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.deviceType')">
        <el-tag type="primary" size="small">
          {{ mdmEnumStore.getDeviceTypeText(deviceData.deviceType) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.platformType')">
        <div class="flex items-center">
          <Icon 
            :icon="deviceData.platformType === 'THINGSBOARD' ? 'ep:platform' : 'ep:cloudy'" 
            class="mr-1"
          />
          <span>{{ mdmEnumStore.getPlatformTypeText(deviceData.platformType || '') }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.onlineStatus')">
        <el-tag 
          :type="mdmEnumStore.getOnlineStatusType(deviceData.onlineStatus)" 
          size="small">
          <div class="flex items-center">
            <Icon 
              :icon="deviceData.onlineStatus === 'ONLINE' ? 'ep:circle-check' : 'ep:circle-close'" 
              class="mr-1"
            />
            <span>{{ mdmEnumStore.getOnlineStatusText(deviceData.onlineStatus) }}</span>
          </div>
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.enableStatus')">
        <el-tag 
          :type="deviceData.enabled ? 'success' : 'info'" 
          size="small">
          {{ deviceData.enabled ? t('mdm.lighting.device.enabled') : t('mdm.lighting.device.disabled') }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.supportedActions')" :span="2">
        <div v-if="getSupportedActions(deviceData.supportedActions).length > 0">
          <el-tag
            v-for="action in getSupportedActions(deviceData.supportedActions)"
            :key="action"
            size="small"
            class="mr-1 mb-1">
            {{ mdmEnumStore.getActionTypeText(action) }}
          </el-tag>
        </div>
        <span v-else class="text-gray-400">{{ t('mdm.lighting.device.notConfigured') }}</span>
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.lastActiveTime')">
        {{ deviceData.lastActiveTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.syncTime')">
        {{ deviceData.syncTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.createTime')">
        {{ deviceData.createTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.updateTime')">
        {{ deviceData.updateTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('mdm.lighting.device.versionNo')">
        {{ deviceData.version }}
      </el-descriptions-item>
    </el-descriptions>
    
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('mdm.lighting.device.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as DeviceApi from '@/api/mdm/lighting/device'
import { useMdmEnumStore } from '@/store/modules/enums'

const { t } = useI18n()
const mdmEnumStore = useMdmEnumStore()

const dialogVisible = ref(false)
const loading = ref(false)
const deviceData = ref<DeviceApi.LightingDeviceVo>({
  id: 0,
  iotDeviceId: '',
  deviceName: '',
  deviceType: '',
  onlineStatus: '',
  enabled: false,
  supportedActions: [],
  version: 0
})

/** 打开对话框 */
const open = async (id: number) => {
  dialogVisible.value = true
  loading.value = true
  
  try {
    const data = await DeviceApi.getDeviceById(id)
    deviceData.value = data
  } catch (error) {
    console.error('加载设备详情失败:', error)
  } finally {
    loading.value = false
  }
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

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
