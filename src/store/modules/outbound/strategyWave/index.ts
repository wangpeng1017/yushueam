/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-23 22:16:25
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyWaveState {
 id: number
 strategyCode: string
 strategyName: string
 warehouseId: number
 areaIds: string
 triggerType: string
 threshold: number
 priority: number
 groupRule: string
 capacityControl: number
 status: string
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const strategyWaveStore = defineStore('strategyWaveStore', {
  state: (): StrategyWaveState => {
    return {
      id: undefined,
      strategyCode: '',
      strategyName: '',
      warehouseId: undefined,
      areaIds: '',
      triggerType: '',
      threshold: undefined,
      priority: undefined,
      groupRule: '',
      capacityControl: undefined,
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

export const strategyWaveStoreWithOut = () => {
  return strategyWaveStore(store)
}


