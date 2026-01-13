import request from '@/utils/request'
import type {
  UserQueryRequest,
  UserEntity,
  UserUpdateDTO,
  PageResult
} from '@/types/global'

/**
 * 分页获取用户列表
 */
export const getUserList = (data: UserQueryRequest): Promise<PageResult<UserEntity>> => {
  return request.post('/user/list/page', data)
}

/**
 * 获取用户详情
 */
export const getUserDetail = (userId: string): Promise<UserEntity> => {
  return request.get(`/user/${userId}`)
}

/**
 * 更新用户信息
 */
export const updateUser = (data: UserUpdateDTO): Promise<boolean> => {
  return request.post('/user/update', data)
}

/**
 * 禁用/启用用户
 */
export const updateUserStatus = (userId: string, status: number): Promise<boolean> => {
  return request.post('/user/status', { userId, status })
}

/**
 * 删除用户
 */
export const deleteUser = (userId: string): Promise<boolean> => {
  return request.delete(`/user/${userId}`)
}
