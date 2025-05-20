import request from '@/config/axios'

export type OperateLogVO = {
  id: number
  traceId: string
  userType: number
  userId: number
  username: string
  type: string
  subType: string
  bizId: number
  action: string
  extra: string
  requestMethod: string
  requestUrl: string
  userIp: string
  userAgent: string
  creator: string
  creatorName: string
  createTime: Date
}

// 查询操作日志列表
export const getOperateLogPage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/system/operate-log', params: newParams })
}
// 导出操作日志
export const exportOperateLog = (params: any) => {
  return request.download({ url: '/system/operate-log/export', params })
}
