/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-23 22:16:25
 */
import request from '@/config/axios'

export interface StrategyWaveDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  triggerType: string
  threshold: number
  priority: number
  groupRule: string
  capacityControl: number
  status: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyWaveSaveDto {
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  triggerType: string
  threshold: number
  priority: number
  groupRule: string
  capacityControl: number
  status: string
  remark: string
  tenantId: string
}

export interface StrategyWaveUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  triggerType: string
  threshold: number
  priority: number
  groupRule: string
  capacityControl: number
  status: string
  remark: string
  tenantId: string
}

export interface StrategyWavePageDto {
  pageNo: number
  pageSize: number
  strategyCode?: string
  strategyName?: string
  triggerType?: string
  status?: string
  groupRule?: string
}

const prefix = '/outbound/strategy/wave'

/**
 * 通过主键获取波次策略配置信息
 * getById
 * @param {*} id
 */
export const getStrategyWaveById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取波次策略配置信息
 * get
 * @param {*} query
 */
export const getStrategyWave = (query: StrategyWaveDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取波次策略配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyWave = (query: StrategyWaveDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取波次策略配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyWavePage = (query: StrategyWavePageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除波次策略配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyWaveById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除波次策略配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyWaveByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增波次策略配置
 * create
 * @param {*} data
 */
export const createStrategyWave = (data: StrategyWaveSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改波次策略配置信息
 * update
 * @param {*} data
 */
export const updateStrategyWave = (data: StrategyWaveUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出波次策略配置
 * export
 * @param {*} query
 */
export const exportStrategyWave = (query: StrategyWaveDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
