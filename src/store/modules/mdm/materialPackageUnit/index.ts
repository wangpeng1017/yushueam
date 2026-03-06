/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import { store } from '@/store'
import { defineStore } from 'pinia'

export interface MaterialPackageUnitState {
 id: number
 packageId: string
 unitType: string
 unitCode: string
 conversionRatio: number
 lengthMm: number
 widthMm: number
 heightMm: number
 weightKg: number
 volumeM3: number
 barcodeType: string
 allowDisassemble: boolean
 isDefaultReceiving: boolean
 isDefaultShipping: boolean
 level: number
 parentUnitId: string
 description: string
 tenantId: string
 createTime: Date
 creator: string
 updateTime: Date
 updater: string
 deleted: boolean
}

export const materialPackageUnitStore = defineStore('materialPackageUnitStore', {
  state: (): MaterialPackageUnitState => {
    return {
      id: 0,
      packageId: '',
      unitType: '',
      unitCode: '',
      conversionRatio: 0,
      lengthMm: 0,
      widthMm: 0,
      heightMm: 0,
      weightKg: 0,
      volumeM3: 0,
      barcodeType: '',
      allowDisassemble: false   ,
      isDefaultReceiving: false,
      isDefaultShipping: false,
      level: 0,
      parentUnitId: '',
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

export const materialPackageUnitStoreWithOut = () => {
  return materialPackageUnitStore(store)
}


