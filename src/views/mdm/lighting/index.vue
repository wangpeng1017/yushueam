<template>
  <div class="lighting-management">
    <!-- 左侧树形结构 -->
    <div class="left-panel">
      <div class="panel-header">
        <span>{{ t('mdm.lighting.structure.title') }}</span>
        <el-icon class="refresh-icon" @click="refreshTree">
          <Refresh />
        </el-icon>
      </div>
      <!-- 空状态提示 -->
      <div v-if="treeData.length === 0" style="padding: 20px; text-align: center; color: #999;">
        <el-icon style="font-size: 48px; margin-bottom: 12px;"><OfficeBuilding /></el-icon>
        <div>{{ t('mdm.lighting.common.noData') }}</div>
      </div>
      <el-tree
        v-else
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expand-all="true"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="tree-node">
            <el-icon v-if="data.type === 'warehouse'">
              <OfficeBuilding />
            </el-icon>
            <el-icon v-else-if="data.type === 'controller'">
              <Monitor />
            </el-icon>
            <span class="node-label">{{ node.label }}</span>
            <el-badge
              v-if="data.type === 'controller' && data.onlineStatus"
              :type="data.onlineStatus === 'ONLINE' ? 'success' : 'danger'"
              is-dot
              class="status-badge"
            />
          </span>
        </template>
      </el-tree>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-panel">
      <!-- 仓库视图：显示控制器卡片 -->
      <div v-if="currentView === 'warehouse'" class="warehouse-view">
        <div class="view-header">
          <div class="header-left">
            <el-icon class="warehouse-icon"><OfficeBuilding /></el-icon>
            <div class="header-titles">
              <span class="title">{{ selectedWarehouseName || t('mdm.lighting.warehouse') }}</span>
              <span class="subtitle">{{ t('mdm.lighting.controllerManagement.title') }}</span>
            </div>
          </div>
          <div class="header-right">
            <el-button 
              v-hasPermi="['mdm:lighting:lightbar:bind']"
              round 
              class="btn-bind-aisle" 
              @click="handleBatchBind">
              <el-icon class="link-icon"><Link /></el-icon>
              {{ t('mdm.lighting.controllerManagement.bindLightbar') }}
            </el-button>
          </div>
        </div>

        <div class="controller-cards">
          <el-card
            v-for="controller in controllerList"
            :key="controller.id"
            class="controller-card"
            shadow="hover"
          >
            <div class="card-header" @click="handleControllerClick(controller)">
              <div class="card-title">
                <el-icon class="card-icon"><Coin /></el-icon>
                <span>{{ controller.controllerName }}</span>
              </div>
              <el-tag 
                :type="controller.onlineStatus === 'ONLINE' ? 'info' : 'danger'" 
                effect="plain"
                class="status-tag"
                round
              >
                {{ controller.onlineStatus === 'ONLINE' ? t('mdm.lighting.controllerManagement.online') : t('mdm.lighting.controllerManagement.offline') }}
              </el-tag>
            </div>
            <div class="card-content" @click="handleControllerClick(controller)">
              <div class="info-row">
                <span class="label">{{ t('mdm.lighting.controllerManagement.controllerCode') }}:</span>
                <span class="value code-font">{{ controller.iotDeviceId }}</span>
              </div>
              <div class="info-row">
                <span class="label">{{ t('mdm.lighting.controllerManagement.relatedLightbars') }}:</span>
                <span class="value count-font">{{ controller.boundLightbarCount || 0 }} {{ t('mdm.lighting.controllerManagement.count') }}</span>
              </div>
            </div>
            
            <div class="card-hover-actions">
              <el-button 
                v-hasPermi="['mdm:lighting:controller:delete']"
                type="danger" 
                plain 
                round 
                size="small" 
                class="btn-remove" 
                @click.stop="handleCardAction('delete', controller)">
                <el-icon><Delete /></el-icon> {{ t('common.delete') }}
              </el-button>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 控制器视图：显示灯条列表 -->
      <div v-else-if="currentView === 'controller'" class="controller-view">
        <LightbarList
          v-if="selectedControllerId"
          :controller-id="selectedControllerId"
          :controller-name="selectedControllerName"
          :warehouse-id="selectedWarehouseId"
          :warehouse-name="selectedWarehouseName"
          @back="handleBack"
        />
      </div>
    </div>

    <!-- 控制器表单弹窗 -->
    <ControllerForm ref="controllerFormRef" @success="handleControllerFormSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { Refresh, OfficeBuilding, Monitor, Link, MoreFilled, Edit, Delete, Coin } from '@element-plus/icons-vue'
