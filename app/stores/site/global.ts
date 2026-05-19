import { defineStore } from 'pinia';
import type { OptionsAttrs } from '#server/models/options.model';
import type { CategoryAttrs } from '#server/models/category.model';
import type { User } from '#server/models/user.model';

export const useGlobalStore = defineStore('site-global', () => {
  const options: Ref<OptionsAttrs | null> = ref(null);
  const categoryList: Ref<CategoryAttrs[] | null> = ref(null);
  const currentCategoryId: Ref<number | null> = ref(null);
  const user: Ref<undefined | User> = ref(undefined);

  async function fetchOptions() {
    options.value = await $fetch('/api/site/options/get');
  }

  async function fetchCategoryList() {
    categoryList.value = await $fetch('/api/site/category/list');
  }

  async function setCurrentCategoryId(id: number) {
    currentCategoryId.value = id;
  }

  return {
    options,
    categoryList,
    currentCategoryId,
    user,
    fetchOptions,
    fetchCategoryList,
    setCurrentCategoryId,
  };
});
