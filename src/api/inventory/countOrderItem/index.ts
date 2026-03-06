/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-02 15:28:38
 */
import request from '@/config/axios'

export interface CountOrderItemDto {
    id: number
    countOrderId: number
    countOrder: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
    countQty: number
    countStatus: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface CountOrderItemSaveDto {
    countOrderId: number
    countOrder: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
    countQty: number
    countStatus: string
    tenantId: string
}

export interface CountOrderItemUpdateDto {
    id: number
    countOrderId: number
    countOrder: string
    warehouseId: number
    warehouseAreaId: number
    warehousePlaceId: number
    supplierId: number
    materialId: number
    materialCode: string
    materialName: string
    materialProducedDate: Date
    materialStatus: string
    materialBatch: string
    qty: number
    usableQty: number
    blockedQty: number
    transitQty: number
    occupyQty: number
    indateStatus: boolean
    indateExpireTime: Date
    countQty: number
    countStatus: string
    tenantId: string
}

const prefix = "/inventory/count/order/item";

/**
 * 通过主键获取盘点单明细信息
 * getById
 * @param {*} id
 */
export const getCountOrderItemById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取盘点单明细信息
 * get
 * @param {*} query
 */
export const getCountOrderItem = (query: CountOrderItemDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取盘点单明细列表
 * list
 * @param {*} query
 */
export const listOfCountOrderItem = (query: CountOrderItemDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取盘点单明细分页
 * getPage
 * @param {*} query
 */
export const getCountOrderItemPage = (query: CountOrderItemDto) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除盘点单明细信息
 * deleteById
 * @param {*} id
 */
export const deleteCountOrderItemById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除盘点单明细信息
* deleteByIds
* @param {*} ids
*/
export const deleteCountOrderItemByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByids',
    data: ids
});

/**
 * 新增盘点单明细
 * create
 * @param {*} data
 */
export const createCountOrderItem = (data: CountOrderItemSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改盘点单明细信息
 * update
 * @param {*} data
 */
export const updateCountOrderItem = (data: CountOrderItemUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出盘点单明细
 * export
 * @param {*} query
 */
export const exportCountOrderItem = (query: CountOrderItemDto) => request.download({
    url: prefix + '/exportData',
    params: query
});