import * as ControllerApi from '@/api/mdm/lighting/controller'
import LightbarList from './components/LightbarList.vue'
import ControllerForm from './components/ControllerForm.vue'

defineOptions({ name: 'LightingManagement' })

const { t } = useI18n()

// 树形数据
const treeRef = ref()
const treeData = ref<ControllerApi.LightingTreeNodeVo[]>([])
const treeProps = {
  children: 'children',
  label: 'label',
  isLeaf: (data: any) => {
    // 控制器节点是叶子节点
    return data.type === 'controller'
  }
}

// 当前视图
const currentView = ref<'warehouse' | 'controller'>('warehouse')
const selectedWarehouseId = ref<number>()
const selectedWarehouseName = ref<string>('')
const selectedControllerId = ref<number>()
const selectedControllerName = ref<string>('')

// 控制器列表
const controllerList = ref<ControllerApi.AisleControllerVo[]>([])

// 控制器表单引用
const controllerFormRef = ref()

// 加载树形数据
const loadTreeData = async () => {
  try {
    const res = await ControllerApi.getLightingTree()
    // res 本身就是数据数组，不需要 res.data
    treeData.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('加载树形数据失败:', error)
    ElMessage.error('加载树形数据失败')
  }
}

// 加载控制器列表
const loadControllers = async (warehouseId?: number) => {
  try {
    const params: ControllerApi.AisleControllerPageDto = {
      pageNo: 1,
      pageSize: 100,
      warehouseId: warehouseId
    }
    const res = await ControllerApi.getAisleControllerPage(params)
    // 分页接口返回的是 PageResult 对象，包含 list 和 total
    controllerList.value = res.list || []
  } catch (error) {
    console.error('加载控制器列表失败:', error)
    ElMessage.error('加载控制器列表失败')
  }
}

// 刷新树
const refreshTree = () => {
  loadTreeData()
  if (selectedWarehouseId.value) {
    loadControllers(selectedWarehouseId.value)
  }
}

// 树节点点击
const handleNodeClick = (data: any) => {
  if (data.type === 'warehouse') {
    currentView.value = 'warehouse'
    selectedWarehouseId.value = data.warehouseId
    selectedWarehouseName.value = data.label
    loadControllers(selectedWarehouseId.value)
  } else if (data.type === 'controller') {
    currentView.value = 'controller'
    selectedControllerId.value = data.controllerId
    selectedControllerName.value = data.label
  }
}

// 控制器卡片点击
const handleControllerClick = (controller: ControllerApi.AisleControllerVo) => {
  currentView.value = 'controller'
  selectedControllerId.value = controller.id
  selectedControllerName.value = controller.controllerName
}

// 返回仓库视图
const handleBack = () => {
  currentView.value = 'warehouse'
}

// 添加控制器
const handleAddController = () => {
  if (!selectedWarehouseId.value) {
    ElMessage.warning(t('mdm.lighting.common.selectWarehouse'))
    return
  }
  controllerFormRef.value?.open('create', undefined, selectedWarehouseId.value, selectedWarehouseName.value)
}

// 批量绑定(实际是新增控制器)
const handleBatchBind = () => {
  if (!selectedWarehouseId.value) {
    ElMessage.warning(t('mdm.lighting.common.selectWarehouse'))
    return
  }
  controllerFormRef.value?.open('create', undefined, selectedWarehouseId.value, selectedWarehouseName.value)
}

