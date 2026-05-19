<template>
  <site-sidebar-section
    v-if="articleList"
    title="推荐文章"
  >
    <ol class="c-sidebar__recommended-article-list">
      <li
        v-for="article in articleList"
        :key="article.articleId"
      >
        <nuxt-link :to="article.href">
          {{ article.title }}
        </nuxt-link>
      </li>
    </ol>
  </site-sidebar-section>
</template>

<script lang="ts" setup>
const { data } = await useAsyncData(
  'recommended-article-list',
  async () => {
    const { data } = await useFetch('/api/site/article/recommended');
    return data.value;
  },
);

const articleList = computed(() => data.value?.rows);
</script>

<style lang="scss">
.c-sidebar__recommended-article-list {
  li {
    margin-top: 0.6em;
    padding-bottom: 0.6em;
    border-bottom: 1px dotted #ccc;
    line-height: 1.5;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
