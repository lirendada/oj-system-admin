import request from '@/utils/request'
import type {
  ProblemQueryRequest,
  ProblemVO,
  ProblemDetailVO,
  ProblemAddDTO,
  PageResult,
  TestCaseDTO,
  ProblemTagVO
} from '@/types/global'

/**
 * 分页获取题目列表
 */
export const getProblemList = (data: ProblemQueryRequest): Promise<PageResult<ProblemVO>> => {
  return request.post('/problem/list/page', data)
}

/**
 * 获取题目详情
 */
export const getProblemDetail = (problemId: string): Promise<ProblemDetailVO> => {
  return request.get(`/problem/detail/${problemId}`)
}

/**
 * 新增题目
 */
export const addProblem = (data: ProblemAddDTO): Promise<boolean> => {
  return request.post('/problem/add', data)
}

/**
 * 更新题目
 */
export const updateProblem = (data: ProblemAddDTO): Promise<boolean> => {
  return request.post('/problem/update', data)
}

/**
 * 删除题目
 */
export const deleteProblem = (problemId: string): Promise<boolean> => {
  return request.delete(`/problem/${problemId}`)
}

/**
 * 获取题目的测试用例列表
 */
export const getTestCases = (problemId: string): Promise<TestCaseDTO[]> => {
  return request.get(`/problem/test-case/${problemId}`)
}

/**
 * 添加测试用例
 */
export const addTestCase = (data: TestCaseDTO): Promise<boolean> => {
  return request.post('/problem/test-case/add', data)
}

/**
 * 更新测试用例
 */
export const updateTestCase = (data: TestCaseDTO): Promise<boolean> => {
  return request.post('/problem/test-case/update', data)
}

/**
 * 删除测试用例
 */
export const deleteTestCase = (caseId: string): Promise<boolean> => {
  return request.delete(`/problem/test-case/${caseId}`)
}

/**
 * 获取所有标签
 */
export const getAllTags = (): Promise<ProblemTagVO[]> => {
  return request.get('/problem/tag/all')
}

/**
 * 添加标签
 */
export const addTag = (data: { tagName: string; tagColor: string }): Promise<boolean> => {
  return request.post('/problem/tag/add', data)
}

/**
 * 更新标签
 */
export const updateTag = (data: { tagId: string; tagName: string; tagColor: string }): Promise<boolean> => {
  return request.post('/problem/tag/update', data)
}

/**
 * 删除标签
 */
export const deleteTag = (tagId: string): Promise<boolean> => {
  return request.delete(`/problem/tag/${tagId}`)
}
