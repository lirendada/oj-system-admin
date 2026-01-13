<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="welcome-title">欢迎回来，管理员 👋</h1>
        <p class="welcome-subtitle">这是您的数据概览面板</p>
      </div>
      <div class="banner-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card modern-card" style="--card-color: #667eea;">
        <div class="stat-background">
          <div class="stat-circle"></div>
        </div>
        <div class="stat-content">
          <div class="stat-icon-wrapper">
            <el-icon :size="28" class="stat-icon"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.userCount }}</div>
            <div class="stat-label">用户总数</div>
            <div class="stat-trend">
              <el-icon class="trend-icon"><TrendCharts /></el-icon>
              <span>+12.5%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card modern-card" style="--card-color: #f093fb;">
        <div class="stat-background">
          <div class="stat-circle"></div>
        </div>
        <div class="stat-content">
          <div class="stat-icon-wrapper">
            <el-icon :size="28" class="stat-icon"><Edit /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.problemCount }}</div>
            <div class="stat-label">题目总数</div>
            <div class="stat-trend">
              <el-icon class="trend-icon"><TrendCharts /></el-icon>
              <span>+8.3%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card modern-card" style="--card-color: #4facfe;">
        <div class="stat-background">
          <div class="stat-circle"></div>
        </div>
        <div class="stat-content">
          <div class="stat-icon-wrapper">
            <el-icon :size="28" class="stat-icon"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.submissionCount }}</div>
            <div class="stat-label">提交总数</div>
            <div class="stat-trend">
              <el-icon class="trend-icon"><TrendCharts /></el-icon>
              <span>+23.1%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card modern-card" style="--card-color: #43e97b;">
        <div class="stat-background">
          <div class="stat-circle"></div>
        </div>
        <div class="stat-content">
          <div class="stat-icon-wrapper">
            <el-icon :size="28" class="stat-icon"><Trophy /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.contestCount }}</div>
            <div class="stat-label">竞赛总数</div>
            <div class="stat-trend">
              <el-icon class="trend-icon"><TrendCharts /></el-icon>
              <span>+5.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-grid">
      <!-- 难度分布 -->
      <div class="chart-card modern-card">
        <div class="card-header">
          <div class="header-left">
            <el-icon class="header-icon"><PieChart /></el-icon>
            <h3 class="header-title">题目难度分布</h3>
          </div>
          <el-button type="primary" link @click="viewAllProblems">
            查看详情
            <el-icon class="ml-1"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="difficulty-chart">
          <div class="difficulty-item">
            <div class="difficulty-header">
              <div class="difficulty-label">
                <div class="label-dot" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"></div>
                <span>简单</span>
              </div>
              <div class="difficulty-stats">
                <span class="stat-number">{{ difficultyStats.easy }}</span>
                <span class="stat-percentage">{{ calculatePercentage(difficultyStats.easy, stats.problemCount) }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill easy"
                :style="{ width: calculatePercentage(difficultyStats.easy, stats.problemCount) + '%' }"
              ></div>
            </div>
          </div>

          <div class="difficulty-item">
            <div class="difficulty-header">
              <div class="difficulty-label">
                <div class="label-dot" style="background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)"></div>
                <span>中等</span>
              </div>
              <div class="difficulty-stats">
                <span class="stat-number">{{ difficultyStats.medium }}</span>
                <span class="stat-percentage">{{ calculatePercentage(difficultyStats.medium, stats.problemCount) }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill medium"
                :style="{ width: calculatePercentage(difficultyStats.medium, stats.problemCount) + '%' }"
              ></div>
            </div>
          </div>

          <div class="difficulty-item">
            <div class="difficulty-header">
              <div class="difficulty-label">
                <div class="label-dot" style="background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%)"></div>
                <span>困难</span>
              </div>
              <div class="difficulty-stats">
                <span class="stat-number">{{ difficultyStats.hard }}</span>
                <span class="stat-percentage">{{ calculatePercentage(difficultyStats.hard, stats.problemCount) }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill hard"
                :style="{ width: calculatePercentage(difficultyStats.hard, stats.problemCount) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近提交 -->
      <div class="submission-card modern-card">
        <div class="card-header">
          <div class="header-left">
            <el-icon class="header-icon"><Clock /></el-icon>
            <h3 class="header-title">最近提交</h3>
          </div>
          <el-button type="primary" link @click="viewAllSubmissions">
            查看全部
            <el-icon class="ml-1"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="submission-list">
          <div
            v-for="(item, index) in recentSubmissions"
            :key="item.submitId"
            class="submission-item"
            :class="{ 'first-item': index === 0 }"
          >
            <div class="submission-left">
              <div class="submission-avatar">
                {{ item.userName?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="submission-info">
                <div class="submission-title">{{ item.problemTitle }}</div>
                <div class="submission-user">{{ item.userName }}</div>
              </div>
            </div>
            <div class="submission-right">
              <el-tag :type="getJudgeResultTagType(item.judgeResult)" size="small" effect="plain">
                {{ JudgeResultText[item.judgeResult] }}
              </el-tag>
              <div class="submission-time">{{ formatTime(item.createTime) }}</div>
            </div>
          </div>

          <el-empty v-if="recentSubmissions.length === 0" description="暂无提交记录" :image-size="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProblemList } from '@/api/problem'
import { getSubmissionList } from '@/api/submission'
import { JudgeResultText } from '@/types/global'
import type { JudgeResultEnum } from '@/types/global'

const router = useRouter()

// 统计数据
const stats = reactive({
  userCount: 0,
  problemCount: 0,
  submissionCount: 0,
  contestCount: 0
})

// 难度统计
const difficultyStats = reactive({
  easy: 0,
  medium: 0,
  hard: 0
})

// 最近提交
const recentSubmissions = ref<any[]>([])

// 计算百分比
const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// 获取判题结果标签类型
const getJudgeResultTagType = (result: JudgeResultEnum) => {
  const typeMap: Record<JudgeResultEnum, any> = {
    1: 'success',
    2: 'danger',
    3: 'warning',
    4: 'warning',
    5: 'danger',
    6: 'info',
    7: 'danger'
  }
  return typeMap[result] || 'info'
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 查看全部提交
const viewAllSubmissions = () => {
  router.push('/submission')
}

// 查看全部题目
const viewAllProblems = () => {
  router.push('/problem')
}

// 加载统计数据
const loadStats = async () => {
  try {
    // 加载题目列表
    const problemRes = await getProblemList({
      current: 1,
      pageSize: 1000
    })
    stats.problemCount = problemRes.total

    // 统计难度分布
    problemRes.records.forEach((problem: any) => {
      if (problem.difficulty === 1) difficultyStats.easy++
      else if (problem.difficulty === 2) difficultyStats.medium++
      else if (problem.difficulty === 3) difficultyStats.hard++
    })

    // 加载最近提交
    const submissionRes = await getSubmissionList({
      current: 1,
      pageSize: 10
    })
    stats.submissionCount = submissionRes.total
    recentSubmissions.value = submissionRes.records

    // TODO: 加载用户数和竞赛数
    stats.userCount = 156 // 示例数据
    stats.contestCount = 12 // 示例数据
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

/* 欢迎横幅 */
.welcome-banner {
  position: relative;
  margin-bottom: 30px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);

  .banner-content {
    position: relative;
    z-index: 1;

    .welcome-title {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
      animation: fadeInUp 0.6s ease;
    }

    .welcome-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
      animation: fadeInUp 0.6s ease 0.1s backwards;
    }
  }

  .banner-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;

      &.shape-1 {
        width: 120px;
        height: 120px;
        top: -40px;
        right: 80px;
        animation-delay: 0s;
      }

      &.shape-2 {
        width: 80px;
        height: 80px;
        bottom: -20px;
        right: 150px;
        animation-delay: 2s;
      }

      &.shape-3 {
        width: 60px;
        height: 60px;
        top: 50%;
        right: 40px;
        animation-delay: 4s;
      }
    }
  }
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 30px;

  .stat-card {
    position: relative;
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

      .stat-circle {
        transform: scale(1.1);
      }

      .stat-icon-wrapper {
        transform: rotate(-10deg) scale(1.1);
      }
    }

    .stat-background {
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      opacity: 0.1;
      pointer-events: none;

      .stat-circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: var(--card-color);
        transition: transform 0.3s ease;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--card-color) 0%, color-mix(in srgb, var(--card-color) 80%, black) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: transform 0.3s ease;
        box-shadow: 0 8px 16px color-mix(in srgb, var(--card-color) 50%, transparent);

        .stat-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          line-height: 1.2;
          background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #10b981;
          font-weight: 600;

          .trend-icon {
            font-size: 16px;
          }
        }
      }
    }
  }
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  .modern-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #667eea;
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }
  }
}

