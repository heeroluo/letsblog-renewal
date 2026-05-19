<template>
  <section class="c-sidebar__section">
    <h2 class="c-sidebar__section__title">
      {{ title }}
    </h2>
    <slot></slot>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>();
</script>

<style lang="scss">
.c-sidebar__section {
  margin-top: 30px;

  &:first-child {
    margin-top: 0;
  }
}

.c-sidebar__section__title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  line-height: 28px;
}
</style>
