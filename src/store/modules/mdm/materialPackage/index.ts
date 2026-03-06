/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface MaterialPackageState {
 id: number
 packageName: string
 materialId: number
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const materialPackageStore = defineStore('materialPackageStore', {
  state: (): MaterialPackageState => {
    return {
      id: 0,
      packageName: '',
      materialId: 0,
      description: '',
      tenantId: '',
      createTime: new Date(),
      creator: '',
      updateTime: new Date(),
      updater: '',
      deleted: false,
    }
  },
  getters: {},
  actions: {}
})

export const materialPackageStoreWithOut = () => {
  return materialPackageStore(store)
}


