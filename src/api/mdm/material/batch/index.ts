/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import request from '@/config/axios'

export interface MaterialBatchDto {
    id: number
    materialId: string
    batchRule: string
    batchRuleId: number
    batchAttributeGroup: string
    productionDate: boolean
    expiryDate: boolean
    supplierBatchNo: boolean
    inboundDate: boolean
    inventoryStatus: boolean
    specification: boolean
    supplierId: boolean
    purchaseOrderNo: boolean
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface MaterialBatchSaveDto {
    materialId: string
    batchRule: string
    batchRuleId: number
    batchAttributeGroup: string
    productionDate: boolean
    expiryDate: boolean
    supplierBatchNo: boolean
    inboundDate: boolean
    inventoryStatus: boolean
    specification: boolean
    supplierId: boolean
    purchaseOrderNo: boolean
    tenantId: string
}

export interface MaterialBatchUpdateDto {
    id: number
    materialId: string
    batchRule: string
    batchRuleId: number
    batchAttributeGroup: string
    productionDate: boolean
    expiryDate: boolean
    supplierBatchNo: boolean
    inboundDate: boolean
    inventoryStatus: boolean
    specification: boolean
    supplierId: boolean
    purchaseOrderNo: boolean
    tenantId: string
}

const prefix = "/mdm/material/batch";

/**
 * 通过主键获取物料批次管理信息
 * getById
 * @param {*} id
 */
export const getMaterialBatchById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取物料批次管理信息
 * get
 * @param {*} query
 */
export const getMaterialBatch = (query: MaterialBatchDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取物料批次管理列表
 * list
 * @param {*} query
 */
export const listOfMaterialBatch = (query: MaterialBatchDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取物料批次管理分页
 * getPage
 * @param {*} query
 */
export const getMaterialBatchPage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除物料批次管理信息
 * deleteById
 * @param {*} id
 */
export const deleteMaterialBatchById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除物料批次管理信息
* deleteByIds
* @param {*} ids
*/
export const deleteMaterialBatchByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增物料批次管理
 * create
 * @param {*} data
 */
export const createMaterialBatch = (data: MaterialBatchSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改物料批次管理信息
 * update
 * @param {*} data
 */
export const updateMaterialBatch = (data: MaterialBatchUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出物料批次管理
 * export
 * @param {*} query
 */
export const exportMaterialBatch = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 获取物料管理状态列表
 * listOfStatus
 */
export const listOfStatus = () => request.get({
    url: prefix + '/listOfBatchStatus'
});

/**
 * 获取物料批次管理规则列表
 * listOfBatchRule
 */
export const listOfBatchRule = () => request.get({
    url: prefix + '/listOfBatchRule'
});

/**
 * 切换物料批次管理状态
 * toggleStatusById
 * @param {*} id
 */
export const toggleMaterialBatchStatusById = (id: number) => request.post({
    url: prefix + '/toggleStatus/' + id
});

/**
 * 校验物料是否已存在批次配置
 * validateMaterial
 * @param {*} materialId
 * @param {*} excludeId
 */
export const validateMaterial = (materialId: number, excludeId?: number) => request.get({
    url: prefix + '/validateMaterial/' + materialId,
    params: excludeId ? { excludeId } : {}
});

/**
 * 生成批次号
 * generateBatchNo
 * @param {*} materialId
 */
export const generateBatchNo = (materialId: number) => request.get({
    url: prefix + '/generateBatchNo/' + materialId
});
