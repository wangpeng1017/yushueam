import request from '@/config/axios'

const prefix = '/mdm/lighting/lightbar'

/**
 * 灯条绑定 DTO
 */
export interface LightBarBindDto {
  controllerId: number
  lightbarDeviceId: string
  channelNo?: number
  enableFlag?: number
}

/**
 * 灯条解绑 DTO
 */
export interface LightBarUnbindDto {
  controllerId: number
  lightbarDeviceId: string
}

/**
 * 灯条停用/启用 DTO
 */
export interface LightBarDisableDto {
  controllerId: number
  lightbarDeviceId: string
  enableFlag: number
}

/**
 * 灯条移除 DTO
 */
export interface LightBarRemoveDto {
  controllerId: number
  lightbarDeviceId: string
}

/**
 * 灯条批量绑定项
 */
export interface LightBarBindItem {
  lightbarDeviceId: string
  channelNo?: number
  enableFlag?: number
}

/**
 * 灯条批量绑定 DTO
 */
export interface LightBarBatchBindDto {
  controllerId: number
  lightbarDeviceIds: string[]
  enableFlag?: number
}

/**
 * 绑定库位信息
 */
export interface BoundLocationInfo {
  locationId: number
  locationCode?: string
  locationName?: string
}

/**
 * 灯条绑定 VO
 */
export interface LightBarBindingVo {
  id: number
  controllerId: number
  controllerName?: string
  lightbarDeviceId: string
  deviceName?: string
  deviceType?: string
  onlineStatus?: string
  channelNo?: number
  enableFlag: number
  boundLocationCount?: number
  boundLocations?: BoundLocationInfo[]
  createTime?: string
  updateTime?: string
}

/**
 * 绑定灯条到控制器
 */
export const bindLightBar = (data: LightBarBindDto) =>
  request.post({
    url: prefix + '/bind',
    data
  })

/**
 * 解绑灯条
 */
export const unbindLightBar = (data: LightBarUnbindDto) =>
  request.post({
    url: prefix + '/unbind',
    data
  })

/**
 * 批量绑定灯条
 */
export const batchBindLightBar = (data: LightBarBatchBindDto) =>
  request.post({
    url: prefix + '/batchBind',
    data
  })

/**
 * 查询控制器下的灯条绑定列表
 */
export const listLightBarByController = (controllerId: number) =>
  request.get({
    url: prefix + `/list/${controllerId}`
  })

/**
 * 停用/启用灯条
 */
export const disableLightBar = (data: LightBarDisableDto) =>
  request.post({
    url: prefix + '/disable',
    data
  })

/**
 * 移除灯条
 */
export const removeLightBar = (data: LightBarRemoveDto) =>
  request.post({
    url: prefix + '/remove',
    data
  })
