<template>
  <div class="contest-list">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入竞赛标题"
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
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
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
        新增竞赛
      </el-button>
    </div>

    <!-- 竞赛表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="contestId" label="竞赛ID" width="180" />
        <el-table-column prop="title" label="竞赛标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getContestStatusTagType(row.status)">
              {{ ContestStatusText[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column label="持续时间" width="120">
          <template #default="{ row }">
            {{ calculateDuration(row.startTime, row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="primary" link @click="handleManageProblems(row)">
              题目
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

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.contestId ? '编辑竞赛' : '新增竞赛'"
      width="600px"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="竞赛标题" required>
          <el-input
            v-model="editForm.title"
            placeholder="请输入竞赛标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="竞赛描述">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入竞赛描述（可选）"
          />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="editForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="editForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 题目管理对话框 -->
    <el-dialog
      v-model="problemDialogVisible"
      title="竞赛题目管理"
      width="900px"
    >
      <div class="problem-manage">
        <div class="problem-toolbar">
          <el-select
            v-model="selectedProblemId"
            placeholder="请选择题目"
            filterable
            style="width: 300px; margin-right: 10px"
          >
            <el-option
              v-for="problem in availableProblems"
              :key="problem.problemId"
              :label="`${problem.problemId} - ${problem.title}`"
              :value="problem.problemId"
            />
          </el-select>
          <el-select
            v-model="selectedDisplayId"
            placeholder="显示编号"
            style="width: 120px; margin-right: 10px"
          >
            <el-option label="A" value="A" />
            <el-option label="B" value="B" />
            <el-option label="C" value="C" />
            <el-option label="D" value="D" />
            <el-option label="E" value="E" />
            <el-option label="F" value="F" />
            <el-option label="G" value="G" />
            <el-option label="H" value="H" />
          </el-select>
          <el-button type="primary" @click="handleAddProblem">
            添加题目
          </el-button>
        </div>

        <el-table :data="contestProblems" stripe>
          <el-table-column prop="displayId" label="编号" width="80" />
          <el-table-column prop="problemId" label="题目ID" width="180" />
          <el-table-column prop="title" label="题目标题" min-width="200" />
          <el-table-column prop="difficulty" label="难度" width="100">
            <template #default="{ row }">
              <el-tag :type="getDifficultyTagType(row.difficulty)">
                {{ DifficultyText[row.difficulty] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" link @click="handleRemoveProblem(row)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getContestList,
  getContestDetail,
  addContest,
  updateContest,
  deleteContest,
  getContestProblems,
  addContestProblem,
  removeContestProblem
} from '@/api/contest'
import { getProblemList } from '@/api/problem'
import { ContestStatusText, DifficultyText, type ContestStatusEnum, type DifficultyEnum } from '@/types/global'

// 查询参数
const queryParams = reactive<{
  current: number
  pageSize: number
  keyword?: string
  status?: ContestStatusEnum
}>({
  current: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

// 编辑对话框
const editDialogVisible = ref(false)
const saving = ref(false)
const editForm = reactive({
  contestId: '',
  title: '',
  description: '',
  startTime: '',
  endTime: ''
})

// 题目管理对话框
const problemDialogVisible = ref(false)
const currentContestId = ref('')
const contestProblems = ref<any[]>([])
const availableProblems = ref<any[]>([])
const selectedProblemId = ref('')
const selectedDisplayId = ref('')

// 获取竞赛状态标签类型
const getContestStatusTagType = (status: ContestStatusEnum) => {
  const typeMap: Record<ContestStatusEnum, any> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status]
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

// 计算持续时间
const calculateDuration = (start: string, end: string) => {
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  const duration = endTime - startTime
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getContestList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('加载竞赛列表失败:', error)
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
  queryParams.current = 1
  loadData()
}

// 新增
const handleAdd = () => {
  editForm.contestId = ''
  editForm.title = ''
  editForm.description = ''
  editForm.startTime = ''
  editForm.endTime = ''
  editDialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  ElMessageBox.alert(
    `
    <p><strong>竞赛ID:</strong> ${row.contestId}</p>
    <p><strong>标题:</strong> ${row.title}</p>
    <p><strong>描述:</strong> ${row.description || '无'}</p>
    <p><strong>状态:</strong> ${ContestStatusText[row.status]}</p>
    <p><strong>开始时间:</strong> ${row.startTime}</p>
    <p><strong>结束时间:</strong> ${row.endTime}</p>
    `,
    '竞赛详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭'
    }
  )
}

// 编辑
const handleEdit = async (row: any) => {
  try {
    const res = await getContestDetail(row.contestId)
    editForm.contestId = res.contestId
    editForm.title = res.title
    editForm.description = res.description || ''
    editForm.startTime = res.startTime
    editForm.endTime = res.endTime
    editDialogVisible.value = true
  } catch (error) {
    console.error('加载竞赛详情失败:', error)
  }
}

// 保存
const handleSave = async () => {
  if (!editForm.title || !editForm.startTime || !editForm.endTime) {
    ElMessage.warning('请填写必填项')
    return
  }

  saving.value = true
  try {
    if (editForm.contestId) {
      await updateContest(editForm)
      ElMessage.success('更新成功')
    } else {
      await addContest(editForm)
      ElMessage.success('创建成功')
    }
    editDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除竞赛"${row.title}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteContest(row.contestId)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 管理题目
const handleManageProblems = async (row: any) => {
  currentContestId.value = row.contestId
  problemDialogVisible.value = true

  // 加载竞赛题目
  try {
    const res = await getContestProblems(row.contestId)
    contestProblems.value = res
  } catch (error) {
    console.error('加载竞赛题目失败:', error)
  }

  // 加载可用题目
  try {
    const res = await getProblemList({ current: 1, pageSize: 1000 })
    availableProblems.value = res.records
  } catch (error) {
    console.error('加载题目列表失败:', error)
  }
}

// 添加题目到竞赛
const handleAddProblem = async () => {
  if (!selectedProblemId.value || !selectedDisplayId.value) {
    ElMessage.warning('请选择题目和显示编号')
    return
  }

  try {
    await addContestProblem({
      contestId: currentContestId.value,
      problemId: selectedProblemId.value,
      displayId: selectedDisplayId.value
    })
    ElMessage.success('添加成功')
    selectedProblemId.value = ''
    selectedDisplayId.value = ''
    // 重新加载竞赛题目
    const res = await getContestProblems(currentContestId.value)
    contestProblems.value = res
  } catch (error) {
    console.error('添加题目失败:', error)
  }
}

// 移除竞赛题目
const handleRemoveProblem = async (row: any) => {
  try {
    await removeContestProblem(currentContestId.value, row.problemId)
    ElMessage.success('移除成功')
    // 重新加载竞赛题目
    const res = await getContestProblems(currentContestId.value)
    contestProblems.value = res
  } catch (error) {
    console.error('移除题目失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.contest-list {
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

  .problem-manage {
    .problem-toolbar {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
