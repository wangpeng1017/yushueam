/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 14:21:09
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface AsnInnerInfoState {
 id: number
 asnNo: string
 inboundType: string
 sourceOrderNo: string
 supplierId: number
 supplierName: string
 expectedArrivalTime: Date
 status: string
 materialId: number
 materialCode: string
 expectedQty: number
 packageUnit: string
 batchNo: string
 qtyTolerancePercent: number
 qcSchemeId: number
 putawayStrategyId: number
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const asnInnerInfoStore = defineStore('asnInnerInfoStore', {
  state: (): AsnInnerInfoState => {
    return {
      id: undefined,
      asnNo: '',
      inboundType: '',
      sourceOrderNo: '',
      supplierId: undefined,
      supplierName: '',
      expectedArrivalTime: undefined,
      status: '',
      materialId: undefined,
      materialCode: '',
      expectedQty: undefined,
      packageUnit: '',
      batchNo: '',
      qtyTolerancePercent: undefined,
      qcSchemeId: undefined,
      putawayStrategyId: undefined,
      remark: '',
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

export const asnInnerInfoStoreWithOut = () => {
  return asnInnerInfoStore(store)
}


