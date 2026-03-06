<template>
  <div class="h-screen w-full relative">
    <div class="absolute inset-0 bg-blue-100 flex items-center justify-center">
      <p class="text-gray-400">地图加载中...</p>
    </div>

    <div class="absolute top-4 inset-x-4 z-10 flex justify-between">
      <div class="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg">
        <span class="text-xs block text-gray-500">当前减排</span>
        <span class="font-bold text-green-600">1.28 kg</span>
      </div>
      <router-link to="/" class="bg-white p-3 rounded-full shadow-lg">🏠</router-link>
    </div>
  </div>
</template>