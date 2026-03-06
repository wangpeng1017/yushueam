/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface MaterialBatchState {
 id: number
 materialId: string
 batchRule: string
 batchRuleId: number
 batchAttributeGroup: string
 productionDate: boolean
 expiryDate: boolean
 supplierBatchNo: boolean
 inboundDate: boolean
 inventoryStatus: boolean
 specification: boolean
 supplierId: boolean
 purchaseOrderNo: boolean
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const materialBatchStore = defineStore('materialBatchStore', {
  state: (): MaterialBatchState => {
    return {
      id: 0,
      materialId: '',
      batchRule: '',
      batchRuleId: 0,
      batchAttributeGroup: '',
      productionDate: false,
      expiryDate: false,
      supplierBatchNo: false,
      inboundDate: false,
      inventoryStatus: false,
      specification: false,
      supplierId: false,
      purchaseOrderNo: false,
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

export const materialBatchStoreWithOut = () => {
  return materialBatchStore(store)
}


