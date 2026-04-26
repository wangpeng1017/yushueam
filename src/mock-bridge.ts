/**
 * Mock 桥接：从 src/mock-data/ 导出 mock 匹配函数
 */
// @ts-nocheck
import authMock from './mock-data/auth'
import equipmentMock from './mock-data/eam-equipment'
import workorderMock from './mock-data/eam-workorder'
import extraMock from './mock-data/eam-extra'
import routeMock from './mock-data/eam-inspection-route'
import knowledgeMock from './mock-data/eam-knowledge'
import projectMock from './mock-data/eam-project'
import iotOeeMock from './mock-data/eam-iot-oee'
import toolingMock from './mock-data/eam-tooling'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock, ...routeMock, ...knowledgeMock, ...projectMock, ...iotOeeMock, ...toolingMock]

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
