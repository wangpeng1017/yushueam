/**
 * 生产环境 Mock（Vercel 部署用）
 * 在 axios 请求拦截器之前注入，匹配到 mock 规则时直接返回假数据
 */
import axios from 'axios'
import authMock from './auth'
import equipmentMock from './eam-equipment'
import workorderMock from './eam-workorder'
import extraMock from './eam-extra'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock]

export function setupProdMockServer() {
  // 使用 axios request interceptor 拦截请求
  axios.interceptors.request.use(async (config) => {
    const url = config.url || ''
    const method = (config.method || 'get').toLowerCase()

    for (const mock of allMocks) {
      const mockUrl = mock.url.replace('/admin-api', '')
      if (url.includes(mockUrl) && method === (mock.method || 'get').toLowerCase()) {
        // 解析 query
        const query = config.params || {}

        // 解析 headers
        const headers: Record<string, string> = {}
        if (config.headers) {
          Object.keys(config.headers).forEach(k => {
            headers[k.toLowerCase()] = String(config.headers[k])
          })
        }

        // 调用 mock handler
        const body = config.data || {}
        const responseData = typeof mock.response === 'function'
          ? mock.response({ url, body, query, headers })
          : mock.response

        // 通过 adapter 返回假响应，跳过真实请求
        config.adapter = () => {
          return Promise.resolve({
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config
          })
        }
        break
      }
    }

    return config
  })

  console.log('[Mock] 生产环境 Mock 已启用，共注册', allMocks.length, '个接口')
}
