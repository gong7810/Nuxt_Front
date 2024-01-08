import { defineStore } from "pinia";
import {
  getAccountCodeList,
  getAccountInnerCodeList,
  getDeptDetailList,
  getDeptList,
  getYearData,
  searchBudgeStatus,
} from "@/api/account/budget";

export const budgetStore = defineStore("budgetStore", {
  state: () => ({
    periodList: [],
    deptList: [],
    detailDeptList: [],
    accountCodeList: [],
    detailAccountList: [],
  }),
  actions: {
    async SEARCH_YEAR_DATA() {
      try {
        const res = await getYearData();

        this.periodList = res.data.periodList;
      } catch (err: any) {
        throw new Error(err);
      }
    },

    async SEARCH_DEPT_LIST() {
      try {
        const response = await getDeptList();

        console.log("responseresponse", response);
        this.deptList = response.data.deptList;
      } catch (err: any) {
        throw new Error(err);
      }
    },

    async SEARCH_DEPT_DETAIL_LIST(payload: any) {
      try {
        const response = await getDeptDetailList(payload);

        this.detailDeptList = response.data.detailDeptList;
      } catch (err: any) {
        throw new Error(err);
      }
    },
    async SEARCH_ACCOUNT_CODE_LIST() {
      try {
        const response = await getAccountCodeList();

        this.accountCodeList = response.data.accountCodeList;
      } catch (err: any) {
        throw new Error(err);
      }
    },

    async SEARCH_ACCOUNT_INNER_CODE_LIST(payload: any) {
      try {
        const response = await getAccountInnerCodeList(payload);

        this.detailAccountList = response.data.detailAccountList;
      } catch (err: any) {
        throw new Error(err);
      }
    },

    SEARCH_BUDGET_STATUS(state: any, budgetStatusList: any) {
      state.searchBudgetStatus = budgetStatusList;
    },

    async SEARCH_BUDGET_STATUS_REQUEST({ commit }: any, data: any) {
      console.log("예산실적 data ~", data);
      try {
        const response = await searchBudgeStatus(data);

        console.log(
          "searchBudgetList 액션실행~",
          response.data.budgetStatusList
        );
        commit("SEARCH_BUDGET_STATUS", response.data.budgetStatusList);

        return response.data.budgetStatusList;
      } catch (err: any) {
        throw new Error(err);
      }
    },
  },
});
