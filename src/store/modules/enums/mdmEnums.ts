import { defineStore } from 'pinia'
import { store } from '@/store'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

// 导入主数据相关 API
import * as MaterialPackageUnitApi from '@/api/mdm/materialPackageUnit'
import * as LightingDeviceApi from '@/api/mdm/lighting/device'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 主数据模块枚举状态接口
 */
export interface MdmEnumState {
  // 物料包装单位枚举
  packageUnitType: EnumEntity[]
  
  // 亮灯设备类型枚举
  deviceType: EnumEntity[]
  
  // 设备在线状态枚举
  onlineStatus: EnumEntity[]
  
  // 平台类型枚举
  platformType: EnumEntity[]
  
  // 动作类型枚举
  actionType: EnumEntity[]
  
  // 任务类型枚举
  taskType: EnumEntity[]
  
  // 目标类型枚举
  targetType: EnumEntity[]
  
  // 任务状态枚举
  taskStatus: EnumEntity[]
  
  // 指令状态枚举
  commandStatus: EnumEntity[]
  
  // 执行策略枚举
  executionStrategy: EnumEntity[]
  
  // 启用标记枚举
  enableFlag: EnumEntity[]
  
  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * 主数据模块枚举 Store
 * 管理主数据相关的所有枚举数据
 */
export const useMdmEnumStore = defineStore('mdmEnum', {
  state: (): MdmEnumState => ({
    packageUnitType: [],
    deviceType: [],
    onlineStatus: [],
    platformType: [],
    actionType: [],
    taskType: [],
    targetType: [],
    taskStatus: [],
    commandStatus: [],
    executionStrategy: [],
    enableFlag: [],
    loadedEnums: new Set<string>()
  }),
  
  getters: {
    /**
     * 获取包装单位类型列表
     */
    getPackageUnitTypeList(): EnumEntity[] {
      return this.packageUnitType
    },
    
    /**
     * 根据值获取包装单位文本
     */
    getPackageUnitText(): (value: string) => string {
      return (value: string) => {
        if (!value) return 'EA'
        const item = this.packageUnitType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取设备类型列表
     */
    getDeviceTypeList(): EnumEntity[] {
      return this.deviceType
    },
    
    /**
     * 根据值获取设备类型文本
     */
    getDeviceTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.deviceType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取在线状态列表
     */
    getOnlineStatusList(): EnumEntity[] {
      return this.onlineStatus
    },
    
    /**
     * 根据值获取在线状态文本
     */
    getOnlineStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.onlineStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取在线状态标签类型
     */
    getOnlineStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          'ONLINE': 'success',
          'OFFLINE': 'danger'
        }
        return typeMap[value] || 'info'
      }
    },
    
    /**
     * 获取动作类型列表
     */
    getActionTypeList(): EnumEntity[] {
      return this.actionType
    },
    
    /**
     * 根据值获取动作类型文本
     */
    getActionTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.actionType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取任务类型列表
     */
    getTaskTypeList(): EnumEntity[] {
      return this.taskType
    },
    
    /**
     * 根据值获取任务类型文本
     */
    getTaskTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.taskType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取目标类型列表
     */
    getTargetTypeList(): EnumEntity[] {
      return this.targetType
    },
    
    /**
     * 根据值获取目标类型文本
     */
    getTargetTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.targetType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取平台类型列表
     */
    getPlatformTypeList(): EnumEntity[] {
      return this.platformType
    },
    
    /**
     * 根据值获取平台类型文本
     */
    getPlatformTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.platformType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取任务状态列表
     */
    getTaskStatusList(): EnumEntity[] {
      return this.taskStatus
    },
    
    /**
     * 根据值获取任务状态文本
     */
    getTaskStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.taskStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取任务状态标签类型
     */
    getTaskStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          'PENDING': 'info',
          'EXECUTING': 'warning',
          'COMPLETED': 'success',
          'FAILED': 'danger',
          'CANCELLED': 'info'
        }
        return typeMap[value] || 'info'
      }
    },
    
    /**
     * 获取指令状态列表
     */
    getCommandStatusList(): EnumEntity[] {
      return this.commandStatus
    },
    
    /**
     * 根据值获取指令状态文本
     */
    getCommandStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.commandStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取指令状态标签类型
     */
    getCommandStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          'PENDING': 'info',
          'SENT': 'warning',
          'ACKNOWLEDGED': 'primary',
          'COMPLETED': 'success',
          'FAILED': 'danger',
          'TIMEOUT': 'danger'
        }
        return typeMap[value] || 'info'
      }
    },
    
    /**
     * 获取执行策略列表
     */
    getExecutionStrategyList(): EnumEntity[] {
      return this.executionStrategy
    },
    
    /**
     * 根据值获取执行策略文本
     */
    getExecutionStrategyText(): (value: string) => string {
      return (value: string) => {
        const item = this.executionStrategy.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 获取启用标记列表
     */
    getEnableFlagList(): EnumEntity[] {
      return this.enableFlag
    },
    
    /**
     * 根据值获取启用标记文本
     */
    getEnableFlagText(): (value: string) => string {
      return (value: string) => {
        const item = this.enableFlag.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取启用标记标签类型
     */
    getEnableFlagType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'success',
          '0': 'info'
        }
        return typeMap[value] || 'info'
      }
    }
  },
  
  actions: {
    /**
     * 加载包装单位枚举
     */
    async loadPackageUnitType() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('packageUnitType')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_mdm_packageUnitType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.packageUnitType = cached
        this.loadedEnums.add('packageUnitType')
        return
      }
      
      try {
        const data = await MaterialPackageUnitApi.listOfPackageUnitType()
        this.packageUnitType = data || []
        this.loadedEnums.add('packageUnitType')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载包装单位枚举失败:', error)
      }
    },
    
    /**
     * 加载设备类型枚举
     */
    async loadDeviceType() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('deviceType')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_mdm_deviceType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.deviceType = cached
        this.loadedEnums.add('deviceType')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfDeviceType()
        this.deviceType = data || []
        this.loadedEnums.add('deviceType')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载设备类型枚举失败:', error)
      }
    },
    
    /**
     * 加载在线状态枚举
     */
    async loadOnlineStatus() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('onlineStatus')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_mdm_onlineStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.onlineStatus = cached
        this.loadedEnums.add('onlineStatus')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfOnlineStatus()
        this.onlineStatus = data || []
        this.loadedEnums.add('onlineStatus')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载在线状态枚举失败:', error)
      }
    },
    
    /**
     * 加载动作类型枚举
     */
    async loadActionType() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('actionType')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_mdm_actionType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.actionType = cached
        this.loadedEnums.add('actionType')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfActionType()
        this.actionType = data || []
        this.loadedEnums.add('actionType')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载动作类型枚举失败:', error)
      }
    },
    
    /**
     * 加载任务类型枚举
     */
    async loadTaskType() {
      if (this.loadedEnums.has('taskType')) {
        return
      }
      
      const cacheKey = 'enum_mdm_taskType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.taskType = cached
        this.loadedEnums.add('taskType')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfTaskType()
        this.taskType = data || []
        this.loadedEnums.add('taskType')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载任务类型枚举失败:', error)
      }
    },
    
    /**
     * 加载目标类型枚举
     */
    async loadTargetType() {
      if (this.loadedEnums.has('targetType')) {
        return
      }
      
      const cacheKey = 'enum_mdm_targetType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.targetType = cached
        this.loadedEnums.add('targetType')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfTargetType()
        this.targetType = data || []
        this.loadedEnums.add('targetType')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载目标类型枚举失败:', error)
      }
    },
    
    /**
     * 加载平台类型枚举
     */
    async loadPlatformType() {
      if (this.loadedEnums.has('platformType')) {
        return
      }
      
      const cacheKey = 'enum_mdm_platformType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.platformType = cached
        this.loadedEnums.add('platformType')
        return
      }
      
      try {
        // TODO: 需要在后端添加对应的枚举接口
        // const data = await DeviceApi.listOfPlatformType()
        // 临时使用硬编码数据
        const data = [
          { value: 'THINGSBOARD', text: 'ThingsBoard' },
          { value: 'ALIYUN_IOT', text: '阿里云IoT' }
        ]
        this.platformType = data || []
        this.loadedEnums.add('platformType')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载平台类型枚举失败:', error)
      }
    },
    
    /**
     * 加载任务状态枚举
     */
    async loadTaskStatus() {
      if (this.loadedEnums.has('taskStatus')) {
        return
      }
      
      const cacheKey = 'enum_mdm_taskStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.taskStatus = cached
        this.loadedEnums.add('taskStatus')
        return
      }
      
      try {
        // TODO: 需要在后端添加对应的枚举接口
        // const data = await LightingApi.listOfTaskStatus()
        // 临时使用硬编码数据
        const data = [
          { value: 'PENDING', text: '待执行' },
          { value: 'EXECUTING', text: '执行中' },
          { value: 'COMPLETED', text: '已完成' },
          { value: 'FAILED', text: '失败' },
          { value: 'CANCELLED', text: '已取消' }
        ]
        this.taskStatus = data || []
        this.loadedEnums.add('taskStatus')
        
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载任务状态枚举失败:', error)
      }
    },
    
    /**
     * 加载指令状态枚举
     */
    async loadCommandStatus() {
      if (this.loadedEnums.has('commandStatus')) {
        return
      }
      
      const cacheKey = 'enum_mdm_commandStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.commandStatus = cached
        this.loadedEnums.add('commandStatus')
        return
      }
      
      try {
        // TODO: 需要在后端添加对应的枚举接口
        // const data = await LightingApi.listOfCommandStatus()
        // 临时使用硬编码数据
        const data = [
          { value: 'PENDING', text: '待发送' },
          { value: 'SENT', text: '已发送' },
          { value: 'ACKNOWLEDGED', text: '已确认' },
          { value: 'COMPLETED', text: '已完成' },
          { value: 'FAILED', text: '失败' },
          { value: 'TIMEOUT', text: '超时' }
        ]
        this.commandStatus = data || []
        this.loadedEnums.add('commandStatus')
        
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载指令状态枚举失败:', error)
      }
    },
    
    /**
     * 加载执行策略枚举
     */
    async loadExecutionStrategy() {
      if (this.loadedEnums.has('executionStrategy')) {
        return
      }
      
      const cacheKey = 'enum_mdm_executionStrategy'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.executionStrategy = cached
        this.loadedEnums.add('executionStrategy')
        return
      }
      
      try {
        const data = await LightingDeviceApi.listOfExecutionStrategyType()
        this.executionStrategy = data || []
        this.loadedEnums.add('executionStrategy')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载执行策略枚举失败:', error)
      }
    },
    
    /**
     * 加载启用标记枚举
     */
    async loadEnableFlag() {
      if (this.loadedEnums.has('enableFlag')) {
        return
      }
      
      const cacheKey = 'enum_mdm_enableFlag'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.enableFlag = cached
        this.loadedEnums.add('enableFlag')
        return
      }
      
      try {
        // 启用标记是通用枚举，使用硬编码
        const data = [
          { value: '1', text: '启用' },
          { value: '0', text: '禁用' }
        ]
        this.enableFlag = data || []
        this.loadedEnums.add('enableFlag')
        
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载启用标记枚举失败:', error)
      }
    },
    
    /**
     * 加载亮灯设备相关枚举（设备类型、在线状态、动作类型）
     */
    async loadLightingDeviceEnums() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('lightingDevice')) {
        return
      }

      // 检查缓存
      const cacheKey = 'enum_mdm_lightingDevice'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.deviceType = cached.deviceType || []
        this.onlineStatus = cached.onlineStatus || []
        this.actionType = cached.actionType || []
        this.loadedEnums.add('lightingDevice')
        return
      }

      try {
        const [deviceType, onlineStatus, actionType] = await Promise.all([
          LightingDeviceApi.listOfDeviceType(),
          LightingDeviceApi.listOfOnlineStatus(),
          LightingDeviceApi.listOfActionType()
        ])

        this.deviceType = deviceType || []
        this.onlineStatus = onlineStatus || []
        this.actionType = actionType || []
        this.loadedEnums.add('lightingDevice')

        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, {
          deviceType: this.deviceType,
          onlineStatus: this.onlineStatus,
          actionType: this.actionType
        }, { exp: 300 })
      } catch (error) {
        console.error('加载亮灯设备枚举失败:', error)
      }
    },
    
    /**
     * 重置主数据模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_mdm_packageUnitType')
      wsCache.delete('enum_mdm_deviceType')
      wsCache.delete('enum_mdm_onlineStatus')
      wsCache.delete('enum_mdm_actionType')
      wsCache.delete('enum_mdm_taskType')
      wsCache.delete('enum_mdm_targetType')
      wsCache.delete('enum_mdm_platformType')
      wsCache.delete('enum_mdm_taskStatus')
      wsCache.delete('enum_mdm_commandStatus')
      wsCache.delete('enum_mdm_executionStrategy')
      wsCache.delete('enum_mdm_enableFlag')
      wsCache.delete('enum_mdm_lightingDevice')
      this.packageUnitType = []
      this.deviceType = []
      this.onlineStatus = []
      this.actionType = []
      this.taskType = []
      this.targetType = []
      this.platformType = []
      this.taskStatus = []
      this.commandStatus = []
      this.executionStrategy = []
      this.enableFlag = []
      this.loadedEnums.clear()
    }
  }
})

export const useMdmEnumStoreWithOut = () => {
  return useMdmEnumStore(store)
}
