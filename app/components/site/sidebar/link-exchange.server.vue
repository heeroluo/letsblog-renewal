<template>
  <site-sidebar-section
    v-if="linkList"
    title="友情链接"
  >
    <dl class="c-sidebar__link-exchange">
      <template
        v-for="item in linkList"
        :key="item.linkId"
      >
        <dt>
          <a
            :href="item.siteURL"
            target="_blank"
            rel="nofollow noopener"
          >{{ item.linkName }}</a>
        </dt>
        <dd>{{ item.introduction }}</dd>
      </template>
    </dl>
  </site-sidebar-section>
</template>

<script lang="ts" setup>
const { data } = await useAsyncData(
  'site-link-exchange',
  async () => {
    const { data } = await useFetch('/api/site/link/list');
    return data.value;
  },
);

const linkList = computed(() => data.value);
</script>

<style lang="scss">
.c-sidebar__link-exchange {
  line-height: 1.5;

  dt {
    margin-top: 0.7em;

    &:first-child {
      margin-top: 0;
    }
  }

  dd {
    color: #999;
    font-size: 12px;
  }
}
</style>
