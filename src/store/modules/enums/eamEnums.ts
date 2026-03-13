import { defineStore } from 'pinia'
import { store } from '@/store'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

import * as SupplierApi from '@/api/eam/supplier'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * EAM 模块枚举状态接口
 */
export interface EamEnumState {
  // 供应商类别枚举
  supplierCategory: EnumEntity[]

  // 供应设备类别枚举
  supplierGoods: EnumEntity[]

  // 供应商状态枚举
  supplierStatus: EnumEntity[]

  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * EAM 模块枚举 Store
 * 管理 EAM 相关的所有枚举数据
 */
export const useEamEnumStore = defineStore('eamEnum', {
  state: (): EamEnumState => ({
    supplierCategory: [],
    supplierGoods: [],
    supplierStatus: [],
    loadedEnums: new Set<string>()
  }),

  getters: {
    /**
     * 获取供应商类别列表
     */
    getSupplierCategoryList(): EnumEntity[] {
      return this.supplierCategory
    },

    /**
     * 根据值获取供应商类别文本
     */
    getSupplierCategoryText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierCategory.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取供应设备类别列表
     */
    getSupplierGoodsList(): EnumEntity[] {
      return this.supplierGoods
    },

    /**
     * 根据值获取供应设备类别文本
     */
    getSupplierGoodsText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierGoods.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取供应商状态列表
     */
    getSupplierStatusList(): EnumEntity[] {
      return this.supplierStatus
    },

    /**
     * 根据值获取供应商状态文本
     */
    getSupplierStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取供应商状态标签类型
     */
    getSupplierStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'success',
          '0': 'danger'
        }
        return typeMap[value] || 'info'
      }
    }
  },

  actions: {
    /**
     * 加载供应商类别枚举
     */
    async loadSupplierCategory() {
      if (this.loadedEnums.has('supplierCategory')) {
        return
      }

      const cacheKey = 'enum_eam_supplierCategory'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierCategory = cached
        this.loadedEnums.add('supplierCategory')
        return
      }

      try {
        const data = await SupplierApi.listOfCategory()
        this.supplierCategory = data || []
        this.loadedEnums.add('supplierCategory')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应商类别枚举失败:', error)
      }
    },

    /**
     * 加载供应设备类别枚举
     */
    async loadSupplierGoods() {
      if (this.loadedEnums.has('supplierGoods')) {
        return
      }

      const cacheKey = 'enum_eam_supplierGoods'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierGoods = cached
        this.loadedEnums.add('supplierGoods')
        return
      }

      try {
        const data = await SupplierApi.listOfGoods()
        this.supplierGoods = data || []
        this.loadedEnums.add('supplierGoods')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应设备类别枚举失败:', error)
      }
    },

    /**
     * 加载供应商状态枚举
     */
    async loadSupplierStatus() {
      if (this.loadedEnums.has('supplierStatus')) {
        return
      }

      const cacheKey = 'enum_eam_supplierStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierStatus = cached
        this.loadedEnums.add('supplierStatus')
        return
      }

      try {
        const data = await SupplierApi.listOfStatus()
        this.supplierStatus = data || []
        this.loadedEnums.add('supplierStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应商状态枚举失败:', error)
      }
    },

    /**
     * 批量加载供应商相关枚举
     */
    async loadSupplierEnums() {
      await Promise.all([
        this.loadSupplierCategory(),
        this.loadSupplierGoods(),
        this.loadSupplierStatus()
      ])
    },

    /**
     * 重置 EAM 模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_eam_supplierCategory')
      wsCache.delete('enum_eam_supplierGoods')
      wsCache.delete('enum_eam_supplierStatus')
      this.supplierCategory = []
      this.supplierGoods = []
      this.supplierStatus = []
      this.loadedEnums.clear()
    }
  }
})

export const useEamEnumStoreWithOut = () => {
  return useEamEnumStore(store)
}
