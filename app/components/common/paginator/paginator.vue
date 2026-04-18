<template>
  <ol class="g-paginator">
    <li
      v-if="data.currentPage > 1"
      class="g-paginator__item g-paginator__item-prev"
    >
      <nuxt-link
        :to="data.prevHref"
        class="g-iconfont g-paginator__item__inner"
      />
    </li>
    <li
      v-else
      class="g-paginator__item g-paginator__item-prev g-paginator__item--disabled"
    >
      <span class="g-iconfont g-paginator__item__inner"></span>
    </li>
    <template
      v-for="item in data.pageNumbers"
      :key="item.page"
    >
      <li
        class="g-paginator__item"
        :class="{
          'g-paginator__item-number': typeof item.page === 'number',
          'g-paginator__item-ellipsis': item.page === '...',
          'g-paginator__item--current': item.current,
        }"
      >
        <span
          v-if="item.current"
          class="g-paginator__item__inner"
        >{{ item.page }}</span>
        <span
          v-else-if="item.page === '...'"
          class="g-iconfont g-paginator__item__inner"
        ></span>
        <nuxt-link
          v-else
          :to="item.href"
          class="g-paginator__item__inner"
        >{{ item.page }}</nuxt-link>
      </li>
    </template>
    <li
      v-if="data.currentPage < data.pageCount"
      class="g-paginator__item g-paginator__item-next"
    >
      <nuxt-link
        :to="data.nextHref"
        class="g-iconfont g-paginator__item__inner"
      />
    </li>
    <li
      v-else
      class="g-paginator__item g-paginator__item-next g-paginator__item--disabled"
    >
      <span class="g-iconfont g-paginator__item__inner"></span>
    </li>
  </ol>
</template>

<script setup lang="ts">
interface PageItem {
  page: number | string
  current?: boolean
  href?: string
}

interface PaginatorData {
  currentPage: number
  pageCount: number
  pageNumbers: PageItem[]
  nextHref?: string
  prevHref?: string
}

function createData(currentPage: number, pageCount: number, href: string): PaginatorData {
  const howManyPageItems = 5;
  const howManyPageItemsPerSide = ~~((howManyPageItems - 1) / 2);
  const data: PageItem[] = [];

  let start = currentPage - howManyPageItemsPerSide;
  let end = currentPage + howManyPageItemsPerSide;
  const startOverflow = start - 1;
  const endOverflow = pageCount - end;

  // 把左侧剩余的页码额度移到右侧
  if (startOverflow < 0) {
    start = 1;
    end = Math.min(pageCount, end - startOverflow);
  }
  // 把右侧剩余的页码移到左侧
  if (endOverflow < 0) {
    end = pageCount;
    if (startOverflow > 0) {
      start = Math.max(1, start + endOverflow);
    }
  }

  // 处理 howManyPageItems 为双数，减一后除不尽的情况
  if (howManyPageItems % 2 === 0) {
    if (start > 1) {
      start--;
    } else if (end < pageCount) {
      end++;
    }
  }

  // 开始页码大于1，但第一页一定要显示，所以要减一个额度
  if (start > 1) {
    start++;
  }
  // 结束页码小于总页数，但最后一页一定要显示，所以要减一个额度
  if (end < pageCount) {
    end--;
  }

  // 补充第一页到开始页
  if (start - 1) {
    data.push({
      page: 1,
      current: false,
    }, {
      page: '...',
    });
  }

  for (let i = start; i <= end; i++) {
    data.push({
      page: i,
      current: i == currentPage,
    });
  }

  // 补充结束页到末页
  if (pageCount - end) {
    data.push({
      page: '...',
    }, {
      page: pageCount,
      current: false,
    });
  }

  let prevHref: string | undefined;
  let nextHref: string | undefined;
  data.forEach((item) => {
    if (typeof item.page === 'number') {
      item.href = href.replace('{{page}}', item.page.toString());
      if (item.page === currentPage + 1) {
        nextHref = item.href;
      } else if (item.page === currentPage - 1) {
        prevHref = item.href;
      }
    }
  });

  return {
    currentPage: currentPage,
    pageCount: pageCount,
    pageNumbers: data,
    nextHref: nextHref,
    prevHref: prevHref,
  };
}

const props = withDefaults(
  defineProps<{
    pageCount: number
    currentPage?: number
    hrefTemplate: string
  }>(),
  {
    currentPage: 1,
  },
);

const data = computed(
  () => createData(props.currentPage, props.pageCount, props.hrefTemplate),
);
</script>

<style lang="scss">
.g-paginator {
  position: relative;
  display: flex;
  justify-content: center;
  column-gap: 12px;
  margin-top: 30px;
  font-family: Tahoma;
  text-align: center;
}
.g-paginator__item__inner {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e3e3e3;
  line-height: 28px;
  text-align: center;
  color: #999;
  transition-duration: 0.3s;
  transition-property: color, border;
}
a.g-paginator__item__inner:hover {
  border-color: #999;
  color: #666 !important;
  text-decoration: none;
}
.g-paginator__item--current .g-paginator__item__inner {
  background: #80bd01;
  border-color: #80bd01;
  color: #fff;
}
.g-paginator__item-prev,
.g-paginator__item-next {
  position: absolute;
  top: 0;
  margin: 0;
}
.g-paginator__item-prev { left: 0; }
.g-paginator__item-next { right: 0; }
.g-paginator__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.g-paginator__item-ellipsis {
  margin-left: 0;
  margin-right: 0;
}
.g-paginator__item-ellipsis .g-paginator__item__inner {
  border-color: rgba(0, 0, 0, 0);
}
.g-paginator__item-ellipsis .g-paginator__item__inner:after { content: '\e606'; }
.g-paginator__item-prev .g-paginator__item__inner:after { content: '\e618'; }
.g-paginator__item-next .g-paginator__item__inner:after { content: '\e617'; }

@media (max-width: 767px) {
  .g-paginator__item {
    margin-left: 3px;
    margin-right: 3px;
  }
  .g-paginator__item--prev,
  .g-paginator__item--next { margin: 0; }
}
</style>
