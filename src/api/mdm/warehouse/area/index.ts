/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import request from '@/config/axios'

export interface WarehouseAreaDto {
    id: number
    factoryId: number
    warehouseId: number
    areaCode: string
    areaName: string
    abcClass: string
    areaType: string
    status: boolean
    areaAttributes: string[]
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface WarehouseAreaSaveDto {
    factoryId: number
    warehouseId: number
    areaCode: string
    areaName: string
    abcClass: string
    areaType: string
    status: number
    areaAttributes: string[]
    description: string
    tenantId: string
}

export interface WarehouseAreaUpdateDto {
    id: number
    factoryId: number
    warehouseId: number
    areaCode: string
    areaName: string
    abcClass: string
    areaType: string
    status: number
    areaAttributes: string[]
    description: string
    tenantId: string
}

const prefix = "/mdm/warehouse/area";

/**
 * 通过主键获取库区管理信息
 * getById
 * @param {*} id
 */
export const getWarehouseAreaById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取库区管理信息
 * get
 * @param {*} query
 */
export const getWarehouseArea = (query: WarehouseAreaDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取库区管理列表
 * list
 * @param {*} query
 */
export const listOfWarehouseArea = (query: WarehouseAreaDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取库区管理分页
 * getPage
 * @param {*} query
 */
export const getWarehouseAreaPage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除库区管理信息
 * deleteById
 * @param {*} id
 */
export const deleteWarehouseAreaById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除库区管理信息
* deleteByIds
* @param {*} ids
*/
export const deleteWarehouseAreaByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByids',
    data: ids
});

/**
 * 新增库区管理
 * create
 * @param {*} data
 */
export const createWarehouseArea = (data: WarehouseAreaSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改库区管理信息
 * update
 * @param {*} data
 */
export const updateWarehouseArea = (data: WarehouseAreaUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出库区管理
 * export
 * @param {*} query
 */
export const exportWarehouseArea = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 获取仓库库区类型列表
 * listOfType
 */
export const listOfAreaType = () => request.get({
    url: prefix + '/listOfAreaType'
});

/**
 * 获取仓库库区状态列表
 * listOfStatus
 */
export const listOfStatus = () => request.get({
    url: prefix + '/listOfStatus'
});

/**
 * 获取库区ABC分类列表
 * listOfAbcClass
 */
export const listOfAbcClass = () => request.get({
    url: prefix + '/listOfAbcClass'
});
