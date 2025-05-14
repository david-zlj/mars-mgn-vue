import request from '@/config/axios'

export type DictTypeVO = {
  id: number | undefined
  name: string
  type: string
  status: number
  remark: string
  createTime: Date
}

// 查询字典（精简)列表
export const getSimpleDictTypeList = () => {
  return request.get({ url: '/system/dict-type/list-all-simple' })
}

// 查询字典列表
export const getDictTypePage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/system/dict-type', params: newParams })
}

// 查询字典详情
export const getDictType = (id: number) => {
  return request.get({ url: `/system/dict-type/${id}` })
}

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  return request.post({ url: '/system/dict-type', data })
}

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  return request.put({ url: `/system/dict-type/${data.id}`, data })
}

// 删除字典
export const deleteDictType = (id: number) => {
  return request.delete({ url: `/system/dict-type/${id}` })
}
// 导出字典类型
export const exportDictType = (params) => {
  return request.download({ url: '/system/dict-type/export', params })
}
