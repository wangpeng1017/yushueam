<template>
  <div class="lightbar-list">
    <!-- 头部 -->
    <div class="list-header">
      <div class="header-left">
        <div class="breadcrumb">
          <span class="cursor-pointer hover:text-blue-500 mr-1" @click="handleBack">{{ warehouseName }}</span>
          <el-icon class="mx-1"><ArrowRight /></el-icon>
          <span>{{ controllerName }}</span>
        </div>
        <div class="controller-title-wrap">
          <el-icon class="controller-icon"><Monitor /></el-icon>
          <span class="controller-title">{{ controllerName }}</span>
          <!-- 由于没有传入状态，固定显示在线或根据信息显示 -->
          <el-tag type="info" effect="plain" class="status-tag" round>
            {{ t('mdm.lighting.controllerManagement.online') }}
          </el-tag>
        </div>
      </div>
      <div class="header-right">
        <el-button 
          v-hasPermi="['mdm:lighting:lightbar:bind']"
          type="primary" 
          @click="handleBindLightbar">
          <el-icon><Plus /></el-icon>
          {{ t('mdm.lighting.lightbarList.bindNewLightbar') }}
        </el-button>
      </div>
    </div>

    <!-- 灯条列表 -->
    <el-table :data="lightbarList" style="width: 100%" v-loading="loading">
      <el-table-column :label="t('mdm.lighting.lightbarList.lightbarName')" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="lightbar-name">
            <el-icon :color="row.onlineStatus === 'ONLINE' ? '#e6a23c' : '#c0c4cc'" class="bulb-icon">
              <!-- 使用 Opportunity 代表灯泡 -->
              <Opportunity />
            </el-icon>
            <span>{{ row.deviceName || t('mdm.lighting.common.noData') }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="lightbarDeviceId" :label="t('mdm.lighting.lightbarList.deviceId')" min-width="150" show-overflow-tooltip />
      
      <el-table-column :label="t('mdm.lighting.lightbarList.connectionStatus')" width="120">
        <template #default="{ row }">
          <div class="connection-status" :class="row.onlineStatus === 'ONLINE' ? 'is-online' : 'is-offline'">
            <el-icon><Connection /></el-icon>
            <span>{{ mdmEnumStore.getOnlineStatusText(row.onlineStatus) }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('mdm.lighting.lightbarList.enableStatus')" width="120">
        <template #default="{ row }">
          <div class="enable-status">
            <div class="status-dot" :class="row.enableFlag === 1 ? 'dot-success' : 'dot-info'"></div>
            <span>{{ mdmEnumStore.getEnableFlagText(String(row.enableFlag)) }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('mdm.lighting.lightbarList.boundLocation')" min-width="200">
        <template #default="{ row }">
          <div v-if="row.boundLocationCount > 0" class="location-info">
            <div class="location-main">
              <el-icon><Location /></el-icon>
              <span>{{ getLocationText(row) }}</span>
            </div>
            <div class="location-sub" v-if="row.boundLocations && row.boundLocations[0]">
              {{ row.boundLocations[0].locationCode || `WH-SH-STO-${row.boundLocations[0].locationId}` }}
            </div>
          </div>
          <el-button 
            v-else 
            v-hasPermi="['mdm:lighting:location:bind']"
            round 
            size="small" 
            class="btn-bind-location" 
            @click="handleBindLocation(row)">
            <el-icon><Link /></el-icon>
            {{ t('mdm.lighting.lightbarList.bindLocation') }}
          </el-button>
        </template>
      </el-table-column>
      
      <el-table-column :label="t('common.operation')" width="80" fixed="right" align="center">
        <template #default="{ row }">
          <el-dropdown 
            v-hasPermi="['mdm:lighting:lightbar:unbind', 'mdm:lighting:lightbar:disable', 'mdm:lighting:lightbar:remove']"
            @command="(cmd) => handleCommand(cmd, row)" 
            trigger="click">
            <el-button link>
              <el-icon class="more-icon"><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown-menu">
                <el-dropdown-item 
                  v-hasPermi="['mdm:lighting:lightbar:unbind']"
                  command="unbind" 
                  class="item-unbind">
                  <el-icon><RefreshLeft /></el-icon>
                  {{ t('mdm.lighting.lightbarList.unbindLightbar') }}
                </el-dropdown-item>
                <el-dropdown-item 
                  v-hasPermi="['mdm:lighting:lightbar:disable']"
                  command="disable" 
                  :class="row.enableFlag === 1 ? 'item-disable' : 'item-enable'">
                  <el-icon v-if="row.enableFlag === 1"><Hide /></el-icon>
                  <el-icon v-else><View /></el-icon>
                  {{ row.enableFlag === 1 ? mdmEnumStore.getEnableFlagText('0') : mdmEnumStore.getEnableFlagText('1') }}
                </el-dropdown-item>
                <el-dropdown-item 
                  v-hasPermi="['mdm:lighting:lightbar:remove']"
                  command="remove" 
                  class="item-remove">
                  <el-icon><Delete /></el-icon>
                  {{ t('common.delete') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 绑定库位弹窗 -->
    <BindLocationDialog
      v-model="bindLocationVisible"
      :lightbar-device-id="selectedLightbarId"
      :lightbar-name="selectedLightbarName"
      :warehouse-id="warehouseId"
      :warehouse-name="warehouseName"
      @success="handleBindSuccess"
    />

    <!-- 绑定新灯条弹窗 -->
    <BindLightbarDialog
      v-model="bindLightbarVisible"
      :controller-id="controllerId"
      @success="loadLightbarList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ArrowRight,
  Monitor,
  Plus,
  Location,
  Link,
  MoreFilled,
  Opportunity,
  Connection,
  RefreshLeft,
  Hide,
  View,
  Delete
} from '@element-plus/icons-vue'
import * as LightbarApi from '@/api/mdm/lighting/lightbar'
import BindLocationDialog from './BindLocationDialog.vue'
import BindLightbarDialog from './BindLightbarDialog.vue'
import { useMdmEnumStore } from '@/store/modules/enums'

const { t } = useI18n()
const mdmEnumStore = useMdmEnumStore()

interface Props {
  controllerId: number
  controllerName: string
  warehouseId: number
  warehouseName: string
}

const props = defineProps<Props>()
const emit = defineEmits(['back'])

const loading = ref(false)
const lightbarList = ref<LightbarApi.LightBarBindingVo[]>([])

// 绑定库位弹窗
const bindLocationVisible = ref(false)
const selectedLightbarId = ref('')
const selectedLightbarName = ref('')

// 绑定灯条弹窗
const bindLightbarVisible = ref(false)

// 加载灯条列表
const loadLightbarList = async () => {
  loading.value = true
  try {
    const res = await LightbarApi.listLightBarByController(props.controllerId)
    lightbarList.value = res || []
  } catch (error) {
    console.error('加载灯条列表失败:', error)
    ElMessage.error(t('mdm.lighting.common.loading'))
  } finally {
    loading.value = false
  }
}

// 初始化时加载枚举数据
const loadEnums = async () => {
  await Promise.all([
    mdmEnumStore.loadOnlineStatus(),
    mdmEnumStore.loadEnableFlag()
  ])
}

// 监听 controllerId 变化，重新加载数据
watch(() => props.controllerId, (newId) => {
  if (newId) {
    loadLightbarList()
  }
}, { immediate: false })

// 获取库位显示文本
const getLocationText = (row: LightbarApi.LightBarBindingVo) => {
  if (!row.boundLocations || row.boundLocations.length === 0) {
    return ''
  }
  
  const firstLocation = row.boundLocations[0]
  const locationCode = firstLocation.locationCode || `库位-${firstLocation.locationId}`
  
  if (row.boundLocationCount && row.boundLocationCount > 1) {
    return `${locationCode} 等${row.boundLocationCount}个库位`
  }
  return locationCode
}

// 返回
const handleBack = () => {
  emit('back')
}

// 绑定库位
const handleBindLocation = (row: LightbarApi.LightBarBindingVo) => {
  selectedLightbarId.value = row.lightbarDeviceId
  selectedLightbarName.value = row.deviceName || row.lightbarDeviceId
  bindLocationVisible.value = true
}

// 绑定成功
const handleBindSuccess = () => {
  loadLightbarList()
}

// 绑定新灯条
const handleBindLightbar = () => {
  bindLightbarVisible.value = true
}

// 操作命令
const handleCommand = async (command: string, row: LightbarApi.LightBarBindingVo) => {
  if (command === 'unbind') {
    try {
      await ElMessageBox.confirm(
        t('mdm.lighting.lightbarList.unbindConfirm'),
        t('common.confirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      
      await LightbarApi.unbindLightBar({
        controllerId: props.controllerId,
        lightbarDeviceId: row.lightbarDeviceId
      })
      
      ElMessage.success(t('mdm.lighting.lightbarList.unbindSuccess'))
      loadLightbarList()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('解绑失败:', error)
        ElMessage.error(error.message || t('mdm.lighting.lightbarList.unbindFailed'))
      }
    }
  } else if (command === 'disable') {
    try {
      const targetStatus = row.enableFlag === 1 ? '0' : '1'
      const action = mdmEnumStore.getEnableFlagText(targetStatus)
      await ElMessageBox.confirm(
        `${t('common.confirmText')}${action}?`,
        t('common.confirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      
      await LightbarApi.disableLightBar({
        controllerId: props.controllerId,
        lightbarDeviceId: row.lightbarDeviceId,
        enableFlag: row.enableFlag === 1 ? 0 : 1
      })
      
      ElMessage.success(t('common.updateSuccess'))
      loadLightbarList()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('操作失败:', error)
        ElMessage.error(error.message || t('common.saveFailed'))
      }
    }
  } else if (command === 'remove') {
    try {
      await ElMessageBox.confirm(
        t('mdm.lighting.lightbarList.unbindConfirm'),
        t('common.confirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      
      await LightbarApi.removeLightBar({
        controllerId: props.controllerId,
        lightbarDeviceId: row.lightbarDeviceId
      })
      
      ElMessage.success(t('common.delSuccess'))
      loadLightbarList()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('移除失败:', error)
        ElMessage.error(error.message || t('common.saveFailed'))
      }
    }
  }
}

onMounted(async () => {
  // 先加载枚举数据
  await loadEnums()
  // 再加载灯条列表
  loadLightbarList()
})
</script>

<style lang="scss" scoped>
.lightbar-list {
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  height: 100%;
  box-sizing: border-box;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .breadcrumb {
        color: #909399;
        font-size: 14px;
        display: flex;
        align-items: center;
      }

      .controller-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .controller-icon {
          font-size: 24px;
          color: #606266;
        }
        
        .controller-title {
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }

        .status-tag {
          border-color: #dcdfe6;
          color: #606266;
          background-color: #f4f4f5;
        }
      }
    }
  }
  
  .lightbar-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #303133;

    .bulb-icon {
      font-size: 16px;
    }
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;

    &.is-online {
      color: #67c23a;
    }
    
    &.is-offline {
      color: #909399;
    }
  }

  .enable-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #606266;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &.dot-success {
        background-color: #67c23a;
      }
      
      &.dot-info {
        background-color: #c0c4cc;
      }
    }
  }

  
  .location-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .location-main {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #409eff;
      font-size: 14px;
    }

    .location-sub {
      color: #909399;
      font-size: 12px;
      padding-left: 18px;
    }
  }

  .btn-bind-location {
    color: #909399;
    border-color: #e4e7ed;
    background: transparent;
    
    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background: #ecf5ff;
    }
  }

  .more-icon {
    font-size: 18px;
    color: #606266;
  }
}

/* 弹出菜单样式 */
.custom-dropdown-menu {
  .el-dropdown-menu__item {
    font-size: 13px;
    gap: 8px;
    display: flex;
    align-items: center;
  }
  
  .item-unbind {
    color: #e6a23c;
    
    .el-icon {
      color: #e6a23c;
    }
  }
  
  .item-disable {
    color: #909399;
    
    .el-icon {
      color: #909399;
    }
  }
  
  .item-enable {
    color: #67c23a;
    
    .el-icon {
      color: #67c23a;
    }
  }
  
  .item-remove {
    color: #f56c6c;
    
    .el-icon {
      color: #f56c6c;
    }
  }
}
</style>
