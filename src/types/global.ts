/**
 * 全局类型定义
 * 与后端 Java 实体对齐
 */

// ==================== 通用类型 ====================

/** 统一响应结构 */
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

/** 分页请求参数 */
export interface PageRequest {
  current: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

/** 分页响应结果 */
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 基础实体 */
export interface BaseEntity {
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
  deleted: number
}

// ==================== 枚举类型 ====================

/** 题目难度 */
export enum DifficultyEnum {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

/** 题目难度文本映射 */
export const DifficultyText: Record<DifficultyEnum, string> = {
  [DifficultyEnum.EASY]: '简单',
  [DifficultyEnum.MEDIUM]: '中等',
  [DifficultyEnum.HARD]: '困难'
}

/** 判题结果 */
export enum JudgeResultEnum {
  ACCEPTED = 1,
  WRONG_ANSWER = 2,
  TIME_LIMIT_EXCEEDED = 3,
  MEMORY_LIMIT_EXCEEDED = 4,
  RUNTIME_ERROR = 5,
  COMPILE_ERROR = 6,
  SYSTEM_ERROR = 7
}

/** 判题结果文本映射 */
export const JudgeResultText: Record<JudgeResultEnum, string> = {
  [JudgeResultEnum.ACCEPTED]: '通过 (AC)',
  [JudgeResultEnum.WRONG_ANSWER]: '答案错误 (WA)',
  [JudgeResultEnum.TIME_LIMIT_EXCEEDED]: '运行超时 (TLE)',
  [JudgeResultEnum.MEMORY_LIMIT_EXCEEDED]: '内存超限 (MLE)',
  [JudgeResultEnum.RUNTIME_ERROR]: '运行错误 (RE)',
  [JudgeResultEnum.COMPILE_ERROR]: '编译错误 (CE)',
  [JudgeResultEnum.SYSTEM_ERROR]: '系统错误 (SE)'
}

/** 提交状态 */
export enum SubmitStatusEnum {
  WAITING = 0,
  JUDGING = 10,
  SUCCEED = 30,
  FAILED = 40
}

/** 提交状态文本映射 */
export const SubmitStatusText: Record<SubmitStatusEnum, string> = {
  [SubmitStatusEnum.WAITING]: '等待判题',
  [SubmitStatusEnum.JUDGING]: '判题中',
  [SubmitStatusEnum.SUCCEED]: '判题完成',
  [SubmitStatusEnum.FAILED]: '判题失败'
}

/** 编程语言 */
export enum LanguageEnum {
  JAVA = 'java',
  CPP = 'cpp',
  PYTHON = 'python',
  C = 'c',
  GO = 'go',
  JAVASCRIPT = 'javascript'
}

/** 编程语言文本映射 */
export const LanguageText: Record<LanguageEnum, string> = {
  [LanguageEnum.JAVA]: 'Java',
  [LanguageEnum.CPP]: 'C++',
  [LanguageEnum.PYTHON]: 'Python',
  [LanguageEnum.C]: 'C',
  [LanguageEnum.GO]: 'Go',
  [LanguageEnum.JAVASCRIPT]: 'JavaScript'
}

/** 竞赛状态 */
export enum ContestStatusEnum {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  ENDED = 2
}

/** 竞赛状态文本映射 */
export const ContestStatusText: Record<ContestStatusEnum, string> = {
  [ContestStatusEnum.NOT_STARTED]: '未开始',
  [ContestStatusEnum.IN_PROGRESS]: '进行中',
  [ContestStatusEnum.ENDED]: '已结束'
}

/** 用户状态 */
export enum UserStatusEnum {
  DISABLED = 0,
  NORMAL = 1
}

/** 用户状态文本映射 */
export const UserStatusText: Record<UserStatusEnum, string> = {
  [UserStatusEnum.DISABLED]: '禁用',
  [UserStatusEnum.NORMAL]: '正常'
}

/** 题目状态 */
export enum ProblemStatusEnum {
  HIDDEN = 0,
  NORMAL = 1
}

/** 题目状态文本映射 */
export const ProblemStatusText: Record<ProblemStatusEnum, string> = {
  [ProblemStatusEnum.HIDDEN]: '隐藏',
  [ProblemStatusEnum.NORMAL]: '正常'
}

/** 题解状态 */
export enum SolutionStatusEnum {
  DRAFT = 0,
  PUBLISHED = 1,
  OFFLINE = 2
}

/** 题解状态文本映射 */
export const SolutionStatusText: Record<SolutionStatusEnum, string> = {
  [SolutionStatusEnum.DRAFT]: '草稿',
  [SolutionStatusEnum.PUBLISHED]: '已发布',
  [SolutionStatusEnum.OFFLINE]: '已下架'
}

/** 题解类型 */
export enum SolutionTypeEnum {
  USER = 0,
  OFFICIAL = 1
}

/** 题解类型文本映射 */
export const SolutionTypeText: Record<SolutionTypeEnum, string> = {
  [SolutionTypeEnum.USER]: '用户题解',
  [SolutionTypeEnum.OFFICIAL]: '官方题解'
}

// ==================== DTO 类型 ====================

/** 管理员登录 DTO */
export interface AdminLoginDTO {
  userAccount: string
  password: string
}

/** 题目查询请求 */
export interface ProblemQueryRequest extends PageRequest {
  keyword?: string
  difficulty?: DifficultyEnum
  status?: ProblemStatusEnum
  tags?: string[]
}

/** 题目添加/更新 DTO */
export interface ProblemAddDTO {
  problemId?: string
  title: string
  difficulty: DifficultyEnum
  description: string
  inputDescription: string
  outputDescription: string
  timeLimit: number
  memoryLimit: number
  stackLimit?: number
  sampleInput: string
  sampleOutput: string
  hint?: string
  source?: string
  tags?: string[]
  status?: ProblemStatusEnum
  testCases?: TestCaseDTO[]
}

/** 测试用例 DTO */
export interface TestCaseDTO {
  caseId?: string
  problemId?: string
  input: string
  output: string
}

/** 用户查询请求 */
export interface UserQueryRequest extends PageRequest {
  keyword?: string
  status?: UserStatusEnum
}

/** 用户更新 DTO */
export interface UserUpdateDTO {
  userId: string
  nickName?: string
  email?: string
  phone?: string
  school?: string
  status?: UserStatusEnum
  avatar?: string
}

/** 竞赛查询请求 */
export interface ContestQueryRequest extends PageRequest {
  keyword?: string
  status?: ContestStatusEnum
}

/** 竞赛添加/更新 DTO */
export interface ContestAddDTO {
  contestId?: string
  title: string
  description?: string
  startTime: string
  endTime: string
}

/** 竞赛题目关联 DTO */
export interface ContestProblemAddDTO {
  contestId: string
  problemId: string
  displayId: string
  displayTitle?: string
}

/** 提交记录查询请求 */
export interface SubmissionQueryRequest extends PageRequest {
  problemId?: string
  userId?: string
  judgeResult?: JudgeResultEnum
  language?: LanguageEnum
}

/** 题解查询请求 */
export interface SolutionQueryRequest extends PageRequest {
  problemId?: string
  userId?: string
  status?: SolutionStatusEnum
  type?: SolutionTypeEnum
}

// ==================== Entity 类型 ====================

/** 用户实体 */
export interface UserEntity extends BaseEntity {
  userId: string
  userAccount: string
  password?: string
  nickName: string
  avatar: string
  email: string
  phone?: string
  school?: string
  status: UserStatusEnum
  submittedCount: number
  acceptedCount: number
  rating: number
}

/** 题目实体 */
export interface ProblemEntity extends BaseEntity {
  problemId: string
  title: string
  difficulty: DifficultyEnum
  submitNum: number
  acceptedNum: number
  description: string
  inputDescription: string
  outputDescription: string
  timeLimit: number
  memoryLimit: number
  stackLimit: number
  sampleInput: string
  sampleOutput: string
  hint: string
  source: string
  status: ProblemStatusEnum
}

/** 测试用例实体 */
export interface TestCaseEntity {
  caseId: string
  problemId: string
  input: string
  output: string
  createTime: string
  updateTime: string
}

/** 提交记录实体 */
export interface SubmitRecordEntity {
  submitId: string
  problemId: string
  contestId: string
  userId: string
  code: string
  language: LanguageEnum
  status: SubmitStatusEnum
  judgeResult: JudgeResultEnum
  timeCost: number
  memoryCost: number
  errorMessage: string
  passCaseCount: number
  totalCaseCount: number
  createTime: string
  updateTime: string
}

/** 竞赛实体 */
export interface ContestEntity extends BaseEntity {
  contestId: string
  title: string
  description: string
  status: ContestStatusEnum
  startTime: string
  endTime: string
}

/** 题目标签实体 */
export interface ProblemTagEntity {
  tagId: string
  tagName: string
  tagColor: string
}

/** 题解实体 */
export interface SolutionEntity extends BaseEntity {
  solutionId: string
  problemId: string
  userId: string
  title: string
  content: string
  cover: string
  visitCount: number
  likeCount: number
  replyCount: number
  type: SolutionTypeEnum
  status: SolutionStatusEnum
}

// ==================== VO 类型 ====================

/** 管理员登录响应 */
export interface AdminLoginVO {
  user: UserEntity
  token: string
}

/** 题目 VO */
export interface ProblemVO {
  problemId: string
  title: string
  difficulty: DifficultyEnum
  submitNum: number
  acceptedNum: number
  tags?: ProblemTagVO[]
  status?: ProblemStatusEnum
  createTime?: string
}

/** 题目详情 VO */
export interface ProblemDetailVO extends ProblemVO {
  description: string
  inputDescription: string
  outputDescription: string
  timeLimit: number
  memoryLimit: number
  stackLimit: number
  sampleInput: string
  sampleOutput: string
  hint: string
  source: string
  updateTime: string
}

/** 题目标签 VO */
export interface ProblemTagVO {
  tagId: string
  tagName: string
  tagColor: string
}

/** 提交记录 VO */
export interface SubmitRecordVO {
  submitId: string
  problemId: string
  problemTitle?: string
  userId: string
  userAccount?: string
  userName?: string
  avatar?: string
  language: LanguageEnum
  status: SubmitStatusEnum
  judgeResult: JudgeResultEnum
  timeCost: number
  memoryCost: number
  passCaseCount: number
  totalCaseCount: number
  createTime: string
}

/** 竞赛 VO */
export interface ContestVO {
  contestId: string
  title: string
  description: string
  status: ContestStatusEnum
  startTime: string
  endTime: string
  duration?: string
  createTime?: string
}

/** 竞赛题目 VO */
export interface ContestProblemVO {
  id: string
  contestId: string
  problemId: string
  displayId: string
  title: string
  difficulty: DifficultyEnum
}

/** 题解 VO */
export interface SolutionVO {
  solutionId: string
  problemId: string
  problemTitle?: string
  userId: string
  userName?: string
  userAvatar?: string
  title: string
  content: string
  cover: string
  visitCount: number
  likeCount: number
  replyCount: number
  type: SolutionTypeEnum
  status: SolutionStatusEnum
  createTime: string
  updateTime: string
}

/** 用户基础信息 DTO */
export interface UserBasicInfoDTO {
  userId: string
  userAccount: string
  nickName: string
  avatar: string
}

/** 排行榜单项 VO */
export interface RankItemVO {
  userId: string
  nickname: string
  avatar: string
  acceptedCount: number
  rank?: number
}
