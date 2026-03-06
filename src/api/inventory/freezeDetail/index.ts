/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-08 20:59:51
 */
import request from '@/config/axios'

export interface InventoryFreezeDetailDto {
    id: number
    freezeOrderId: number
    freezeOrderNo: string
    inventoryId: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    materialId: number
    materialCode: string
    materialName: string
    materialBatch: string
    freezeQty: number
    description: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface InventoryFreezeDetailSaveDto {
    freezeOrderId: number
    freezeOrderNo: string
    inventoryId: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    materialId: number
    materialCode: string
    materialName: string
    materialBatch: string
    freezeQty: number
    description: string
    tenantId: string
}

export interface InventoryFreezeDetailUpdateDto {
    id: number
    freezeOrderId: number
    freezeOrderNo: string
    inventoryId: number
    uniqueKeyId: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    materialId: number
    materialCode: string
    materialName: string
    materialBatch: string
    freezeQty: number
    description: string
    tenantId: string
}

const prefix = "/inventory/inventory/freeze/detail";

/**
 * 通过主键获取库存冻结单明细表信息
 * getById
 * @param {*} id
 */
export const getInventoryFreezeDetailById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取库存冻结单明细表信息
 * get
 * @param {*} query
 */
export const getInventoryFreezeDetail = (query: InventoryFreezeDetailDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取库存冻结单明细表列表
 * list
 * @param {*} query
 */
export const listOfInventoryFreezeDetail = (query: InventoryFreezeDetailDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取库存冻结单明细表分页
 * getPage
 * @param {*} query
 */
export const getInventoryFreezeDetailPage = (query: InventoryFreezeDetailDto) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除库存冻结单明细表信息
 * deleteById
 * @param {*} id
 */
export const deleteInventoryFreezeDetailById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除库存冻结单明细表信息
* deleteByIds
* @param {*} ids
*/
export const deleteInventoryFreezeDetailByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增库存冻结单明细表
 * create
 * @param {*} data
 */
export const createInventoryFreezeDetail = (data: InventoryFreezeDetailSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改库存冻结单明细表信息
 * update
 * @param {*} data
 */
export const updateInventoryFreezeDetail = (data: InventoryFreezeDetailUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出库存冻结单明细表
 * export
 * @param {*} query
 */
export const exportInventoryFreezeDetail = (query: InventoryFreezeDetailDto) => request.download({
    url: prefix + '/exportData',
    params: query
});
