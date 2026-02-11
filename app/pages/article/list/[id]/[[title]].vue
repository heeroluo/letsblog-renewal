<template>
  <div v-if="article">
    <div>{{ article.articleid }}</div>
    <div>{{ article.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { CategoryAttrs } from '~/dal/models/category';

defineOptions({
  name: 'ArticleList'
});

const route = useRoute();
const id = route.params.id;
// const title = route.params.title;

const category = useState<CategoryAttrs | null>(() => null);


if (import.meta.server) {
  const readArticle = (await import('@/bll/article')).read;
  article.value = await readArticle(Number(id));
}
</script>
