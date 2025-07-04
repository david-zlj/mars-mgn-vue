import request from '@/config/axios'

export interface UserVO {
  id: number
  username: string
  nickname: string
  deptId: number
  postIds: string[]
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  status: number
  remark: string
  loginDate: Date
  createTime: Date
}

// 查询用户管理列表
export const getUserPage = (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.createTime && Array.isArray(newParams.createTime)) {
    newParams.createTimeBegin = newParams.createTime[0]
    newParams.createTimeEnd = newParams.createTime[1]
    delete newParams.createTime
  }
  return request.get({ url: '/system/user', params: newParams })
}

// 查询用户详情
export const getUser = (id: number) => {
  return request.get({ url: `/system/user/${id}` })
}

// 新增用户
export const createUser = (data: UserVO) => {
  return request.post({ url: '/system/user', data })
}

// 修改用户
export const updateUser = (data: UserVO) => {
  return request.put({ url: `/system/user/${data.id}`, data })
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete({ url: `/system/user/${id}` })
}

// 导出用户
export const exportUser = (params: any) => {
  return request.download({ url: '/system/user/export', params })
}

// 下载用户导入模板
export const importUserTemplate = () => {
  return request.download({ url: '/system/user/get-import-template' })
}

// 用户密码重置
export const resetUserPassword = (id: number, password: string) => {
  const data = {
    id,
    password
  }
  return request.put({ url: `/system/user/${id}/update-password`, data: data })
}

// 用户状态修改
export const updateUserStatus = (id: number, status: number) => {
  const data = {
    id,
    status
  }
  return request.put({ url: `/system/user/${id}/update-status`, data: data })
}

// 获取用户精简信息列表
export const getSimpleUserList = (): Promise<UserVO[]> => {
  return request.get({ url: '/system/user/simple-list' })
}
