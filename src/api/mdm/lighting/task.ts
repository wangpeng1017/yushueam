import request from '@/config/axios'

const prefix = '/mdm/lighting/task'

/**
 * 亮灯任务创建 DTO
 */
export interface TaskCreateDto {
  taskType: string
  bizType: string
  bizId: string
  targetType: string
  targetExpression: string
  action: string
  executionStrategy: string
  priority?: number
  metadata?: string
}

/**
 * 亮灯任务执行 DTO
 */
export interface TaskExecuteDto {
  taskId: string
}

/**
 * 亮灯任务取消 DTO
 */
export interface TaskCancelDto {
  taskId: string
}

/**
 * 亮灯任务分页查询 DTO
 */
export interface TaskPageDto {
  pageNo: number
  pageSize: number
  taskId?: string
  bizType?: string
  bizId?: string
  taskStatus?: string
  startTime?: string
  endTime?: string
}

/**
 * 亮灯任务 VO
 */
export interface TaskVo {
  taskId: string
  bizType?: string
  bizId?: string
  taskStatus: string
  locationIds: number[]
  action: string
  color?: string
  duration?: number
  totalCommands?: number
  successCommands?: number
  failedCommands?: number
  remark?: string
  createTime?: string
  updateTime?: string
  executeTime?: string
  cancelTime?: string
}

/**
 * 任务执行结果 VO
 */
export interface TaskResultVo {
  taskId: string
  taskStatus: string
  totalCommands: number
  successCommands: number
  failedCommands: number
  errors?: string[]
}

/**
 * 创建并执行亮灯任务
 */
export const createAndExecuteTask = (data: TaskCreateDto) =>
  request.post({
    url: prefix + '/createAndExecute',
    data
  })

/**
 * 执行亮灯任务
 */
export const executeTask = (data: TaskExecuteDto) =>
  request.post({
    url: prefix + '/execute',
    data
  })

/**
 * 取消亮灯任务
 */
export const cancelTask = (data: TaskCancelDto) =>
  request.post({
    url: prefix + '/cancel',
    data
  })

/**
 * 查询任务详情
 */
export const getTaskDetail = (taskId: string) =>
  request.get({
    url: prefix + `/detail/${taskId}`
  })

/**
 * 根据业务单据查询任务
 */
export const getTaskByBiz = (bizType: string, bizId: string) =>
  request.get({
    url: prefix + `/byBiz/${bizType}/${bizId}`
  })

/**
 * 分页查询任务列表
 */
export const getTaskPage = (data: TaskPageDto) =>
  request.post({
    url: prefix + '/page',
    data
  })
