<!-- Author [Kiro AI],  Since 2026-03-04,  Copyright (c) 2025-2026  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px">
      <el-form-item :label="t('mdm.lighting.device.deviceName')" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          class="!w-200px"
          clearable
          :placeholder="t('mdm.lighting.device.searchPlaceholder')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="t('mdm.lighting.device.deviceType')" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          :placeholder="t('common.selectText')"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in mdmEnumStore.getDeviceTypeList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('mdm.lighting.device.onlineStatus')" prop="onlineStatus">
        <el-select
          v-model="queryParams.onlineStatus"
          :placeholder="t('common.selectText')"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in mdmEnumStore.getOnlineStatusList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('mdm.lighting.device.enableStatus')" prop="enabled">
        <el-select
          v-model="queryParams.enabled"
          :placeholder="t('common.selectText')"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in mdmEnumStore.getEnableFlagList"
            :key="dict.value"
            :label="dict.text"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['mdm:lighting:device:query']" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;{{ t('common.query') }}
        </el-button>
        <el-button v-hasPermi="['mdm:lighting:device:query']" @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;{{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button
        v-hasPermi="['mdm:lighting:device:sync']"
        plain
        type="success"
        @click="handleSyncDevices"
        :loading="syncLoading">
        <Icon class="mr-5px" icon="ep:refresh" />&nbsp;{{ t('mdm.lighting.device.syncDevices') }}
      </el-button>
      <el-button
        v-hasPermi="['mdm:lighting:task:create']"
        plain
        type="primary"
        @click="openExecuteTaskForm">
        <Icon class="mr-5px" icon="ep:video-play" />&nbsp;{{ t('mdm.lighting.device.executeTask') }}
      </el-button>
    </div>
    
    <el-table v-loading="loading" :data="list" stripe border>
      <el-table-column :label="t('mdm.lighting.device.deviceId')" align="center" width="180" prop="iotDeviceId" show-overflow-tooltip />
      <el-table-column :label="t('mdm.lighting.device.deviceName')" align="center" width="180" prop="deviceName" show-overflow-tooltip />
      <el-table-column :label="t('mdm.lighting.device.deviceType')" align="center" width="120">
        <template #default="scope">
          <el-tag type="primary" size="small">
            {{ mdmEnumStore.getDeviceTypeText(scope.row.deviceType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('mdm.lighting.device.platformType')" align="center" width="140">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <Icon 
              :icon="scope.row.platformType === 'THINGSBOARD' ? 'ep:platform' : 'ep:cloudy'" 
              class="mr-1"
            />
            <span>{{ mdmEnumStore.getPlatformTypeText(scope.row.platformType) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('mdm.lighting.device.onlineStatus')" align="center" width="100">
        <template #default="scope">
          <el-tag 
            :type="mdmEnumStore.getOnlineStatusType(scope.row.onlineStatus)" 
            size="small">
            <div class="flex items-center">
              <Icon 
                :icon="scope.row.onlineStatus === 'ONLINE' ? 'ep:circle-check' : 'ep:circle-close'" 
                class="mr-1"
              />
              <span>{{ mdmEnumStore.getOnlineStatusText(scope.row.onlineStatus) }}</span>
            </div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('mdm.lighting.device.enableStatus')" align="center" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleToggleStatus(scope.row)"
            :disabled="!hasPermission(['mdm:lighting:device:update'])"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('mdm.lighting.device.supportedActions')" align="center" width="200" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="getSupportedActions(scope.row.supportedActions).length > 0">
            <el-tag
              v-for="action in getSupportedActions(scope.row.supportedActions).slice(0, 3)"
              :key="action"
              size="small"
              class="mr-1 mb-1">
              {{ mdmEnumStore.getActionTypeText(action) }}
            </el-tag>
            <el-tag v-if="getSupportedActions(scope.row.supportedActions).length > 3" size="small" type="info">
              +{{ getSupportedActions(scope.row.supportedActions).length - 3 }}
            </el-tag>
          </div>
          <span v-else class="text-gray-400">{{ t('mdm.lighting.device.notConfigured') }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        :label="t('mdm.lighting.device.lastActiveTime')" 
        align="center" 
        prop="lastActiveTime" 
        :formatter="dateFormatter"
        width="160"
      />
      <el-table-column 
        :label="t('mdm.lighting.device.syncTime')" 
        align="center" 
        prop="syncTime" 
        :formatter="dateFormatter"
        width="160"
      />
      <el-table-column :label="t('mdm.lighting.device.operation')" align="center" min-width="200" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['mdm:lighting:device:query']">
            <Icon icon="ep:view" />&nbsp;{{ t('mdm.lighting.device.detail') }}
          </el-button>
          <el-button
            link
            class="btn-edit"
            @click="openCapabilityForm(scope.row)"
            v-hasPermi="['mdm:lighting:device:update']">
            <Icon icon="ep:setting" />&nbsp;{{ t('mdm.lighting.device.capabilityConfig') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"/>
  </ContentWrap>

  <!-- 设备详情对话框 -->
  <DeviceDetail ref="detailRef" />

  <!-- 能力配置对话框 -->
  <DeviceCapabilityForm ref="capabilityFormRef" @success="getList" />

  <!-- 执行任务对话框 -->
  <ExecuteTaskForm ref="executeTaskFormRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as DeviceApi from '@/api/mdm/lighting/device'
import { useMdmEnumStore } from '@/store/modules/enums'
import { hasPermission } from '@/directives/permission/hasPermi'
import DeviceDetail from './components/DeviceDetail.vue'
import DeviceCapabilityForm from './components/DeviceCapabilityForm.vue'
import ExecuteTaskForm from './components/ExecuteTaskForm.vue'

defineOptions({ name: 'LightingDevicePage' })

const message = useMessage()
const { t } = useI18n()
const mdmEnumStore = useMdmEnumStore()

const loading = ref(true)
const syncLoading = ref(false)
const total = ref(0)
const list = ref<DeviceApi.LightingDevicePageVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceName: undefined,
  deviceType: undefined,
  onlineStatus: undefined,
  enabled: undefined
})
const queryFormRef = ref()

/** 查询设备列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceApi.getDevicePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 同步设备 */
const handleSyncDevices = async () => {
  try {
    await message.confirm(
      t('mdm.lighting.device.syncConfirm'), 
      t('mdm.lighting.device.syncTitle')
    )
    syncLoading.value = true
    const result = await DeviceApi.syncDevices()
    message.success(
      t('mdm.lighting.device.syncSuccess', { 
        created: result.createdCount || 0, 
        updated: result.updatedCount || 0 
      })
    )
    await getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('同步设备失败:', error)
    }
  } finally {
    syncLoading.value = false
  }
}

/** 切换设备状态 */
const handleToggleStatus = async (row: DeviceApi.LightingDevicePageVo) => {
  try {
    const action = row.enabled 
      ? t('mdm.lighting.device.enabled') 
      : t('mdm.lighting.device.disabled')
    const title = row.enabled 
      ? t('mdm.lighting.device.enableTitle') 
      : t('mdm.lighting.device.disableTitle')
    const confirmMsg = row.enabled 
      ? t('mdm.lighting.device.enableConfirm') 
      : t('mdm.lighting.device.disableConfirm')
    
    await message.confirm(confirmMsg, title)
    
    await DeviceApi.updateDeviceStatus({
      id: row.id,
      enabled: row.enabled,
      version: row.version
    })
    
    message.success(
      row.enabled 
        ? t('mdm.lighting.device.enableSuccess') 
        : t('mdm.lighting.device.disableSuccess')
    )
    await getList()
  } catch (error) {
    if (error !== 'cancel') {
      // 恢复原状态
      row.enabled = !row.enabled
      console.error('更新设备状态失败', error)
    } else {
      // 用户取消，恢复原状态
      row.enabled = !row.enabled
    }
  }
}

/** 打开详情对话框 */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** 打开能力配置对话框 */
const capabilityFormRef = ref()
const openCapabilityForm = (row: DeviceApi.LightingDevicePageVo) => {
  capabilityFormRef.value.open(row)
}

/** 打开执行任务对话框 */
const executeTaskFormRef = ref()
const openExecuteTaskForm = () => {
  // 创建一个空的设备对象，让用户在表单中手动填写
  const emptyDevice: DeviceApi.LightingDevicePageVo = {
    id: 0,
    iotDeviceId: '',
    deviceName: '手动执行任务',
    deviceType: '',
    platformType: '',
    onlineStatus: '',
    enabled: true,
    supportedActions: [],
    version: 0
  }
  executeTaskFormRef.value.open(emptyDevice)
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

/** 初始化 */
onMounted(async () => {
  // 加载枚举数据
  await Promise.all([
    mdmEnumStore.loadDeviceType(),
    mdmEnumStore.loadOnlineStatus(),
    mdmEnumStore.loadPlatformType(),
    mdmEnumStore.loadActionType(),
    mdmEnumStore.loadEnableFlag()
  ])
  
  // 加载设备列表
  await getList()
})
</script>

<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097BA;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #D54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #A5D867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}
</style>
