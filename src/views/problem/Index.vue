<template>
  <div class="problem-list">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入题目标题"
            clearable
            @clear="loadData"
          />
        </el-form-item>

        <el-form-item label="难度">
          <el-select
            v-model="queryParams.difficulty"
            placeholder="请选择难度"
            clearable
            @clear="loadData"
          >
            <el-option label="简单" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="困难" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            @clear="loadData"
          >
            <el-option label="正常" :value="1" />
            <el-option label="隐藏" :value="0" />
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

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增题目
      </el-button>
    </div>

    <!-- 题目表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="problemId" label="ID" width="180" />
        <el-table-column prop="title" label="题目标题" min-width="200" />
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyTagType(row.difficulty)">
              {{ DifficultyText[row.difficulty] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitNum" label="提交数" width="100" />
        <el-table-column prop="acceptedNum" label="通过数" width="100" />
        <el-table-column label="通过率" width="100">
          <template #default="{ row }">
            {{ calculateAcceptRate(row.submitNum, row.acceptedNum) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ ProblemStatusText[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProblemList, deleteProblem as deleteProblemApi } from '@/api/problem'
import { DifficultyText, ProblemStatusText, type DifficultyEnum, type ProblemStatusEnum } from '@/types/global'

const router = useRouter()

// 查询参数
const queryParams = reactive<{
  current: number
  pageSize: number
  keyword?: string
  difficulty?: DifficultyEnum
  status?: ProblemStatusEnum
}>({
  current: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

// 计算通过率
const calculateAcceptRate = (submitNum: number, acceptedNum: number) => {
  if (submitNum === 0) return '0%'
  return ((acceptedNum / submitNum) * 100).toFixed(1) + '%'
}

// 获取难度标签类型
const getDifficultyTagType = (difficulty: DifficultyEnum) => {
  const typeMap: Record<DifficultyEnum, any> = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return typeMap[difficulty]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getProblemList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('加载题目列表失败:', error)
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
  queryParams.difficulty = undefined
  queryParams.status = undefined
  queryParams.current = 1
  loadData()
}

// 新增
const handleAdd = () => {
  router.push('/problem/edit')
}

// 查看
const handleView = (row: any) => {
  router.push(`/problem/detail/${row.problemId}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/problem/edit/${row.problemId}`)
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除题目"${row.title}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteProblemApi(row.problemId)
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
.problem-list {
  .search-card {
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 0;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
