<template>
  <div>
    <site-header />
    <slot></slot>
    <site-footer />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~/stores/site/global';

useAsyncData('site-global', async () => {
  const { fetchOptions, fetchCategoryList } = useGlobalStore();
  return Promise.all([fetchOptions(), fetchCategoryList()]);
});
</script>
