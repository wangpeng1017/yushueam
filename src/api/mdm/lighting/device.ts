import request from '@/config/axios'

const prefix = '/mdm/lighting/device'

/**
 * 亮灯设备 VO
 */
export interface LightingDeviceVo {
  id: number
  iotDeviceId: string
  deviceName: string
  deviceType: string
  platformType?: string
  onlineStatus: string
  lastActiveTime?: string
  syncTime?: string
}

/**
 * 设备同步结果 VO
 */
export interface DeviceSyncResultVo {
  syncCount: number
  newCount: number
  updateCount: number
  message?: string
}

/**
 * 手动同步设备信息
 */
export const syncDevices = () =>
  request.post({
    url: prefix + '/sync'
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
 * 获取可用的IoT设备列表（未绑定的设备）
 */
export const getAvailableDevices = () =>
  request.get({
    url: prefix + '/available'
  })
