import request from '@/config/axios'

const prefix = '/mdm/lighting/query'

/**
 * 亮灯查询 DTO
 */
export interface LightingQueryDto {
  locationIds: number[]
}

/**
 * 灯条亮灯信息 VO
 */
export interface LightbarLightingVo {
  lightbarDeviceId: string
  deviceName?: string
  deviceType?: string
  onlineStatus?: string
  locationIds: number[]
}

/**
 * 控制器亮灯信息 VO
 */
export interface ControllerLightingVo {
  controllerId: number
  controllerName?: string
  iotDeviceId?: string
  lightbars: LightbarLightingVo[]
}

/**
 * 亮灯查询结果 VO
 */
export interface LightingQueryVo {
  controllers: ControllerLightingVo[]
  unmappedLocationIds: number[]
}

/**
 * 查询库位对应的亮灯设备信息
 */
export const queryLightingDevices = (data: LightingQueryDto) =>
  request.post({
    url: prefix + '/lightingDevices',
    data
  })
