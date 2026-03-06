/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-29 11:27:06
 */
import request from '@/config/axios'

export interface CountOrderDto {
  id: number
  countOrder: string
  countType: string
  countScopeType: string
  scopeDetails: string[]
  scopeDetailNames: string[]
  countMethod: string
  planBeginTime: Date
  planEndTime: Date
  status: string
  adjustOrderFlag: string
  reviewSettings: string
  manageUser: number
  countUsers: string[]
  actualBeginTime: Date
  actualEndTime: Date
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
  countOrderItems?: CountOrderItemDto[]
}

export interface CountOrderItemDto {
  id?: number
  countOrderId?: number
  countOrder?: string
  uniqueKeyId?: string
  warehouseId?: number
  warehouseAreaId?: number
  warehousePlaceId?: number
  supplierId?: number
  status?: string
  materialId?: number
  materialCode?: string
  materialName?: string
  materialProducedDate?: Date
  materialStatus?: string
  materialBatch?: string
  qty?: number
  usableQty?: number
  blockedQty?: number
  transitQty?: number
  occupyQty?: number
  indateStatus?: boolean
  indateExpireTime?: Date
  countQty?: number
  countStatus?: string
}

export interface CountOrderItemSaveDto {
  uniqueKeyId?: string
  warehouseId?: number
  warehouseAreaId?: number
  warehousePlaceId?: number
  supplierId?: number
  materialId?: number
  materialCode?: string
  materialName?: string
  materialProducedDate?: Date
  materialStatus?: string
  materialBatch?: string
  qty?: number
  usableQty?: number
  blockedQty?: number
  transitQty?: number
  occupyQty?: number
  indateStatus?: boolean
  indateExpireTime?: Date
  countQty?: number
  countStatus?: string
}

export interface CountOrderSaveDto {
  countOrder: string
  countType: string
  countScopeType: string
  scopeDetails: string[]
  countMethod: string
  planBeginTime: Date
  planEndTime: Date
  status: string
  adjustOrderFlag: string
  reviewSettings: string
  manageUser: number
  countUsers: string[]
  actualBeginTime: Date
  actualEndTime: Date
  remark: string
  tenantId: string
  countOrderItems?: CountOrderItemSaveDto[]
}

export interface CountOrderUpdateDto {
  id: number
  countOrder: string
  countType: string
  countScopeType: string
  scopeDetails: string[]
  countMethod: string
  planBeginTime: Date
  planEndTime: Date
  status: string
  adjustOrderFlag: string
  reviewSettings: string
  manageUser: number
  countUsers: string[]
  actualBeginTime: Date
  actualEndTime: Date
  remark: string
  tenantId: string
  countOrderItems?: CountOrderItemSaveDto[]
}

const prefix = '/inventory/count/order'

/**
 * 通过主键获取盘点单信息信息
 * getById
 * @param {*} id
 */
export const getCountOrderById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

export const generateCountOrderNo = () =>
  request.get({
    url: prefix + '/countOrderNo'
  })

/**
 * 通过属性获取盘点单信息信息
 * get
 * @param {*} query
 */
export const getCountOrder = (query: CountOrderDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取盘点单信息列表
 * list
 * @param {*} query
 */
export const listOfCountOrder = (query: CountOrderDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取盘点单信息分页
 * getPage
 * @param {*} query
 */
export const getCountOrderPage = (query: CountOrderDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除盘点单信息信息
 * deleteById
 * @param {*} id
 */
export const deleteCountOrderById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除盘点单信息信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteCountOrderByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增盘点单信息
 * create
 * @param {*} data
 */
export const createCountOrder = (data: CountOrderSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改盘点单信息信息
 * update
 * @param {*} data
 */
export const updateCountOrder = (data: CountOrderUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出盘点单信息
 * export
 * @param {*} query
 */
export const exportCountOrder = (query: CountOrderDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })

/**
 * 开始盘点
 * startCount
 * @param {*} id
 */
export const startCount = (id: number) =>
  request.post({
    url: prefix + '/startCount/' + id
  })

/**
 * 取消盘点
 * cancelCount
 * @param {*} id
 */
export const cancelCount = (id: number) =>
  request.post({
    url: prefix + '/cancelCount/' + id
  })

/**
 * 盘点完成
 * completeCount
 * @param {*} data
 */
export const completeCount = (data: CountOrderUpdateDto) =>
  request.post({
    url: prefix + '/completeCount',
    data: data
  })
