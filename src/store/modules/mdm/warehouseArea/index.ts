/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface WarehouseAreaState {
 id: number
 factoryId: number
 warehouseId: number
 areaCode: string
 areaName: string
 abcClass: string
 areaType: string
 status: boolean
 areaAttributes: string[]
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const warehouseAreaStore = defineStore('warehouseAreaStore', {
  state: (): WarehouseAreaState => {
    return {
      id: 0,
      factoryId: 0,
      warehouseId: 0,
      areaCode: '',
      areaName: '',
      abcClass: '',
      areaType: '',
      status: false,
      areaAttributes: [],
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

export const warehouseAreaStoreWithOut = () => {
  return warehouseAreaStore(store)
}


