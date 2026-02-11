<template>
  <div v-if="article">
    <div>{{ article.articleid }}</div>
    <div>{{ article.title }}</div>
    <div>{{ test }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { ArticleAttrs } from '~/dal/models/article';

defineOptions({
  name: 'ArticleDetail'
});

const route = useRoute();
const id = route.params.id;
// const title = route.params.title;

const article = useState<ArticleAttrs | null>(() => null);

if (import.meta.server) {
  const readArticle = (await import('@/bll/article')).read;
  article.value = await readArticle(Number(id));
}
</script>
