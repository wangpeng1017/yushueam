/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface MaterialState {
 id: number
 materialCode: string
 materialName: string
 materialIds: string
 specification: string
 materialCategory: string
 baseUnit: string
 lengthMm: number
 widthMm: number
 heightMm: number
 volumeM3: number
 netWeightKg: number
 grossWeightKg: number
 storageCondition: string
 batchManagementEnabled: boolean
 barcodeRuleId: string
 minStock: number
 maxStock: number
 purchaseUnit: string
 purchaseSpec: number
 manufacturer: string
 supplierIds: string
 materialStatus: string
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const materialStore = defineStore('materialStore', {
  state: (): MaterialState => {
    return {
      id: 0,
      materialCode: '',
      materialName: '',
      materialIds: '',
      specification: '',
      materialCategory: '',
      baseUnit: '',
      lengthMm: 0,
      widthMm: 0,
      heightMm: 0,
      volumeM3: 0,
      netWeightKg: 0,
      grossWeightKg: 0,
      storageCondition: '',
      batchManagementEnabled: false,
      barcodeRuleId: '',
      minStock: 0,
      maxStock: 0,
      purchaseUnit: '',
      purchaseSpec: 0,
      manufacturer: '',
      supplierIds: '',
      materialStatus: '',
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

export const materialStoreWithOut = () => {
  return materialStore(store)
}


