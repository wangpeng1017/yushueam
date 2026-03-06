/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-25 22:37:30
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyTurnoverState {
 id: number
 strategyCode: string
 strategyName: string
 warehouseId: number
 areaIds: string
 strategyType: string
 priority: number
 materialCategories: string
 batchManage: string
 status: string
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const strategyTurnoverStore = defineStore('strategyTurnoverStore', {
  state: (): StrategyTurnoverState => {
    return {
      id: undefined,
      strategyCode: '',
      strategyName: '',
      warehouseId: undefined,
      areaIds: '',
      strategyType: '',
      priority: undefined,
      materialCategories: '',
      batchManage: '',
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

export const strategyTurnoverStoreWithOut = () => {
  return strategyTurnoverStore(store)
}


