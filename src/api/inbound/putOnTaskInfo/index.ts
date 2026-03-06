/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-20 17:11:46
 */
import request from '@/config/axios'
import { AsnInnerInfoItemSaveDto } from '../asnInnerInfo'

export interface PutOnTaskInfoDto {
    id: number
    taskCode: string
    bizCode: string
    taskType: string
    materialCode: string
    expectedOnQty: number
    actualOnQty: number
    packageUnit: string
    batchNo: string
    targetLocation: string
    executorId: number
    executorName: string
    status: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
    deleted: boolean
}

export interface PutOnTaskInfoSaveDto {
    taskCode: string
    bizCode: string
    taskType: string
    materialCode: string
    expectedOnQty: number
    actualOnQty: number
    packageUnit: string
    batchNo: string
    targetLocation: string
    executorId: number
    executorName: string
    status: string
    tenantId: string
}

export interface PutOnTaskInfoUpdateDto {
    id: number
    taskCode: string
    bizCode: string
    taskType: string
    materialCode: string
    expectedOnQty: number
    actualOnQty: number
    packageUnit: string
    batchNo: string
    targetLocation: string
    executorId: number
    executorName: string
    status: string
    tenantId: string
}

export interface PutOnTaskInfoAssignDto {
    taskId: number
    executorId: number
    executorName: string
}

export interface PutOnTaskInfoExecuteDto {
    taskId: number
    actualOnQty: number
    actualLocation: string
}

export interface PutOnTaskStatisticsVo {
    pendingCount: number
    todayCompletedCount: number
    errorCount: number
}


export interface NotGenerateTaskMaterialDto extends AsnInnerInfoItemSaveDto {
    asnNo?: string
    inboundType?: string
    status: string
    supplierCode: string
    supplierName: string
    materialName: string
}

const prefix = "/inbound/putOnTaskInfo";
const execute_prefix = "/inbound/putOnTaskExecute";

/**
 * 通过主键获取上架任务信息信息
 * getById
 * @param {*} id
 */
export const getPutOnTaskInfoById = (id: number) => request.get({
    url: prefix + '/id/' + id
});


export const pageNotGenerate = (params?: any) => request.get({
    url: prefix + '/pageNotGenerate',
  params
});

/**
 * 通过属性获取上架任务信息信息
 * get
 * @param {*} query
 */
export const getPutOnTaskInfo = (query: PutOnTaskInfoDto) => request.post({
    url: prefix + '/get',
    data: query
});


/**
 * 获取上架任务信息列表
 * list
 * @param {*} query
 */
export const listOfPutOnTaskInfo = (query: PutOnTaskInfoDto) => request.post({
    url: prefix + '/list',
    data: query
});

/**
 * 获取上架任务信息分页
 * getPage
 * @param {*} query
 */
export const getPutOnTaskInfoPage = (query: PutOnTaskInfoDto) => request.post({
    url: prefix + '/page',
    data: query
});


export const getPutOnTaskExecuteInfoPage = (query: PutOnTaskInfoDto) => request.post({
  url: execute_prefix + '/page',
  data: query
});

/**
 * 删除上架任务信息信息
 * deleteById
 * @param {*} id
 */
export const deletePutOnTaskInfoById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
* 批量删除上架任务信息信息
* deleteByIds
* @param {*} ids
*/
export const deletePutOnTaskInfoByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 新增上架任务信息
 * create
 * @param {*} data
 */
export const createPutOnTaskInfo = (data: PutOnTaskInfoSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改上架任务信息信息
 * update
 * @param {*} data
 */
export const updatePutOnTaskInfo = (data: PutOnTaskInfoUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 导出上架任务信息
 * export
 * @param {*} query
 */
export const exportPutOnTaskInfo = (query: PutOnTaskInfoDto) => request.download({
    url: prefix + '/exportData',
    params: query
});

/**
 * 批量生成上架任务
 * batchGenerateTask
 * @param {*} materials
 */
export const batchGenerateTask = (materials:{asnInfoItemIdList:number[],taskType?:string}) => request.post({
    url: prefix + '/generateTask',
    data: materials
});

/**
 * 分配上架任务
 * assignTask
 * @param {*} data
 */
export const assignTask = (data: PutOnTaskInfoAssignDto) => request.post({
    url: prefix + '/assign',
    data: data
});

/**
 * 强制完成上架任务
 * forceComplete
 * @param {*} id
 */
export const forceComplete = (id: number) => request.post({
    url: prefix + '/forceComplete/' + id
});

/**
 * 执行上架任务
 * executePutOn
 * @param {*} data
 */
export const executePutOn = (data: PutOnTaskInfoExecuteDto) => request.post({
    url: '/inbound/putOnTaskExecute/execute',
    data: data
});

/**
 * 获取上架任务统计数据
 * getStatistics
 */
export const getStatistics = (): Promise<PutOnTaskStatisticsVo> => request.get({
    url: '/inbound/putOnTaskExecute/statistics'
});

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 获取上架任务状态列表
 */
export const listOfPutOnTaskStatus = () =>
  request.get({
    url: prefix + '/listOfPutOnTaskStatus'
  })

/**
 * 获取上架任务类型列表
 */
export const listOfPutOnTaskType = () =>
  request.get({
    url: prefix + '/listOfPutOnTaskType'
  })

/**
 * 获取上架任务执行状态列表
 */
export const listOfPutOnTaskExecuteStatus = () =>
  request.get({
    url: execute_prefix + '/listOfPutOnTaskExecuteStatus'
  })
