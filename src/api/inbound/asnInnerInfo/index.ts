/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 14:21:09
 */
import request from '@/config/axios'

export interface AsnInnerInfoDto {
    id: number
    asnNo: string
    inboundType: string
    sourceOrderNo: string
    supplierCode: number
    supplierName: string
    expectedArrivalTime: Date
    status: string
    qcSchemeId: number
    putawayStrategyId: number
    remark: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface AsnInnerInfoPageDto extends AsnInnerInfoDto {
  materialCount:number,
  totalQty:number,
}


export interface AsnInnerInfoDetailDto {
  id: number
  asnNo: string
  inboundType: string
  sourceOrderNo: string
  supplierCode: number
  supplierName: string
  expectedArrivalTime: Date
  status: string
  qcSchemeId: number
  putawayStrategyId: number
  putawayStrategyName: string
  remark: string
  tenantId: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  materialList?: AsnInnerInfoItemSaveDto[]
}

export interface AsnInnerInfoSaveDto {
  id?: number
    asnNo: string
    inboundType: string
    sourceOrderNo: string
    supplierCode: string
    supplierName: string
    expectedArrivalTime: Date
    status: string
    qcSchemeId: string
    putawayStrategyId: string
    remark: string,
    materialList: AsnInnerInfoItemSaveDto[]
}

export interface AsnInnerInfoItemSaveDto {
  id?: number
  materialCode: string
  expectedQty: number
  actualQty?: number
  packageUnit: string
  batchNo?: string
}

export interface AsnInnerInfoReceiveDto {
  id: number
  asnNo: string
  completed?: boolean
  materialList: AsnInnerInfoItemSaveDto[]
}

export interface AsnInnerInfoUpdateDto {
    id: number
    asnNo: string
    inboundType: string
    sourceOrderNo: string
    supplierId: number
    supplierName: string
    expectedArrivalTime: Date
    status: string
    materialId: number
    materialCode: string
    expectedQty: number
    packageUnit: string
    batchNo: string
    qtyTolerancePercent: number
    qcSchemeId: number
    putawayStrategyId: number
    remark: string
    tenantId: string
}

const prefix = "/inbound/asnInnerInfo";

/**
 * 通过主键获取ASN到货预告单信息
 * getById
 * @param {*} id
 */
export const getAsnInnerInfoById = (id: number) => request.get({
    url: prefix + '/id/' + id
});


export const generateAsnNo = () => request.get({
    url: prefix + '/asnNo'
});


/**
 * 通过属性获取ASN到货预告单信息
 * get
 * @param {*} query
 */
export const getAsnInnerInfo = (query: AsnInnerInfoDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取ASN到货预告单列表
 * list
 * @param {*} query
 */
export const listOfAsnInnerInfo = (query: AsnInnerInfoDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取ASN到货预告单分页
 * getPage
 * @param {*} query
 */
export const getAsnInnerInfoPage = (query: AsnInnerInfoDto) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除ASN到货预告单信息
 * deleteById
 * @param {*} id
 */
export const deleteAsnInnerInfoById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除ASN到货预告单信息
* deleteByIds
* @param {*} ids
*/
export const deleteAsnInnerInfoByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增ASN到货预告单
 * create
 * @param {*} data
 */
export const createAsnInnerInfo = (data: AsnInnerInfoSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改ASN到货预告单信息
 * update
 * @param {*} data
 */
export const updateAsnInnerInfo = (data: AsnInnerInfoUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出ASN到货预告单
 * export
 * @param {*} query
 */
export const exportAsnInnerInfo = (query: AsnInnerInfoDto) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 确认收货
 * confirmReceive
 * @param {*} data
 */
export const confirmReceive = (data: AsnInnerInfoReceiveDto) => request.post({
    url: prefix + '/confirmReceive',
    data: data
});

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 获取入库类型列表
 */
export const listOfInboundType = () =>
  request.get({
    url: prefix + '/listOfInboundType'
  })

/**
 * 获取ASN单据状态列表
 */
export const listOfAsnStatus = () =>
  request.get({
    url: prefix + '/listOfAsnStatus'
  })
