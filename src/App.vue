<template>
  <div>
    <h1>低碳路线展示</h1>
    <ul>
      <li v-for="route in routes" :key="route.id">
        {{ route.name }} - 减排量: {{ route.carbon }}kg
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const routes = ref([])

const fetchRoutes = async () => {
  try {
    // 这里的 URL 就是你 Spring Boot 的接口地址
    const response = await axios.get('http://localhost:8080/api/routes')
    routes.value = response.data
  } catch (error) {
    console.error("连接后端失败了:", error)
  }
}

// 页面加载时执行
onMounted(() => {
  fetchRoutes()
})
</script>