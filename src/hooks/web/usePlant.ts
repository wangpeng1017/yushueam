/**
 * usePlant Hook：获取当前用户的端别（车间）信息
 * 用于"通用功能 + 个性化字段段"的渲染控制
 *
 * 端别 (plantCode):
 * - C: C 端车间（PACK/PCBA/装配）
 * - B: B 端车间
 * - CNC: 数控机加车间
 * - ALL: admin（跨端）
 */
import { computed } from 'vue'
import { useCache, CACHE_KEY } from '@/hooks/web/useCache'

export function usePlant() {
  const { wsCache } = useCache()

  const plantCode = computed<string>(() => {
    const userInfo = wsCache.get(CACHE_KEY.USER) || {}
    return userInfo?.user?.plantCode || 'ALL'
  })

  const workshopName = computed<string>(() => {
    const userInfo = wsCache.get(CACHE_KEY.USER) || {}
    return userInfo?.user?.workshopName || '全部车间'
  })

  /** 检查当前用户是否属于指定端别（数组形式可指定多端） */
  function inPlant(scope: string | string[]): boolean {
    const current = plantCode.value
    if (current === 'ALL') return true
    if (Array.isArray(scope)) return scope.includes(current)
    return scope === current
  }

  /** 是否 C 端（含 admin） */
  const isC = computed(() => inPlant(['C', 'ALL']))
  /** 是否 B 端（含 admin） */
  const isB = computed(() => inPlant(['B', 'ALL']))
  /** 是否数控机加（含 admin） */
  const isCNC = computed(() => inPlant(['CNC', 'ALL']))
  /** 是否 admin */
  const isAdmin = computed(() => plantCode.value === 'ALL')

  /** 是否显示 IoT 字段段（C + 数控机加 + admin）—— 与 EM-08 联动 */
  const showIotFields = computed(() => inPlant(['C', 'CNC', 'ALL']))
  /** 是否显示非标研制字段段（C + admin）—— 与 EM-07 联动 */
  const showProjectFields = computed(() => inPlant(['C', 'ALL']))
  /** 是否显示双仓库切换（C + admin） */
  const showMultiWarehouse = computed(() => inPlant(['C', 'ALL']))
  /** 是否显示工装柜对接（C + admin） */
  const showToolboxIntegration = computed(() => inPlant(['C', 'ALL']))

  return {
    plantCode,
    workshopName,
    inPlant,
    isC,
    isB,
    isCNC,
    isAdmin,
    showIotFields,
    showProjectFields,
    showMultiWarehouse,
    showToolboxIntegration
  }
}
