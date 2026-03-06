/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [陈建峰]
 * Since 2026-01-21
 */
import request from '@/config/axios'

// 枚举实体接口
export interface EnumEntity {
    value: string
    text: string
    desc?: string
}

// 出库订单接口
export interface OutboundOrderDto {
    id: number
    orderNo: string
    relOrderNo: string
    orderSource: string
    orderType: string
    partyType: string
    partyId: number
    partyName: string
    priority: string
    receiverInfo: string
    expectedShipDate: string
    status: string
    auditBy: string
    auditTime: Date
    remark: string
    tenantId: string
    createTime: Date
    creator: string
    updateTime: Date
    updater: string
}

// 出库订单分页接口
export interface OutboundOrderPageDto extends OutboundOrderDto {
    materialCount: number
    totalDemandQty: number
}

// 出库订单明细接口
export interface OutboundOrderDetailDto {
    id?: number
    orderId?: number
    orderNo?: string
    lineNo?: number
    materialCode: string
    materialName?: string
    materialSpec?: string
    demandQty: number
    allocatedQty?: number
    pickedQty?: number
    shippedQty?: number
    unit?: string
    batchRequirement?: string
    packageRequirement?: string
    remark?: string
}

// 出库订单详情（含明细）
export interface OutboundOrderWithDetailDto extends OutboundOrderDto {
    detailList: OutboundOrderDetailDto[]
}

// 出库订单新增
export interface OutboundOrderSaveDto {
    orderNo: string
    relOrderNo?: string
    orderSource?: string
    orderType?: string
    partyType?: string
    partyId?: number
    priority?: string
    receiverInfo?: string
    expectedShipDate?: string
    remark?: string
    detailList: OutboundOrderDetailSaveDto[]
}

// 出库订单明细新增
export interface OutboundOrderDetailSaveDto {
    materialCode: string
    materialName?: string
    materialSpec?: string
    demandQty: number
    unit?: string
    batchRequirement?: string
    packageRequirement?: string
    remark?: string
}

// 出库订单修改
export interface OutboundOrderUpdateDto {
    id: number
    orderNo: string
    relOrderNo?: string
    orderSource?: string
    orderType?: string
    partyType?: string
    partyId?: number
    priority?: string
    receiverInfo?: string
    expectedShipDate?: string
    remark?: string
    detailList: OutboundOrderDetailUpdateDto[]
}

// 出库订单明细修改
export interface OutboundOrderDetailUpdateDto {
    id?: number
    orderNo?: string
    materialCode: string
    materialName?: string
    materialSpec?: string
    demandQty: number
    unit?: string
    batchRequirement?: string
    packageRequirement?: string
    remark?: string
}

const prefix = "/outbound/outboundOrder";

// ==================== 业务操作接口 ====================

/**
 * 通过主键获取出库订单信息（含明细）
 */
export const getOutboundOrderById = (id: number) => request.get({
    url: prefix + '/id/' + id
});

/**
 * 获取出库订单唯一编码
 * 注意：接口返回的订单号在 message 字段中，data 为 null
 * 由于 request.get 会返回 res.data（为 null），需要直接使用 service 获取完整响应
 */
export const generateOrderNo = async (): Promise<string> => {
    // 直接使用 service 获取完整响应对象，绕过 request.get 的 res.data 提取
    const { service } = await import('@/config/axios/service')
    const res: any = await service({
        method: 'GET',
        url: prefix + '/orderNo'
    }); // 响应拦截器在 code === 200 时返回整个响应对象
    // 订单号在 message 字段中
    return res?.message || '';
};

/**
 * 获取出库订单分页
 */
export const getOutboundOrderPage = (query: any) => request.post({
    url: prefix + '/page',
    data: query
});

/**
 * 新增出库订单
 */
export const createOutboundOrder = (data: OutboundOrderSaveDto) => request.post({
    url: prefix + '/create',
    data: data
});

/**
 * 修改出库订单信息
 */
export const updateOutboundOrder = (data: OutboundOrderUpdateDto) => request.post({
    url: prefix + '/update',
    data: data
});

/**
 * 删除出库订单信息
 */
export const deleteOutboundOrderById = (id: number) => request.post({
    url: prefix + '/delete/' + id
});

/**
 * 批量删除出库订单信息
 */
export const deleteOutboundOrderByIds = (ids: number[]) => request.post({
    url: prefix + '/deleteByIds',
    data: ids
});

/**
 * 审核出库订单（通过）
 */
export const approveOutboundOrder = (id: number) => request.post({
    url: prefix + '/approve/' + id
});

/**
 * 分配库存
 */
export const allocateOutboundOrder = (id: number) => request.post({
    url: prefix + '/allocate/' + id
});

// ==================== 基础数据查询接口 ====================

/**
 * 物料信息接口（用于下拉选择）
 */
export interface MaterialInfo {
    materialCode: string
    materialName: string
    specification?: string
}

/**
 * 获取物料列表
 */
export const listOfMaterial = () => request.get<MaterialInfo[]>({
    url: prefix + '/listOfMaterial'
});

/**
 * 根据关键字查询物料列表
 */
export const listOfMaterialByKeyword = (keyword: string) => request.get<MaterialInfo[]>({
    url: prefix + '/listOfMaterialByKeyword',
    params: { keyword }
});

// ==================== 枚举查询接口 ====================

/**
 * 获取订单来源枚举列表
 */
export const listOfOrderSource = () => request.get<EnumEntity[]>({
    url: prefix + '/listOfOrderSource'
});

/**
 * 获取订单类型枚举列表
 */
export const listOfOrderType = () => request.get<EnumEntity[]>({
    url: prefix + '/listOfOrderType'
});

/**
 * 获取往来方类型枚举列表
 */
export const listOfPartyType = () => request.get<EnumEntity[]>({
    url: prefix + '/listOfPartyType'
});

/**
 * 获取优先级枚举列表
 */
export const listOfPriority = () => request.get<EnumEntity[]>({
    url: prefix + '/listOfPriority'
});

/**
 * 获取订单状态枚举列表
 */
export const listOfStatus = () => request.get<EnumEntity[]>({
    url: prefix + '/listOfStatus'
});
