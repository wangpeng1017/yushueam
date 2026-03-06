/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-02 15:28:38
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface CountOrderItemState {
 id: number
 countOrderId: number
 countOrder: string
 warehouseId: number
 warehouseAreaId: number
 warehousePlaceId: number
 supplierId: number
 materialId: number
 materialCode: string
 materialName: string
 materialProducedDate: Date
 materialStatus: string
 materialBatch: string
 qty: number
 usableQty: number
 blockedQty: number
 transitQty: number
 occupyQty: number
 indateStatus: boolean
 indateExpireTime: Date
 countQty: number
 countStatus: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const countOrderItemStore = defineStore('countOrderItemStore', {
  state: (): CountOrderItemState => {
    return {
      id: undefined,
      countOrderId: undefined,
      countOrder: '',
      warehouseId: undefined,
      warehouseAreaId: undefined,
      warehousePlaceId: undefined,
      supplierId: undefined,
      materialId: undefined,
      materialCode: '',
      materialName: '',
      materialProducedDate: undefined,
      materialStatus: '',
      materialBatch: '',
      qty: undefined,
      usableQty: undefined,
      blockedQty: undefined,
      transitQty: undefined,
      occupyQty: undefined,
      indateStatus: undefined,
      indateExpireTime: undefined,
      countQty: undefined,
      countStatus: '',
      tenantId: '',
      createTime: undefined,
      creator: '',
      updateTime: undefined,
      updater: '',
      deleted: undefined,
    }
  },
  getters: {},
  actions: {}
})

export const countOrderItemStoreWithOut = () => {
  return countOrderItemStore(store)
}


