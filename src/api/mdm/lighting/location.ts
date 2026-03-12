import request from '@/config/axios'

const prefix = '/mdm/lighting/controller/location'

/**
 * 库位绑定 DTO
 */
export interface LocationBindDto {
  lightbarDeviceId: string
  locationId: number
  enableFlag?: number
}

/**
 * 库位批量绑定 DTO
 */
export interface LocationBatchBindDto {
  lightbarDeviceId: string
  locationIds: number[]
}

/**
 * 库位解绑 DTO
 */
export interface LocationUnbindDto {
  lightbarDeviceId: string
  locationId: number
}

/**
 * 库位绑定 VO
 */
export interface LocationBindingVo {
  id: number
  lightbarDeviceId: string
  deviceName?: string
  locationId: number
  locationCode?: string
  locationName?: string
  enableFlag?: number
  bindTime?: string
  createTime?: string
  updateTime?: string
}

/**
 * 库位绑定详情 VO
 */
export interface LocationBindingDetailVo {
  id: number
  lightbarDeviceId: string
  deviceName?: string
  deviceType?: string
  onlineStatus?: string
  locationId: number
  locationCode?: string
  locationName?: string
  warehouseId?: number
  warehouseName?: string
  enableFlag: number
  createTime?: string
  updateTime?: string
}

/**
 * 批量绑定结果 VO
 */
export interface LocationBatchBindResultVo {
  addedCount: number
  removedCount: number
}

/**
 * 单个绑定库位
 */
export const bindLocation = (data: LocationBindDto) =>
  request.post({
    url: prefix + '/bind',
    data
  })

/**
 * 批量绑定库位
 */
export const batchBindLocation = (data: LocationBatchBindDto) =>
  request.post({
    url: prefix + '/batchBind',
    data
  })

/**
 * 解绑库位
 */
export const unbindLocation = (data: LocationUnbindDto) =>
  request.post({
    url: prefix + '/unbind',
    data
  })

/**
 * 查询灯条绑定的库位列表
 */
export const listLocationByLightbar = (lightbarDeviceId: string) =>
  request.get({
    url: prefix + `/listByLightbar/${lightbarDeviceId}`
  })

/**
 * 查询库位绑定的灯条列表
 */
export const listLightbarByLocation = (locationId: number) =>
  request.get({
    url: prefix + `/listByLocation/${locationId}`
  })

/**
 * 库位信息 VO
 */
export interface WarehouseLocationVo {
  id: number
  locationCode: string
  locationName?: string
  warehouseId: number
  warehouseName?: string
  areaId?: number
  areaName?: string
  status?: string
}

/**
 * 搜索可用库位（使用现有的 list 接口）
 * @param warehouseId 仓库ID
 * @param keyword 搜索关键词（库位编码或名称）
 */
export const searchAvailableLocations = (warehouseId: number, keyword?: string) =>
  request.post({
    url: '/mdm/warehouse/location/list',
    data: {
      warehouseId,
      locationCode: keyword, // 按库位编码搜索
      status: 'I' // 只查询空闲状态的库位
    }
  })
