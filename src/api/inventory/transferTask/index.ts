/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [王晓]
 * Since 2026-02-04
 */
import request from '@/config/axios'

export interface TransferTaskDto {
  id: number
  transferOrderNo: string
  transferType: string
  sourceInventoryId: number
  sourceWarehouseId: number
  sourceWarehouseAreaId: number
  sourceWarehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  qty: number
  targetWarehouseId: number
  targetWarehouseAreaId: number
  targetWarehousePlaceId: number
  status: string
  executor: string
  finishedTime: Date
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface TransferTaskSaveDto {
  transferOrderNo?: string
  transferType: string
  sourceInventoryId: number
  sourceWarehouseId: number
  sourceWarehouseAreaId: number
  sourceWarehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  qty: number
  targetWarehouseId: number
  targetWarehouseAreaId: number
  targetWarehousePlaceId: number
}

export interface TransferTaskUpdateDto {
  id: number
  transferOrderNo: string
  transferType: string
  sourceInventoryId: number
  sourceWarehouseId: number
  sourceWarehouseAreaId: number
  sourceWarehousePlaceId: number
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  qty: number
  targetWarehouseId: number
  targetWarehouseAreaId: number
  targetWarehousePlaceId: number
}

export interface TransferTaskPageDto {
  pageNo: number
  pageSize: number
  transferOrderNo?: string
  transferType?: string
  status?: string
  materialKeyword?: string
  beginTime?: string
  endTime?: string
}

const prefix = '/inventory/transfer/task'

/**
 * 通过主键获取调拨任务信息
 */
export const getTransferTaskById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 生成调拨单号
 */
export const generateTransferOrderNo = () =>
  request.get({
    url: prefix + '/transferOrderNo'
  })

/**
 * 通过属性获取调拨任务信息
 */
export const getTransferTask = (query: TransferTaskDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取调拨任务列表
 */
export const listOfTransferTask = (query: TransferTaskDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取调拨任务分页
 */
export const getTransferTaskPage = (query: TransferTaskPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除调拨任务信息
 */
export const deleteTransferTaskById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除调拨任务信息
 */
export const deleteTransferTaskByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增调拨任务
 */
export const createTransferTask = (data: TransferTaskSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改调拨任务信息
 */
export const updateTransferTask = (data: TransferTaskUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 执行调拨任务
 */
export const executeTransferTask = (id: number) =>
  request.post({
    url: prefix + '/execute/' + id
  })

/**
 * 取消调拨任务
 */
export const cancelTransferTask = (id: number) =>
  request.post({
    url: prefix + '/cancel/' + id
  })

/**
 * 导出调拨任务
 */
export const exportTransferTask = (query: TransferTaskDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
