/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-09 00:00:00
 */
import request from '@/config/axios'

// ==================== 段配置 DTO ====================

export interface StrategyCodeSegmentDto {
  id?: number
  strategyCodeId?: number
  sortOrder: number
  segmentType: string // FIXED | DATE | SEQUENCE
  segmentDesc: string
  fixedValue?: string
  dateFormat?: string
  snLength?: number
  padChar?: string
}

// ==================== 主表 DTO ====================

export interface StrategyCodeDto {
  id: number
  ruleCode: string
  ruleName: string
  ruleType: string
  applicableSystem: string
  separatorCode: string
  resetCycle: string
  status: string
  remark: string
  segments: StrategyCodeSegmentDto[]
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyCodeSaveDto {
  ruleCode: string
  ruleName: string
  ruleType: string
  applicableSystem: string
  separatorCode: string
  resetCycle: string
  status: string
  remark: string
  segments: StrategyCodeSegmentDto[]
  tenantId?: string
}

export interface StrategyCodeUpdateDto {
  id: number
  ruleCode: string
  ruleName: string
  ruleType: string
  applicableSystem: string
  separatorCode: string
  resetCycle: string
  status: string
  remark: string
  segments: StrategyCodeSegmentDto[]
  tenantId?: string
}

const prefix = '/mdm/strategy/code'

/**
 * 通过主键获取编码规则配置信息（含段明细）
 * getById
 * @param {*} id
 */
export const getStrategyCodeById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取编码规则配置信息
 * get
 * @param {*} query
 */
export const getStrategyCode = (query: StrategyCodeDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取编码规则配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyCode = (query: StrategyCodeDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取编码规则配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyCodePage = (query: StrategyCodeDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除编码规则配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyCodeById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除编码规则配置信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteStrategyCodeByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增编码规则配置（含段明细）
 * create
 * @param {*} data
 */
export const createStrategyCode = (data: StrategyCodeSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改编码规则配置信息（含段明细）
 * update
 * @param {*} data
 */
export const updateStrategyCode = (data: StrategyCodeUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出编码规则配置
 * export
 * @param {*} query
 */
export const exportStrategyCode = (query: StrategyCodeDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })

/**
 * 获取编码规则配置的唯一编码
 * getCodeNo
 * @param {*} ruleType 规则类型
 */
export const getCodeNo = (ruleType: string) =>
  request.get({
    url: prefix + '/codeNo',
    params: { ruleType }
  })
