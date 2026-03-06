/**
 * Copyright (c) 2025-2026
 * Inventory Adjustment API Service
 * Since 2026-02-03
 */
import request from '@/config/axios'
import type {
  InventoryAdjustOrderSaveDto,
  InventoryAdjustOrderUpdateDto,
  InventoryAdjustOrderSubmitDto,
  InventoryAdjustOrderApproveDto,
  InventoryAdjustOrderPostDto,
  InventoryAdjustOrderPageDto
} from '@/types/inventory/adjust'

const prefix = '/inventory/adjust/order'

/**
 * Get paginated list of adjustment orders
 * @param query - Page query parameters
 */
export const getInventoryAdjustOrderPage = (query: InventoryAdjustOrderPageDto) =>
  request.post({
    url: prefix + '/page',
    data: query
  })

/**
 * Get paginated list of adjustment details (detail left join order)
 * @param query - Page query parameters
 */
export const getInventoryAdjustDetailPage = (query: InventoryAdjustOrderPageDto) =>
  request.post({
    url: prefix + '/pageDetail',
    data: query
  })

/**
 * Get adjustment order by ID
 * @param id - Order ID
 */
export const getInventoryAdjustOrderById = (id: number) =>
  request.get({
    url: prefix + '/id/' + id
  })

export const getInventoryAdjustOrderByCode = (code: string) =>
  request.get({
    url: prefix + '/adjustNo/' + code
  })

/**
 * Create new adjustment order
 * @param data - Order creation data
 */
export const createInventoryAdjustOrder = (data: InventoryAdjustOrderSaveDto) =>
  request.post({
    url: prefix + '/create',
    data: data
  })

/**
 * Update adjustment order
 * @param data - Order update data
 */
export const updateInventoryAdjustOrder = (data: InventoryAdjustOrderUpdateDto) =>
  request.post({
    url: prefix + '/update',
    data: data
  })

/**
 * Delete adjustment order by ID
 * @param id - Order ID
 */
export const deleteInventoryAdjustOrderById = (id: number) =>
  request.post({
    url: prefix + '/delete/' + id
  })

/**
 * Submit adjustment order for approval
 * @param data - Submit data
 */
export const submitInventoryAdjustOrder = (data: InventoryAdjustOrderSubmitDto) =>
  request.post({
    url: prefix + '/submit',
    data: data
  })

/**
 * Approve adjustment order
 * @param data - Approval data
 */
export const approveInventoryAdjustOrder = (data: InventoryAdjustOrderApproveDto) =>
  request.post({
    url: prefix + '/approve',
    data: data
  })

/**
 * Reject adjustment order
 * @param data - Rejection data
 */
export const rejectInventoryAdjustOrder = (data: InventoryAdjustOrderApproveDto) =>
  request.post({
    url: prefix + '/reject',
    data: data
  })

/**
 * Post adjustment order to inventory
 * @param data - Post data
 */
export const postInventoryAdjustOrder = (data: InventoryAdjustOrderPostDto) =>
  request.post({
    url: prefix + '/post',
    data: data
  })

/**
 * Generate unique adjustment order number
 */
export const generateAdjustOrderNo = () =>
  request.get({
    url: prefix + '/generateOrderNo'
  })

/**
 * Get list of adjustment types
 */
export const listOfAdjustType = () =>
  request.get({
    url: prefix + '/listOfAdjustType'
  })

/**
 * Get list of adjustment reasons
 */
export const listOfAdjustReason = () =>
  request.get({
    url: prefix + '/listOfAdjustReason'
  })

/**
 * Get list of approval statuses
 */
export const listOfApprovalStatus = () =>
  request.get({
    url: prefix + '/listOfApprovalStatus'
  })
