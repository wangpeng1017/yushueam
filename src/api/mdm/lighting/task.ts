import request from '@/config/axios'

const prefix = '/mdm/lighting/task'

/**
 * 亮灯任务创建 DTO
 */
export interface LightingTaskCreateDto {
  taskName?: string
  targetType: string
  targetIds: string[]
  executionStrategy?: string
  remark?: string
}

/**
 * 亮灯任务分页查询 DTO
 */
export interface LightingTaskPageDto {
  pageNo: number
  pageSize: number
  taskName?: string
  taskStatus?: string
  targetType?: string
  executionStrategy?: string
}

/**
 * 亮灯任务 VO
 */
export interface LightingTaskVo {
  id: number
  taskName?: string
  taskStatus: string
  targetType: string
  targetIds: string[]
  executionStrategy: string
  totalCommands?: number
  successCommands?: number
  failedCommands?: number
  remark?: string
  createTime?: string
  updateTime?: string
}

/**
 * 亮灯任务分页 VO
 */
export interface LightingTaskPageVo {
  list: LightingTaskVo[]
  total: number
}

/**
 * 创建亮灯任务
 */
export const createLightingTask = (data: LightingTaskCreateDto) =>
  request.post({
    url: prefix + '/create',
    data
  })

/**
 * 执行亮灯任务
 */
export const executeLightingTask = (taskId: number) =>
  request.post({
    url: prefix + `/execute/${taskId}`
  })

/**
 * 取消亮灯任务
 */
export const cancelLightingTask = (taskId: number) =>
  request.post({
    url: prefix + `/cancel/${taskId}`
  })

/**
 * 分页查询亮灯任务
 */
export const getLightingTaskPage = (params: LightingTaskPageDto) =>
  request.get({
    url: prefix + '/page',
    params
  })

/**
 * 获取亮灯任务详情
 */
export const getLightingTask = (taskId: number) =>
  request.get({
    url: prefix + `/get/${taskId}`
  })
