import { defineStore } from 'pinia';

export const commonStore = defineStore('commonStore', {
  state: () => ({
    menu: '' as any, // 현재 메뉴
  }),
  actions: {
    // 메뉴 변경
    FETCH_MENU(menu: string) {
      try {
        this.menu = menu;
      } catch (error: any) {
        console.error(error);
      }
    },
  },
})