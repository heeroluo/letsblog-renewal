<template>
  <footer class="g-footer">
    <div class="g-boundary g-footer__boundary">
      <nav class="g-footer__nav">
        <ul class="g-footer__nav__list">
          <li>
            <nuxt-link to="/">首页</nuxt-link>
          </li>
          <li
            v-for="item in categoryList"
            :key="item.categoryId"
          >
            <nuxt-link :to="item.href">{{ item.categoryName }}</nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="g-footer__copyright">
        <p>Copyright &copy; 2009-{{ data?.currentYear }} <nuxt-link to="/">{{ options?.siteName }}</nuxt-link>. All rights reserved.</p>
        <p>
          本站原创内容采用 <a
            href="http://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
          >知识共享署名-非商业性使用 4.0 </a> 国际许可协议。
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~/stores/site/global';

const { options, categoryList } = useGlobalStore();

const { data } = useAsyncData(async () => {
  return {
    currentYear: (new Date()).getFullYear(),
  };
}, {
  server: true,
  lazy: false,
});
</script>

<style lang="scss">
.g-footer {
  padding: 30px 0;
  background: #444;
  font-size: 12px;
  line-height: 1.6;
  color: #fafafa;
}
.g-footer__boundary {
  @media (min-width: 960px) {
    display: flex;
    justify-content: space-between;
  }
}

.g-footer__nav__list {
  display: flex;
  padding: 0 5px 10px 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (min-width: 400px) {
    column-gap: 16px;
  }
  @media (max-width: 399px) {
    flex-direction: column;
    row-gap: 6px;
  }
}

.g-footer__copyright {
  display: flex;
  flex-direction: column;
  row-gap: 6px;

  @media (max-width: 959px) {
    padding: 0 5px;
    margin-top: 18px;
  }
}
</style>
