# Liren OJ Admin - 管理后台

基于 Vue 3 + TypeScript + Vite + Element Plus 开发的在线判题系统管理后台。

## 技术栈

- **框架**: Vue 3.5 (Composition API)
- **构建工具**: Vite 7.2
- **UI 组件库**: Element Plus 2.13
- **图标库**: @element-plus/icons-vue 2.3
- **状态管理**: Pinia 3.0
- **路由管理**: Vue Router 4.6
- **HTTP 客户端**: Axios 1.13
- **CSS 预处理**: Sass 1.97
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

### 重要提示

⚠️ **敏感信息**: 以下为开发环境的默认账号和配置，仅用于本地开发和测试。**在生产环境中，请务必修改为强密码并配置正确的后端服务地址。**

### 管理员账号（示例）
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
│   │   ├── index.ts      # Axios 实例配置
│   │   ├── auth.ts       # 认证相关接口
│   │   ├── dashboard.ts  # 数据概览接口
│   │   ├── problem.ts    # 题目管理接口
│   │   ├── user.ts       # 用户管理接口
│   │   ├── contest.ts    # 竞赛管理接口
│   │   ├── submit.ts     # 提交记录接口
│   │   └── solution.ts   # 题解管理接口
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts      # 全局类型定义
│   ├── utils/            # 工具函数
│   │   └── index.ts      # 通用工具函数
│   ├── stores/           # 状态管理
│   │   └── user.ts       # 用户状态管理
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由配置和守卫
│   ├── layout/           # 布局组件
│   │   ├── AdminLayout.vue    # 管理后台布局
│   │   └── components/        # 布局相关组件
│   │       ├── Sidebar.vue    # 侧边栏
│   │       ├── Header.vue     # 顶部导航
│   │       └── Breadcrumb.vue # 面包屑
│   ├── views/            # 页面组件
│   │   ├── Login.vue         # 登录页
│   │   ├── Dashboard.vue     # 数据概览
│   │   ├── problem/          # 题目管理
│   │   │   ├── List.vue      # 题目列表
│   │   │   ├── Edit.vue      # 新增/编辑题目
│   │   │   └── Detail.vue    # 题目详情
│   │   ├── user/             # 用户管理
│   │   │   └── List.vue      # 用户列表
│   │   ├── contest/          # 竞赛管理
│   │   │   ├── List.vue      # 竞赛列表
│   │   │   └── Edit.vue      # 新增/编辑竞赛
│   │   ├── submit/           # 提交记录
│   │   │   └── List.vue      # 提交记录列表
│   │   └── solution/         # 题解管理
│   │       └── List.vue      # 题解列表
│   ├── App.vue           # 应用根组件
│   └── main.ts           # 应用入口
├── public/               # 静态资源
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目依赖
└── README.md             # 项目说明
```

## 核心功能说明

### 1. 数据概览 Dashboard
- 实时展示系统核心指标
- 用户总数、题目总数、提交总数、竞赛总数
- 题目难度分布图表(简单/中等/困难)
- 最近提交记录实时更新

### 2. 题目管理
- 题目列表支持分页、搜索、难度筛选
- 新增/编辑题目(标题、难度、描述、限制等)
- 题目详情查看
- 测试用例管理(增删改查)
- 支持富文本编辑器编辑题目描述

### 3. 用户管理
- 用户列表支持分页、搜索、状态筛选
- 查看用户详细信息
- 禁用/启用用户账号
- 查看用户统计数据(提交数、通过数、Rating 评分)

### 4. 竞赛管理
- 竞赛列表支持分页、搜索、状态筛选
- 新增/编辑竞赛(标题、描述、时间等)
- 竞赛详情查看
- 竞赛题目关联管理
- 添加/移除竞赛题目

### 5. 提交记录
- 提交记录列表支持分页、搜索、筛选
- 查看提交详情(代码、结果、耗时、内存)
- 判题结果筛选(AC/WA/TLE/MLE/CE等)
- 编程语言筛选(Java/C++/Python)

### 6. 题解管理
- 题解列表支持分页、搜索、状态筛选
- 查看题解详情(支持 Markdown 渲染)
- 审核题解(通过/驳回)
- 下架题解
- 删除题解

## API 接口列表

### 认证接口
- `POST /system/user/login` - 管理员登录

### 题目管理接口
- `POST /problem/add` - 新增题目
- `POST /problem/list/page` - 分页获取题目列表
- `GET /problem/detail/{problemId}` - 获取题目详情
- `POST /problem/update` - 更新题目
- `POST /problem/delete` - 删除题目

### 用户管理接口
- `POST /system/user/list` - 分页获取用户列表
- `GET /system/user/{userId}` - 获取用户详情
- `POST /system/user/update/status` - 更新用户状态

### 竞赛管理接口
- `POST /contest/add` - 新增/更新竞赛
- `POST /contest/list` - 分页获取竞赛列表
- `GET /contest/{contestId}` - 获取竞赛详情
- `POST /contest/problem/add` - 添加题目到竞赛
- `POST /contest/problem/remove` - 移除竞赛题目

### 提交记录接口
- `POST /problem/submit/result/list` - 获取提交记录列表
- `GET /problem/submit/result/{submitId}` - 获取提交详情

### 题解管理接口
- `POST /solution/list` - 分页获取题解列表
- `GET /solution/{solutionId}` - 获取题解详情
- `POST /solution/review` - 审核题解
- `POST /solution/offline` - 下架题解
- `POST /solution/delete` - 删除题解

## 特色功能

1. **完整的类型系统**: 与后端 Java 实体完全对齐的 TypeScript 类型定义
2. **权限控制**: 基于 JWT 的认证机制，路由守卫保护
3. **响应式布局**: 侧边栏可折叠，适配不同屏幕尺寸
4. **统一错误处理**: Axios 拦截器统一处理请求和响应错误
5. **数据持久化**: 用户登录状态持久化到 localStorage
6. **自动导入**: 使用 unplugin-auto-import 和 unplugin-vue-components 自动导入组件和 API
7. **权限路由**: 基于角色的路由权限控制
8. **面包屑导航**: 自动生成页面面包屑

## 注意事项

1. **雪花算法 ID 处理**: 所有 ID 字段使用 String 类型，避免 JavaScript 精度丢失
2. **Token 认证**: 所有 API 请求自动携带 Authorization 头
3. **统一响应格式**: 后端返回格式为 `{ code, message, data }`
4. **错误码 1000**: code 为 1000 表示成功，其他值为失败
5. **路由守卫**: 未登录用户自动跳转到登录页
6. **权限验证**: 管理员权限验证，非管理员无法访问

## 技术亮点

1. **组件化设计**: 高度模块化的组件结构，易于维护和扩展
2. **性能优化**: 路由懒加载，提升首屏加载速度
3. **开发体验**: Vite HMR 提供极速的开发体验
4. **类型安全**: 完整的 TypeScript 类型定义，减少运行时错误
5. **自动导入**: 组件和 API 自动导入，提升开发效率
6. **用户体验**: 统一的错误提示、Loading 状态、过渡动画

## 浏览器支持

- Chrome (推荐)
- Firefox
- Edge
- Safari

## 常见问题

### 1. 登录后刷新页面丢失登录状态
- 确保使用了 localStorage 持久化 token
- 检查路由守卫是否正确配置

### 2. API 请求失败
- 检查后端服务是否正常启动
- 检查代理配置是否正确
- 查看浏览器控制台和网络请求详情

### 3. 页面样式异常
- 清除浏览器缓存
- 检查 Element Plus 样式是否正确导入

## 开发建议

1. **代码规范**: 遵循 TypeScript 和 Vue 3 最佳实践
2. **组件命名**: 使用 PascalCase 命名组件文件
3. **类型定义**: 所有 API 接口都应该定义明确的 TypeScript 类型
4. **错误处理**: 统一使用 try-catch 处理异步错误
5. **代码注释**: 关键业务逻辑添加注释说明

## 许可证

MIT License
