<template>
  <div class="not-found">
  <a-result status="404" title="404" sub-title="抱歉,找不到信息...">
    <template #extra>
      <a-button type="primary">
        <router-link to="/">
          返回首页
        </router-link>
      </a-button>
    </template>
  </a-result>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFound',
})
</script>
