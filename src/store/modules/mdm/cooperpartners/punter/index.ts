/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:46:12
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface CooperpartnersPunterState {
 id: number
 shipperCode: string
 shipperName: string
 shipperType: string
 settlementMethod: string
 contactName: string
 contactPhone: string
 deliveryAddress: string
 defaultWarehouseId: number
 enableSnTrace: boolean
 useCustomTemplate: boolean
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const cooperpartnersPunterStore = defineStore('cooperpartnersPunterStore', {
  state: (): CooperpartnersPunterState => {
    return {
      id: undefined,
      shipperCode: '',
      shipperName: '',
      shipperType: '',
      settlementMethod: '',
      contactName: '',
      contactPhone: '',
      deliveryAddress: '',
      defaultWarehouseId: undefined,
      enableSnTrace: undefined,
      useCustomTemplate: undefined,
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

export const cooperpartnersPunterStoreWithOut = () => {
  return cooperpartnersPunterStore(store)
}


