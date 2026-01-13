import request from '@/utils/request'
import type {
  SolutionQueryRequest,
  SolutionVO,
  PageResult
} from '@/types/global'

/**
 * 分页获取题解列表
 */
export const getSolutionList = (data: SolutionQueryRequest): Promise<PageResult<SolutionVO>> => {
  return request.post('/solution/list/page', data)
}

/**
 * 获取题解详情
 */
export const getSolutionDetail = (solutionId: string): Promise<SolutionVO> => {
  return request.get(`/solution/${solutionId}`)
}

/**
 * 审核题解(通过/驳回)
 */
export const reviewSolution = (solutionId: string, status: number): Promise<boolean> => {
  return request.post('/solution/review', { solutionId, status })
}

/**
 * 下架题解
 */
export const offlineSolution = (solutionId: string): Promise<boolean> => {
  return request.post(`/solution/offline/${solutionId}`)
}

/**
 * 删除题解
 */
export const deleteSolution = (solutionId: string): Promise<boolean> => {
  return request.delete(`/solution/${solutionId}`)
}
