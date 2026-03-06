/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface WarehouseLocationState {
 id: number
 factoryId: number
 warehouseId: number
 areaId: number
 locationCode: string
 locationName: string
 locationType: string
 status: string
 storageAttributes: string[]
 maxCapacity: number
 minCapacity: number
 lengthMm: number
 widthMm: number
 heightMm: number
 loadCapacityKg: number
 storageEnvironment: string
 storageLevel: string
 pickingType: string
 aisle: string
 row: string
 column: string
 level: string
 xCoordinate: string
 yCoordinate: string
 zCoordinate: string
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

export const warehouseLocationStore = defineStore('warehouseLocationStore', {
  state: (): WarehouseLocationState => {
    return {
      id: 0,
      factoryId: 0,
      warehouseId: 0,
      areaId: 0,
      locationCode: '',
      locationName: '',
      locationType: '',
      status: '',
      storageAttributes: [],
      maxCapacity: 0,
      minCapacity: 0,
      lengthMm: 0,
      widthMm: 0,
      heightMm: 0,
      loadCapacityKg: 0,
      storageEnvironment: '',
      storageLevel: '',
      pickingType: '',
      aisle: '',
      row: '',
      column: '',
      level: '',
      xCoordinate: 0,
      yCoordinate: 0,
      zCoordinate: 0,
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

export const warehouseLocationStoreWithOut = () => {
  return warehouseLocationStore(store)
}


