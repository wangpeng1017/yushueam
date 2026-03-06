import { defineStore } from 'pinia'
import { store } from '../../index'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

// 导入库存相关 API
import * as InventoryApi from '@/api/inventory'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 库存模块枚举状态接口
 */
export interface InventoryEnumState {
  // 库存状态枚举
  inventoryStatus: EnumEntity[]
  
  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * 库存模块枚举 Store
 * 管理库存相关的所有枚举数据
 */
export const useInventoryEnumStore = defineStore('inventoryEnum', {
  state: (): InventoryEnumState => ({
    inventoryStatus: [],
    loadedEnums: new Set<string>()
  }),
  
  getters: {
    /**
     * 获取库存状态列表
     */
    getInventoryStatusList(): EnumEntity[] {
      return this.inventoryStatus
    },
    
    /**
     * 根据值获取库存状态文本
     */
    getInventoryStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.inventoryStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取库存状态标签类型
     */
    getInventoryStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          'NORMAL': 'success',
          'FROZEN': 'danger',
          'QC': 'warning'
        }
        return typeMap[value] || 'info'
      }
    }
  },
  
  actions: {
    /**
     * 加载库存状态枚举
     */
    async loadInventoryStatus() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('inventoryStatus')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_inventory_status'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.inventoryStatus = cached
        this.loadedEnums.add('inventoryStatus')
        return
      }
      
      try {
        const data = await InventoryApi.listOfInventoryStatus()
        this.inventoryStatus = data || []
        this.loadedEnums.add('inventoryStatus')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载库存状态枚举失败:', error)
      }
    },
    
    /**
     * 重置库存模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_inventory_status')
      this.inventoryStatus = []
      this.loadedEnums.clear()
    }
  }
})

export const useInventoryEnumStoreWithOut = () => {
  return useInventoryEnumStore(store)
}
