<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('mdm.lighting.controllerManagement.bindLightbar')"
    width="500px"
    :close-on-click-modal="false"
    class="custom-dialog"
    @close="handleClose"
  >
    <div class="dialog-body">
      <div class="dialog-desc">
        {{ t('mdm.lighting.bindLightbar.tip') }}
      </div>

      <div class="current-warehouse">
        {{ t('mdm.lighting.bindLocation.currentWarehouse') }}：<span class="warehouse-name">{{ warehouseName }}</span>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="refactored-form"
      >
        <el-form-item :label="t('mdm.lighting.controllerManagement.controllerName')" prop="controllerName">
          <el-input
            v-model="formData.controllerName"
            :placeholder="t('mdm.lighting.controllerManagement.controllerCode')"
            maxlength="128"
            show-word-limit
            class="custom-styled-item"
          />
        </el-form-item>

        <el-form-item :label="t('mdm.lighting.bindLightbar.availableDevices')" prop="iotDeviceId">
          <el-select
            v-model="formData.iotDeviceId"
            :placeholder="t('mdm.lighting.bindLightbar.searchPlaceholder')"
            style="width: 100%"
            filterable
            class="custom-styled-item"
            @change="handleDeviceChange"
          >
            <template #prefix>
              <el-icon v-if="formData.iotDeviceId" style="margin-right: 8px"><Monitor /></el-icon>
            </template>
            <el-option
              v-for="device in iotDeviceList"
              :key="device.iotDeviceId"
              :label="device.deviceName"
              :value="device.iotDeviceId"
            >
              <div class="option-content">
                <span>{{ device.deviceName }}</span>
                <span class="option-code">{{ device.iotDeviceId }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <transition name="fade">
          <div v-if="selectedDevice" class="device-info-box">
            <div class="info-title">{{ t('mdm.lighting.lightbarList.deviceId') }}</div>
            <div class="info-row">
              <span class="label">{{ t('mdm.lighting.controllerManagement.controllerCode') }}：</span>
              <span class="value">{{ selectedDevice.iotDeviceId }}</span>
            </div>
          </div>
        </transition>

        <div class="footer-notice">
          * {{ t('mdm.lighting.bindLightbar.tip') }}
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" round>{{ t('mdm.lighting.common.cancel') }}</el-button>
        <el-button 
          type="primary" 
          :loading="submitLoading" 
          @click="handleSubmit"
          round
          class="confirm-btn"
        >
          {{ t('mdm.lighting.common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Monitor } from '@element-plus/icons-vue'
import { useI18n } from '@/hooks/web/useI18n'
import * as ControllerApi from '@/api/mdm/lighting/controller'
import * as DeviceApi from '@/api/mdm/lighting/device'

const { t } = useI18n()

const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const formType = ref<'create' | 'update'>('create')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const warehouseName = ref<string>('')

// 表单数据
const formData = reactive({
  id: undefined as number | undefined,
  warehouseId: undefined as number | undefined,
  controllerName: '',
  iotDeviceId: '',
  enableFlag: 1
})

// IoT设备列表
const iotDeviceList = ref<DeviceApi.LightingDeviceVo[]>([])

// 选中的设备对象
const selectedDevice = computed(() => {
  return iotDeviceList.value.find(d => d.iotDeviceId === formData.iotDeviceId)
})

// 表单验证规则
const formRules: FormRules = {
  iotDeviceId: [
    { required: true, message: t('mdm.lighting.bindLightbar.selectAtLeastOne'), trigger: 'change' }
  ],
  controllerName: [
    { required: true, message: t('mdm.lighting.controllerManagement.controllerCode'), trigger: 'blur' },
    { max: 128, message: t('mdm.lighting.controllerManagement.controllerCode'), trigger: 'blur' }
  ]
}

/** 打开弹窗 */
const open = async (
  type: 'create' | 'update',
  row?: ControllerApi.AisleControllerVo,
  warehouseId?: number,
  warehouseNameParam?: string
) => {
  dialogVisible.value = true
  formType.value = type
  resetForm()

  if (type === 'update' && row) {
    // 编辑模式：填充表单数据
    formData.id = row.id
    formData.controllerName = row.controllerName
    formData.iotDeviceId = row.iotDeviceId
    formData.enableFlag = row.enableFlag
    // 加载一次可用列表以确认数据
    await loadIotDevices()
  } else {
    // 新增模式：设置仓库信息并加载IoT设备列表
    if (warehouseId) {
      formData.warehouseId = warehouseId
      warehouseName.value = warehouseNameParam || ''
    }
    await loadIotDevices()
  }
}

/** 加载IoT设备列表 */
const loadIotDevices = async () => {
  try {
    const res = await DeviceApi.getAvailableDevices()
    iotDeviceList.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('加载IoT设备列表失败:', error)
  }
}

/** 设备切换处理 */
const handleDeviceChange = (val: string) => {
  const device = iotDeviceList.value.find(d => d.iotDeviceId === val)
  if (device) {
    formData.controllerName = device.deviceName
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.id = undefined
  formData.warehouseId = undefined
  formData.controllerName = ''
  formData.iotDeviceId = ''
  formData.enableFlag = 1
  warehouseName.value = ''
  formRef.value?.clearValidate()
}

/** 关闭弹窗 */
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (formType.value === 'create') {
        if (!formData.warehouseId) {
          ElMessage.error('仓库信息缺失')
          return
        }
        const dto: ControllerApi.AisleControllerSaveDto = {
          warehouseId: formData.warehouseId,
          controllerName: formData.controllerName,
          iotDeviceId: formData.iotDeviceId,
          enableFlag: formData.enableFlag
        }
        await ControllerApi.saveAisleController(dto)
        ElMessage.success('绑定成功')
      } else {
        const dto: ControllerApi.AisleControllerUpdateDto = {
          id: formData.id!,
          controllerName: formData.controllerName,
          enableFlag: formData.enableFlag
        }
        await ControllerApi.updateAisleController(dto)
        ElMessage.success('更新成功')
      }

      handleClose()
      emit('success')
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.custom-dialog {
  :deep(.el-dialog__header) {
    padding-bottom: 20px;
    .el-dialog__title {
      font-weight: 600;
      font-size: 20px;
    }
  }

  .dialog-body {
    padding: 0 8px;
  }

  .dialog-desc {
    color: #909399;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .current-warehouse {
    background-color: #f5f7fa;
    padding: 16px 20px;
    border-radius: 6px;
    font-size: 14px;
    color: #606266;
    margin-bottom: 24px;

    .warehouse-name {
      color: #303133;
      font-weight: 700;
      font-size: 16px;
    }
  }

  .refactored-form {
    :deep(.el-form-item__label) {
      font-size: 16px;
      color: #303133;
      padding-bottom: 12px;
    }
  }

  .custom-styled-item {
    :deep(.el-input__wrapper) {
      background-color: #f5f7fa;
      box-shadow: none !important;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      padding: 8px 12px;
      height: 48px;
      
      &:hover {
        border-color: #c0c4cc;
      }
      &.is-focus {
        border-color: #409eff;
        background-color: #fff;
      }
    }

    :deep(.el-input__inner) {
      font-size: 14px;
    }
  }

  .device-info-box {
    margin-top: 16px;
    background-color: #ecf5ff;
    border: 1px solid #d9ecff;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info-title {
      color: #409eff;
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 4px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      .label {
        color: #409eff;
      }
      .value {
        color: #004d99;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
      }
    }
  }

  .footer-notice {
    margin-top: 20px;
    font-size: 13px;
    color: #909399;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .confirm-btn {
      background-color: #4da6ff;
      border-color: #4da6ff;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 500;
      
      &:hover {
        background-color: #66b3ff;
      }
    }
  }
}

.option-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  
  .option-code {
    color: #909399;
    font-size: 12px;
    margin-left: 12px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
