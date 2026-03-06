/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import request from '@/config/axios'

export interface EnumEntity {
    value: string
    desc?: string
    text: string
}

export interface MaterialPackageUnitDto {
    id: number
    packageId: string
    unitType: string
    unitCode: string
    conversionRatio: number
    lengthMm: number
    widthMm: number
    heightMm: number
    weightKg: number
    volumeM3: number
    barcodeType: string
    allowDisassemble: boolean
    isDefaultReceiving: boolean
    isDefaultShipping: boolean
    level: number
    parentUnitId: string
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface MaterialPackageUnitSaveDto {
    packageId: string
    unitType: string
    unitCode: string
    conversionRatio: number
    lengthMm: number
    widthMm: number
    heightMm: number
    weightKg: number
    volumeM3: number
    barcodeType: string
    allowDisassemble: boolean
    isDefaultReceiving: boolean
    isDefaultShipping: boolean
    level: number
    parentUnitId: string
    description: string
    tenantId: string
}

export interface MaterialPackageUnitUpdateDto {
    id: number
    packageId: string
    unitType: string
    unitCode: string
    conversionRatio: number
    lengthMm: number
    widthMm: number
    heightMm: number
    weightKg: number
    volumeM3: number
    barcodeType: string
    allowDisassemble: boolean
    isDefaultReceiving: boolean
    isDefaultShipping: boolean
    level: number
    parentUnitId: string
    description: string
    tenantId: string
}

const prefix = "/material/material/package/unit";

/**
 * 通过主键获取物料包装单元定义信息
 * getById
 * @param {*} id
 */
export const getMaterialPackageUnitById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取物料包装单元定义信息
 * get
 * @param {*} query
 */
export const getMaterialPackageUnit = (query: MaterialPackageUnitDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取物料包装单元定义列表
 * list
 * @param {*} query
 */
export const listOfMaterialPackageUnit = (query: MaterialPackageUnitDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取物料包装单元定义列表 (联合查询)
 * listMaterialPackageUnit
 * @param {*} query
 */
export const listMaterialPackageUnit = (query: any) => request.post({
    url: '/material/material/package/unit/listMaterialPackageUnit',
    data: query
});

/**
 * 获取物料包装单元定义分页
 * getPage
 * @param {*} query
 */
export const getMaterialPackageUnitPage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除物料包装单元定义信息
 * deleteById
 * @param {*} id
 */
export const deleteMaterialPackageUnitById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除物料包装单元定义信息
* deleteByIds
* @param {*} ids
*/
export const deleteMaterialPackageUnitByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增物料包装单元定义
 * create
 * @param {*} data
 */
export const createMaterialPackageUnit = (data: MaterialPackageUnitSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改物料包装单元定义信息
 * update
 * @param {*} data
 */
export const updateMaterialPackageUnit = (data: MaterialPackageUnitUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出物料包装单元定义
 * export
 * @param {*} query
 */
export const exportMaterialPackageUnit = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 获取物料管理状态列表
 * listOfStatus
 */
export const listOfPackageUnitType = () => request.get({
    url: prefix + '/listOfPackageUnitType'
});

/**
 * 获取物料包装单元条码类型列表
 * listOfPackageBarcodeType
 */
export const listOfPackageBarcodeType = () => request.get({
    url: prefix + '/listOfPackageBarcodeType'
});

/**
 * 获取物料包装单元允许拆卸列表
 * listOfPackageAllowDisassemble
 */
export const listOfPackageAllowDisassemble = () => request.get({
    url: prefix + '/listOfPackageAllowDisassemble'
});
/**
 * 获取物料包装单元默认收货列表
 * listOfPackageDefaultReceiving
 */ 
export const listOfPackageDefaultReceiving = () => request.get({
    url: prefix + '/listOfPackageDefaultReceiving'
});
/**
 * 获取物料包装单元默认发货列表
 * listOfPackageDefaultShipping
 */
export const listOfPackageDefaultShipping = () => request.get({
    url: prefix + '/listOfPackageDefaultShipping'
});
