/**
 *  Copyright (c) 2025-2026, wangxiao
 * Author [王晓]
 * Since 2026-01-28
 */
import request from '@/config/axios'

// ==================== 类型定义 ====================

/**
 * 拣货任务 VO
 */
export interface PickingTaskVo {
  id: number
  taskNo: string
  taskType: string
  sourceDocType: string
  sourceDocId: number
  sourceDocNo: string
  executorType?: string
  executorId?: string
  executorName?: string
  pickedItemsCount: number
  pickedPiecesCount: number
  status: string
  startTime?: Date
  completeTime?: Date
  remark?: string
  createTime: Date
  creator: string
}

/**
 * 拣货任务分页 VO
 */
export interface PickingTaskPageVo extends PickingTaskVo {
}

/**
 * 拣货任务详情 VO（含物料明细）
 */
export interface PickingTaskDetailVo extends PickingTaskVo {
  materials: PickingTaskMaterialVo[]
}

/**
 * 拣货任务物料明细 VO
 */
export interface PickingTaskMaterialVo {
  allocationId: number // 分配记录ID
  lineNo: number
  materialCode: string
  materialName: string
  materialSpec?: string
  batchRequirement?: string
  demandQty: number
  allocatedQty: number // 分配数量
  pickedQty?: number // 已拣数量
  unit?: string
  locationInfo?: string // 库位信息（仓库-库区-库位）
  materialBatch?: string // 物料批次
}

/**
 * 拣货执行 DTO
 */
export interface PickingExecutionDto {
  taskId: number
  allocationId: number
  materialCode: string
  pickedQty: number
}

/**
 * 拣货执行结果 VO
 */
export interface PickingExecutionResultVo {
  allocationId: number
  materialCode: string
  materialName: string
  demandQty: number
  pickedQty: number
  allCompleted: boolean
  pickedItemsCount: number
  pickedPiecesCount: number
}

/**
 * 拣货任务分配 DTO
 */
export interface PickingTaskAssignDto {
  taskId: number
  executorType: string
  executorId: string
  executorName: string
}

/**
 * 拣货任务保存 DTO
 */
export interface PickingTaskSaveDto {
  taskType: string
  sourceDocType: string
  sourceDocId: number
  sourceDocNo: string
  remark?: string
}

/**
 * 波次简要信息 VO
 */
export interface WaveSimpleVo {
  id: number
  waveNo: string
  includedOrderCount: number
  includedLineCount: number
  createTime: Date
}

/**
 * 拣货任务分页查询 DTO
 */
export interface PickingTaskPageDto {
  pageNo: number
  pageSize: number
  taskNo?: string
  taskType?: string
  sourceDocNo?: string
  executorId?: string
  executorName?: string
  status?: string
  beginTime?: string
  endTime?: string
}

/**
 * 枚举实体
 */
export interface EnumEntity {
  value: string
  text: string
}

/**
 * 用户信息 VO
 */
export interface UserVo {
  id: number
  username: string
  nickname: string
  deptId?: number
}

const prefix = '/outbound/picking-task'

// ==================== API 接口 ====================

/**
 * 分页查询拣货任务
 */
export const getPickingTaskPage = (query: PickingTaskPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * 通过主键获取任务详情（含物料明细）
 */
export const getPickingTaskById = (id: number) =>
  request.get<PickingTaskDetailVo>({
    url: prefix + '/id/' + id
  })

/**
 * 分配任务
 */
export const assignPickingTask = (data: PickingTaskAssignDto) =>
  request.post<boolean>({
    url: prefix + '/assign',
    data: data
  })

/**
 * 获取待分配任务数量
 */
export const getPendingCount = () =>
  request.get<number>({
    url: prefix + '/pending-count'
  })

/**
 * 获取任务类型枚举列表
 */
export const listOfTaskType = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfTaskType'
  })

/**
 * 获取任务状态枚举列表
 */
export const listOfTaskStatus = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfTaskStatus'
  })

/**
 * 获取执行人类型枚举列表
 */
export const listOfExecutorType = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfExecutorType'
  })

/**
 * 获取来源单据类型枚举列表
 */
export const listOfSourceDocType = () =>
  request.get<EnumEntity[]>({
    url: prefix + '/listOfSourceDocType'
  })

/**
 * 查询用户列表（用于分配任务选择执行人）
 */
export const getUsers = (params: {
  username?: string
  nickname?: string
  pageNo?: number
  pageSize?: number
}) =>
  request.get<PageResult<UserVo[]>>({
    url: prefix + '/users',
    params: params
  })

/**
 * 查询计划中状态的波次列表（用于创建波次拣货任务时选择）
 */
export const listPlannedWaves = () =>
  request.get<WaveSimpleVo[]>({
    url: prefix + '/waves/planned'
  })

/**
 * 创建拣货任务
 */
export const createPickingTask = (data: PickingTaskSaveDto) =>
  request.post<boolean>({
    url: prefix + '/create',
    data: data
  })

/**
 * 执行拣货操作（记录拣货过程）
 */
export const executePickingItem = (data: PickingExecutionDto) =>
  request.post<PickingExecutionResultVo>({
    url: prefix + '/execute',
    data: data
  })
