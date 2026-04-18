<template>
  <header class="c-header">
    <div class="c-header__inner">
      <div class="g-boundary g-flex-v-center c-header__boundary">
        <div
          v-if="options"
          class="c-header__logo"
        >
          <a href="/">
            <img
              src="./assets/logo.png"
              :alt="options?.siteName"
            />
          </a>
        </div>
        <nav class="c-header__nav">
          <i
            class="g-iconfont c-header__nav__toggle"
            :class="{
              'c-header__nav__toggle--on': isNavListVisible,
            }"
            @click="toggleNavList"
          ></i>
          <ul
            class="c-header__nav__list"
            :class="{
              'c-header__nav__list--on': isNavListVisible,
            }"
          >
            <li
              class="c-header__nav__list-item"
              :class="{
                'c-header__nav__list-item--current': currentCategoryId === 0,
              }"
            >
              <nuxt-link to="/">首页</nuxt-link>
            </li>
            <li
              v-for="item in categoryList"
              :key="item.categoryId"
              class="c-header__nav__list-item"
              :class="{
                'c-header__nav__list-item--current': currentCategoryId === item.categoryId,
              }"
            >
              <nuxt-link :to="item.href">{{ item.categoryName }}</nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- <div class="c-header__user">
          <template v-if="user && user.userid > 0">
            <i class="iconfont header__user__toggle"></i>
            <ul class="c-header__user__menu">
              <li>欢迎回来, {{ user.nickname }}</li>
              <li class="c-header__user__menu__item__admin">
                <a
                  href="/admin/home"
                  target="_blank"
                >后台管理</a>
                <span class="c-header__user__menu__item__admin__pending-reviews">
                  (<a
                    href="/admin/comment/list/?state=0"
                    target="_blank"
                  >待审:<em></em>条</a>)
                </span> |
                <a href="/user/logout">退出</a>
              </li>
            </ul>
          </template>
          <div
            v-else
            class="c-header__user__login"
          >
            <a href="/user/login">登录</a>
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// import type { OptionsAttrs } from '~/dal/models/options';
// import type { CategoryAttrs } from '~/dal/models/category';
// import type { User } from '~/dal/models/user';
import { useGlobalStore } from '~/stores/site/global';

const { options, categoryList, currentCategoryId } = storeToRefs(useGlobalStore());

// const user = ref<User | null>(null);

const isNavListVisible = ref(false);

function toggleNavList() {
  isNavListVisible.value = !isNavListVisible.value;
}

function hideNavList(evt: PointerEvent) {
  const target = evt.target as HTMLElement;
  if (target.classList.contains('c-header__nav__toggle')) {
    return;
  }
  isNavListVisible.value = false;
}

onMounted(() => {
  document.addEventListener('click', hideNavList, false);
});
onUnmounted(() => {
  document.removeEventListener('click', hideNavList, false);
});
</script>

<style lang="scss">
.c-header__inner {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  background: rgba(255, 255, 255, 0.93);
  border-bottom: 1px solid #eee;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);

  a {
    text-decoration: none;
  }
}
.c-header__boundary {
  height: 100%;
}

.c-header__logo {
  img {
    height: 100%;
  }
}

.c-header__nav__list-item a {
  display: block;
  height: 100%;
  padding: 0 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
}
.c-header__nav__list-item--current a { color: #333; }
.c-header__user { max-width: 180px; }
.c-header__user__menu li {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.c-header__user__menu__item__admin {
  font-size: 12px;
  color: #999;
}
.c-header__user__menu__item__admin em {
  color: #f53a24;
}
.c-header__user__menu__item__admin__pending-reviews {
  display: none;
}

@media (min-width: 960px) {
  $headerHeight: 81px;

  .c-header,
  .c-header__inner {
    height: $headerHeight;
  }
  .c-header__logo {
    height: 46px;
  }
  .c-header__nav {
    height: 100%;
    margin-left: 44px;
  }
  .c-header__nav__toggle { display: none; }
  .c-header__nav__list {
    display: flex;
    column-gap: 14px;
  }
  .c-header__nav__list-item {
    height: $headerHeight;
    line-height: $headerHeight - 1px;
    overflow: hidden;

    a {
      max-width: 115px;
      &:hover {
        color: #333 !important;
      }
    }
  }
  .c-header__nav__list-item--current {
    border-bottom: 2px solid #333;
  }
  .c-header__user {
    float: right;
    max-width: 180px;
    padding: 15px 0;
    line-height: 50px;
  }
  .c-header__user__toggle { display: none; }
  .c-header__user__menu { line-height: 25px; }
}

@media (min-width: 960px) and (max-width: 1000px) {
  .c-header__user { max-width: 150px; }
}

@media (min-width: 768px) and (max-width: 1099px) {
  .c-header__nav__list-item a {
    padding-left: 7px;
    padding-right: 7px;
  }
}

@media (max-width: 959px) {
  $headerHeight: 65px;

  .c-header,
  .c-header__inner {
    height: $headerHeight;
  }
  .c-header__boundary {
    position: relative;
  }
  .c-header__logo {
    width: 100%;
    height: 40px;
    text-align: center;
  }
  .c-header__nav__toggle,
  .c-header__user__toggle,
  .c-header__user__login {
    line-height: 64px;
    position: absolute;
    top: 0;
  }
  .c-header__nav__toggle,
  .c-header__user__toggle {
    font-size: 28px;
    color: #999;
    cursor: pointer;
  }
  .c-header__nav__toggle {
    left: 0;
    transition-property: color;
    transition-duration: 0.4s;
  }
  .c-header__nav__toggle:after { content: '\e622'; }
  .c-header__nav__toggle--on { color: #08c; }
  .c-header__nav__list {
    user-select: none;
  }
  .c-header__nav__list,
  .c-header__user__menu {
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #eee;
    background: rgba(255, 255, 255, 0.93);
    display: none;
  }
  .c-header__nav__list--on,
  .c-header__user__menu--on {
    display: block;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
  }
  .c-header__nav__list-item {
    box-sizing: border-box;
    float: left;
    width: 25%;
    height: 50px;
    line-height: 50px;
    margin: 0;
    text-align: center;
  }
  .c-header__user__login {
    position: absolute;
    top: 0;
    line-height: 70px;
  }
  .c-header__user__toggle,
  .c-header__user__login { right: 0; }
  .c-header__user__toggle { transition-duration: 0.4s; }
  .c-header__user__toggle:after { content: '\e625'; }
  .c-header__user__toggle--on { color: #08c; }
  .c-header__user__menu {
    padding: 7px 0;
    text-align: right;
  }
  .c-header__user__menu li {
    padding: 0 30px;
    line-height: 25px;
    word-spacing: 0.5em;
  }
}
</style>
