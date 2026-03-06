<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('mdm.lighting.bindLocation.title')"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-content" v-loading="loading">
      <p class="tip">{{ t('mdm.lighting.bindLocation.tip') }}</p>
      
      <el-form :model="formData" label-width="100px">
        <el-form-item :label="t('mdm.lighting.bindLocation.currentWarehouse')">
          <el-input :value="warehouseName" disabled />
        </el-form-item>
        
        <el-form-item :label="t('mdm.lighting.bindLocation.selectLocation')" required>
          <el-select
            v-model="formData.locationIds"
            multiple
            filterable
            :placeholder="t('mdm.lighting.bindLocation.searchPlaceholder')"
            style="width: 100%"
          >
            <el-option
              v-for="location in locationOptions"
              :key="location.id"
              :label="location.label"
              :value="location.id"
            >
              <div class="location-option">
                <span>{{ location.locationCode }}</span>
                <span class="location-name">{{ location.locationName }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="form-tip">{{ t('mdm.lighting.bindLocation.searchTip') }}</div>
        </el-form-item>
      </el-form>
      
      <!-- 已选择的库位列表 -->
      <div v-if="formData.locationIds.length > 0" class="selected-locations">
        <div class="section-title">{{ t('mdm.lighting.bindLocation.selectedLocations') }} ({{ formData.locationIds.length }})</div>
        <div class="location-tags">
          <el-tag
            v-for="locationId in formData.locationIds"
            :key="locationId"
            closable
            @close="removeLocation(locationId)"
          >
            {{ getLocationLabel(locationId) }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="handleClose">{{ t('mdm.lighting.common.cancel') }}</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="formData.locationIds.length === 0"
        @click="handleSubmit"
      >
        {{ t('mdm.lighting.common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import * as LocationApi from '@/api/mdm/lighting/location'

const { t } = useI18n()

interface Props {
  modelValue: boolean
  lightbarDeviceId: string
  lightbarName: string
  warehouseId: number
  warehouseName: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formData = reactive({
  locationIds: [] as number[]
})

const loading = ref(false)
const submitting = ref(false)
const locationOptions = ref<any[]>([])

// 加载库位列表
const loadLocations = async () => {
  if (!props.warehouseId) {
    ElMessage.warning(t('mdm.lighting.common.selectWarehouse'))
    return
  }
  
  loading.value = true
  try {
    const res = await LocationApi.searchAvailableLocations(props.warehouseId)
    // list 接口直接返回数组
    const locations = Array.isArray(res) ? res : []
    
    locationOptions.value = locations.map((loc: LocationApi.WarehouseLocationVo) => ({
      id: loc.id,
      locationCode: loc.locationCode,
      locationName: loc.locationName || '',
      label: loc.locationName 
        ? `${loc.locationName} (${loc.locationCode})` 
        : loc.locationCode
    }))
    
    console.log('加载到库位:', locationOptions.value.length, '个')
  } catch (error) {
    console.error('加载库位列表失败:', error)
    ElMessage.error(t('mdm.lighting.common.loading'))
  } finally {
    loading.value = false
  }
}

// 获取库位标签
const getLocationLabel = (locationId: number) => {
  const location = locationOptions.value.find(loc => loc.id === locationId)
  return location ? location.locationCode : locationId
}

// 移除库位
const removeLocation = (locationId: number) => {
  const index = formData.locationIds.indexOf(locationId)
  if (index > -1) {
    formData.locationIds.splice(index, 1)
  }
}

// 提交
const handleSubmit = async () => {
  if (formData.locationIds.length === 0) {
    ElMessage.warning(t('mdm.lighting.bindLocation.selectAtLeastOne'))
    return
  }
  
  submitting.value = true
  try {
    await LocationApi.batchBindLocation({
      lightbarDeviceId: props.lightbarDeviceId,
      locationIds: formData.locationIds
    })
    
    ElMessage.success(t('mdm.lighting.bindLocation.bindSuccess'))
    emit('success')
    handleClose()
  } catch (error: any) {
    console.error('绑定失败:', error)
    ElMessage.error(error.message || t('mdm.lighting.bindLocation.bindFailed'))
  } finally {
    submitting.value = false
  }
}

// 关闭
const handleClose = () => {
  formData.locationIds = []
  locationOptions.value = []
  dialogVisible.value = false
}

// 监听弹窗打开
watch(dialogVisible, (val) => {
  if (val) {
    loadLocations()
  }
})
</script>

<style lang="scss" scoped>
.dialog-content {
  .tip {
    color: #909399;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .form-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .location-option {
    display: flex;
    justify-content: space-between;
    
    .location-name {
      color: #909399;
      font-size: 12px;
    }
  }
  
  .selected-locations {
    margin-top: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
    
    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      color: #606266;
    }
    
    .location-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}
</style>
