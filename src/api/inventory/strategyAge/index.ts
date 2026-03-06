/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-02-09 13:42:52
 */
import request from '@/config/axios'

export interface StrategyAgeDto {
    id: number
    strategyCode: string
    strategyName: string
    materialCategory: string
    startPoint: string
    workAssign: string
    warningThreshold: number
    invalidThreshold: number
    freezeFlag: string
    status: string
    remark: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface StrategyAgeSaveDto {
    strategyCode: string
    strategyName: string
    materialCategory: string
    startPoint: string
    workAssign: string
    warningThreshold: number
    invalidThreshold: number
    freezeFlag: string
    status: string
    remark: string
    tenantId: string
}

export interface StrategyAgeUpdateDto {
    id: number
    strategyCode: string
    strategyName: string
    materialCategory: string
    startPoint: string
    workAssign: string
    warningThreshold: number
    invalidThreshold: number
    freezeFlag: string
    status: string
    remark: string
    tenantId: string
}

const prefix = "/inventory/strategy/age";

/**
 * 通过主键获取库龄规则配置信息
 * getById
 * @param {*} id
 */
export const getStrategyAgeById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 通过属性获取库龄规则配置信息
 * get
 * @param {*} query
 */
export const getStrategyAge = (query: StrategyAgeDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取库龄规则配置列表
 * list
 * @param {*} query
 */
export const listOfStrategyAge = (query: StrategyAgeDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取库龄规则配置分页
 * getPage
 * @param {*} query
 */
export const getStrategyAgePage = (query: StrategyAgeDto) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 删除库龄规则配置信息
 * deleteById
 * @param {*} id
 */
export const deleteStrategyAgeById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除库龄规则配置信息
* deleteByIds
* @param {*} ids
*/
export const deleteStrategyAgeByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增库龄规则配置
 * create
 * @param {*} data
 */
export const createStrategyAge = (data: StrategyAgeSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改库龄规则配置信息
 * update
 * @param {*} data
 */
export const updateStrategyAge = (data: StrategyAgeUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出库龄规则配置
 * export
 * @param {*} query
 */
export const exportStrategyAge = (query: StrategyAgeDto) => request.download({
    url: prefix + '/exportData',
    params: query
});