/* 难度图表 */
.difficulty-chart {
  .difficulty-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .difficulty-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .difficulty-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;

        .label-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }

      .difficulty-stats {
        display: flex;
        align-items: baseline;
        gap: 8px;

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .stat-percentage {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
        }
      }
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: #f3f4f6;
      border-radius: 10px;
      overflow: hidden;
      position: relative;

      .progress-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        &.easy {
          background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
        }

        &.medium {
          background: linear-gradient(90deg, #f2994a 0%, #f2c94c 100%);
        }

        &.hard {
          background: linear-gradient(90deg, #eb3349 0%, #f45c43 100%);
        }
      }
    }
  }
}

/* 提交列表 */
.submission-list {
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;

    &:hover {
      background-color: #9ca3af;
    }
  }

  .submission-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    margin-bottom: 12px;
    background: #f9fafb;
    border-radius: 12px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background: #f3f4f6;
      transform: translateX(4px);
    }

    &.first-item {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .submission-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .submission-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        flex-shrink: 0;
      }

      .submission-info {
        min-width: 0;

        .submission-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .submission-user {
          font-size: 13px;
          color: #6b7280;
        }
      }
    }

    .submission-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;

      .submission-time {
        font-size: 12px;
        color: #9ca3af;
      }
    }
  }
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 响应式 */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .welcome-banner {
    padding: 24px;

    .welcome-title {
      font-size: 24px !important;
    }
  }
}

/* 辅助类 */
.ml-1 {
  margin-left: 4px;
}
</style>
