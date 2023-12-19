<template>
  <div class="flex-1 overflow-y-auto bg-#f2f3f5 p-10px">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </div>
</template>

<script setup>
import iframeToggle from './IframeToggle/index.vue';
import useTagsViewStore from '@/store/modules/tagsView';

const tagsViewStore = useTagsViewStore();
</script>
<style lang="scss" scoped></style>
