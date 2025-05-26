import request from '@/config/axios'

export interface ConfigVO {
  id: number | undefined
  category: string
  name: string
  configKey: string
  value: string
  type: number
  visible: boolean
  remark: string
  createTime: Date
}

// 查询参数列表
export const getConfigPage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/infra/config', params: newParams })
}

// 查询参数详情
export const getConfig = (id: number) => {
  return request.get({ url: `/infra/config/${id}` })
}

// 根据参数键名查询参数值
export const getConfigKey = (configKey: string) => {
  return request.get({ url: '/infra/config/get-value-by-key?key=' + configKey })
}

// 新增参数
export const createConfig = (data: ConfigVO) => {
  return request.post({ url: '/infra/config', data })
}

// 修改参数
export const updateConfig = (data: ConfigVO) => {
  return request.put({ url: `/infra/config/${data.id}`, data })
}

// 删除参数
export const deleteConfig = (id: number) => {
  return request.delete({ url: `/infra/config/${id}` })
}

// 导出参数
export const exportConfig = (params) => {
  return request.download({ url: '/infra/config/export', params })
}
