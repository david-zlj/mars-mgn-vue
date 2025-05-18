import request from '@/config/axios'

export interface MailLogVO {
  id: number
  userId: number
  userType: number
  toMail: string
  accountId: number
  fromMail: string
  templateId: number
  templateCode: string
  templateNickname: string
  templateTitle: string
  templateContent: string
  templateParams: string
  sendStatus: number
  sendTime: Date
  sendMessageId: string
  sendException: string
}

// 查询邮件日志列表
export const getMailLogPage = async (params: PageParam) => {
  // 处理时间范围参数
  const newParams = { ...params }
  if (newParams.sendTime && Array.isArray(newParams.sendTime)) {
    newParams.sendTimeBegin = newParams.sendTime[0]
    newParams.sendTimeEnd = newParams.sendTime[1]
    delete newParams.sendTime
  }
  return await request.get({ url: '/system/mail-log', params: newParams })
}

// 查询邮件日志详情
export const getMailLog = async (id: number) => {
  return await request.get({ url: `/system/mail-log/${id}` })
}
