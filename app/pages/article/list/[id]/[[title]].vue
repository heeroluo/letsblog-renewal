<template>
  <div class="g-container">
    <div class="g-boundary g-container__boundary">
      <main
        v-if="category"
        class="p-article-list"
      >
        <template v-if="articleList && articleList.rows.length > 0">
          <article
            v-for="article in articleList.rows"
            :key="article.articleId"
            class="p-article-list__item"
          >
            <header class="p-article-list__item__header">
              <h2 class="g-article-title p-article-list__item__header__title">
                <nuxt-link :to="article.href">{{ article.title }}</nuxt-link>
              </h2>
              <div class="p-article-list__item__header__meta">
                <nuxt-link :to="article.category.href">{{ article.category.categoryName }}</nuxt-link>
              </div>
            </header>
            <div
              class="g-article-content p-article-list__item__summary"
              v-html="article.summary"
            >
            </div>
          </article>
          <common-paginator
            v-if="articleList.pageCount > 1"
            :page-count="articleList.pageCount"
            :current-page="articleList.page"
            :href-template="`${category.href}?page={{page}}`"
          />
        </template>
      </main>
      <aside></aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useGlobalStore } from '~/stores/site/global';
// import type { DataList } from '#shared/types/data';
// import type { CategoryAttrs } from '#server/repositories/category.repo';
// import type { ArticleAttrs } from '#server/repositories/article.repo';

definePageMeta({
  layout: 'site',
});

const route = useRoute();
const queryId = Number(route.params.id);
const queryPage = Number(route.query.page) || 1;

const { data } = await useAsyncData(`article-list-${queryId}`, async () => {
  const requests = await Promise.all([
    useFetch('/api/category/detail', {
      query: { categoryId: queryId },
    }),

    useFetch('/api/article/list', {
      query: {
        categoryId: queryId,
        page: queryPage,
      },
    }),
  ]);

  return {
    category: requests[0].data.value,
    articleList: requests[1].data.value,
  };
});

const category = computed(() => data.value?.category);

const articleList = computed(() => data.value?.articleList);

onMounted(() => {
  watch(category, (value) => {
    const { setCurrentCategoryId } = useGlobalStore();
    if (value) {
      setCurrentCategoryId(value.categoryId as number);
    }
  }, {
    immediate: true,
  });
});
</script>

<style lang="scss">
.p-article-list__item {
  margin-bottom: 30px;
  padding: 30px;
  border-radius: 5px;
  background: #fff;
}
.p-article-list__item:first-child { margin-top: 0; }
.p-article-list__item:last-child { border-bottom: none; }

.p-article-list__item__header { line-height: 28px; }
.p-article-list__item__header__title {
  font-size: 22px;
}
.p-article-list__item__header__title a { color: #000; }
.p-article-list__item__header__title a:hover { color: #000 !important; }
.p-article-list__item__header__meta {
  font-size: 14px;
  color: #aaa;
}

.p-article-list__item__summary {
  margin-top: 25px;
  color: #666;
}

.p-article-list__item__footer { margin-top: 25px; }
.p-article-list__item__footer_info {
  float: left;
  padding-top: 12px;
  line-height: 24px;
  font-size: 12px;
  color: #aaa;
}
.p-article-list__item__footer_info em {
  margin-right: 2px;
  font-size: 14px;
  color: #333;
}
.p-article-list__item__footer__share { float: right; }
.p-article-list__item__footer__share .share-ico {
  float: left;
  margin-left: 0.5em;
}

@media (min-width: 960px) {
  .p-article-list {
    width: 70%;
  }
  .p-article-list__item__header {
    display: flex;
    justify-content: space-between;
  }
  .p-article-list__item__header__title {
    width: 70%;
  }
  .p-article-list__item__header__meta {
    width: 25%;
    text-align: right;
  }
}

@media (max-width: 959px) {
  .p-article-list__item {
    padding: 20px 30px;
    margin-left: -30px;
    margin-right: -30px;
  }
  .p-article-list__item__header__meta { margin-top: 0.5em; }
}

@media (max-width: 767px) {
  .p-article-list__item {
    padding: 20px;
    margin-left: -20px;
    margin-right: -20px;
  }
}
</style>
