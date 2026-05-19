<template>
  <aside class="c-sidebar">
    <slot></slot>
  </aside>
</template>

<style lang="scss">
@media (min-width: 960px) {
  .c-sidebar {
    flex: 1;
    margin-left: 50px;
  }
}
</style>
