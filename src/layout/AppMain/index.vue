<template>
  <div class="app-container overflow-y-auto bg-#f2f3f5 p-10px w-full flex-1">
    <router-view #default="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import useViewsStore from '@/store/modules/views';
const { cachedViews } = useViewsStore();
</script>
