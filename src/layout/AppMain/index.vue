<template>
  <div class="app-container overflow-y-auto bg-#f2f3f5 p-10px w-full flex-1">
    <router-view #default="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import useTagsViewStore from '@/store/modules/tagsView';
const tagsViewStore = useTagsViewStore();

</script>
