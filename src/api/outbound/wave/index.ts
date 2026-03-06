/**
 *  Copyright (c) 2025-2026, wangxiao
 * Author [王晓]
 * Since 2026-01-27
 */
import request from '@/config/axios'

// ==================== 类型定义 ====================

/**
 * 波次计划 VO
 */
export interface OutboundWaveVo {
  id: number
  waveNo: string
  waveStrategyId: number
  includedOrderCount: number
  includedLineCount: number
  status: string
  releaseTime?: Date
  remark?: string
  createTime: Date
  creator: string
  updateTime?: Date
  updater?: string
}

/**
 * 波次计划分页 VO
 */
export interface OutboundWavePageVo extends OutboundWaveVo {
  waveStrategyName?: string
}

/**
 * 波次计划含订单详情 VO
 */
export interface OutboundWaveWithOrderVo extends OutboundWaveVo {
  waveStrategyName?: string
  orders: WaveOrderVo[]
}

/**
 * 波次关联订单 VO
 */
export interface WaveOrderVo {
  orderId: number
  orderNo: string
  sortOrder: number
  partyName?: string
  priority?: string
  expectedShipDate?: string
  materialCount?: number
  totalDemandQty?: number
}

/**
 * 待波次订单池 VO
 */
export interface PendingWaveOrderVo {
  id: number
  orderNo: string
  orderType: string
  partyType: string
  partyName?: string
  priority: string
  expectedShipDate?: string
  materialCount: number
  totalDemandQty: number
}

/**
 * 波次计划创建 DTO
 */
export interface OutboundWaveSaveDto {
  waveStrategyId: number
  orderIds: number[]
  remark?: string
}

/**
 * 波次计划更新 DTO
 */
export interface OutboundWaveUpdateDto {
  id: number
  waveStrategyId?: number
  orderIds?: number[]
  remark?: string
}

/**
 * 波次计划分页查询 DTO
 */
export interface OutboundWavePageDto {
  pageNo: number
  pageSize: number
  waveNo?: string
  waveStrategyId?: number
  status?: string
  beginTime?: string
  endTime?: string
}

/**
 * 枚举实体
 */
export interface EnumEntity {
  value: string
  text: string
}

/**
 * 默认策略返回
 */
export interface DefaultStrategy {
  id: number
  strategyCode: string
  strategyName: string
}

const prefix = '/outbound/wave'

// ==================== API 接口 ====================

/**
 * 生成波次计划
 */
export const generateWave = (data: OutboundWaveSaveDto) =>
  request.post<number>({
    url: prefix + '/generate',
    data: data
  })

/**
 * 通过主键获取波次详情
 */
export const getWaveById = (id: number) =>
  request.get<OutboundWaveWithOrderVo>({
    url: prefix + '/id/' + id
  })

/**
 * 分页查询波次计划
 */
export const getWavePage = (query: OutboundWavePageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 更新波次计划
 */
export const updateWave = (data: OutboundWaveUpdateDto) =>
  request.post<boolean>({
    url: prefix + '/update',
    data: data
  })

/**
 * 删除波次计划
 */
export const deleteWaveById = (id: number) =>
  request.post<boolean>({
    url: prefix + '/delete/' + id
  })

/**
 * 获取待波次订单池
 */
export const getPendingOrders = () =>
  request.get<PendingWaveOrderVo[]>({
    url: prefix + '/pending-orders'
  })

/**
 * 获取默认策略（triggerType=MANUAL）
 */
export const getDefaultStrategy = () =>
  request.get<DefaultStrategy>({
    url: prefix + '/default-strategy'
  })

/**
 * 生成波次号
 */
export const generateWaveNo = () =>
  request.get<string>({
    url: prefix + '/waveNo'
  })

/**
 * 获取波次状态枚举列表
 */
export const listOfWaveStatus = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfWaveStatus'
  })
