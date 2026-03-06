/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import request from '@/config/axios'

export interface WarehouseDto {
    id: number
    factoryId: number
    warehouseCode: string
    warehouseName: string
    warehouseType: string
    storageType: string
    status: boolean
    address: string
    contactPerson: string
    contactPhone: string
    size: number
    capacity: number
    enableDate: Date
    disableDate: Date
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface WarehouseSaveDto {
    factoryId: number
    warehouseCode: string
    warehouseName: string
    warehouseType: string
    storageType: string
    status: number
    address: string
    contactPerson: string
    contactPhone: string
    size: number
    capacity: number
    enableDate: Date
    disableDate: Date
    description: string
    tenantId: string
}

export interface WarehouseUpdateDto {
    id: number
    factoryId: number
    warehouseCode: string
    warehouseName: string
    warehouseType: string
    storageType: string
    status: boolean
    address: string
    contactPerson: string
    contactPhone: string
    size: number
    capacity: number
    enableDate: Date
    disableDate: Date
    description: string
    tenantId: string
}

const prefix = "/mdm/warehouse";

/**
 * 通过主键获取仓库管理信息
 * getById
 * @param {*} id
 */
export const getWarehouseById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取仓库管理信息
 * get
 * @param {*} query
 */
export const getWarehouse = (query: WarehouseDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取仓库管理列表
 * list
 * @param {*} query
 */
export const listOfWarehouse = (query: WarehouseDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取仓库管理分页
 * getPage
 * @param {*} query
 */
export const getWarehousePage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除仓库管理信息
 * deleteById
 * @param {*} id
 */
export const deleteWarehouseById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除仓库管理信息
* deleteByIds
* @param {*} ids
*/
export const deleteWarehouseByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByids',
    data: ids
});

/**
 * 新增仓库管理
 * create
 * @param {*} data
 */
export const createWarehouse = (data: WarehouseSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改仓库管理信息
 * update
 * @param {*} data
 */
export const updateWarehouse = (data: WarehouseUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出仓库管理
 * export
 * @param {*} query
 */
export const exportWarehouse = (params: any) => request.download({
    url: prefix + '/exportData',
    params
});

/**
 * 获取仓库存储类型列表
 * listOfStorageType
 */
export const listOfStorageType = () => request.get({
    url: prefix + '/listOfStorageType'
});

/**
 * 获取仓库类型列表
 * listOfType
 */
export const listOfType = () => request.get({
    url: prefix + '/listOfType'
});

/**
 * 获取仓库状态列表
 * listOfStatus
 */
export const listOfStatus = () => request.get({
    url: prefix + '/listOfStatus'
});