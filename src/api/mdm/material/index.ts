/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import request from '@/config/axios'

export interface MaterialDto {
  id: number
  materialCode: string
  materialName: string
  materialIds: string
  specification: string
  materialCategory: string
  baseUnit: string
  lengthMm: number
  widthMm: number
  heightMm: number
  volumeM3: number
  netWeightKg: number
  grossWeightKg: number
  baseStorageCondition: string
  storageCondition: string
  batchManagementEnabled: boolean
  barcodeRuleId: string
  minStock: number
  maxStock: number
  purchaseUnit: string
  purchaseSpec: number
  manufacturer: string
  supplierIds: string
  materialStatus: string
  description: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface MaterialSaveDto {
  materialCode: string
  materialName: string
  materialIds: string
  specification: string
  materialCategory: string
  baseUnit: string
  lengthMm: number
  widthMm: number
  heightMm: number
  volumeM3: number
  netWeightKg: number
  grossWeightKg: number
  baseStorageCondition: string
  storageCondition: string
  batchManagementEnabled: boolean
  barcodeRuleId: string
  minStock: number
  maxStock: number
  purchaseUnit: string
  purchaseSpec: number
  manufacturer: string
  supplierIds: string
  materialStatus: string
  description: string
  tenantId: string
}

export interface MaterialUpdateDto {
  id: number
  materialCode: string
  materialName: string
  materialIds: string
  specification: string
  materialCategory: string
  baseUnit: string
  lengthMm: number
  widthMm: number
  heightMm: number
  volumeM3: number
  netWeightKg: number
  grossWeightKg: number
  baseStorageCondition: string
  storageCondition: string
  batchManagementEnabled: boolean
  barcodeRuleId: string
  minStock: number
  maxStock: number
  purchaseUnit: string
  purchaseSpec: number
  manufacturer: string
  supplierIds: string
  materialStatus: string
  description: string
  tenantId: string
}

const prefix = '/material/material'

/**
 * 通过主键获取物料管理信息
 * getById
 * @param {*} id
 */
export const getMaterialById = (id: number) => request.get({
  url: prefix + '/id/' + id
})

/**
 * 通过属性获取物料管理信息
 * get
 * @param {*} query
 */
export const getMaterial = (query: MaterialDto) => request.post({
  url: prefix + '/get',
  data: query
})


/**
 * 获取物料管理列表
 * list
 * @param {*} query
 */
export const listOfMaterial = (query: Partial<MaterialDto>) => request.post({
  url: prefix + '/list',
  data: query
})

/**
 * 获取物料管理分页
 * getPage
 * @param {*} query
 */
export const getMaterialPage = (query: any) => request.post({
  url: prefix + '/page',
  data: query
})

/**
 * 删除物料管理信息
 * deleteById
 * @param {*} id
 */
export const deleteMaterialById = (id: number) => request.post({
  url: prefix + '/delete/' + id
})

/**
 * 切换物料管理状态
 * toggleStatusById
 * @param {*} id
 */
export const toggleMaterialStatusById = (id: number) => request.post({
  url: prefix + '/toggleStatus/' + id
})

/**
 * 批量删除物料管理信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteMaterialByIds = (ids: number[]) => request.post({
  url: prefix + '/deleteByids',
  data: ids
})

/**
 * 新增物料管理
 * create
 * @param {*} data
 */
export const createMaterial = (data: MaterialSaveDto) => request.post({
  url: prefix + '/create',
  data: data
})

/**
 * 修改物料管理信息
 * update
 * @param {*} data
 */
export const updateMaterial = (data: MaterialUpdateDto) => request.post({
  url: prefix + '/update',
  data: data
})

/**
 * 导出物料管理
 * export
 * @param {*} query
 */
export const exportMaterial = (query: any) => request.download({
  url: prefix + '/exportData',
  params: query
})

/**
 * 获取物料管理状态列表
 * listOfStatus
 */
export const listOfStatus = () => request.get({
  url: prefix + '/listOfStatus'
})

/**
 * 获取物料管理类别列表
 * listOfCategory
 */
export const listOfCategory = () => request.get({
  url: prefix + '/listOfCategory'
})

/**
 * 获取物料管理基础单位列表
 * listOfBaseUnit
 */
export const listOfBaseUnit = () => request.get({
  url: prefix + '/listOfBaseUnit'
})
