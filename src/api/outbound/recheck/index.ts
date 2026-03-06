/**
 *  Copyright (c) 2025-2026, wangxiao
 * Author [王晓]
 * Since 2026-02-03
 */
import request from '@/config/axios'

// ==================== 类型定义 ====================

/**
 * 出库复核 VO
 */
export interface OutboundRecheckVo {
  id: number
  recheckNo: string
  pickingTaskId: number
  pickingTaskNo: string
  recheckMethod: string
  status: string
  progress: number
  totalQty: number
  checkedQty: number
  recheckUserId?: string
  recheckUserName?: string
  recheckTime?: Date
  exceptionRemark?: string
  createTime: Date
  creator: string
}

/**
 * 出库复核分页 VO
 */
export interface OutboundRecheckPageVo extends OutboundRecheckVo {
}

/**
 * 出库复核详情 VO（含物料明细）
 */
export interface OutboundRecheckDetailVo extends OutboundRecheckVo {
  materials: RecheckMaterialVo[]
}

/**
 * 复核物料明细 VO
 */
export interface RecheckMaterialVo {
  id: number
  lineNo: number
  materialCode: string
  materialName: string
  materialSpec?: string
  batchNo?: string
  barcode?: string
  demandQty: number
  checkedQty: number
  status: string
}

/**
 * 拣货任务简单 VO（快速开始搜索）
 */
export interface PickingTaskSimpleVo {
  id: number
  taskNo: string
  sourceDocNo: string
  status: string
  pickedItemsCount: number
  pickedPiecesCount: number
}

/**
 * 出库复核分页查询 DTO
 */
export interface OutboundRecheckPageDto {
  pageNo: number
  pageSize: number
  recheckNo?: string
  pickingTaskNo?: string
  recheckMethod?: string
  status?: string
  beginTime?: string
  endTime?: string
}

/**
 * 出库复核快速开始 DTO
 */
export interface OutboundRecheckStartDto {
  pickingTaskIds: number[]
}

/**
 * 复核扫码 DTO
 */
export interface RecheckScanDto {
  recheckId: number
  barcode: string
}

/**
 * 复核上报异常 DTO
 */
export interface RecheckExceptionDto {
  exceptionRemark: string
}

/**
 * 枚举实体
 */
export interface EnumEntity {
  value: string
  text: string
}

const prefix = '/outbound/recheck'

// ==================== API 接口 ====================

/**
 * 分页查询复核任务列表
 */
export const getOutboundRecheckPage = (query: OutboundRecheckPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 通过主键获取复核详情（含物料明细）
 */
export const getOutboundRecheckById = (id: number) =>
  request.get<OutboundRecheckDetailVo>({
    url: prefix + '/id/' + id
  })

/**
 * 获取待复核任务数量
 */
export const getPendingRecheckCount = () =>
  request.get<number>({
    url: prefix + '/pending-count'
  })

/**
 * 快速开始（批量创建复核任务）
 */
export const startRecheck = (data: OutboundRecheckStartDto) =>
  request.post<boolean>({
    url: prefix + '/start',
    data: data
  })

/**
 * 搜索可复核的拣货任务
 */
export const searchPickingTasks = (keyword?: string) =>
  request.get<PickingTaskSimpleVo[]>({
    url: prefix + '/search-picking-tasks',
    params: { keyword }
  })

/**
 * 扫码确认物料
 */
export const scanBarcode = (data: RecheckScanDto) =>
  request.post<RecheckMaterialVo>({
    url: prefix + '/scan',
    data: data
  })

/**
 * 复核通过并发货
 */
export const completeRecheck = (id: number) =>
  request.post<boolean>({
    url: prefix + '/complete/' + id
  })

/**
 * 上报异常
 */
export const reportException = (id: number, data: RecheckExceptionDto) =>
  request.post<boolean>({
    url: prefix + '/exception/' + id,
    data: data
  })

/**
 * 获取复核方式枚举列表
 */
export const listOfRecheckMethod = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfRecheckMethod'
  })

/**
 * 获取复核状态枚举列表
 */
export const listOfRecheckStatus = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfRecheckStatus'
  })
