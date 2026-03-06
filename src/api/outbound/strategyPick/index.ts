/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-25 16:39:04
 */
import request from '@/config/axios'

export interface StrategyPickDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  groupRule: string
  capacityControl: number
  pathPlan: string
  status: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyPickSaveDto {
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  groupRule: string
  capacityControl: number
  pathPlan: string
  status: string
  remark: string
  tenantId: string
}

export interface StrategyPickUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  groupRule: string
  capacityControl: number
  pathPlan: string
  status: string
  remark: string
  tenantId: string
}

const prefix = '/outbound/strategy/pick'

/**
 * 通过主键获取拣货策略配置信息
 * getById
 * @param {*} id
 */
export const getStrategyPickById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取拣货策略配置信息
 * get
 * @param {*} query
 */
export const getStrategyPick = (query: StrategyPickDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取拣货策略配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyPick = (query: StrategyPickDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取拣货策略配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyPickPage = (query: StrategyPickDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除拣货策略配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyPickById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除拣货策略配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyPickByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增拣货策略配置
 * create
 * @param {*} data
 */
export const createStrategyPick = (data: StrategyPickSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改拣货策略配置信息
 * update
 * @param {*} data
 */
export const updateStrategyPick = (data: StrategyPickUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出拣货策略配置
 * export
 * @param {*} query
 */
export const exportStrategyPick = (query: StrategyPickDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
