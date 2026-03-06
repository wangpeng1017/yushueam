/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-19 16:47:27
 */
import request from '@/config/axios'

export interface WarehouseLocationDto {
    id: number
    factoryId: number
    warehouseId: number
    areaId: number
    locationCode: string
    locationName: string
    locationType: string
    status: boolean
    storageAttributes: string[]
    maxCapacity: number
    minCapacity: number
    lengthMm: number
    widthMm: number
    heightMm: number
    loadCapacityKg: number
    storageEnvironment: string
    storageLevel: string
    pickingType: string
    aisle: string
    row: string
    column: string
    level: string
    xCoordinate: string
    yCoordinate: string
    zCoordinate: string
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

export interface WarehouseLocationSaveDto {
    factoryId: number
    warehouseId: number
    areaId: number
    locationCode: string
    locationName: string
    locationType: string
    status: boolean
    storageAttributes: string[]
    maxCapacity: number
    minCapacity: number
    lengthMm: number
    widthMm: number
    heightMm: number
    loadCapacityKg: number
    storageEnvironment: string
    storageLevel: string
    pickingType: string
    aisle: string
    row: string
    column: string
    level: string
    xCoordinate: string
    yCoordinate: string
    zCoordinate: string
    enableDate: Date
    disableDate: Date
    description: string
    tenantId: string
}

export interface WarehouseLocationUpdateDto {
    id: number
    factoryId: number
    warehouseId: number
    areaId: number
    locationCode: string
    locationName: string
    locationType: string
    status: number
    storageAttributes: string[]
    maxCapacity: number
    minCapacity: number
    lengthMm: number
    widthMm: number
    heightMm: number
    loadCapacityKg: number
    storageEnvironment: string
    storageLevel: string
    pickingType: string
    aisle: string
    row: string
    column: string
    level: string
    xCoordinate: string
    yCoordinate: string
    zCoordinate: string
    enableDate: Date
    disableDate: Date
    description: string
    tenantId: string
}

const prefix = "/mdm/warehouse/location";

/**
 * 通过主键获取库位管理信息
 * getById
 * @param {*} id
 */
export const getWarehouseLocationById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取库位管理信息
 * get
 * @param {*} query
 */
export const getWarehouseLocation = (query: WarehouseLocationDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取库位管理列表
 * list
 * @param {*} query
 */
export const listOfWarehouseLocation = (query: WarehouseLocationDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取库位管理分页
 * getPage
 * @param {*} query
 */
export const getWarehouseLocationPage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除库位管理信息
 * deleteById
 * @param {*} id
 */
export const deleteWarehouseLocationById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除库位管理信息
* deleteByIds
* @param {*} ids
*/
export const deleteWarehouseLocationByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByids',
    data: ids
});

/**
 * 新增库位管理
 * create
 * @param {*} data
 */
export const createWarehouseLocation = (data: WarehouseLocationSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改库位管理信息
 * update
 * @param {*} data
 */
export const updateWarehouseLocation = (data: WarehouseLocationUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出库位管理
 * export
 * @param {*} query
 */
export const exportWarehouseLocation = (query: any) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 获取拣货属性列表
 * listOfLocationStatus
 */
export const listOfLocationStatus = () => request.get({
    url: prefix + '/listOfLocationStatus'
});

/**
 * 获取库位状态列表
 * listOfPickingType
 */
export const listOfPickingType = () => request.get({
    url: prefix + '/listOfPickingType'
});

/**
 * 获取存储等级列表
 * listOfStorageLevel
 */
export const listOfStorageLevel = () => request.get({
    url: prefix + '/listOfStorageLevel'
});

/**
 * 获取库位类型列表
 * listOfLocationType
 */
export const listOfLocationType = () => request.get({
    url: prefix + '/listOfLocationType'
});