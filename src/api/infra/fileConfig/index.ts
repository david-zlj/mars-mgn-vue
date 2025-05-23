import request from '@/config/axios'

export interface FileClientConfig {
  basePath: string
  host?: string
  port?: number
  username?: string
  password?: string
  mode?: string
  endpoint?: string
  bucket?: string
  accessKey?: string
  accessSecret?: string
  enablePathStyleAccess?: boolean
  domain: string
}

export interface FileConfigVO {
  id: number
  name: string
  storage?: number
  master: boolean
  visible: boolean
  config: FileClientConfig
  remark: string
  createTime: Date
}

// 查询文件配置列表
export const getFileConfigPage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/infra/file-config', params: newParams })
}

// 查询文件配置详情
export const getFileConfig = (id: number) => {
  return request.get({ url: `/infra/file-config/${id}` })
}

// 更新文件配置为主配置
export const updateFileConfigMaster = (id: number) => {
  return request.put({ url: `/infra/file-config/${id}/master` })
}

// 新增文件配置
export const createFileConfig = (data: FileConfigVO) => {
  return request.post({ url: '/infra/file-config', data })
}

// 修改文件配置
export const updateFileConfig = (data: FileConfigVO) => {
  return request.put({ url: `/infra/file-config/${data.id}`, data })
}

// 删除文件配置
export const deleteFileConfig = (id: number) => {
  return request.delete({ url: `/infra/file-config/${id}` })
}

// 测试文件配置
export const testFileConfig = (id: number) => {
  return request.get({ url: `/infra/file-config/${id}/test` })
}
