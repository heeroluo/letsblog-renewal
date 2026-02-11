import { defineStore } from 'pinia';
import type { Options } from '~/dal/models/options';
import type { Category } from '~/dal/models/category';
import type { User } from '~/dal/models/user';

export const useFrontStore = defineStore('front', {
  state() {
    return {
      options: null as Options | null,
      categoryList: [] as Category[],
      user: null as User | null
    };
  }
});
