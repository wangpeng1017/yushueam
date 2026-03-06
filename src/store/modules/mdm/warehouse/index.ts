/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface WarehouseState {
 id: number
 factoryId: number
 warehouseCode: string
 warehouseName: string
 warehouseType: string
 storageType: string
 status: boolean
 address: string
 contactPerson: string
 contactPhone: string
 size: number
 capacity: number
 enableDate: Date
 disableDate: Date
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const warehouseStore = defineStore('warehouseStore', {
  state: (): WarehouseState => {
    return {
      id: 0,
      factoryId: 0,
      warehouseCode: '',
      warehouseName: '',
      warehouseType: '',
      storageType: '',
      status: false,
      address: '',
      contactPerson: '',
      contactPhone: '',
      size: 0,
      capacity: 0,
      enableDate: new Date(),
      disableDate: new Date(),
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

export const warehouseStoreWithOut = () => {
  return warehouseStore(store)
}


