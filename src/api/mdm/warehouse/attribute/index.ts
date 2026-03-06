/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import request from '@/config/axios'

export interface WarehouseAttributeDto {
    id: number
    warehouseId: string
    attributeName: string
    storageEnvironment: string
    storageUnitPreference: string
    materialType: string
    inventoryTurnoverFeature: string
    cleanlinessLevel: string
    securityLevel: string
    operationMode: string
    operationTime: string
    maxStorageCapacity: number
    inventoryCyclePeriod: string
    fireSafetyLevel: string
    deptId: number
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface WarehouseAttributeSaveDto {
    warehouseId: string
    attributeName: string
    storageEnvironment: string
    storageUnitPreference: string
    materialType: string
    inventoryTurnoverFeature: string
    cleanlinessLevel: string
    securityLevel: string
    operationMode: string
    operationTime: string
    maxStorageCapacity: number
    inventoryCyclePeriod: string
    fireSafetyLevel: string
    deptId: number
    description: string
    tenantId: string
}

export interface WarehouseAttributeUpdateDto {
    id: number
    warehouseId: string
    attributeName: string
    storageEnvironment: string
    storageUnitPreference: string
    materialType: string
    inventoryTurnoverFeature: string
    cleanlinessLevel: string
    securityLevel: string
    operationMode: string
    operationTime: string
    maxStorageCapacity: number
    inventoryCyclePeriod: string
    fireSafetyLevel: string
    deptId: number
    description: string
    tenantId: string
}

const prefix = "/mdm/warehouse/attribute";

/**
 * 通过主键获取仓库属性管理信息
 * getById
 * @param {*} id
 */
export const getWarehouseAttributeById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取仓库属性管理信息
 * get
 * @param {*} query
 */
export const getWarehouseAttribute = (query: WarehouseAttributeDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取仓库属性管理列表
 * list
 * @param {*} query
 */
export const listOfWarehouseAttribute = (query: WarehouseAttributeDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取仓库属性管理分页
 * getPage
 * @param {*} query
 */
export const getWarehouseAttributePage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除仓库属性管理信息
 * deleteById
 * @param {*} id
 */
export const deleteWarehouseAttributeById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除仓库属性管理信息
* deleteByIds
* @param {*} ids
*/
export const deleteWarehouseAttributeByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增仓库属性管理
 * create
 * @param {*} data
 */
export const createWarehouseAttribute = (data: WarehouseAttributeSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改仓库属性管理信息
 * update
 * @param {*} data
 */
export const updateWarehouseAttribute = (data: WarehouseAttributeUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出仓库属性管理
 * export
 * @param {*} query
 */
export const exportWarehouseAttribute = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 获取仓库排查周期
 * listOfCheckCyclePeriod
 */
export const listOfCheckCyclePeriod = () => request.get({
    url: prefix + '/listOfCheckCyclePeriod'
});

/**
 * 获取仓库清洁度等级
 * listOfCleanlinessLevel
 */
export const listOfCleanlinessLevel = () => request.get({
    url: prefix + '/listOfCleanlinessLevel'
});

/**
 * 获取仓库防火安全等级
 * listOfFireSafetyLevel
 */
export const listOfFireSafetyLevel = () => request.get({
    url: prefix + '/listOfFireSafetyLevel'
});

/**
 * 获取仓库安全等级
 * listOfSecurityLevel
 */
export const listOfSecurityLevel = () => request.get({
    url: prefix + '/listOfSecurityLevel'
});

/**
 * 获取仓库库存周转特征
 * listOfTurnoverFeature
 */
export const listOfTurnoverFeature = () => request.get({
    url: prefix + '/listOfTurnoverFeature'
});
