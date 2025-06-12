<template>
  <el-form
    v-if="getShow"
    ref="formLogin"
    :model="loginData.loginForm"
    :rules="LoginRules"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <el-row style="margin-right: -10px; margin-left: -10px">
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <LoginFormTitle style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="username">
          <el-input
            v-model="loginData.loginForm.username"
            :placeholder="t('login.usernamePlaceholder')"
            :prefix-icon="iconAvatar"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="password">
          <el-input
            v-model="loginData.loginForm.password"
            :placeholder="t('login.passwordPlaceholder')"
            :prefix-icon="iconLock"
            show-password
            type="password"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <CaptchaComponent v-if="loginData.captchaEnable === 'true'" ref="captchaRef" />
        </el-form-item>
      </el-col>
      <el-col
        :span="24"
        style="padding-right: 10px; padding-left: 10px; margin-top: -20px; margin-bottom: -20px"
      >
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-col>
            <!-- <el-col :offset="6" :span="12">
              <el-link
                style="float: right"
                type="primary"
                @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
              >
                {{ t('login.forgetPassword') }}
              </el-link>
            </el-col> -->
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <XButton
            :loading="loginLoading"
            :title="t('login.login')"
            class="w-[100%]"
            type="primary"
            @click="handleSubmit()"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <el-row :gutter="5" justify="space-between" style="width: 100%">
            <!-- <el-col :span="8">
              <XButton
                :title="t('login.btnMobile')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.MOBILE)"
              />
            </el-col>
            <el-col :span="8">
              <XButton
                :title="t('login.btnQRCode')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.QR_CODE)"
              />
            </el-col> -->
            <el-col>
              <XButton
                v-if="isRegisterEnabled"
                :title="t('login.btnRegister')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.REGISTER)"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import CaptchaComponent from './CaptchaComponent.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
// const message = useMessage()
// const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const captchaRef = ref()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
// 是否显示注册
const isRegisterEnabled = computed(() => import.meta.env.VITE_APP_REGISTER_ENABLE === 'true')

const LoginRules = {
  username: [
    required,
    { min: 4, max: 30, message: '用户名长度必须在4到30个字符之间', trigger: 'blur' }
  ],
  password: [
    required,
    { min: 8, max: 20, message: '密码长度必须在8到20个字符之间', trigger: 'blur' }
  ]
}

const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  // tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    // tenantName: import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT || '',
    username: import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || '',
    password: import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})

// const socialList = [
//   { icon: 'ant-design:wechat-filled', type: 30 },
//   { icon: 'ant-design:dingtalk-circle-filled', type: 20 },
//   { icon: 'ant-design:github-filled', type: 0 },
//   { icon: 'ant-design:alipay-circle-filled', type: 0 }
// ]

// 处理登录提交
const handleSubmit = async () => {
  // 情况一，未开启验证码：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
    return
  }

  // 情况二，已开启验证码：则进行验证码验证
  const isValid = await captchaRef.value?.validateCaptcha()
  if (isValid) {
    await handleLogin({})
  }
}
// 获取租户 ID
// const getTenantId = async () => {
//   if (loginData.tenantEnable === 'true') {
//     const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
//     authUtil.setTenantId(res)
//   }
// }
// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe
      // tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 根据域名，获得租户信息
// const getTenantByWebsite = async () => {
//   const website = location.host
//   const res = await LoginApi.getTenantByWebsite(website)
//   if (res) {
//     loginData.loginForm.tenantName = res.name
//     authUtil.setTenantId(res.id)
//   }
// }
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params: any) => {
  loginLoading.value = true
  try {
    // await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    const loginDataLoginForm = { ...loginData.loginForm }
    loginDataLoginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginDataLoginForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginDataLoginForm.rememberMe) {
      authUtil.setLoginForm(loginDataLoginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      await push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

// 社交登录
// const doSocialLogin = async (type: number) => {
//   if (type === 0) {
//     message.error('此方式未配置')
//   } else {
//     loginLoading.value = true
//     if (loginData.tenantEnable === 'true') {
//       // 尝试先通过 tenantName 获取租户
//       await getTenantId()
//       // 如果获取不到，则需要弹出提示，进行处理
//       if (!authUtil.getTenantId()) {
//         try {
//           const data = await message.prompt('请输入租户名称', t('common.reminder'))
//           if (data?.action !== 'confirm') throw 'cancel'
//           const res = await LoginApi.getTenantIdByName(data.value)
//           authUtil.setTenantId(res)
//         } catch (error) {
//           if (error === 'cancel') return
//         } finally {
//           loginLoading.value = false
//         }
//       }
//     }
//     // 计算 redirectUri
//     // 注意: type、redirect 需要先 encode 一次，否则钉钉回调会丢失。
//     // 配合 social-login.vue#getUrlValue() 使用
//     const redirectUri =
//       location.origin +
//       '/social-login?' +
//       encodeURIComponent(`type=${type}&redirect=${redirect.value || '/'}`)

//     // 进行跳转
//     window.location.href = await LoginApi.socialAuthRedirect(type, encodeURIComponent(redirectUri))
//   }
// }
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getLoginFormCache()
  // getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
