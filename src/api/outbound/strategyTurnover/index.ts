/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-25 22:37:30
 */
import request from '@/config/axios'

export interface StrategyTurnoverDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  batchManage: string
  status: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyTurnoverSaveDto {
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  batchManage: string
  status: string
  remark: string
  tenantId: string
}

export interface StrategyTurnoverUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  warehouseId: number
  areaIds: string[]
  strategyType: string
  priority: number
  materialCategories: string[]
  batchManage: string
  status: string
  remark: string
  tenantId: string
}

const prefix = '/outbound/strategy/turnover'

/**
 * 通过主键获取库存周转配置信息
 * getById
 * @param {*} id
 */
export const getStrategyTurnoverById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取库存周转配置信息
 * get
 * @param {*} query
 */
export const getStrategyTurnover = (query: StrategyTurnoverDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取库存周转配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyTurnover = (query: StrategyTurnoverDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取库存周转配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyTurnoverPage = (query: StrategyTurnoverDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除库存周转配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyTurnoverById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除库存周转配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyTurnoverByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增库存周转配置
 * create
 * @param {*} data
 */
export const createStrategyTurnover = (data: StrategyTurnoverSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改库存周转配置信息
 * update
 * @param {*} data
 */
export const updateStrategyTurnover = (data: StrategyTurnoverUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出库存周转配置
 * export
 * @param {*} query
 */
export const exportStrategyTurnover = (query: StrategyTurnoverDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
