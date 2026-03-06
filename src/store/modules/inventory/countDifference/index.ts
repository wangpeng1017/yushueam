/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-04 22:43:08
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface CountDifferenceState {
 id: number
 countOrderId: number
 countOrder: string
 differenceOrder: string
 differenceTime: Date
 differenceStatus: string
 warehouseId: number
 warehouseAreaId: number
 warehousePlaceId: number
 materialId: number
 materialCode: string
 materialName: string
 materialBatch: string
 usableQty: number
 countQty: number
 differenceQty: number
 differenceAmount: number
 differenceReason: string
 handleUserId: number
 handleUserName: string
 handleTime: Date
 approvalComment: string
 approvalUserId: number
 approvalUserName: string
 approvalTime: Date
 postingQty: number
 postingUserId: number
 postingUserName: string
 postingTime: Date
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const countDifferenceStore = defineStore('countDifferenceStore', {
  state: (): CountDifferenceState => {
    return {
      id: undefined,
      countOrderId: undefined,
      countOrder: '',
      differenceOrder: '',
      differenceTime: undefined,
      differenceStatus: '',
      warehouseId: undefined,
      warehouseAreaId: undefined,
      warehousePlaceId: undefined,
      materialId: undefined,
      materialCode: '',
      materialName: '',
      materialBatch: '',
      usableQty: undefined,
      countQty: undefined,
      differenceQty: undefined,
      differenceAmount: undefined,
      differenceReason: '',
      handleUserId: undefined,
      handleUserName: '',
      handleTime: undefined,
      approvalComment: '',
      approvalUserId: undefined,
      approvalUserName: '',
      approvalTime: undefined,
      postingQty: undefined,
      postingUserId: undefined,
      postingUserName: '',
      postingTime: undefined,
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

export const countDifferenceStoreWithOut = () => {
  return countDifferenceStore(store)
}


