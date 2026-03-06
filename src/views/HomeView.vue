<template>
  <div class="p-6 flex flex-col items-center justify-center min-h-screen bg-green-50">
    <h1 class="text-3xl font-bold text-green-800 mb-4">港珠低碳智慧导览</h1>
    <p class="text-gray-600 mb-8 text-center">选择一条路线，开始你的绿色足迹之旅</p>

    <div class="grid gap-4 w-full max-w-md">
      <router-link to="/explore" class="p-4 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-green-500 transition-all">
        <h3 class="font-bold">香港：老街避热之旅</h3>
        <p class="text-sm text-gray-500">2天1夜 | 预计减排 5.2kg</p>
      </router-link>
    </div>
  </div>
</template>