/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-21 09:25:38
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyPutawayState {
 id: number
 strategyCode: string
 strategyName: string
 warehouseId: string
 areaIds: string
 strategyType: string
 priority: number
 materialCategories: string
 packageUnits: string
 businessType: string
 targetLocation: string
 status: string
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const strategyPutawayStore = defineStore('strategyPutawayStore', {
  state: (): StrategyPutawayState => {
    return {
      id: undefined,
      strategyCode: '',
      strategyName: '',
      warehouseId: undefined,
      areaIds: '',
      strategyType: '',
      priority: undefined,
      materialCategories: '',
      packageUnits: '',
      businessType: '',
      targetLocation: undefined,
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

export const strategyPutawayStoreWithOut = () => {
  return strategyPutawayStore(store)
}


