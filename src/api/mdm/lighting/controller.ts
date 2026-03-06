import request from '@/config/axios'

const prefix = '/mdm/lighting/controller'

/**
 * 巷道控制器保存 DTO
 */
export interface AisleControllerSaveDto {
  controllerName: string
  controllerCode?: string
  warehouseId: number
  iotDeviceId: string
  enableFlag?: number
  remark?: string
}

/**
 * 巷道控制器更新 DTO
 */
export interface AisleControllerUpdateDto {
  id: number
  controllerName?: string
  controllerCode?: string
  warehouseId?: number
  iotDeviceId?: string
  enableFlag?: number
  remark?: string
}

/**
 * 巷道控制器分页查询 DTO
 */
export interface AisleControllerPageDto {
  pageNo: number
  pageSize: number
  controllerName?: string
  controllerCode?: string
  warehouseId?: number
  iotDeviceId?: string
  enableFlag?: number
}

/**
 * 巷道控制器 VO
 */
export interface AisleControllerVo {
  id: number
  controllerName: string
  controllerCode?: string
  warehouseId: number
  warehouseName?: string
  iotDeviceId: string
  deviceName?: string
  onlineStatus?: string
  enableFlag: number
  boundLightbarCount?: number
  remark?: string
  createTime?: string
  updateTime?: string
}

/**
 * 巷道控制器分页 VO
 */
export interface AisleControllerPageVo {
  list: AisleControllerVo[]
  total: number
}

/**
 * 灯光管理树形节点 VO
 */
export interface LightingTreeNodeVo {
  id: string
  label: string
  type: 'warehouse' | 'controller'
  warehouseId?: number
  controllerId?: number
  onlineStatus?: string
  children?: LightingTreeNodeVo[]
}

/**
 * 创建巷道控制器
 */
export const saveAisleController = (data: AisleControllerSaveDto) =>
  request.post({
    url: prefix + '/save',
    data
  })

/**
 * 更新巷道控制器
 */
export const updateAisleController = (data: AisleControllerUpdateDto) =>
  request.put({
    url: prefix + '/update',
    data
  })

/**
 * 删除巷道控制器
 */
export const removeAisleController = (id: number) =>
  request.delete({
    url: prefix + `/remove/${id}`
  })

/**
 * 获取巷道控制器详情
 */
export const getAisleController = (id: number) =>
  request.get({
    url: prefix + `/get/${id}`
  })

/**
 * 分页查询巷道控制器
 */
export const getAisleControllerPage = (params: AisleControllerPageDto) =>
  request.get({
    url: prefix + '/page',
    params
  })

/**
 * 获取灯光管理树形结构
 */
export const getLightingTree = () =>
  request.get({
    url: prefix + '/tree'
  })
