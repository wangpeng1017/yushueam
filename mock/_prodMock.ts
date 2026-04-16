/**
 * 生产环境 Mock（Vercel 部署用）
 * 通过覆盖全局 XMLHttpRequest 实现，确保所有 axios 实例都被拦截
 */
import authMock from './auth'
import equipmentMock from './eam-equipment'
import workorderMock from './eam-workorder'
import extraMock from './eam-extra'
import routeMock from './eam-inspection-route'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock, ...routeMock]

function matchMock(url: string, method: string) {
  const m = method.toLowerCase()
  for (const mock of allMocks) {
    const mockMethod = (mock.method || 'get').toLowerCase()
    if (m !== mockMethod) continue
    // URL匹配：mock.url 是 /admin-api/xxx，请求url可能是完整URL或相对路径
    const mockPath = mock.url.replace('/admin-api', '')
    if (url.includes(mockPath)) return mock
  }
  return null
}

function parseQueryString(url: string): Record<string, string> {
  const query: Record<string, string> = {}
  const idx = url.indexOf('?')
  if (idx === -1) return query
  const pairs = url.substring(idx + 1).split('&')
  for (const pair of pairs) {
    const [k, v] = pair.split('=')
    if (k) query[decodeURIComponent(k)] = v ? decodeURIComponent(v) : ''
  }
  return query
}

export function setupProdMockServer() {
  const OrigXHR = window.XMLHttpRequest

  // @ts-ignore
  window.XMLHttpRequest = function () {
    const xhr = new OrigXHR()
    const origOpen = xhr.open.bind(xhr)
    const origSend = xhr.send.bind(xhr)
    let _method = 'GET'
    let _url = ''
    let _headers: Record<string, string> = {}

    xhr.open = function (method: string, url: string, ...args: any[]) {
      _method = method
      _url = url
      return origOpen(method, url, ...args)
    }

    const origSetRequestHeader = xhr.setRequestHeader.bind(xhr)
    xhr.setRequestHeader = function (name: string, value: string) {
      _headers[name.toLowerCase()] = value
      return origSetRequestHeader(name, value)
    }

    xhr.send = function (body?: any) {
      const mock = matchMock(_url, _method)
      if (mock) {
        // 解析参数
        const query = parseQueryString(_url)
        let parsedBody = {}
        if (body) {
          try { parsedBody = JSON.parse(body) } catch {}
        }

        // 调用 mock handler
        const responseData = typeof mock.response === 'function'
          ? mock.response({ url: _url, body: parsedBody, query, headers: _headers })
          : mock.response

        // 模拟异步响应
        setTimeout(() => {
          Object.defineProperty(xhr, 'readyState', { writable: true, value: 4 })
          Object.defineProperty(xhr, 'status', { writable: true, value: 200 })
          Object.defineProperty(xhr, 'statusText', { writable: true, value: 'OK' })
          Object.defineProperty(xhr, 'responseText', { writable: true, value: JSON.stringify(responseData) })
          Object.defineProperty(xhr, 'response', { writable: true, value: JSON.stringify(responseData) })

          // 触发事件
          if (typeof xhr.onreadystatechange === 'function') {
            xhr.onreadystatechange(new Event('readystatechange'))
          }
          if (typeof xhr.onload === 'function') {
            xhr.onload(new ProgressEvent('load'))
          }
          xhr.dispatchEvent(new Event('readystatechange'))
          xhr.dispatchEvent(new ProgressEvent('load'))
          xhr.dispatchEvent(new ProgressEvent('loadend'))
        }, 50)

        return // 不发真实请求
      }

      // 未匹配 → 发真实请求（会被 axios error 拦截器兜底）
      return origSend(body)
    }

    return xhr
  }

  // 复制原型属性
  // @ts-ignore
  window.XMLHttpRequest.prototype = OrigXHR.prototype

  console.log('[Mock] 生产环境 Mock 已启用（XHR拦截），共注册', allMocks.length, '个接口')
}
