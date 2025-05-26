import request from '@/config/axios'

export interface JobLogVO {
  id: number
  jobId: number
  taskName: string
  taskKwargs: string
  cronExpression: string
  executeIndex: string
  dateCreated: Date
  dateStarted: Date
  dateDone: Date
  duration: string
  status: number
  result: string
}

// 任务日志列表
export const getJobLogPage = (params: PageParam) => {
  return request.get({ url: '/infra/job-log', params })
}

// 任务日志详情
export const getJobLog = (id: number) => {
  return request.get({ url: `/infra/job-log/${id}` })
}

// 导出定时任务日志
export const exportJobLog = (params) => {
  return request.download({
    url: '/infra/job-log/export',
    params
  })
}
