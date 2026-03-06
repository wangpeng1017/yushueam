/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:46:12
 */
import request from '@/config/axios'

export interface CooperpartnersPunterDto {
  id: number
  shipperCode: string
  shipperName: string
  shipperType: string
  settlementMethod: string
  contactName: string
  contactPhone: string
  deliveryAddress: string
  defaultWarehouseId: number
  enableSnTrace: boolean
  useCustomTemplate: boolean
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface CooperpartnersPunterSaveDto {
  shipperCode: string
  shipperName: string
  shipperType: string
  settlementMethod: string
  contactName: string
  contactPhone: string
  deliveryAddress: string
  defaultWarehouseId: number
  enableSnTrace: boolean
  useCustomTemplate: boolean
  tenantId: string
}

export interface CooperpartnersPunterUpdateDto {
  id: number
  shipperCode: string
  shipperName: string
  shipperType: string
  settlementMethod: string
  contactName: string
  contactPhone: string
  deliveryAddress: string
  defaultWarehouseId: number
  enableSnTrace: boolean
  useCustomTemplate: boolean
  tenantId: string
}

const prefix = '/mdm/cooperpartners/punter'

/**
 * 通过主键获取客户/货主管理信息
 * getById
 * @param {*} id
 */
export const getCooperpartnersPunterById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取客户/货主管理信息
 * get
 * @param {*} query
 */
export const getCooperpartnersPunter = (query: CooperpartnersPunterDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取客户/货主管理列表
 * list
 * @param {*} query
 */
export const listOfCooperpartnersPunter = (query: CooperpartnersPunterDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取客户/货主管理分页
 * getPage
 * @param {*} query
 */
export const getCooperpartnersPunterPage = (query: CooperpartnersPunterDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除客户/货主管理信息
 * deleteById
 * @param {*} id
 */
export const deleteCooperpartnersPunterById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除客户/货主管理信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteCooperpartnersPunterByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增客户/货主管理
 * create
 * @param {*} data
 */
export const createCooperpartnersPunter = (data: CooperpartnersPunterSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改客户/货主管理信息
 * update
 * @param {*} data
 */
export const updateCooperpartnersPunter = (data: CooperpartnersPunterUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出客户/货主管理
 * export
 * @param {*} query
 */
export const exportCooperpartnersPunter = (query: CooperpartnersPunterDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
