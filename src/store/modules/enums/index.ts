/**
 * 枚举 Store 统一导出
 *
 * 按业务模块拆分枚举管理，便于维护和扩展
 *
 * 使用示例：
 * ```typescript
 * import { useInventoryEnumStore } from '@/store/modules/enums'
 *
 * const inventoryEnumStore = useInventoryEnumStore()
 * await inventoryEnumStore.loadInventoryStatus()
 * const statusList = inventoryEnumStore.getInventoryStatusList
 * ```
 */

// 导出所有枚举 store
export { useMdmEnumStore, useMdmEnumStoreWithOut } from './mdmEnums'
export { useEamEnumStore, useEamEnumStoreWithOut } from './eamEnums'

// 导出类型
export type { MdmEnumState } from './mdmEnums'
export type { EamEnumState } from './eamEnums'

/**
 * 清除所有枚举模块的缓存
 * 用于语言切换或需要强制刷新枚举数据的场景
 *
 * @example
 * ```typescript
 * import { clearAllEnumCaches } from '@/store/modules/enums'
 *
 * // 切换语言时清除所有枚举缓存
 * clearAllEnumCaches()
 * ```
 */
export const clearAllEnumCaches = () => {
  // 动态导入所有枚举 store 并清除缓存
  Promise.all([
    import('./mdmEnums').then(({ useMdmEnumStore }) => {
      const store = useMdmEnumStore()
      store.resetEnums()
    }),
    import('./eamEnums').then(({ useEamEnumStore }) => {
      const store = useEamEnumStore()
      store.resetEnums()
    })
  ]).catch((error) => {
    console.error('清除枚举缓存失败:', error)
  })
}
