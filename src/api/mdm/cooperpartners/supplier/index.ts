/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-20 15:37:08
 */
import request from '@/config/axios'

export interface CooperpartnersSupplierDto {
  id: number
  supplierCode: string
  supplierName: string
  supplierType: string
  evalLevel: string
  cooperationStatus: string
  paymentTerm: string
  primaryContact: string
  contactPhone: string
  bankInfo: string
  recentQualifiedRate: number
  recentOtdRate: number
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface CooperpartnersSupplierSaveDto {
  supplierCode: string
  supplierName: string
  supplierType: string
  evalLevel: string
  cooperationStatus: string
  paymentTerm: string
  primaryContact: string
  contactPhone: string
  bankInfo: string
  recentQualifiedRate: number
  recentOtdRate: number
  tenantId: string
}

export interface CooperpartnersSupplierUpdateDto {
  id: number
  supplierCode: string
  supplierName: string
  supplierType: string
  evalLevel: string
  cooperationStatus: string
  paymentTerm: string
  primaryContact: string
  contactPhone: string
  bankInfo: string
  recentQualifiedRate: number
  recentOtdRate: number
  tenantId: string
}

const prefix = '/mdm/cooperpartners/supplier'

/**
 * 通过主键获取供应商管理信息
 * getById
 * @param {*} id
 */
export const getCooperpartnersSupplierById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过属性获取供应商管理信息
 * get
 * @param {*} query
 */
export const getCooperpartnersSupplier = (query: CooperpartnersSupplierDto) =>
  request.post({
    url: prefix + '/get',
    data: query
  })

/**
 * 获取供应商管理列表
 * list
 * @param {*} query
 */
export const listOfCooperpartnersSupplier = (query: CooperpartnersSupplierDto) =>
  request.post({
    url: prefix + '/list',
    data: query
  })

/**
 * 获取供应商管理分页
 * getPage
 * @param {*} query
 */
export const getCooperpartnersSupplierPage = (query: CooperpartnersSupplierDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 删除供应商管理信息
 * deleteById
 * @param {*} id
 */
export const deleteCooperpartnersSupplierById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除供应商管理信息
 * deleteByIds
 * @param {*} ids
 */
export const deleteCooperpartnersSupplierByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 新增供应商管理
 * create
 * @param {*} data
 */
export const createCooperpartnersSupplier = (data: CooperpartnersSupplierSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 修改供应商管理信息
 * update
 * @param {*} data
 */
export const updateCooperpartnersSupplier = (data: CooperpartnersSupplierUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 导出供应商管理
 * export
 * @param {*} query
 */
export const exportCooperpartnersSupplier = (query: CooperpartnersSupplierDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })
