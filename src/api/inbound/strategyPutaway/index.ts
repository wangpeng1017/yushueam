/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-21 09:25:38
 */
import request from '@/config/axios'

export interface StrategyPutawayDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  packageUnits: string[]
  businessType: string
  targetLocation: number
  status: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyPutawaySaveDto {
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  packageUnits: string[]
  businessType: string
  targetLocation: number
  status: string
  remark: string
  tenantId: string
}

export interface StrategyPutawayUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  packageUnits: string[]
  businessType: string
  targetLocation: number
  status: string
  remark: string
  tenantId: string
}

const prefix = '/inbound/strategy/putaway'

/**
 * 通过主键获取上架策略配置信息
 * getById
 * @param {*} id
 */
export const getStrategyPutawayById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取上架策略配置信息
 * get
 * @param {*} query
 */
export const getStrategyPutaway = (query: StrategyPutawayDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取上架策略配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyPutaway = (query: StrategyPutawayDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取上架策略配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyPutawayPage = (query: StrategyPutawayDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除上架策略配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyPutawayById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除上架策略配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyPutawayByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增上架策略配置
 * create
 * @param {*} data
 */
export const createStrategyPutaway = (data: StrategyPutawaySaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改上架策略配置信息
 * update
 * @param {*} data
 */
export const updateStrategyPutaway = (data: StrategyPutawayUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出上架策略配置
 * export
 * @param {*} query
 */
export const exportStrategyPutaway = (query: StrategyPutawayDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
