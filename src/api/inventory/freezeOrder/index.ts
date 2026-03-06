/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-08 17:48:03
 */
import request from '@/config/axios'

export interface InventoryFreezeOrderDto {
  id: number
  freezeOrderNo: string
  freezeObjectType: string
  freezeObject: string
  freezeObjectName: string
  freezeReason: string
  unfreezeCondition: string
  relatedOrderId: number
  relatedOrderNo: string
  status: string
  remark: string
  operateUser: number
  operateUserName: string
  operateTime: Date
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
  freezeDetails: InventoryFreezeDetailDto[]
}

export interface InventoryFreezeDetailDto {
    id: number
    freezeOrderId: number
    freezeOrderNo: string
    inventoryId: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    materialId: number
    materialCode: string
    materialName: string
    materialBatch: string
    freezeQty: number
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface InventoryFreezeOrderSaveDto {
  freezeOrderNo: string
  freezeObjectType: string
  freezeObject: string
  freezeReason: string
  unfreezeCondition: string
  relatedOrderId: number
  relatedOrderNo: string
  status: string
  remark: string
  operateUser: number
  operateUserName: string
  operateTime: Date
  tenantId: string
}

export interface InventoryFreezeOrderUpdateDto {
  id: number
  freezeOrderNo: string
  freezeObjectType: string
  freezeObject: string
  freezeReason: string
  unfreezeCondition: string
  relatedOrderId: number
  relatedOrderNo: string
  status: string
  remark: string
  operateUser: number
  operateUserName: string
  operateTime: Date
  tenantId: string
}

const prefix = '/inventory/inventory/freeze/order'

/**
 * 通过主键获取库存冻结单主表信息
 * getById
 * @param {*} id
 */
export const getInventoryFreezeOrderById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

export const generateFreezeOrderNo = () =>
  request.get({
    url: prefix + '/freezeOrderNo'
  })

/**
 * 通过属性获取库存冻结单主表信息
 * get
 * @param {*} query
 */
export const getInventoryFreezeOrder = (query: InventoryFreezeOrderDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取库存冻结单主表列表
 * list
 * @param {*} query
 */
export const listOfInventoryFreezeOrder = (query: InventoryFreezeOrderDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取库存冻结单主表分页
 * getPage
 * @param {*} query
 */
export const getInventoryFreezeOrderPage = (query: InventoryFreezeOrderDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除库存冻结单主表信息
 * deleteById
 * @param {*} id
 */
export const deleteInventoryFreezeOrderById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除库存冻结单主表信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteInventoryFreezeOrderByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增库存冻结单主表
 * create
 * @param {*} data
 */
export const createInventoryFreezeOrder = (data: InventoryFreezeOrderSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改库存冻结单主表信息
 * update
 * @param {*} data
 */
export const updateInventoryFreezeOrder = (data: InventoryFreezeOrderUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出库存冻结单主表
 * export
 * @param {*} query
 */
export const exportInventoryFreezeOrder = (query: InventoryFreezeOrderDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })

/**
 * 解冻库存
 * unfreezeInventory
 * @param {*} freezeOrderId
 */
export const unfreezeInventory = (freezeOrderId: number) =>
  request.post({
    url: prefix + '/unfreezeInventory/' + freezeOrderId
  })
