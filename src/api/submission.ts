import request from '@/utils/request'
import type {
  SubmissionQueryRequest,
  SubmitRecordVO,
  PageResult
} from '@/types/global'

/**
 * 分页获取提交记录列表
 */
export const getSubmissionList = (data: SubmissionQueryRequest): Promise<PageResult<SubmitRecordVO>> => {
  return request.post('/problem/submit/result/list', data)
}

/**
 * 获取提交记录详情
 */
export const getSubmissionDetail = (submitId: string): Promise<SubmitRecordVO> => {
  return request.get(`/problem/submit/result/${submitId}`)
}

/**
 * 获取提交代码
 */
export const getSubmissionCode = (submitId: string): Promise<string> => {
  return request.get(`/problem/submit/code/${submitId}`)
}
