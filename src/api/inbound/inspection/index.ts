/**
 * Copyright (c) 2025-2026
 * Quality Inspection Record API
 * Since 2026-02-06
 */
import request from '@/config/axios'
import type {
  InspectionOrderDto,
  InspectionOrderPageDto,
  InspectionOrderSaveDto,
  InspectionOrderUpdateDto,
  InspectionOrderVo,
  QmsSyncQueryDto,
  QmsSyncResultVo
} from '@/types/inbound/inspection'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

const prefix = '/inbound/inspectionOrder'

/**
 * 分页查询检验记录
 * @param query 分页查询参数
 */
export const getInspectionOrderPage = (query: InspectionOrderPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 通过主键获取检验记录详情(包含检验项目明细)
 * @param id 检验单ID
 */
export const getInspectionOrderById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

/**
 * 通过主键获取检验记录详情(别名方法)
 * @param id 检验单ID
 */
export const getInspectionOrder = (id: number) => getInspectionOrderById(id)

/**
 * 创建检验记录
 * @param data 检验单保存数据
 */
export const createInspectionOrder = (data: InspectionOrderSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * 更新检验记录
 * @param data 检验单更新数据
 */
export const updateInspectionOrder = (data: InspectionOrderUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * 删除检验记录(软删除)
 * @param id 检验单ID
 */
export const deleteInspectionOrderById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * 批量删除检验记录
 * @param ids 检验单ID数组
 */
export const deleteInspectionOrderByIds = (ids: number[]) =>
  request.post({
    url: prefix + '/deleteByIds',
    data: ids
  })

/**
 * 生成检验单号
 */
export const generateInspectionNo = () =>
  request.get({
    url: prefix + '/inspectionNo'
  })

/**
 * 上传检验报告文件
 * @param id 检验单ID
 * @param file 文件对象
 */
export const uploadInspectionReport = (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post({
    url: prefix + '/' + id + '/report',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 下载检验报告文件
 * @param id 检验单ID
 */
export const downloadInspectionReport = (id: number) =>
  request.download({
    url: prefix + '/' + id + '/report'
  })

/**
 * 从QMS系统同步检验记录
 * @param query QMS同步查询条件
 */
export const syncFromQms = (query: QmsSyncQueryDto) =>
  request.post({
    url: prefix + '/sync-from-qms',
    data: query
  })

/**
 * 导出检验记录
 * @param query 查询条件
 */
export const exportInspectionOrder = (query: InspectionOrderDto) =>
  request.download({
    url: prefix + '/exportData',
    params: query
  })

/**
 * 获取检验类型列表
 */
export const listOfInspectionType = () =>
  request.get({
    url: prefix + '/listOfInspectionType'
  })

/**
 * 获取检验结果列表
 */
export const listOfInspectionResult = () =>
  request.get({
    url: prefix + '/listOfInspectionResult'
  })

/**
 * 获取判定结果列表
 */
export const listOfJudgeResult = () =>
  request.get({
    url: prefix + '/listOfJudgeResult'
  })

/**
 * 获取单据状态列表
 */
export const listOfOrderStatus = () =>
  request.get({
    url: prefix + '/listOfOrderStatus'
  })

/**
 * 获取来源单据类型列表
 */
export const listOfSourceOrderType = () =>
  request.get({
    url: prefix + '/listOfSourceOrderType'
  })
