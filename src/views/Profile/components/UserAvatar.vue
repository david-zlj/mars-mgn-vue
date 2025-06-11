<template>
  <div class="change-avatar">
    <!-- 在 CropperAvatar 添加 v-if 确保数据就绪 -->
    <CropperAvatar
      v-if="img"
      ref="cropperRef"
      :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
      :showBtn="false"
      :value="img"
      width="120px"
      @change="handelUpload"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { uploadAvatar } from '@/api/system/user/profile'
import { CropperAvatar } from '@/components/Cropper'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'UserAvatar' })

defineProps({
  img: propTypes.string.def('')
})

const userStore = useUserStore()

const cropperRef = ref()
const handelUpload = async ({ data, filename }) => {
  try {
    // 上传文件和文件名信息
    const res = await uploadAvatar({ avatarFile: new File([data], filename) })
    cropperRef.value.close()
    userStore.setUserAvatarAction(res.data)
  } catch (error) {
    // console.error('上传失败：', error)
  }
}
</script>

<style lang="scss" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }
}
</style>
