/**
 * Copyright (c) 2025-2026
 * Lighting Device Management API
 * Since 2026-03-04
 */
import request from '@/config/axios'

const prefix = '/mdm/lighting/device'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 亮灯设备分页查询 DTO
 */
export interface LightingDevicePageDto {
  pageNo: number
  pageSize: number
  deviceName?: string
  deviceType?: string
  onlineStatus?: string
  enabled?: boolean
}

/**
 * 亮灯设备分页列表 VO
 */
export interface LightingDevicePageVo {
  id: number
  iotDeviceId: string
  deviceName: string
  deviceType: string
  platformType?: string
  onlineStatus: string
  enabled: boolean
  supportedActions: string | string[]  // 支持字符串（逗号分隔）或数组
  lastActiveTime?: string
  syncTime?: string
  version: number
}

/**
 * 亮灯设备详情 VO
 */
export interface LightingDeviceVo {
  id: number
  iotDeviceId: string
  deviceName: string
  deviceType: string
  platformType?: string
  onlineStatus: string
  enabled: boolean
  supportedActions: string | string[]  // 支持字符串（逗号分隔）或数组
  lastActiveTime?: string
  syncTime?: string
  version?: number
  createTime?: string
  updateTime?: string
}

/**
 * 设备同步结果 VO
 */
export interface DeviceSyncResultVo {
  successCount: number
  failureCount: number
  totalCount: number
  errors?: string[]
  syncTime?: string
  createdCount?: number
  updatedCount?: number
}

/**
 * 设备状态更新 DTO
 */
export interface LightingDeviceStatusUpdateDto {
  id: number
  enabled: boolean
  version: number
}

/**
 * 设备能力配置更新 DTO
 */
export interface LightingDeviceCapabilityUpdateDto {
  id: number
  supportedActions: string[]
  version: number
}

/**
 * 设备状态回调 DTO
 */
export interface DeviceStatusCallbackDto {
  iotDeviceId: string
  onlineStatus: string
  statusChangeTime: string
}

/**
 * 亮灯查询 DTO
 */
export interface LightingQueryDto {
  locationIds: number[]
}

/**
 * 控制器亮灯信息 VO
 */
export interface ControllerLightingVo {
  controllerId: number
  controllerName: string
  iotDeviceId: string
  platformType: string
  strips: StripLightingVo[]
}

/**
 * 灯条亮灯信息 VO
 */
export interface StripLightingVo {
  stripId: number
  stripName: string
  channel: number
  locationId: number
  locationCode: string
}

/**
 * 亮灯查询结果 VO
 */
export interface LightingQueryVo {
  controllers: ControllerLightingVo[]
  unmappedLocationIds: number[]
}

/**
 * 手动同步设备信息
 * 从 IoT 平台同步设备信息到本地数据库
 */
export const syncDevices = (): Promise<DeviceSyncResultVo> =>
  request.post({
    url: prefix + '/sync'
  })

/**
 * 分页查询设备列表
 * @param query 分页查询参数
 */
export const getDevicePage = (query: LightingDevicePageDto) =>
  request.get({
    url: prefix + '/page',
    params: query
  })

/**
 * 查询设备详情
 * @param id 设备ID
 */
export const getDeviceById = (id: number) =>
  request.get({
    url: prefix + '/' + id
  })

/**
 * 查询设备详情（别名方法）
 * @param id 设备ID
 */
export const getDevice = (id: number) => getDeviceById(id)

/**
 * 更新设备状态（启用/禁用）
 * @param data 设备状态更新参数
 */
export const updateDeviceStatus = (data: LightingDeviceStatusUpdateDto) =>
  request.put({
    url: prefix + '/status',
    data: data
  })

/**
 * 更新设备能力配置
 * @param data 设备能力配置更新参数
 */
export const updateDeviceCapability = (data: LightingDeviceCapabilityUpdateDto) =>
  request.put({
    url: prefix + '/capability',
    data: data
  })

/**
 * 设备状态回调接口
 * @param data 设备状态回调数据
 */
export const deviceStatusCallback = (data: DeviceStatusCallbackDto) =>
  request.post({
    url: prefix + '/status/callback',
    data: data
  })

/**
 * 查询库位对应的亮灯设备信息
 * @param data 亮灯查询参数
 */
export const queryLightingDevices = (data: LightingQueryDto) =>
  request.post({
    url: prefix + '/query',
    data: data
  })

/**
 * 获取设备类型列表
 */
export const listOfDeviceType = () =>
  request.get({
    url: prefix + '/listOfDeviceType'
  })

/**
 * 获取在线状态列表
 */
export const listOfOnlineStatus = () =>
  request.get({
    url: prefix + '/listOfOnlineStatus'
  })

/**
 * 获取动作类型列表
 */
export const listOfActionType = () =>
  request.get({
    url: prefix + '/listOfActionType'
  })

/**
 * 获取任务类型列表
 */
export const listOfTaskType = () =>
  request.get({
    url: prefix + '/listOfTaskType'
  })

/**
 * 获取目标类型列表
 */
export const listOfTargetType = () =>
  request.get({
    url: prefix + '/listOfTargetType'
  })

/**
 * 获取执行策略类型列表
 */
export const listOfExecutionStrategyType = () =>
  request.get({
    url: prefix + '/listOfExecutionStrategyType'
  })

/**
 * 获取可用的IoT设备列表（未绑定的设备）
 */
export const getAvailableDevices = () =>
  request.get({
    url: prefix + '/available'
  })
