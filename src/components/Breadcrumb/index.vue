<template>
  <el-breadcrumb id="breadcrumb-container" class="breadcrumb-container app-breadcrumb w-full ml-15px" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';

const route = useRoute();
const router = useRouter();
const levelList = ref([]);

function getBreadcrumb() {
  let matched = route.matched;
  if (route.meta && route.meta.breadcrumb !== false && levelList.value.some((item) => item.path.startsWith(route.meta.activeMenu))) {
    let index = levelList.value.findIndex((item) => item.path == route.path);
    if (index > -1) {
      levelList.value.splice(index + 1);
    } else {
      levelList.value.push({ path: route.path, meta: route.meta });
    }
  } else {
    levelList.value = matched.filter((item) => item.meta && item.meta.title);
  }
}

function cacheBreadcrumb() {
  window.sessionStorage.setItem('breadcrumb-cache', JSON.stringify(levelList.value));
}

window.addEventListener('beforeunload', cacheBreadcrumb);

function handleLink(item) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  router.push(path);
}

onMounted(() => {
  const cache = window.sessionStorage.getItem('breadcrumb-cache');
  if (cache) {
    levelList.value = JSON.parse(cache);
  }
  watchEffect(() => {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return;
    }
    getBreadcrumb();
  });
  getBreadcrumb();
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', cacheBreadcrumb);
});
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
