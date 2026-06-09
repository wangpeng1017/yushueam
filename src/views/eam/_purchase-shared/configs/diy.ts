/**
 * 自制设备备件采购
 * 头部字段与「设备采购」一致；明细 = 钣金件 / 机加工件 / 外购件 三个清单 Tab。
 */
import type { PurchaseConfig } from '../types'
import { FEISHU_STATUS_OPTIONS } from '../feishu-status'
import { commonHeaderFields, sheetMetalTab, machiningTab, outsourceTab, WORKSHOP_TEXT } from './_shared'

export const diyPurchaseConfig: PurchaseConfig = {
  key: 'diy',
  title: '自制设备备件采购',
  alert: '自制设备备件采购说明：用于自制线体（PACK 线 / 电机线 / 装配线等）的钣金件 / 机加工件 / 外购件采购；流程 = 申请 → 飞书审批 → ERP 生成 PO → 入库',
  codeField: 'projectCode',
  codePrefix: 'DIY-PR-2026',
  nameField: 'projectName',
  searchFields: [
    { prop: 'projectCode', label: '单据编号', placeholder: 'DIY-PR-XXXX' },
    { prop: 'projectName', label: '项目名称' },
    { prop: 'status', label: '状态', type: 'select', options: FEISHU_STATUS_OPTIONS }
  ],
  columns: [
    { prop: 'projectCode', label: '单据编号', width: 155 },
    { prop: 'projectName', label: '项目', minWidth: 200, align: 'left', formatter: (r) => (r.projectNo ? `${r.projectNo} ${r.projectName || ''}` : r.projectName || '—') },
    { prop: 'applicantName', label: '申购人', width: 85 },
    { prop: 'applicantDept', label: '申购部门', width: 120 },
    { prop: 'workshopCode', label: '端别', width: 70, formatter: (r) => WORKSHOP_TEXT[r.workshopCode] || r.workshopCode },
    { prop: 'applicationDate', label: '申购日期', width: 100 },
    { prop: 'expectedDate', label: '要求到货', width: 100 },
    { prop: 'itemCount', label: '清单(钣/机/外)', width: 130, formatter: (r) => `${r.sheetMetalItems?.length || 0} / ${r.machiningItems?.length || 0} / ${r.outsourceItems?.length || 0}` },
    { prop: 'totalAmount', label: '预估金额', width: 110, money: true, align: 'right' }
  ],
  formFields: commonHeaderFields,
  detailTabs: [sheetMetalTab, machiningTab, outsourceTab],
  dataSource: {
    type: 'inline',
    rows: [
      {
        id: 'DIY01', projectCode: 'DIY-PR-2026-001', projectName: 'PACK 线第二工位扩展', applicantName: '王组长', applicantDept: '自动化车间', workshopCode: 'C',
        applicationDate: '2026-04-12', expectedDate: '2026-05-12', totalAmount: 28600, status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0421', remark: 'PACK 线扩展第二工位主控与机架',
        sheetMetalItems: [
          { materialCode: 'BJ-2026-001', drawingNo: 'PACK-02-01', itemName: '工位机架立板', quantity: 4, material: 'SUS304', surfaceTreat: '拉丝', remark: '' },
          { materialCode: 'BJ-2026-002', drawingNo: 'PACK-02-02', itemName: '防护罩侧板', quantity: 6, material: 'SPCC', surfaceTreat: '喷塑', remark: '' }
        ],
        machiningItems: [
          { materialCode: 'JJ-2026-001', drawingNo: 'PACK-02-10', itemName: '定位销轴', quantity: 8, material: '45#钢', surfaceTreat: '调质', remark: '' }
        ],
        outsourceItems: [
          { materialCode: 'WG-2026-001', drawingSpec: 'CPU 1214C DC/DC/DC', description: '西门子 S7-1200 PLC', quantity: 2, brand: '西门子', remark: '', link: '' },
          { materialCode: 'WG-2026-002', drawingSpec: 'SGM7J-A5A 750W', description: '安川伺服电机', quantity: 4, brand: '安川', remark: '加急', link: '' }
        ]
      },
      {
        id: 'DIY02', projectCode: 'DIY-PR-2026-002', projectName: '电机扁线绕线机改造', applicantName: '李伟', applicantDept: '自动化车间', workshopCode: 'B',
        applicationDate: '2026-04-15', expectedDate: '2026-05-20', totalAmount: 41800, status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '', remark: '新机型 4 轴联动升级',
        sheetMetalItems: [
          { materialCode: 'BJ-2026-010', drawingNo: 'WX-01-01', itemName: '绕线机底座护板', quantity: 2, material: 'SPCC', surfaceTreat: '喷塑', remark: '' }
        ],
        machiningItems: [
          { materialCode: 'JJ-2026-010', drawingNo: 'WX-01-10', itemName: '主轴法兰', quantity: 2, material: '40Cr', surfaceTreat: '渗碳淬火', remark: '' },
          { materialCode: 'JJ-2026-011', drawingNo: 'WX-01-11', itemName: '张力轮', quantity: 4, material: '铝合金', surfaceTreat: '阳极氧化', remark: '' }
        ],
        outsourceItems: [
          { materialCode: 'WG-2026-010', drawingSpec: 'LS 187 220mm', description: '海德汉光栅尺', quantity: 1, brand: '海德汉', remark: '', link: '' }
        ]
      },
      {
        id: 'DIY03', projectCode: 'DIY-PR-2026-003', projectName: '装配自动锁付线新建', applicantName: '严欢欢', applicantDept: '装配车间', workshopCode: 'C',
        applicationDate: '2026-04-20', expectedDate: '2026-06-01', totalAmount: 36500, status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '', remark: '新增安全门联锁与传送调速',
        sheetMetalItems: [
          { materialCode: 'BJ-2026-020', drawingNo: 'SF-01-01', itemName: '传送带支撑架', quantity: 8, material: 'SPCC', surfaceTreat: '镀锌', remark: '' }
        ],
        machiningItems: [],
        outsourceItems: [
          { materialCode: 'WG-2026-020', drawingSpec: 'G9SE-201 24VDC', description: '欧姆龙安全继电器', quantity: 3, brand: '欧姆龙', remark: '', link: '' },
          { materialCode: 'WG-2026-021', drawingSpec: 'VFD007EL21A 0.75kW', description: '台达变频器', quantity: 2, brand: '台达', remark: '', link: '' }
        ]
      },
      {
        id: 'DIY04', projectCode: 'DIY-PR-2026-004', projectName: 'PCBA 自动测试线工装', applicantName: '陈工', applicantDept: '测试车间', workshopCode: 'C',
        applicationDate: '2026-04-22', expectedDate: '2026-05-30', totalAmount: 9800, status: 'DRAFT', erpPurchaseOrderNo: '', remark: '测试治具与人机界面',
        sheetMetalItems: [],
        machiningItems: [
          { materialCode: 'JJ-2026-040', drawingNo: 'PCBA-01-10', itemName: '治具定位板', quantity: 6, material: '铝合金', surfaceTreat: '阳极氧化', remark: '' }
        ],
        outsourceItems: [
          { materialCode: 'WG-2026-040', drawingSpec: 'MT8071iE 7寸', description: '威纶通触摸屏', quantity: 1, brand: '威纶通', remark: '', link: '' }
        ]
      },
      {
        id: 'DIY05', projectCode: 'DIY-PR-2026-005', projectName: '老化测试线转盘升级', applicantName: '王组长', applicantDept: '老化车间', workshopCode: 'B',
        applicationDate: '2026-04-24', expectedDate: '2026-06-05', totalAmount: 7600, status: 'PUSH_FAILED', erpPurchaseOrderNo: '', remark: '老化转盘旋转计数与编码器',
        sheetMetalItems: [
          { materialCode: 'BJ-2026-050', drawingNo: 'LH-01-01', itemName: '转盘护栏', quantity: 4, material: 'SUS304', surfaceTreat: '抛光', remark: '' }
        ],
        machiningItems: [
          { materialCode: 'JJ-2026-050', drawingNo: 'LH-01-10', itemName: '转盘中心轴', quantity: 1, material: '45#钢', surfaceTreat: '调质', remark: '' }
        ],
        outsourceItems: [
          { materialCode: 'WG-2026-050', drawingSpec: 'E6B2-CWZ6C 1024P/R', description: '欧姆龙旋转编码器', quantity: 2, brand: '欧姆龙', remark: '', link: '' }
        ]
      },
      {
        id: 'DIY06', projectCode: 'DIY-PR-2026-006', projectName: 'CNC 上下料桁架', applicantName: '彭向', applicantDept: '数控机加车间', workshopCode: 'CNC',
        applicationDate: '2026-04-26', expectedDate: '2026-06-10', totalAmount: 52000, status: 'FEISHU_REJECTED', erpPurchaseOrderNo: '', remark: '财务驳回：预算已用完，建议二季度',
        sheetMetalItems: [
          { materialCode: 'BJ-2026-060', drawingNo: 'HJ-01-01', itemName: '桁架横梁罩', quantity: 4, material: 'SPCC', surfaceTreat: '喷塑', remark: '' }
        ],
        machiningItems: [
          { materialCode: 'JJ-2026-060', drawingNo: 'HJ-01-10', itemName: '夹爪导轨座', quantity: 2, material: '40Cr', surfaceTreat: '淬火', remark: '' }
        ],
        outsourceItems: [
          { materialCode: 'WG-2026-060', drawingSpec: 'IPC-510 i5/8G/256SSD', description: '研华工控机', quantity: 1, brand: '研华', remark: '', link: '' }
        ]
      }
    ]
  }
}
