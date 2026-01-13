<template>
  <div class="solution-list">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入题解标题"
            clearable
            @clear="loadData"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            @clear="loadData"
          >
            <el-option label="草稿" :value="0" />
            <el-option label="已发布" :value="1" />
            <el-option label="已下架" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择类型"
            clearable
            @clear="loadData"
          >
            <el-option label="用户题解" :value="0" />
            <el-option label="官方题解" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 题解表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="solutionId" label="题解ID" width="180" />
        <el-table-column prop="problemId" label="题目ID" width="180" />
        <el-table-column prop="problemTitle" label="题目标题" min-width="200" />
        <el-table-column prop="title" label="题解标题" min-width="200" />
        <el-table-column prop="userId" label="作者ID" width="180" />
        <el-table-column prop="userName" label="作者" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'warning' : 'primary'">
              {{ SolutionTypeText[row.type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ SolutionStatusText[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visitCount" label="浏览量" width="100" />
        <el-table-column prop="likeCount" label="点赞数" width="100" />
        <el-table-column prop="replyCount" label="评论数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="success"
              link
              @click="handleReview(row, 1)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="danger"
              link
              @click="handleReview(row, 2)"
            >
              驳回
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="warning"
              link
              @click="handleOffline(row)"
            >
              下架
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 题解详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="题解详情"
      width="900px"
    >
      <div v-if="currentSolution" class="solution-detail">
        <el-descriptions :column="2" border class="detail-info">
          <el-descriptions-item label="题解ID" :span="2">
            {{ currentSolution.solutionId }}
          </el-descriptions-item>
          <el-descriptions-item label="题目ID">
            {{ currentSolution.problemId }}
          </el-descriptions-item>
          <el-descriptions-item label="题目标题">
            {{ currentSolution.problemTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="作者ID">
            {{ currentSolution.userId }}
          </el-descriptions-item>
          <el-descriptions-item label="作者">
            {{ currentSolution.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="题解标题" :span="2">
            {{ currentSolution.title }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="currentSolution.type === 1 ? 'warning' : 'primary'">
              {{ SolutionTypeText[currentSolution.type] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentSolution.status)">
              {{ SolutionStatusText[currentSolution.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="浏览量">
            {{ currentSolution.visitCount }}
          </el-descriptions-item>
          <el-descriptions-item label="点赞数">
            {{ currentSolution.likeCount }}
          </el-descriptions-item>
          <el-descriptions-item label="评论数">
            {{ currentSolution.replyCount }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentSolution.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ currentSolution.updateTime }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="solution-content">
          <h4>题解内容</h4>
          <div class="markdown-content" v-html="currentSolution.content"></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSolutionList, getSolutionDetail, reviewSolution, offlineSolution, deleteSolution } from '@/api/solution'
import { SolutionStatusText, SolutionTypeText, type SolutionStatusEnum, type SolutionTypeEnum } from '@/types/global'

// 查询参数
const queryParams = reactive<{
  current: number
  pageSize: number
  keyword?: string
  status?: SolutionStatusEnum
  type?: SolutionTypeEnum
}>({
  current: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentSolution = ref<any>(null)

// 获取状态标签类型
const getStatusTagType = (status: SolutionStatusEnum) => {
  const typeMap: Record<SolutionStatusEnum, any> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getSolutionList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('加载题解列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.current = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.keyword = undefined
  queryParams.status = undefined
  queryParams.type = undefined
  queryParams.current = 1
  loadData()
}

// 查看详情
const handleView = async (row: any) => {
  try {
    const res = await getSolutionDetail(row.solutionId)
    currentSolution.value = res
    detailDialogVisible.value = true
  } catch (error) {
    console.error('加载题解详情失败:', error)
  }
}

// 审核题解
const handleReview = async (row: any, status: number) => {
  const action = status === 1 ? '通过' : '驳回'

  try {
    await ElMessageBox.confirm(
      `确定要${action}题解"${row.title}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await reviewSolution(row.solutionId, status)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 下架题解
const handleOffline = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要下架题解"${row.title}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await offlineSolution(row.solutionId)
    ElMessage.success('下架成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('下架失败:', error)
      ElMessage.error(error.message || '下架失败')
    }
  }
}

// 删除题解
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除题解"${row.title}"吗？此操作不可恢复！`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteSolution(row.solutionId)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.solution-list {
  .search-card {
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 0;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .solution-detail {
    .detail-info {
      margin-bottom: 20px;
    }

    .solution-content {
      h4 {
        margin-bottom: 15px;
        color: #303133;
      }

      .markdown-content {
        padding: 20px;
        background-color: #f5f7fa;
        border-radius: 4px;
        line-height: 1.8;
        min-height: 200px;
      }
    }
  }
}
</style>
