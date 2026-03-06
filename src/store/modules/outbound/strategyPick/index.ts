/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-25 16:39:04
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyPickState {
 id: number
 strategyCode: string
 strategyName: string
 warehouseId: number
 areaIds: string
 strategyType: string
 priority: number
 groupRule: string
 capacityControl: number
 pathPlan: string
 status: string
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const strategyPickStore = defineStore('strategyPickStore', {
  state: (): StrategyPickState => {
    return {
      id: undefined,
      strategyCode: '',
      strategyName: '',
      warehouseId: undefined,
      areaIds: '',
      strategyType: '',
      priority: undefined,
      groupRule: '',
      capacityControl: undefined,
      pathPlan: '',
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

export const strategyPickStoreWithOut = () => {
  return strategyPickStore(store)
}