// 控制器表单提交成功
const handleControllerFormSuccess = () => {
  // 刷新树形数据和控制器列表
  loadTreeData()
  if (selectedWarehouseId.value) {
    loadControllers(selectedWarehouseId.value)
  }
}

// 卡片操作
const handleCardAction = async (command: string, controller: ControllerApi.AisleControllerVo) => {
  if (command === 'edit') {
    // 编辑控制器
    controllerFormRef.value?.open('update', controller)
  } else if (command === 'delete') {
    // 删除控制器
    try {
      await ElMessageBox.confirm(
        t('mdm.lighting.controllerManagement.deleteConfirm', { name: controller.controllerName }),
        t('common.confirmTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
      
      await ControllerApi.removeAisleController(controller.id)
      ElMessage.success(t('common.delSuccess'))
      
      // 刷新树形数据和控制器列表
      loadTreeData()
      if (selectedWarehouseId.value) {
        loadControllers(selectedWarehouseId.value)
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
        ElMessage.error(error.message || t('common.delSuccess'))
      }
    }
  }
}

onMounted(() => {
  loadTreeData()
  // 默认加载第一个仓库的控制器（如果有的话）
  // selectedWarehouseId.value = 1
  // loadControllers(1)
})
</script>

<style lang="scss" scoped>
.lighting-management {
  display: flex;
  height: calc(100vh - 120px);
  background: #f5f7fa;
  
  .left-panel {
    width: 280px;
    background: white;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
    
    .panel-header {
      padding: 16px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      
      .refresh-icon {
        cursor: pointer;
        color: #909399;
        
        &:hover {
          color: #409eff;
        }
      }
    }
    
    :deep(.el-tree) {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      
      .tree-node {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        
        .node-label {
          flex: 1;
        }
        
        .status-badge {
          margin-left: auto;
        }
      }
    }
  }
  
  .right-panel {
    flex: 1;
    overflow-y: auto;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
    
    .warehouse-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      
      .view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 32px;
        background: #ffffff;
        border-bottom: 1px solid #e4e7ed;
        
        .header-left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          
          .warehouse-icon {
            font-size: 28px;
            color: #606266;
            margin-top: 2px;
          }

          .header-titles {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .title {
              font-size: 20px;
              font-weight: 600;
              color: #303133;
            }
            
            .subtitle {
              color: #909399;
              font-size: 14px;
            }
          }
        }
        
        .header-right {
          .btn-bind-aisle {
            border-color: #dcdfe6;
            color: #606266;
            font-size: 14px;
            padding: 8px 16px;
            
            .link-icon {
              margin-right: 4px;
              font-size: 16px;
            }

            &:hover {
              color: #409eff;
              border-color: #c6e2ff;
              background-color: #ecf5ff;
            }
          }
        }
      }
      
      .controller-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 20px;
        padding: 24px 32px;
        
        .controller-card {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-radius: 8px;
          border: 1px solid #ebeef5;
          position: relative;
          background: #ffffff;
          
          :deep(.el-card__body) {
            padding: 20px 24px;
          }
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
            
            .card-hover-actions {
              opacity: 1;
              pointer-events: auto;
            }
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            
            .card-title {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 18px;
              font-weight: 600;
              color: #303133;
              
              .card-icon {
                color: #409eff;
                font-size: 22px;
              }
            }
            
            .status-tag {
              border-color: #e4e7ed;
              color: #606266;
              background-color: #ffffff;
            }
          }
          
          .card-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              
              .label {
                color: #606266;
              }
              
              .value {
                color: #303133;
                font-weight: 500;
                
                &.code-font {
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                
                &.count-font {
                  font-size: 16px;
                }
              }
            }
          }
          
          .card-hover-actions {
            position: absolute;
            bottom: 20px;
            right: 24px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            
            .btn-remove {
              padding: 6px 16px;
            }
          }
        }
      }
    }
    
    .controller-view {
      flex: 1;
    }
  }
}
</style>
