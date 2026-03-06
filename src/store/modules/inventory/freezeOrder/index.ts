/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-08 17:48:03
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface InventoryFreezeOrderState {
 id: number
 freezeOrderNo: string
 freezeObjectType: string
 freezeObject: string
 freezeReason: string
 unfreezeCondition: string
 relatedOrderId: number
 relatedOrderNo: string
 status: string
 remark: string
 operateUser: number
 operateUserName: string
 operateTime: Date
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const inventoryFreezeOrderStore = defineStore('inventoryFreezeOrderStore', {
  state: (): InventoryFreezeOrderState => {
    return {
      id: undefined,
      freezeOrderNo: '',
      freezeObjectType: '',
      freezeObject: '',
      freezeReason: '',
      unfreezeCondition: '',
      relatedOrderId: undefined,
      relatedOrderNo: '',
      status: '',
      remark: '',
      operateUser: undefined,
      operateUserName: '',
      operateTime: undefined,
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

export const inventoryFreezeOrderStoreWithOut = () => {
  return inventoryFreezeOrderStore(store)
}


