import { defineStore } from "pinia";
import {
  deletePlan,
  fetchDateDetail,
  fetchDateExpenditure,
  fetchDateIncome,
  registerPlan,
  selectDailyTradeStatus,
  selectFinanceStatus,
  selectGeneralFundStatus,
  selectInoutExpectedPrice,
  selectNote,
  selectNoteStatus,
  selectPlan,
  updatePlan,
} from "@/api/account/funds/index";

export const fundsStore = defineStore("fundsStore", {
  state: () => ({
    noteList: [] as any, // 어음 리스트
    dailyTradeStatusList: [] as any, // 일일거래증감현황 리스트
    inExpectedPriceList: [] as any, // 입금예정액 리스트
    outExpectedPriceList: [] as any, // 출금예정액 리스트
    inExpectedPlanList: [] as any, // 수입예정계획 리스트
    outExpectedPlanList: [] as any, // 지출예정계획 리스트
    financeStatusList: [] as any, // 예적금현황 리스트
    generalTradeStatusList: [] as any, // 총괄거래현황 리스트
    payableNoteStatusList: [] as any, // 지급어음현황 리스트
    receivableNoteStatusList: [] as any, // 받을어음현황 리스트
  }),
  actions: {
    // 일자별자금계획 추가
    async CREATE_PLAN(plan: any) {
      try {
        const response = await registerPlan(plan);

        return response.data.planNo;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 일자별자금계획 조회
    async FETCH_PLAN({ startDate, endDate }: any) {
      try {
        const response = await selectPlan({ startDate, endDate });

        console.log("API 호출성공: ", response.data);
        this.inExpectedPlanList = response.data.inExpectedPlanList;
        this.outExpectedPlanList = response.data.outExpectedPlanList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 일자별자금계획 삭제
    async DELETE_PLAN(planNo: string) {
      try {
        return await deletePlan(planNo);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 일자별자금계획 수정
    async UPDATE_PLAN(plan: any) {
      try {
        return await updatePlan(plan);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 자금계획 카렌다 날짜별 수입조회
    async FETCH_DATE_INCOME(day: any) {
      try {
        return await fetchDateIncome(day);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 자금계획 카렌다 날짜별 지출조회
    async FETCH_DATE_EXPENDITURE(day: any) {
      try {
        return await fetchDateExpenditure(day);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 자금계획 카렌다 날짜별 계획상세조회
    async FETCH_DATE_DETAIL(date: string) {
      try {
        const response = await fetchDateDetail(date);

        console.log("API 호출성공: ", response.data);
        this.inExpectedPlanList = response.data.inExpectedPlanList;
        this.outExpectedPlanList = response.data.outExpectedPlanList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 어음명세서 조회
    async FETCH_ALL_NOTE(accountCode: string) {
      try {
        const response = await selectNote(accountCode);

        this.noteList = response.data.noteList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 일일거래증감현황 조회
    async FETCH_DAILY_TRADE_STATUS({ date }: any) {
      try {
        const response = await selectDailyTradeStatus({ date });

        console.log("API 호출성공: ", response.data);
        this.dailyTradeStatusList = response.data.dailyTradeStatusList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 입출금예정액 조회
    async FETCH_INOUT_EXPECTED_PRICE({ date }: any) {
      try {
        const response = await selectInoutExpectedPrice({ date });

        console.log("API 호출성공: ", response.data);
        this.inExpectedPriceList = response.data.inExpectedPriceList;
        this.outExpectedPriceList = response.data.outExpectedPriceList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 예적금현황 조회
    async FETCH_FINANCE_STATUS({ date, accountName }: any) {
      try {
        const response = await selectFinanceStatus({ date, accountName });

        console.log("API 호출성공: ", response.data);
        this.financeStatusList = response.data.financeStatusList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 총괄거래현황 조회
    async FETCH_GENERAL_FUND_STATUS(startDate: any, endDate: any) {
      try {
        const response = await selectGeneralFundStatus(startDate, endDate);

        console.log("API 호출성공: ", response.data);
        this.generalFundStatusList = response.data.generalFundStatusList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 어음현황 조회
    async FETCH_NOTE_STATUS({ date }: any) {
      try {
        const response = await selectNoteStatus({ date });

        console.log("API 호출성공: ", response.data);
        this.payableNoteStatusList = response.data.payableNoteStatusList;
        this.receivableNoteStatusList = response.data.receivableNoteStatusList;
      } catch (error: any) {
        console.error(error);
      }
    },
  },
  getters: {
    GET_SLIP_lIST(state: any) {
      return state.allSlipList;
    },
  },
});
