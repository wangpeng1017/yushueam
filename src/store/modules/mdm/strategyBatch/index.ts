/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-27 10:18:01
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyBatchState {
 id: number
 strategyCode: string
 strategyName: string
 materialCategories: string
 strategyType: string
 prefix: string
 dateFormat: string
 snLength: number
 validityPeriod: string
 validityDuration: number
 validityUnit: string
 circulationStatus: string
 circulationExpiration: number
 forceTrace: string
 status: string
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const strategyBatchStore = defineStore('strategyBatchStore', {
  state: (): StrategyBatchState => {
    return {
      id: undefined,
      strategyCode: '',
      strategyName: '',
      materialCategories: '',
      strategyType: '',
      prefix: '',
      dateFormat: '',
      snLength: undefined,
      validityPeriod: '',
      validityDuration: undefined,
      validityUnit: '',
      circulationStatus: '',
      circulationExpiration: undefined,
      forceTrace: '',
      status: '',
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

export const strategyBatchStoreWithOut = () => {
  return strategyBatchStore(store)
}


