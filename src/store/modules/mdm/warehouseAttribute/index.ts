/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface WarehouseAttributeState {
 id: number
 warehouseId: string
 attributeName: string
 storageEnvironment: string
 storageUnitPreference: string
 materialType: string
 inventoryTurnoverFeature: string
 cleanlinessLevel: string
 securityLevel: string
 operationMode: string
 operationTime: string
 maxStorageCapacity: number
 inventoryCyclePeriod: string
 fireSafetyLevel: string
 deptId: number
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const warehouseAttributeStore = defineStore('warehouseAttributeStore', {
  state: (): WarehouseAttributeState => {
    return {
      id: 0,
      warehouseId: '',
      attributeName: '',
      storageEnvironment: '',
      storageUnitPreference: '',
      materialType: '',
      inventoryTurnoverFeature: '',
      cleanlinessLevel: '',
      securityLevel: '',
      operationMode: '',
      operationTime: '',
      maxStorageCapacity: 0,
      inventoryCyclePeriod: '',
      fireSafetyLevel: '',
      deptId: 0,
      description: '',
      tenantId: '',
      createTime: new Date(),
      creator: '',
      updateTime: new Date(),
      updater: '',
      deleted: false,
    }
  },
  getters: {},
  actions: {}
})

export const warehouseAttributeStoreWithOut = () => {
  return warehouseAttributeStore(store)
}


