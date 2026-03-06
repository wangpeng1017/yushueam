/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-04 22:43:08
 */
import request from '@/config/axios'

export interface CountDifferenceDto {
  id: number
  countOrderId: number
  countOrder: string
  differenceOrder: string
  differenceTime: Date
  differenceStatus: string
  warehouseId: number
  warehouseAreaId: number
  warehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  usableQty: number
  countQty: number
  differenceQty: number
  differenceAmount: number
  differenceReason: string
  handleUserId: number
  handleUserName: string
  handleTime: Date
  approvalComment: string
  approvalUserId: number
  approvalUserName: string
  approvalTime: Date
  postingQty: number
  postingUserId: number
  postingUserName: string
  postingTime: Date
  adjustOrderId: number
  uniqueKeyId: string
  adjustOrderNo: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface CountDifferenceSaveDto {
  countOrderId: number
  countOrder: string
  differenceOrder: string
  differenceTime: Date
  differenceStatus: string
  warehouseId: number
  warehouseAreaId: number
  warehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  usableQty: number
  countQty: number
  differenceQty: number
  differenceAmount: number
  differenceReason: string
  handleUserId: number
  handleUserName: string
  handleTime: Date
  approvalComment: string
  approvalUserId: number
  approvalUserName: string
  approvalTime: Date
  postingQty: number
  postingUserId: number
  postingUserName: string
  postingTime: Date
  adjustOrderId: number
  uniqueKeyId: string
  adjustOrderNo: string
  tenantId: string
}

export interface CountDifferenceUpdateDto {
  id: number
  countOrderId: number
  countOrder: string
  differenceOrder: string
  differenceTime: Date
  differenceStatus: string
  warehouseId: number
  warehouseAreaId: number
  warehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  usableQty: number
  countQty: number
  differenceQty: number
  differenceAmount: number
  differenceReason: string
  handleUserId: number
  handleUserName: string
  handleTime: Date
  approvalComment: string
  approvalUserId: number
  approvalUserName: string
  approvalTime: Date
  postingQty: number
  postingUserId: number
  postingUserName: string
  postingTime: Date
  adjustOrderId: number
  uniqueKeyId: string
  adjustOrderNo: string
  tenantId: string
}

const prefix = '/inventory/count/difference'

/**
 * 通过主键获取盘点差异信息
 * getById
 * @param {*} id
 */
export const getCountDifferenceById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取盘点差异信息
 * get
 * @param {*} query
 */
export const getCountDifference = (query: CountDifferenceDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取盘点差异列表
 * list
 * @param {*} query
 */
export const listOfCountDifference = (query: CountDifferenceDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取盘点差异分页
 * getPage
 * @param {*} query
 */
export const getCountDifferencePage = (query: CountDifferenceDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除盘点差异信息
 * deleteById
 * @param {*} id
 */
export const deleteCountDifferenceById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除盘点差异信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteCountDifferenceByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增盘点差异
 * create
 * @param {*} data
 */
export const createCountDifference = (data: CountDifferenceSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改盘点差异信息
 * update
 * @param {*} data
 */
export const updateCountDifference = (data: CountDifferenceUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出盘点差异
 * export
 * @param {*} query
 */
export const exportCountDifference = (query: CountDifferenceDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })

/**
 * 处理盘点差异
 * handleDifference
 * @param {*} data
 */
export const handleDifference = (data: { id: number; differenceReason: string }) =>
  request.post({
    url: prefix + '/handleDifference',
    data: data
  })

/**
 * 审批盘点差异
 * approvalDifference
 * @param {*} data
 */
export const approvalDifference = (data: {
  id: number
  approvalComment: string
  approvalType: string
}) =>
  request.post({
    url: prefix + '/approvalDifference',
    data: data
  })

/**
 * 过账盘点差异
 * postDifference
 * @param {*} data
 */
export const postDifference = (data: { id: number; postingQty: number }) =>
  request.post({
    url: prefix + '/postDifference',
    data: data
  })
