/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-29
 */
import request from '@/config/axios'

export interface InventoryDto {
    id: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
    // 扩展字段
    warehouseName?: string
    warehouseAreaName?: string
    warehousePlaceName?: string
    supplierName?: string
    materialStatusText?: string
}

export interface InventorySaveDto {
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
}

export interface InventoryUpdateDto {
    id: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
}

export interface InventoryPageDto {
    pageNo: number
    pageSize: number
    warehouseId?: number
    warehouseAreaId?: number
    warehousePlaceId?: number
    supplierId?: number
    materialId?: number
    materialCode?: string
    materialName?: string
    materialStatus?: string
    materialBatch?: string
    indateStatus?: boolean
    beginTime?: Date
    endTime?: Date
    warehouseIds?: number[]
    warehouseAreaIds?: number[]
    materialIds?: number[]
}

// 获取库存分页
export const getInventoryPage = (params: InventoryPageDto) => {
  return request.post({ url: '/inventory/inventory/page', data: params })
}

// 获取库存详情
export const getInventoryById = (id: number) => {
  return request.get({ url: `/inventory/inventory/id/${id}` })
}

// 新增库存
export const createInventory = (data: InventorySaveDto) => {
  return request.post({ url: '/inventory/inventory/create', data })
}

// 修改库存
export const updateInventory = (data: InventoryUpdateDto) => {
  return request.post({ url: '/inventory/inventory/update', data })
}

// 删除库存
export const deleteInventoryById = (id: number) => {
  return request.post({ url: `/inventory/inventory/delete/${id}` })
}

// 批量删除库存
export const deleteInventoryByIds = (ids: number[]) => {
  return request.post({ url: '/inventory/inventory/deleteByIds', data: ids })
}

// 导出库存
export const exportInventory = (params: InventoryPageDto) => {
  return request.download({ url: '/inventory/inventory/exportData', params })
}

// 获取仓库列表
export const listOfWarehouse = () => {
  return request.post({ url: '/mdm/warehouse/list',data:{} })
}

// 获取库区列表
export const listOfWarehouseArea = (warehouseId?: number) => {
  return request.post({ url: '/mdm/warehouse/area/list', data: { warehouseId } })
}

// 获取库位列表
export const listOfWarehousePlace = (areaId?: number) => {
  return request.post({ url: '/mdm/warehouse/location/list', data: { areaId } })
}

// 获取供应商列表
export const listOfSupplier = () => {
  return request.post({ url: '/mdm/cooperpartners/supplier/list',data:{} })
}

// 获取物料列表
export const listOfMaterial = () => {
  return request.post({ url: '/material/material/list',data:{} })
}

// 获取物料状态列表
export const listOfMaterialStatus = () => {
  return request.get({ url: '/material/material/listOfStatus' })
}

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

// 获取库存状态列表
export const listOfInventoryStatus = () => {
  return request.get({ url: '/inventory/inventory/listOfInventoryStatus' })
}
