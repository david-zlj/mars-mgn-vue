<template>
  <div class="captcha-wrapper">
    <!-- 用户输入框 -->
    <input type="text" v-model="userInput" placeholder="请输入验证码" class="captcha-input" />
    <!-- 验证码图片（点击可刷新） -->
    <img :src="captchaImage" @click="refreshCaptcha" class="captcha-img" />
    <!-- 隐藏域存储hashkey -->
    <input type="hidden" v-model="captchaHashKey" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as LoginApi from '@/api/login'

const captchaImage = ref('')
const captchaHashKey = ref('')
const userInput = ref('')

// 初始化获取验证码
const fetchCaptcha = async () => {
  try {
    const response = await LoginApi.getCode({})
    // console.log('验证码响应:', response) // 添加日志
    if (response.code === 0) {
      captchaImage.value = response.data.imageBase
      captchaHashKey.value = response.data.captchaKey
    } else {
      console.error('验证码加载失败:', response.msg)
    }
  } catch (error) {
    console.error('验证码加载失败:', error)
  }
}

// 点击刷新验证码
const refreshCaptcha = () => fetchCaptcha()

// 暴露验证方法
const validateCaptcha = async () => {
  try {
    const response = await LoginApi.reqCheck({
      captchaKey: captchaHashKey.value,
      captchaValue: userInput.value
    })
    return response.code === 0
  } catch (error) {
    console.error('验证码验证失败:', error)
    return false
  }
}

// 组件挂载时加载
onMounted(() => fetchCaptcha())

// 暴露接口给父组件
defineExpose({ validateCaptcha })
</script>

<style lang="scss" scoped>
.captcha-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.captcha-input {
  flex: 1;
  height: 40px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  background-color: var(--el-input-bg-color);
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:focus {
    border-color: var(--el-color-primary);
  }

  &::placeholder {
    color: var(--el-text-color-placeholder);
  }
}

.captcha-img {
  height: 40px;
  width: 120px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>
