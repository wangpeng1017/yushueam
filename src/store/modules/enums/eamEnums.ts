import { defineStore } from 'pinia'
import { store } from '@/store'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

import * as SupplierApi from '@/api/eam/supplier'
import * as EquipmentApi from '@/api/eam/optEquipment'
import * as SpotInspectionStandardApi from '@/api/eam/spotInspectionStandard'

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

  // 设备型号枚举
  equipmentMode: EnumEntity[]

  // 资产状态枚举
  equipmentStatus: EnumEntity[]

  // 运行状态枚举
  operationStatus: EnumEntity[]

  // 启停用状态枚举
  equipmentRevstop: EnumEntity[]

  // 点巡检标准-参数单位枚举
  paramsUnit: EnumEntity[]

  // 点巡检标准-是否枚举
  yesNo: EnumEntity[]

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
    equipmentMode: [],
    equipmentStatus: [],
    operationStatus: [],
    equipmentRevstop: [],
    paramsUnit: [],
    yesNo: [],
    loadedEnums: new Set<string>()
  }),

  getters: {
    // ==================== 供应商相关 getters ====================

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
    },

    // ==================== 设备档案相关 getters ====================

    /**
     * 获取设备型号列表
     */
    getEquipmentModeList(): EnumEntity[] {
      return this.equipmentMode
    },

    /**
     * 根据值获取设备型号文本
     */
    getEquipmentModeText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentMode.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取资产状态列表
     */
    getEquipmentStatusList(): EnumEntity[] {
      return this.equipmentStatus
    },

    /**
     * 根据值获取资产状态文本
     */
    getEquipmentStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取运行状态列表
     */
    getOperationStatusList(): EnumEntity[] {
      return this.operationStatus
    },

    /**
     * 根据值获取运行状态文本
     */
    getOperationStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.operationStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取启停用状态列表
     */
    getEquipmentRevstopList(): EnumEntity[] {
      return this.equipmentRevstop
    },

    /**
     * 根据值获取启停用状态文本
     */
    getEquipmentRevstopText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentRevstop.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 点巡检标准相关 getters ====================

    /**
     * 获取参数单位列表
     */
    getParamsUnitList(): EnumEntity[] {
      return this.paramsUnit
    },

    /**
     * 根据值获取参数单位文本
     */
    getParamsUnitText(): (value: string) => string {
      return (value: string) => {
        const item = this.paramsUnit.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取是否枚举列表
     */
    getYesNoList(): EnumEntity[] {
      return this.yesNo
    },

    /**
     * 根据值获取是否枚举文本
     */
    getYesNoText(): (value: string) => string {
      return (value: string) => {
        const item = this.yesNo.find((e) => e.value === value)
        return item?.text || value
      }
    }
  },

  actions: {
    // ==================== 供应商相关 actions ====================

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

    // ==================== 设备档案相关 actions ====================

    /**
     * 加载设备型号枚举
     */
    async loadEquipmentMode() {
      if (this.loadedEnums.has('equipmentMode')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentMode'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentMode = cached
        this.loadedEnums.add('equipmentMode')
        return
      }

      try {
        const data = await EquipmentApi.listOfMode()
        this.equipmentMode = data || []
        this.loadedEnums.add('equipmentMode')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载设备型号枚举失败:', error)
      }
    },

    /**
     * 加载资产状态枚举
     */
    async loadEquipmentStatus() {
      if (this.loadedEnums.has('equipmentStatus')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentStatus = cached
        this.loadedEnums.add('equipmentStatus')
        return
      }

      try {
        const data = await EquipmentApi.listOfStatus()
        this.equipmentStatus = data || []
        this.loadedEnums.add('equipmentStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载资产状态枚举失败:', error)
      }
    },

    /**
     * 加载运行状态枚举
     */
    async loadOperationStatus() {
      if (this.loadedEnums.has('operationStatus')) {
        return
      }

      const cacheKey = 'enum_eam_operationStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.operationStatus = cached
        this.loadedEnums.add('operationStatus')
        return
      }

      try {
        const data = await EquipmentApi.listOfOperationStatus()
        this.operationStatus = data || []
        this.loadedEnums.add('operationStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载运行状态枚举失败:', error)
      }
    },

    /**
     * 加载启停用状态枚举
     */
    async loadEquipmentRevstop() {
      if (this.loadedEnums.has('equipmentRevstop')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentRevstop'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentRevstop = cached
        this.loadedEnums.add('equipmentRevstop')
        return
      }

      try {
        const data = await EquipmentApi.listOfRevstop()
        this.equipmentRevstop = data || []
        this.loadedEnums.add('equipmentRevstop')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载启停用状态枚举失败:', error)
      }
    },

    /**
     * 批量加载设备档案相关枚举
     */
    async loadEquipmentEnums() {
      await Promise.all([
        this.loadEquipmentMode(),
        this.loadEquipmentStatus(),
        this.loadOperationStatus(),
        this.loadEquipmentRevstop()
      ])
    },

    // ==================== 点巡检标准相关 actions ====================

    /**
     * 加载参数单位枚举
     */
    async loadParamsUnit() {
      if (this.loadedEnums.has('paramsUnit')) {
        return
      }

      const cacheKey = 'enum_eam_paramsUnit'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.paramsUnit = cached
        this.loadedEnums.add('paramsUnit')
        return
      }

      try {
        const data = await SpotInspectionStandardApi.listOfParamsUnit()
        this.paramsUnit = data || []
        this.loadedEnums.add('paramsUnit')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载参数单位枚举失败:', error)
      }
    },

    /**
     * 加载是否枚举
     */
    async loadYesNo() {
      if (this.loadedEnums.has('yesNo')) {
        return
      }

      const cacheKey = 'enum_eam_yesNo'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.yesNo = cached
        this.loadedEnums.add('yesNo')
        return
      }

      try {
        const data = await SpotInspectionStandardApi.listOfYesNo()
        this.yesNo = data || []
        this.loadedEnums.add('yesNo')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载是否枚举失败:', error)
      }
    },

    /**
     * 批量加载点巡检标准相关枚举
     */
    async loadSpotInspectionEnums() {
      await Promise.all([this.loadParamsUnit(), this.loadYesNo()])
    },

    /**
     * 重置 EAM 模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_eam_supplierCategory')
      wsCache.delete('enum_eam_supplierGoods')
      wsCache.delete('enum_eam_supplierStatus')
      wsCache.delete('enum_eam_equipmentMode')
      wsCache.delete('enum_eam_equipmentStatus')
      wsCache.delete('enum_eam_operationStatus')
      wsCache.delete('enum_eam_equipmentRevstop')
      wsCache.delete('enum_eam_paramsUnit')
      wsCache.delete('enum_eam_yesNo')
      this.supplierCategory = []
      this.supplierGoods = []
      this.supplierStatus = []
      this.equipmentMode = []
      this.equipmentStatus = []
      this.operationStatus = []
      this.equipmentRevstop = []
      this.paramsUnit = []
      this.yesNo = []
      this.loadedEnums.clear()
    }
  }
})

export const useEamEnumStoreWithOut = () => {
  return useEamEnumStore(store)
}
