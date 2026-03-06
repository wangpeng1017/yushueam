/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-09 00:00:00
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface StrategyCodeSegmentState {
  id: number
  strategyCodeId: number
  sortOrder: number
  segmentType: string
  segmentDesc: string
  fixedValue: string
  dateFormat: string
  snLength: number
  padChar: string
}

export interface StrategyCodeState {
  id: number
  ruleCode: string
  ruleName: string
  ruleType: string
  applicableSystem: string
  separator: string
  resetCycle: string
  status: string
  remark: string
  segments: StrategyCodeSegmentState[]
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export const strategyCodeStore = defineStore('strategyCodeStore', {
  state: (): StrategyCodeState => {
    return {
      id: undefined,
      ruleCode: '',
      ruleName: '',
      ruleType: '',
      applicableSystem: '',
      separator: '',
      resetCycle: '',
      status: '',
      remark: '',
      segments: [],
      tenantId: '',
      createTime: undefined,
      creator: '',
      updateTime: undefined,
      updater: '',
      deleted: undefined
    }
  },
  getters: {},
  actions: {}
})

export const strategyCodeStoreWithOut = () => {
  return strategyCodeStore(store)
}
