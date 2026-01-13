<template>
  <div class="problem-detail" v-loading="loading">
    <!-- 题目基本信息 -->
    <el-card shadow="never" class="info-card">
      <template #header>
        <div class="card-header">
          <span>题目信息</span>
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="题目ID">
          {{ problemDetail?.problemId }}
        </el-descriptions-item>
        <el-descriptions-item label="题目标题">
          {{ problemDetail?.title }}
        </el-descriptions-item>
        <el-descriptions-item label="难度">
          <el-tag :type="getDifficultyTagType(problemDetail?.difficulty)">
            {{ DifficultyText[problemDetail?.difficulty] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="problemDetail?.status === 1 ? 'success' : 'info'">
            {{ ProblemStatusText[problemDetail?.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="时间限制">
          {{ problemDetail?.timeLimit }} ms
        </el-descriptions-item>
        <el-descriptions-item label="内存限制">
          {{ problemDetail?.memoryLimit }} MB
        </el-descriptions-item>
        <el-descriptions-item label="栈限制">
          {{ problemDetail?.stackLimit || 128 }} MB
        </el-descriptions-item>
        <el-descriptions-item label="来源">
          {{ problemDetail?.source || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="提交数">
          {{ problemDetail?.submitNum || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="通过数">
          {{ problemDetail?.acceptedNum || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ problemDetail?.createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 题目描述 -->
    <el-card shadow="never" class="content-card">
      <template #header>
        <span>题目描述</span>
      </template>
      <div class="markdown-content" v-html="markedContent?.description || '-'"></div>
    </el-card>

    <!-- 输入输出格式 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>输入格式</span>
          </template>
          <div class="markdown-content">
            {{ problemDetail?.inputDescription || '-' }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>输出格式</span>
          </template>
          <div class="markdown-content">
            {{ problemDetail?.outputDescription || '-' }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 样例 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>样例输入</span>
          </template>
          <pre class="sample-content">{{ problemDetail?.sampleInput || '-' }}</pre>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>样例输出</span>
          </template>
          <pre class="sample-content">{{ problemDetail?.sampleOutput || '-' }}</pre>
        </el-card>
      </el-col>
    </el-row>

    <!-- 提示 -->
    <el-card shadow="never">
      <template #header>
        <span>提示</span>
      </template>
      <div class="markdown-content">
        {{ problemDetail?.hint || '暂无提示' }}
      </div>
    </el-card>

    <!-- 测试用例 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>测试用例</span>
          <el-button type="primary" @click="handleAddTestCase">
            <el-icon><Plus /></el-icon>
            添加测试用例
          </el-button>
        </div>
      </template>

      <el-table :data="testCases" stripe>
        <el-table-column prop="caseId" label="用例ID" width="180" />
        <el-table-column prop="input" label="输入" min-width="200" show-overflow-tooltip />
        <el-table-column prop="output" label="输出" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditTestCase(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDeleteTestCase(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 测试用例编辑对话框 -->
    <el-dialog
      v-model="testCaseDialogVisible"
      :title="testCaseForm.caseId ? '编辑测试用例' : '添加测试用例'"
      width="600px"
    >
      <el-form :model="testCaseForm" label-width="80px">
        <el-form-item label="输入">
          <el-input
            v-model="testCaseForm.input"
            type="textarea"
            :rows="5"
            placeholder="请输入测试用例输入数据"
          />
        </el-form-item>
        <el-form-item label="输出">
          <el-input
            v-model="testCaseForm.output"
            type="textarea"
            :rows="5"
            placeholder="请输入测试用例期望输出"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="testCaseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTestCase">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProblemDetail, getTestCases, addTestCase, updateTestCase, deleteTestCase } from '@/api/problem'
import { DifficultyText, ProblemStatusText, type DifficultyEnum } from '@/types/global'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const problemDetail = ref<any>(null)
const testCases = ref<any[]>([])

// 测试用例表单
const testCaseDialogVisible = ref(false)
const testCaseForm = reactive({
  caseId: '',
  problemId: '',
  input: '',
  output: ''
})

// 获取难度标签类型
const getDifficultyTagType = (difficulty: DifficultyEnum) => {
  const typeMap: Record<DifficultyEnum, any> = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return typeMap[difficulty]
}

// 加载题目详情
const loadProblemDetail = async () => {
  loading.value = true
  try {
    const problemId = route.params.id as string
    const res = await getProblemDetail(problemId)
    problemDetail.value = res
    await loadTestCases()
  } catch (error) {
    console.error('加载题目详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载测试用例
const loadTestCases = async () => {
  try {
    const problemId = route.params.id as string
    const res = await getTestCases(problemId)
    testCases.value = res
  } catch (error) {
    console.error('加载测试用例失败:', error)
  }
}

// 编辑题目
const handleEdit = () => {
  router.push(`/problem/edit/${route.params.id}`)
}

// 添加测试用例
const handleAddTestCase = () => {
  testCaseForm.caseId = ''
  testCaseForm.problemId = route.params.id as string
  testCaseForm.input = ''
  testCaseForm.output = ''
  testCaseDialogVisible.value = true
}

// 编辑测试用例
const handleEditTestCase = (row: any) => {
  testCaseForm.caseId = row.caseId
  testCaseForm.problemId = row.problemId
  testCaseForm.input = row.input
  testCaseForm.output = row.output
  testCaseDialogVisible.value = true
}

// 保存测试用例
const handleSaveTestCase = async () => {
  try {
    if (testCaseForm.caseId) {
      await updateTestCase(testCaseForm)
      ElMessage.success('更新成功')
    } else {
      await addTestCase(testCaseForm)
      ElMessage.success('添加成功')
    }
    testCaseDialogVisible.value = false
    loadTestCases()
  } catch (error) {
    console.error('保存测试用例失败:', error)
  }
}

// 删除测试用例
const handleDeleteTestCase = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该测试用例吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteTestCase(row.caseId)
    ElMessage.success('删除成功')
    loadTestCases()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除测试用例失败:', error)
    }
  }
}

onMounted(() => {
  loadProblemDetail()
})
</script>

<style scoped lang="scss">
.problem-detail {
  .info-card,
  .content-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .markdown-content {
    line-height: 1.8;
    color: #303133;
  }

  .sample-content {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
