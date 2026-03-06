/**
 *  Copyright (c) 2025-2026, wangxiao
 * Author [王晓]
 * Since 2026-02-09
 */
import request from '@/config/axios'

export interface OutboundLogVo {
  id: number
  operationId: string
  operationType: string
  operationTypeName: string
  operationCode: string
  operationStatus: string
  warehouseId: number
  warehouseName: string
  materialId: number
  materialCode: string
  materialName: string
  materialBatch: string
  qty: number
  beforeQty: number
  beforeUsableQty: number
  beforeBlockedQty: number
  beforeOccupyQty: number
  afterQty: number
  afterUsableQty: number
  afterBlockedQty: number
  afterOccupyQty: number
  sourceDocType: string
  sourceDocNo: string
  targetInventoryId: number
  remark: string
  createTime: Date
  creator: string
  creatorName: string
}

export interface OutboundLogPageDto {
  pageNo: number
  pageSize: number
  operationType?: string
  materialBatch?: string
  sourceDocNo?: string
  warehouseId?: number
  materialId?: number
  beginTime?: string
  endTime?: string
}

const prefix = '/inventory/outboundLog'

/**
 * 获取出库流水分页
 */
export const getOutboundLogPage = (query: OutboundLogPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 获取出库操作类型列表
 */
export const listOfOperationType = () =>
  request.get({
    url: prefix + '/listOfOperationType'
  })
