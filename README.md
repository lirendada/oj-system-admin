# Liren OJ Admin - 管理后台

基于 Vue 3 + TypeScript + Vite + Element Plus 开发的在线判题系统管理后台。

## 技术栈

- **框架**: Vue 3.5 (Composition API)
- **构建工具**: Vite 7.2
- **UI 组件库**: Element Plus 2.13
- **状态管理**: Pinia 3.0
- **路由管理**: Vue Router 4.6
- **HTTP 客户端**: Axios 1.13
- **开发语言**: TypeScript 5.9

## 功能模块

### 1. 数据概览 (Dashboard)
- 用户总数统计
- 题目总数统计
- 提交总数统计
- 竞赛总数统计
- 题目难度分布
- 最近提交记录

### 2. 题目管理
- 题目列表(分页、搜索、筛选)
- 新增题目
- 编辑题目
- 删除题目
- 查看题目详情
- 测试用例管理(CRUD)

### 3. 用户管理
- 用户列表(分页、搜索、筛选)
- 查看用户详情
- 禁用/启用用户
- 用户统计数据(提交数、通过数、Rating)

### 4. 竞赛管理
- 竞赛列表(分页、搜索、筛选)
- 新增竞赛
- 编辑竞赛
- 删除竞赛
- 查看竞赛详情
- 竞赛题目关联管理

### 5. 提交记录
- 提交记录列表(分页、搜索、筛选)
- 查看提交详情
- 查看提交代码
- 判题结果筛选
- 编程语言筛选

### 6. 题解管理
- 题解列表(分页、搜索、筛选)
- 查看题解详情
- 审核题解(通过/驳回)
- 下架题解
- 删除题解

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问地址: http://localhost:3001

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 默认配置

### 管理员账号
- 账号: `admin`
- 密码: `123456`

### API 代理
开发环境默认代理到后端网关: `http://localhost:10020`

### 端口
- 开发服务器端口: `3001`
- 后端网关端口: `10020`

## 项目结构

```
liren-oj-admin/
├── src/
│   ├── api/              # API 接口层
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── stores/           # 状态管理
│   ├── router/           # 路由配置
│   ├── layout/           # 布局组件
│   ├── views/            # 页面组件
│   ├── App.vue           # 应用根组件
│   └── main.ts           # 应用入口
├── public/               # 静态资源
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 特色功能

1. **完整的类型系统**: 与后端 Java 实体完全对齐的 TypeScript 类型定义
2. **权限控制**: 基于 JWT 的认证机制,路由守卫保护
3. **响应式布局**: 侧边栏可折叠,适配不同屏幕
4. **统一错误处理**: Axios 拦截器统一处理请求和响应错误
5. **数据持久化**: 用户登录状态持久化到 localStorage

## 注意事项

1. **雪花算法 ID 处理**: 所有 ID 字段使用 String 类型,避免 JavaScript 精度丢失
2. **Token 认证**: 所有 API 请求自动携带 Authorization 头
3. **统一响应格式**: 后端返回格式为 `{ code, message, data }`
4. **错误码 1000**: code 为 1000 表示成功,其他值为失败
5. **路由守卫**: 未登录用户自动跳转到登录页

## 许可证

MIT License
