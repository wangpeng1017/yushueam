/**
 * Mock 桥接文件：从 src/ 目录导出 mock 匹配函数
 * 解决 Vite 构建时 src/ 下文件无法引用项目根目录 mock/ 的问题
 */
// @ts-nocheck
import authMock from '../mock/auth'
import equipmentMock from '../mock/eam-equipment'
import workorderMock from '../mock/eam-workorder'
import extraMock from '../mock/eam-extra'
import routeMock from '../mock/eam-inspection-route'
import knowledgeMock from '../mock/eam-knowledge'
import projectMock from '../mock/eam-project'
import iotOeeMock from '../mock/eam-iot-oee'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock, ...routeMock, ...knowledgeMock, ...projectMock, ...iotOeeMock]

function parseQS(url: string): Record<string, string> {
  const q: Record<string, string> = {}
  const i = url.indexOf('?')
  if (i === -1) return q
  url.substring(i + 1).split('&').forEach(p => {
    const [k, v] = p.split('=')
    if (k) q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : ''
  })
  return q
}

export function tryMatchMock(
  url: string, method: string, data?: any, headers?: Record<string, string>
): any | null {
  const m = method.toLowerCase()
  for (const mock of allMocks) {
    const mm = (mock.method || 'get').toLowerCase()
    if (m !== mm) continue
    const mockPath = mock.url.replace('/admin-api', '')
    if (url.includes(mockPath)) {
      const query = parseQS(url)
      const body = typeof data === 'string'
        ? (() => { try { return JSON.parse(data) } catch { return {} } })()
        : (data || {})
      const hdrs: Record<string, string> = {}
      if (headers) Object.keys(headers).forEach(k => { hdrs[k.toLowerCase()] = String(headers[k]) })
      return typeof mock.response === 'function'
        ? mock.response({ url, body, query, headers: hdrs })
        : mock.response
    }
  }
  return null
}
