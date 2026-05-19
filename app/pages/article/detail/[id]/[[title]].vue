<template>
  <main
    v-if="article"
    class="p-article-detail"
  >
    <header class="p-article-detail__header">
      <h1 class="g-article-title">
        {{ article.title }}
      </h1>
      <div class="p-article-detail__header__meta">
        <address>{{ article.user.nickname }}</address>
        发表于
        <time :datetime="pubTime">{{ pubTime }}</time>，已被查看
        {{ article.totalViews }} 次
      </div>
    </header>
    <div
      class="g-article-content p-article-detail__content"
      v-html="article.content"
    >
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { formatDate } from '#shared/utils/formatter';
import { useGlobalStore } from '~/stores/site/global';

definePageMeta({
  layout: 'site',
});

const route = useRoute();
const queryId = Number(route.params.id);

const { data: article } = await useAsyncData(`article-${queryId}`, async () => {
  const res = await useFetch('/api/site/article/detail', {
    query: {
      articleId: queryId,
    },
  });
  return res.data.value;
});

const { options } = useGlobalStore();

if (article.value) {
  const seoTitle = [
    article.value.title,
    article.value.category.categoryName,
  ];
  if (options?.siteName) {
    seoTitle.push(options.siteName);
  }
  useSeoMeta({
    title: seoTitle.join(' | '),
    keywords: article.value.keywords,
  });
}

const pubTime = computed(() => {
  return article.value ? formatDate(article.value.pubTime) : '';
});

onMounted(() => {
  if (!article.value) {
    return;
  }
  const href = article.value.href;
  if (route.path !== href) {
    const router = useRouter();
    router.replace(href);
  }
});
</script>

<style lang="scss">
.p-article-detail {
  padding: 40px 0;
  background-color: #fff;

  @media (min-width: 1000px) {
    width: 960px;
    margin: 0 auto;
  }
}
.p-article-detail__header__meta {
  margin-top: 15px;
  color: #aaa;
}
.p-article-detail__content {
  margin-top: 30px;
}
</style>
