/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-29 11:27:06
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface CountOrderState {
 id: number
 countOrder: string
 countType: string
 countScopeType: string
 scopeDetails: string
 countMethod: string
 planBeginTime: Date
 planEndTime: Date
 status: string
 adjustOrderFlag: string
 reviewSettings: string
 manageUser: number
 countUsers: string
 actualBeginTime: Date
 actualEndTime: Date
 remark: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const countOrderStore = defineStore('countOrderStore', {
  state: (): CountOrderState => {
    return {
      id: undefined,
      countOrder: '',
      countType: '',
      countScopeType: '',
      scopeDetails: '',
      countMethod: '',
      planBeginTime: undefined,
      planEndTime: undefined,
      status: '',
      adjustOrderFlag: '',
      reviewSettings: '',
      manageUser: undefined,
      countUsers: '',
      actualBeginTime: undefined,
      actualEndTime: undefined,
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

export const countOrderStoreWithOut = () => {
  return countOrderStore(store)
}


