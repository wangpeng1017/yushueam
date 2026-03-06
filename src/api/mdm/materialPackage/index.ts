/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 17:20:18
 */
import request from '@/config/axios'

export interface MaterialPackageDto {
    id: number
    packageName: string
    materialId: number
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface MaterialPackageSaveDto {
    packageName: string
    materialId: number
    description: string
    tenantId?: string
    materialPackageUnitList: MaterialPackageUnitSaveDto[]
}

export interface MaterialPackageUpdateDto {
    id: number
    packageName: string
    materialId: number
    description: string
    tenantId?: string
    materialPackageUnitList: MaterialPackageUnitSaveDto[]
}

export interface MaterialPackageUnitSaveDto {
    unitType: string
    unitCode: string
    conversionRatio: number
    lengthMm?: number
    widthMm?: number
    heightMm?: number
    weightKg?: number
    volumeM3?: number
    barcodeType?: string
    allowDisassemble?: boolean
    isDefaultReceiving?: boolean
    isDefaultShipping?: boolean
    level: number
    description?: string
}

const prefix = "/material/material/package";

/**
 * 通过主键获取物料包装层级主信息信息
 * getById
 * @param {*} id
 */
export const getMaterialPackageById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取物料包装层级主信息信息
 * get
 * @param {*} query
 */
export const getMaterialPackage = (query: MaterialPackageDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取物料包装层级主信息列表
 * list
 * @param {*} query
 */
export const listOfMaterialPackage = (query: MaterialPackageDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取物料包装层级主信息分页
 * getPage
 * @param {*} query
 */
export const getMaterialPackagePage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除物料包装层级主信息信息
 * deleteById
 * @param {*} id
 */
export const deleteMaterialPackageById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除物料包装层级主信息信息
* deleteByIds
* @param {*} ids
*/
export const deleteMaterialPackageByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增物料包装层级主信息
 * create
 * @param {*} data
 */
export const createMaterialPackage = (data: MaterialPackageSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改物料包装层级主信息信息
 * update
 * @param {*} data
 */
export const updateMaterialPackage = (data: MaterialPackageUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 校验物料是否已存在包装层级配置
 * validateMaterialPackageExists
 * @param {*} materialId
 */
export const validateMaterialPackageExists = (materialId: number) => request.get({
    url: prefix + '/validate/material/' + materialId
});

/**
 * 导出物料包装层级主信息
 * export
 * @param {*} query
 */
export const exportMaterialPackage = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});
