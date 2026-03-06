<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('mdm.lighting.bindLightbar.title')"
    width="500px"
    :close-on-click-modal="false"
    class="custom-dialog"
    @close="handleClose"
  >
    <div class="dialog-content">
      <p class="tip">{{ t('mdm.lighting.bindLightbar.tip') }}</p>
      
      <div class="form-item">
        <label class="form-label">{{ t('mdm.lighting.bindLightbar.availableDevices') }}</label>
        <el-select
          v-model="selectedDeviceIds"
          :placeholder="t('mdm.lighting.bindLightbar.searchPlaceholder')"
          class="w-full"
          clearable
          multiple
          collapse-tags
          collapse-tags-tooltip
        >
          <el-option
            v-for="device in deviceList"
            :key="device.id"
            :label="`${device.deviceName} (${device.iotDeviceId}) - ${device.onlineStatus === 'ONLINE' ? t('mdm.lighting.controllerManagement.online') : t('mdm.lighting.controllerManagement.offline')}`"
            :value="device.id"
          />
        </el-select>
      </div>
      
      <p class="form-tip">* {{ t('mdm.lighting.bindLightbar.tip') }}</p>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ t('mdm.lighting.common.cancel') }}</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          :disabled="selectedDeviceIds.length === 0"
          @click="handleSubmit"
        >
          {{ t('mdm.lighting.common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import * as LightbarApi from '@/api/mdm/lighting/lightbar'
import * as DeviceApi from '@/api/mdm/lighting/device'

const { t } = useI18n()

interface Props {
  modelValue: boolean
  controllerId: number
}

interface Device {
  id: number
  deviceName: string
  iotDeviceId: string
  onlineStatus: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const deviceList = ref<Device[]>([])
const selectedDeviceIds = ref<number[]>([])

// 已选择的设备
const selectedDevices = computed(() => {
  return deviceList.value.filter(device => selectedDeviceIds.value.includes(device.id))
})

// 加载可用设备列表
const loadDevices = async () => {
  loading.value = true
  try {
    // 调用后端接口获取未绑定的灯条设备列表
    const res = await DeviceApi.getAvailableDevices()
    const devices = Array.isArray(res) ? res : []
    
    // 过滤出灯条类型的设备（如果需要的话）
    // deviceList.value = devices.filter(d => d.deviceType === 'LIGHT_STRIP')
    deviceList.value = devices.map(d => ({
      id: d.id,
      deviceName: d.deviceName,
      iotDeviceId: d.iotDeviceId,
      onlineStatus: d.onlineStatus
    }))
    
    console.log('可用灯条设备列表:', deviceList.value)
  } catch (error) {
    console.error('加载设备列表失败:', error)
    ElMessage.error(t('mdm.lighting.common.loading'))
  } finally {
    loading.value = false
  }
}

// 选择逻辑已由el-select接管

// 提交
const handleSubmit = async () => {
  if (selectedDeviceIds.value.length === 0) {
    ElMessage.warning(t('mdm.lighting.bindLightbar.selectAtLeastOne'))
    return
  }
  
  submitting.value = true
  try {
    // 批量绑定灯条 - 将选中的设备ID转换为iotDeviceId字符串数组
    const lightbarDeviceIds = selectedDeviceIds.value.map(deviceId => {
      const device = deviceList.value.find(d => d.id === deviceId)
      return device?.iotDeviceId || ''
    }).filter(id => id !== '')
    
    console.log('准备绑定的灯条设备ID列表:', lightbarDeviceIds)
    
    // 调用批量绑定接口
    await LightbarApi.batchBindLightBar({
      controllerId: props.controllerId,
      lightbarDeviceIds: lightbarDeviceIds,
      enableFlag: 1
    })
    
    ElMessage.success(t('mdm.lighting.bindLightbar.bindSuccess'))
    emit('success')
    handleClose()
  } catch (error: any) {
    console.error('绑定失败:', error)
    ElMessage.error(error.message || t('mdm.lighting.bindLightbar.bindFailed'))
  } finally {
    submitting.value = false
  }
}

// 关闭
const handleClose = () => {
  selectedDeviceIds.value = []
  searchKeyword.value = ''
  dialogVisible.value = false
}

// 监听弹窗打开
watch(dialogVisible, (val) => {
  if (val) {
    loadDevices()
  }
})
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 0 10px;
  
  .tip {
    color: #909399;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 24px;
  }
  
  .form-item {
    margin-bottom: 8px;
    
    .form-label {
      display: block;
      font-size: 14px;
      color: #303133;
      margin-bottom: 8px;
    }
    
    .w-full {
      width: 100%;
    }
  }
  
  .form-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
    margin-bottom: 20px;
  }
}

:deep(.el-dialog__header) {
  font-weight: bold;
}
</style>
