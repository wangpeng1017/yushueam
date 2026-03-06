/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-20 17:11:46
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface PutOnTaskInfoState {
 id: number
 bizCode: string
 taskType: string
 materialCode: string
 expectedOnQty: number
 actualOnQty: number
 packageUnit: string
 batchNo: string
 targetLocation: string
 executorId: number
 executorName: string
 status: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const putOnTaskInfoStore = defineStore('putOnTaskInfoStore', {
  state: (): PutOnTaskInfoState => {
    return {
      id: undefined,
      bizCode: '',
      taskType: '',
      materialCode: '',
      expectedOnQty: undefined,
      actualOnQty: undefined,
      packageUnit: '',
      batchNo: '',
      targetLocation: '',
      executorId: undefined,
      executorName: '',
      status: '',
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

export const putOnTaskInfoStoreWithOut = () => {
  return putOnTaskInfoStore(store)
}


