/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-20 15:37:08
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface CooperpartnersSupplierState {
 id: number
 supplierCode: string
 supplierName: string
 supplierType: string
 evalLevel: string
 cooperationStatus: string
 paymentTerm: string
 primaryContact: string
 contactPhone: string
 bankInfo: string
 recentQualifiedRate: number
 recentOtdRate: number
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const cooperpartnersSupplierStore = defineStore('cooperpartnersSupplierStore', {
  state: (): CooperpartnersSupplierState => {
    return {
      id: undefined,
      supplierCode: '',
      supplierName: '',
      supplierType: '',
      evalLevel: '',
      cooperationStatus: '',
      paymentTerm: '',
      primaryContact: '',
      contactPhone: '',
      bankInfo: '',
      recentQualifiedRate: undefined,
      recentOtdRate: undefined,
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

export const cooperpartnersSupplierStoreWithOut = () => {
  return cooperpartnersSupplierStore(store)
}


