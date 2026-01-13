import request from '@/utils/request'
import type {
  ContestQueryRequest,
  ContestVO,
  ContestAddDTO,
  ContestProblemAddDTO,
  ContestProblemVO,
  PageResult
} from '@/types/global'

/**
 * 分页获取竞赛列表
 */
export const getContestList = (data: ContestQueryRequest): Promise<PageResult<ContestVO>> => {
  return request.post('/contest/list', data)
}

/**
 * 获取竞赛详情
 */
export const getContestDetail = (contestId: string): Promise<ContestVO> => {
  return request.get(`/contest/${contestId}`)
}

/**
 * 新增竞赛
 */
export const addContest = (data: ContestAddDTO): Promise<boolean> => {
  return request.post('/contest/add', data)
}

/**
 * 更新竞赛
 */
export const updateContest = (data: ContestAddDTO): Promise<boolean> => {
  return request.post('/contest/update', data)
}

/**
 * 删除竞赛
 */
export const deleteContest = (contestId: string): Promise<boolean> => {
  return request.delete(`/contest/${contestId}`)
}

/**
 * 获取竞赛题目列表
 */
export const getContestProblems = (contestId: string): Promise<ContestProblemVO[]> => {
  return request.get(`/contest/${contestId}/problems`)
}

/**
 * 添加题目到竞赛
 */
export const addContestProblem = (data: ContestProblemAddDTO): Promise<boolean> => {
  return request.post('/contest/problem/add', data)
}

/**
 * 移除竞赛题目
 */
export const removeContestProblem = (contestId: string, problemId: string): Promise<boolean> => {
  return request.post('/contest/problem/remove', null, {
    params: { contestId, problemId }
  })
}
