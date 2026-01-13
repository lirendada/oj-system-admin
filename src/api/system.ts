import request from '@/utils/request'
import type {
  AdminLoginDTO,
  AdminLoginVO,
  Result
} from '@/types/global'

/**
 * 管理员登录
 */
export const login = (data: AdminLoginDTO): Promise<AdminLoginVO> => {
  return request.post('/system/user/login', data)
}

/**
 * 获取当前管理员信息
 */
export const getAdminInfo = (): Promise<AdminLoginVO['user']> => {
  return request.get('/system/user/info')
}

/**
 * 管理员退出登录
 */
export const logout = (): Promise<void> => {
  return request.post('/system/user/logout')
}
