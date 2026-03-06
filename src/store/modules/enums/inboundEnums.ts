import { defineStore } from 'pinia'
import { store } from '../../index'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

// 导入入库相关 API
import * as PutOnTaskInfoApi from '@/api/inbound/putOnTaskInfo'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * 入库模块枚举状态接口
 */
export interface InboundEnumState {
  // 上架任务相关枚举
  putOnTaskStatus: EnumEntity[]
  putOnTaskType: EnumEntity[]
  putOnTaskExecuteStatus: EnumEntity[]
  
  // ASN 相关枚举
  inboundType: EnumEntity[]
  asnStatus: EnumEntity[]
  
  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * 入库模块枚举 Store
 * 管理入库相关的所有枚举数据
 */
export const useInboundEnumStore = defineStore('inboundEnum', {
  state: (): InboundEnumState => ({
    putOnTaskStatus: [],
    putOnTaskType: [],
    putOnTaskExecuteStatus: [],
    inboundType: [],
    asnStatus: [],
    loadedEnums: new Set<string>()
  }),
  
  getters: {
    /**
     * 获取上架任务状态列表
     */
    getPutOnTaskStatusList(): EnumEntity[] {
      return this.putOnTaskStatus
    },
    
    /**
     * 获取上架任务类型列表
     */
    getPutOnTaskTypeList(): EnumEntity[] {
      return this.putOnTaskType
    },
    
    /**
     * 获取上架任务执行状态列表
     */
    getPutOnTaskExecuteStatusList(): EnumEntity[] {
      return this.putOnTaskExecuteStatus
    },
    
    /**
     * 获取入库类型列表
     */
    getInboundTypeList(): EnumEntity[] {
      return this.inboundType
    },
    
    /**
     * 获取 ASN 状态列表
     */
    getAsnStatusList(): EnumEntity[] {
      return this.asnStatus
    },
    
    /**
     * 根据值获取上架任务状态文本
     */
    getPutOnTaskStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.putOnTaskStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取上架任务类型文本
     */
    getPutOnTaskTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.putOnTaskType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取上架任务执行状态文本
     */
    getPutOnTaskExecuteStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.putOnTaskExecuteStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取入库类型文本
     */
    getInboundTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.inboundType.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据值获取 ASN 状态文本
     */
    getAsnStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.asnStatus.find(e => e.value === value)
        return item?.text || value
      }
    },
    
    /**
     * 根据 ASN 状态值获取标签类型
     */
    getAsnStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          'CREATED': 'primary',
          'RECEIVING': 'warning',
          'PART_RECEIVED': 'info',
          'RECEIVED': 'success',
          'CLOSED': 'danger'
        }
        return typeMap[value] || 'info'
      }
    }
  },
  
  actions: {
    /**
     * 加载上架任务相关枚举
     */
    async loadPutOnTaskEnums() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('putOnTask')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_inbound_putOnTask'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.putOnTaskStatus = cached.putOnTaskStatus || []
        this.putOnTaskType = cached.putOnTaskType || []
        this.putOnTaskExecuteStatus = cached.putOnTaskExecuteStatus || []
        this.loadedEnums.add('putOnTask')
        return
      }
      
      try {
        const [status, type, executeStatus] = await Promise.all([
          PutOnTaskInfoApi.listOfPutOnTaskStatus(),
          PutOnTaskInfoApi.listOfPutOnTaskType(),
          PutOnTaskInfoApi.listOfPutOnTaskExecuteStatus()
        ])
        
        this.putOnTaskStatus = status || []
        this.putOnTaskType = type || []
        this.putOnTaskExecuteStatus = executeStatus || []
        this.loadedEnums.add('putOnTask')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, {
          putOnTaskStatus: this.putOnTaskStatus,
          putOnTaskType: this.putOnTaskType,
          putOnTaskExecuteStatus: this.putOnTaskExecuteStatus
        }, { exp: 300 })
      } catch (error) {
        console.error('加载上架任务枚举失败:', error)
      }
    },
    
    /**
     * 加载 ASN 相关枚举（入库类型 + ASN 状态）
     */
    async loadAsnEnums() {
      // 如果已加载，直接返回
      if (this.loadedEnums.has('asn')) {
        return
      }
      
      // 检查缓存
      const cacheKey = 'enum_inbound_asn'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.inboundType = cached.inboundType || []
        this.asnStatus = cached.asnStatus || []
        this.loadedEnums.add('asn')
        return
      }
      
      try {
        // 动态导入 ASN API
        const AsnInnerInfoApi = await import('@/api/inbound/asnInnerInfo')
        
        const [inboundType, asnStatus] = await Promise.all([
          AsnInnerInfoApi.listOfInboundType(),
          AsnInnerInfoApi.listOfAsnStatus()
        ])
        
        this.inboundType = inboundType || []
        this.asnStatus = asnStatus || []
        this.loadedEnums.add('asn')
        
        // 缓存数据（5分钟过期）
        wsCache.set(cacheKey, {
          inboundType: this.inboundType,
          asnStatus: this.asnStatus
        }, { exp: 300 })
      } catch (error) {
        console.error('加载 ASN 枚举失败:', error)
      }
    },
    
    /**
     * 重置入库模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_inbound_putOnTask')
      wsCache.delete('enum_inbound_asn')
      this.putOnTaskStatus = []
      this.putOnTaskType = []
      this.putOnTaskExecuteStatus = []
      this.inboundType = []
      this.asnStatus = []
      this.loadedEnums.clear()
    }
  }
})

export const useInboundEnumStoreWithOut = () => {
  return useInboundEnumStore(store)
}
