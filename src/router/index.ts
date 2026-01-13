import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '管理员登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '数据概览', icon: 'DataAnalysis' }
      },
      {
        path: 'problem',
        name: 'Problem',
        component: () => import('@/views/problem/Index.vue'),
        meta: { title: '题目管理', icon: 'Edit' }
      },
      {
        path: 'problem/detail/:id',
        name: 'ProblemDetail',
        component: () => import('@/views/problem/Detail.vue'),
        meta: { title: '题目详情', hidden: true }
      },
      {
        path: 'problem/edit/:id?',
        name: 'ProblemEdit',
        component: () => import('@/views/problem/Edit.vue'),
        meta: { title: '编辑题目', hidden: true }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/Index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'contest',
        name: 'Contest',
        component: () => import('@/views/contest/Index.vue'),
        meta: { title: '竞赛管理', icon: 'Trophy' }
      },
      {
        path: 'submission',
        name: 'Submission',
        component: () => import('@/views/submission/Index.vue'),
        meta: { title: '提交记录', icon: 'Document' }
      },
      {
        path: 'solution',
        name: 'Solution',
        component: () => import('@/views/solution/Index.vue'),
        meta: { title: '题解管理', icon: 'ChatLineSquare' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  document.title = `${to.meta.title || 'Liren OJ Admin'} - 管理后台`

  // 白名单：不需要登录的页面
  const whiteList = ['/login']

  if (userStore.token) {
    // 已登录
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
