/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-27 10:18:01
 */
import request from '@/config/axios'

export interface StrategyBatchDto {
  id: number
  strategyCode: string
  strategyName: string
  materialCategories: string[]
  strategyType: string
  prefix: string
  dateFormat: string
  snLength: number
  validityPeriod: string
  validityDuration: number
  validityUnit: string
  circulationStatus: string
  circulationExpiration: number
  forceTrace: string
  status: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyBatchSaveDto {
  strategyCode: string
  strategyName: string
  materialCategories: string[]
  strategyType: string
  prefix: string
  dateFormat: string
  snLength: number
  validityPeriod: string
  validityDuration: number
  validityUnit: string
  circulationStatus: string
  circulationExpiration: number
  forceTrace: string
  status: string
  remark: string
  tenantId: string
}

export interface StrategyBatchUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  materialCategories: string[]
  strategyType: string
  prefix: string
  dateFormat: string
  snLength: number
  validityPeriod: string
  validityDuration: number
  validityUnit: string
  circulationStatus: string
  circulationExpiration: number
  forceTrace: string
  status: string
  remark: string
  tenantId: string
}

const prefix = '/mdm/strategy/batch'

/**
 * 通过主键获取批次规则配置信息
 * getById
 * @param {*} id
 */
export const getStrategyBatchById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取批次规则配置信息
 * get
 * @param {*} query
 */
export const getStrategyBatch = (query: StrategyBatchDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取批次规则配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyBatch = (query: StrategyBatchDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取批次规则配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyBatchPage = (query: StrategyBatchDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除批次规则配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyBatchById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除批次规则配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyBatchByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增批次规则配置
 * create
 * @param {*} data
 */
export const createStrategyBatch = (data: StrategyBatchSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改批次规则配置信息
 * update
 * @param {*} data
 */
export const updateStrategyBatch = (data: StrategyBatchUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出批次规则配置
 * export
 * @param {*} query
 */
export const exportStrategyBatch = (query: StrategyBatchDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
