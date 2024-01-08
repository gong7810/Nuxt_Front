import { defineStore } from "pinia";
import {
  getEarlyTotalTrialBalanceStatement, // 합계잔액시산표 결산 전 저장
  getEarlyTotalTrialBalanceStatementList, // 합계잔액시산표 결산 전 조회
  getStatementList, // 합계잔액시산표 결산
  getTotalTrialBalance, // 합계잔액시산표 결산 후 조회
  getTotalTrialBalanceStatement, // 합계잔액시산표 결산 후 수정
  getCancelStatement, // 합계잔액시산표 결산취소
  getIncomeStatement, // 손익계산서
  getFinancialPosition, // 재무상태표
  getMonthIncomeStatement, // 월별손익계산서
  getCashFlowStatement, // 현금흐름표
  getCostStatement, // 원가명세서
  getRetainedEarningsStatement, // 이익잉여금처분계산서
  getMonthCostStatement, // 기간별원가명세서
  getPeriodDataList, // 모달창
} from "@/api/account/statement";

export const statementStore = defineStore("statementStore", {
  state: () => ({
    earlyTotaltrialList: [], // 합계잔액시산표 결산 전 조회
    totaltrialList: [], // 합계잔액시산표 결산 후 조회
    incomeStatement: [], // 손익계산서
    financialPositionList: [], //  재무상태표
    monthIncomeStatementList: [], // 월별손익계산서
    cashFlowList: [], // 현금흐름표
    costList: [], // 원가명세서
    retainedEarningsList: [], // 이익잉여금처분계산서
    monthCostList: [], // 기간별원가명세서
    periodDataList: [], // 모달창
    selectedRow: [],
  }),
  actions: {
    // 모달창
    async SEARCH_PERIOD_DATA_LIST() {
      try {
        const response = await getPeriodDataList();

        console.log("111111", response.data.accountPeriodList);
        this.periodDataList = response.data.accountPeriodList;
      } catch (err: any) {
        throw new Error(err);
      }
    },

    // 합계잔액시산표 결산 전 데이터 저장
    async SEARCH_EARLY_TOTAL_TRIAL_BALANCE_STATEMENT(payload: any) {
      try {
        await getEarlyTotalTrialBalanceStatement(payload);
      } catch (err: any) {
        throw new Error(err);
      }
    },

    // 합계잔액시산표 결산 전 데이터 조회
    async SEARCH_EARLY_TOTAL_TRIAL_BALANCE_STATEMENT_LIST(payload: any) {
      try {
        const response = await getEarlyTotalTrialBalanceStatementList(payload);

        console.log("222222", response.data.earlyTotaltrialList);
        this.earlyTotaltrialList = response.data.earlyTotaltrialList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 합계잔액시산표 결산
    async SEARCH_STATEMENT_LIST(payload: any) {
      try {
        await getStatementList(payload);
      } catch (err: any) {
        throw new Error(err);
      }
    },

    // 합계잔액시산표 결산 후 조회
    async SEARCH_TOTAL_TRIAL_BALANCE_LIST(payload1: any) {
      try {
        const response = await getTotalTrialBalance(payload1);

        console.log(
          "333333",
          response.data.totalTrialBalanceList.totalTrialBalance
        );
        this.totaltrialList =
          response.data.totalTrialBalanceList.totalTrialBalance;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 합계잔액시산표 결산 후 수정
    async SEARCH_TOTAL_TRIAL_BALANCE_STATEMENT(payload: any) {
      try {
        await getTotalTrialBalanceStatement(payload);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 합계잔액시산표 결산취소
    async SEARCH_CANCEL_STATEMENT(payload: any) {
      try {
        await getCancelStatement(payload);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 손익계산서
    async SEARCH_INCOME_STATEMENT_LIST(payload: any) {
      try {
        const response = await getIncomeStatement(payload);

        console.log("444444", response.data.incomeList.incomeStatement);
        this.incomeStatement = response.data.incomeList.incomeStatement;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 재무상태표
    async SEARCH_FINANCIAL_POSITION_LIST(payload: any) {
      try {
        const response = await getFinancialPosition(payload);

        console.log(
          "555555",
          response.data.financialPositionList.financialPosition
        );
        this.financialPositionList =
          response.data.financialPositionList.financialPosition;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 월별손익계산서
    async SEARCH_MONTH_INCOME_STATEMENT_LIST(payload: any) {
      try {
        const response = await getMonthIncomeStatement(payload);

        console.log("666666", response.data.monthIncomeList);
        this.monthIncomeStatementList = response.data.monthIncomeList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 현금흐름표
    async SEARCH_CASH_FLOW_STATEMENT_LIST(searchDate: any) {
      try {
        const response = await getCashFlowStatement(searchDate);

        console.log("777777", response.data.cashFlowList);
        this.cashFlowList = response.data.cashFlowList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 원가명세서
    async SEARCH_COST_STATEMENT_LIST(searchDate: any) {
      try {
        const response = await getCostStatement(searchDate);

        console.log("888888", response.data.costList);
        this.costList = response.data.costList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 이익잉여금처분계산서
    async SEARCH_RETAINED_EARNINGS_STATEMENT_LIST(searchDate: any) {
      try {
        const response = await getRetainedEarningsStatement(searchDate);

        console.log("999999", response.data.retainedEarningsList);
        this.retainedEarningsList = response.data.retainedEarningsList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 기간별원가명세서
    async SEARCH_MONTH_COST_STATEMENT_LIST(searchDate: any) {
      try {
        const response = await getMonthCostStatement(searchDate);

        console.log("000000", response.data.monthCostList);
        this.monthCostList = response.data.monthCostList;

        return response;
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
});
