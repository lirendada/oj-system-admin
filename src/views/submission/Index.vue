<template>
  <div class="submission-list">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="题目ID">
          <el-input
            v-model="queryParams.problemId"
            placeholder="请输入题目ID"
            clearable
            @clear="loadData"
          />
        </el-form-item>

        <el-form-item label="用户ID">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            @clear="loadData"
          />
        </el-form-item>

        <el-form-item label="判题结果">
          <el-select
            v-model="queryParams.judgeResult"
            placeholder="请选择判题结果"
            clearable
            @clear="loadData"
          >
            <el-option label="通过 (AC)" :value="1" />
            <el-option label="答案错误 (WA)" :value="2" />
            <el-option label="运行超时 (TLE)" :value="3" />
            <el-option label="内存超限 (MLE)" :value="4" />
            <el-option label="运行错误 (RE)" :value="5" />
            <el-option label="编译错误 (CE)" :value="6" />
            <el-option label="系统错误 (SE)" :value="7" />
          </el-select>
        </el-form-item>

        <el-form-item label="编程语言">
          <el-select
            v-model="queryParams.language"
            placeholder="请选择编程语言"
            clearable
            @clear="loadData"
          >
            <el-option label="Java" value="java" />
            <el-option label="C++" value="cpp" />
            <el-option label="Python" value="python" />
            <el-option label="C" value="c" />
            <el-option label="Go" value="go" />
            <el-option label="JavaScript" value="javascript" />
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

    <!-- 提交记录表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="submitId" label="提交ID" width="180" />
        <el-table-column prop="problemId" label="题目ID" width="180" />
        <el-table-column prop="problemTitle" label="题目标题" min-width="200" />
        <el-table-column prop="userId" label="用户ID" width="180" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="language" label="语言" width="100">
          <template #default="{ row }">
            <el-tag>{{ LanguageText[row.language] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="judgeResult" label="判题结果" width="150">
          <template #default="{ row }">
            <el-tag :type="getJudgeResultTagType(row.judgeResult)">
              {{ JudgeResultText[row.judgeResult] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeCost" label="耗时" width="100">
          <template #default="{ row }">
            {{ row.timeCost }} ms
          </template>
        </el-table-column>
        <el-table-column prop="memoryCost" label="内存" width="100">
          <template #default="{ row }">
            {{ row.memoryCost }} KB
          </template>
        </el-table-column>
        <el-table-column label="通过用例" width="120">
          <template #default="{ row }">
            {{ row.passCaseCount }}/{{ row.totalCaseCount }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button type="primary" link @click="handleViewCode(row)">
              代码
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="提交详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentSubmission">
        <el-descriptions-item label="提交ID" :span="2">
          {{ currentSubmission.submitId }}
        </el-descriptions-item>
        <el-descriptions-item label="题目ID">
          {{ currentSubmission.problemId }}
        </el-descriptions-item>
        <el-descriptions-item label="题目标题">
          {{ currentSubmission.problemTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="用户ID">
          {{ currentSubmission.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ currentSubmission.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="编程语言">
          {{ LanguageText[currentSubmission.language] }}
        </el-descriptions-item>
        <el-descriptions-item label="判题结果">
          <el-tag :type="getJudgeResultTagType(currentSubmission.judgeResult)">
            {{ JudgeResultText[currentSubmission.judgeResult] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="耗时">
          {{ currentSubmission.timeCost }} ms
        </el-descriptions-item>
        <el-descriptions-item label="内存">
          {{ currentSubmission.memoryCost }} KB
        </el-descriptions-item>
        <el-descriptions-item label="通过用例" :span="2">
          {{ currentSubmission.passCaseCount }}/{{ currentSubmission.totalCaseCount }}
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2" v-if="currentSubmission.errorMessage">
          <div class="error-message">{{ currentSubmission.errorMessage }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间" :span="2">
          {{ currentSubmission.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 代码查看对话框 -->
    <el-dialog
      v-model="codeDialogVisible"
      title="提交代码"
      width="900px"
    >
      <el-input
        v-model="submissionCode"
        type="textarea"
        :rows="20"
        readonly
        class="code-viewer"
      />
      <template #footer>
        <el-button @click="codeDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSubmissionList, getSubmissionDetail, getSubmissionCode } from '@/api/submission'
import { JudgeResultText, LanguageText, type JudgeResultEnum } from '@/types/global'

// 查询参数
const queryParams = reactive<{
  current: number
  pageSize: number
  problemId?: string
  userId?: string
  judgeResult?: JudgeResultEnum
  language?: string
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
const currentSubmission = ref<any>(null)

// 代码对话框
const codeDialogVisible = ref(false)
const submissionCode = ref('')

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
  return typeMap[result]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getSubmissionList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('加载提交记录失败:', error)
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
  queryParams.problemId = undefined
  queryParams.userId = undefined
  queryParams.judgeResult = undefined
  queryParams.language = undefined
  queryParams.current = 1
  loadData()
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res = await getSubmissionDetail(row.submitId)
    currentSubmission.value = res
    detailDialogVisible.value = true
  } catch (error) {
    console.error('加载提交详情失败:', error)
  }
}

// 查看代码
const handleViewCode = async (row: any) => {
  try {
    const code = await getSubmissionCode(row.submitId)
    submissionCode.value = code
    codeDialogVisible.value = true
  } catch (error) {
    console.error('加载代码失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.submission-list {
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

  .error-message {
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', monospace;
    background-color: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
  }

  .code-viewer {
    font-family: 'Courier New', monospace;

    :deep(textarea) {
      font-family: 'Courier New', monospace;
    }
  }
}
</style>
