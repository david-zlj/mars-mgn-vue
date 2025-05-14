import request from '@/config/axios'

export interface RoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  type: number
  dataScope: number
  dataScopeDeptIds: number[]
  createTime: Date
}

export interface UpdateStatusReqVO {
  id: number
  status: number
}

// 查询角色列表
export const getRolePage = async (params: PageParam) => {
    // 处理时间范围参数
    const newParams = { ...params }
    if (newParams.createTime && Array.isArray(newParams.createTime)) {
      newParams.createTimeBegin = newParams.createTime[0]
      newParams.createTimeEnd = newParams.createTime[1]
      delete newParams.createTime
    }
  return await request.get({ url: '/system/role', params: newParams })
}

// 查询角色（精简)列表
export const getSimpleRoleList = async (): Promise<RoleVO[]> => {
  return await request.get({ url: '/system/role/simple-list' })
}

// 查询角色详情
export const getRole = async (id: number) => {
  return await request.get({ url: `/system/role/${id}` })
}

// 新增角色
export const createRole = async (data: RoleVO) => {
  return await request.post({ url: '/system/role', data })
}

// 修改角色
export const updateRole = async (data: RoleVO) => {
  return await request.put({ url: `/system/role/${data.id}`, data })
}

// 修改角色状态
export const updateRoleStatus = async (data: UpdateStatusReqVO) => {
  return await request.put({ url: `/system/role/${data.id}/status`, data })
}

// 删除角色
export const deleteRole = async (id: number) => {
  return await request.delete({ url: `/system/role/${id}` })
}

// 导出角色
export const exportRole = (params) => {
  return request.download({
    url: '/system/role/export',
    params
  })
}
