import request from '@/config/axios'

export interface LoginLogVO {
  id: number
  logType: number
  traceId: number
  userId: number
  userType: number
  username: string
  result: number
  status: number
  userIp: string
  userAgent: string
  createTime: Date
}

// 查询登录日志列表
export const getLoginLogPage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/system/login-log', params: newParams })
}

// 导出登录日志
export const exportLoginLog = (params) => {
  return request.download({ url: '/system/login-log/export', params })
}
