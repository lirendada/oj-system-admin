<template>
  <div class="user-list">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入账号/昵称/邮箱"
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
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
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

    <!-- 用户表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="userId" label="用户ID" width="180" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar || defaultAvatar" />
          </template>
        </el-table-column>
        <el-table-column prop="userAccount" label="账号" width="150" />
        <el-table-column prop="nickName" label="昵称" width="150" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="school" label="学校" min-width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ UserStatusText[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedCount" label="提交数" width="100" />
        <el-table-column prop="acceptedCount" label="通过数" width="100" />
        <el-table-column prop="rating" label="Rating" width="100">
          <template #default="{ row }">
            <el-tag type="warning">{{ row.rating || 1500 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
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

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentUser">
        <el-descriptions-item label="用户ID">
          {{ currentUser.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="账号">
          {{ currentUser.userAccount }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ currentUser.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.email }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentUser.phone || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="学校">
          {{ currentUser.school || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser.status === 1 ? 'success' : 'info'">
            {{ UserStatusText[currentUser.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Rating">
          <el-tag type="warning">{{ currentUser.rating || 1500 }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提交数">
          {{ currentUser.submittedCount }}
        </el-descriptions-item>
        <el-descriptions-item label="通过数">
          {{ currentUser.acceptedCount }}
        </el-descriptions-item>
        <el-descriptions-item label="通过率">
          {{ calculateAcceptRate(currentUser.submittedCount, currentUser.acceptedCount) }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">
          {{ currentUser.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, updateUserStatus } from '@/api/user'
import { UserStatusText } from '@/types/global'

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// 查询参数
const queryParams = reactive<{
  current: number
  pageSize: number
  keyword?: string
  status?: number
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
const currentUser = ref<any>(null)

// 计算通过率
const calculateAcceptRate = (submitNum: number, acceptNum: number) => {
  if (submitNum === 0) return '0%'
  return ((acceptNum / submitNum) * 100).toFixed(1) + '%'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getUserList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
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

// 查看用户详情
const handleView = (row: any) => {
  currentUser.value = row
  detailDialogVisible.value = true
}

// 切换用户状态
const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 0 ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(
      `确定要${action}用户"${row.nickName}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await updateUserStatus(row.userId, newStatus)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error(error.message || '操作失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.user-list {
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
}
</style>
