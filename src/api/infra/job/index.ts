import request from '@/config/axios'

export interface JobVO {
  id: number
  name: string
  status: number
  task: string
  kwargs: string
  cronExpression: string
  retryCount: number
  retryInterval: number
  monitorTimeout: number
  createTime: Date
}

// 任务列表
export const getJobPage = (params: PageParam) => {
  return request.get({ url: '/infra/job', params })
}

// 任务详情
export const getJob = (id: number) => {
  return request.get({ url: `/infra/job/${id}` })
}

// 新增任务
export const createJob = (data: JobVO) => {
  return request.post({ url: '/infra/job', data })
}

// 修改定时任务调度
export const updateJob = (data: JobVO) => {
  return request.put({ url: `/infra/job/${data.id}`, data })
}

// 删除定时任务调度
export const deleteJob = (id: number) => {
  return request.delete({ url: `/infra/job/${id}` })
}

// 导出定时任务调度
export const exportJob = (params) => {
  return request.download({ url: '/infra/job/export', params })
}

// 任务状态修改
export const updateJobStatus = (id: number, status: number) => {
  return request.put({ url: `/infra/job/${id}/status`, params: { status } })
}

// 定时任务立即执行一次
export const runJob = (id: number) => {
  return request.put({ url: `/infra/job/${id}/trigger` })
}

// 获得定时任务的下 n 次执行时间
export const getJobNextTimes = (id: number) => {
  return request.get({ url: `/infra/job/${id}/next-times` })
}
