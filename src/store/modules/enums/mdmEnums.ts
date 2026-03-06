import { defineStore } from 'pinia'
import { store } from '@/store'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

// 导入主数据相关 API
import * as MaterialPackageUnitApi from '@/api/mdm/materialPackageUnit'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 主数据模块枚举状态接口
 */
export interface MdmEnumState {
  // 物料包装单位枚举
  packageUnitType: EnumEntity[]
  
  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * 主数据模块枚举 Store
 * 管理主数据相关的所有枚举数据
 */
export const useMdmEnumStore = defineStore('mdmEnum', {
  state: (): MdmEnumState => ({
    packageUnitType: [],
    loadedEnums: new Set<string>()
  }),
  
  getters: {
    /**
     * 获取包装单位类型列表
     */
    getPackageUnitTypeList(): EnumEntity[] {
      return this.packageUnitType
    },
    
    /**
     * 根据值获取包装单位文本
     */
    getPackageUnitText(): (value: string) => string {
      return (value: string) => {
        if (!value) return 'EA'
        const item = this.packageUnitType.find(e => e.value === value)
        return item?.text || value
      }
    }
  },
  
  actions: {
    /**
     * 加载包装单位枚举
     */
    async loadPackageUnitType() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('packageUnitType')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_mdm_packageUnitType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.packageUnitType = cached
        this.loadedEnums.add('packageUnitType')
        return
      }
      
      try {
        const data = await MaterialPackageUnitApi.listOfPackageUnitType()
        this.packageUnitType = data || []
        this.loadedEnums.add('packageUnitType')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载包装单位枚举失败:', error)
      }
    },
    
    /**
     * 重置主数据模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_mdm_packageUnitType')
      this.packageUnitType = []
      this.loadedEnums.clear()
    }
  }
})

export const useMdmEnumStoreWithOut = () => {
  return useMdmEnumStore(store)
}
