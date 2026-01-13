<template>
  <div class="problem-edit" v-loading="loading">
    <el-card shadow="never">
      <template #header>
        <span>{{ isEdit ? '编辑题目' : '新增题目' }}</span>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="题目标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入题目标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="form.difficulty">
            <el-radio :label="1">简单</el-radio>
            <el-radio :label="2">中等</el-radio>
            <el-radio :label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="时间限制 (ms)" prop="timeLimit">
          <el-input-number
            v-model="form.timeLimit"
            :min="1"
            :max="10000"
            :step="100"
          />
          <span class="unit-text">毫秒 (默认1000ms)</span>
        </el-form-item>

        <el-form-item label="内存限制 (MB)" prop="memoryLimit">
          <el-input-number
            v-model="form.memoryLimit"
            :min="1"
            :max="1024"
            :step="1"
          />
          <span class="unit-text">MB (默认128MB)</span>
        </el-form-item>

        <el-form-item label="栈限制 (MB)" prop="stackLimit">
          <el-input-number
            v-model="form.stackLimit"
            :min="1"
            :max="1024"
            :step="1"
          />
          <span class="unit-text">MB (默认128MB)</span>
        </el-form-item>

        <el-form-item label="题目来源" prop="source">
          <el-input
            v-model="form.source"
            placeholder="请输入题目来源（可选）"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="题目描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            placeholder="请输入题目描述，支持 Markdown"
          />
        </el-form-item>

        <el-form-item label="输入格式" prop="inputDescription">
          <el-input
            v-model="form.inputDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入输入格式说明"
          />
        </el-form-item>

        <el-form-item label="输出格式" prop="outputDescription">
          <el-input
            v-model="form.outputDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入输出格式说明"
          />
        </el-form-item>

        <el-form-item label="样例输入" prop="sampleInput">
          <el-input
            v-model="form.sampleInput"
            type="textarea"
            :rows="4"
            placeholder="请输入样例输入"
          />
        </el-form-item>

        <el-form-item label="样例输出" prop="sampleOutput">
          <el-input
            v-model="form.sampleOutput"
            type="textarea"
            :rows="4"
            placeholder="请输入样例输出"
          />
        </el-form-item>

        <el-form-item label="提示" prop="hint">
          <el-input
            v-model="form.hint"
            type="textarea"
            :rows="4"
            placeholder="请输入提示信息（可选）"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ submitting ? '提交中...' : (isEdit ? '更新' : '创建') }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getProblemDetail, addProblem, updateProblem } from '@/api/problem'
import type { ProblemAddDTO, DifficultyEnum, ProblemStatusEnum } from '@/types/global'

const router = useRouter()
const route = useRoute()

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const form = reactive<ProblemAddDTO>({
  problemId: '',
  title: '',
  difficulty: 1 as DifficultyEnum,
  status: 1 as ProblemStatusEnum,
  timeLimit: 1000,
  memoryLimit: 128,
  stackLimit: 128,
  description: '',
  inputDescription: '',
  outputDescription: '',
  sampleInput: '',
  sampleOutput: '',
  hint: '',
  source: ''
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入题目标题', trigger: 'blur' },
    { min: 2, max: 200, message: '标题长度应为 2 到 200 个字符', trigger: 'blur' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  timeLimit: [
    { required: true, message: '请输入时间限制', trigger: 'blur' }
  ],
  memoryLimit: [
    { required: true, message: '请输入内存限制', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入题目描述', trigger: 'blur' }
  ],
  inputDescription: [
    { required: true, message: '请输入输入格式', trigger: 'blur' }
  ],
  outputDescription: [
    { required: true, message: '请输入输出格式', trigger: 'blur' }
  ],
  sampleInput: [
    { required: true, message: '请输入样例输入', trigger: 'blur' }
  ],
  sampleOutput: [
    { required: true, message: '请输入样例输出', trigger: 'blur' }
  ]
}

// 加载题目详情（编辑模式）
const loadProblemDetail = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const problemId = route.params.id as string
    const res = await getProblemDetail(problemId)

    // 填充表单
    form.problemId = res.problemId
    form.title = res.title
    form.difficulty = res.difficulty
    form.status = res.status
    form.timeLimit = res.timeLimit
    form.memoryLimit = res.memoryLimit
    form.stackLimit = res.stackLimit
    form.description = res.description
    form.inputDescription = res.inputDescription
    form.outputDescription = res.outputDescription
    form.sampleInput = res.sampleInput
    form.sampleOutput = res.sampleOutput
    form.hint = res.hint
    form.source = res.source
  } catch (error) {
    console.error('加载题目详情失败:', error)
    ElMessage.error('加载题目详情失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    submitting.value = true

    if (isEdit.value) {
      // 更新
      await updateProblem(form)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await addProblem(form)
      ElMessage.success('创建成功')
    }

    // 返回列表页
    router.push('/problem')
  } catch (error: any) {
    console.error('提交失败:', error)
    if (error !== false) {
      ElMessage.error(error.message || '提交失败')
    }
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadProblemDetail()
})
</script>

<style scoped lang="scss">
.problem-edit {
  .unit-text {
    margin-left: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
