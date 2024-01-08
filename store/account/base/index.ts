import { defineStore } from "pinia";
import {
  addCustomerCode,
  deleteCustomerCode,
  getAccountCode,
  getAccountLedger,
  getCashJournal,
  getDetailTrialBalance,
  getGeneralAccountLedger,
  searchAccountCodeList,
  searchCustomerList,
  updateCustomerCode,
} from "@/api/account/base";

export const baseStore = defineStore("baseStore", {
  state: () => ({
    fullAccountCodeList: [],
    accountCodeList: [],
    accountCode: [],
    accountLedgerList: [],
    generalAccountLedgerList: [],
    detailTrialBalanceList: [],
    cashJournalList: [],
    accountCustomerList: [],
    selectedRow: [],
  }),
  actions: {
    // 계정코드 전체조회
    async SEARCH_ACCOUNT_CODE_LIST() {
      try {
        const response = await searchAccountCodeList();

        this.fullAccountCodeList = response.data.accountCodeList;
        this.accountCodeList = response.data.accountCodeList.filter(
          (item) => item.accountInnerCode.length === 4
        );

        return response.data.accountCodeList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 계정코드 조건조회
    async SEARCH_ACCOUNT_CODE({ accountInnerCode, accountName }: any) {
      try {
        const response = await getAccountCode({
          accountInnerCode,
          accountName,
        });

        this.accountCode = response.data.accountCodeList;

        return response.data.accountCodeList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 계정별원장
    async SEARCH_ACCOUNT_LEDGER({ accountCode, startDate, endDate }: any) {
      try {
        const response = await getAccountLedger({
          accountCode,
          startDate,
          endDate,
        });

        this.accountLedgerList = response.data.accountLedgerList;

        return response.data.accountLedgerList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 총계정원장
    async SEARCH_GENERAL_ACCOUNT_LEDGER_LIST({ startDate, endDate }: any) {
      try {
        const response = await getGeneralAccountLedger({ startDate, endDate });

        this.generalAccountLedgerList = response.data;

        return response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 일(월)계표
    async SEARCH_DETAIL_TRIAL_BALANCE_LIST({ startDate, endDate }: any) {
      try {
        const response = await getDetailTrialBalance({ startDate, endDate });

        this.detailTrialBalanceList = response.data.detailTrialBalanceList;

        return response.data.detailTrialBalanceList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 현금출납장
    async SEARCH_CASH_JOURNAL_LIST({ startDate, endDate }: any) {
      try {
        const response = await getCashJournal({ startDate, endDate });

        this.cashJournalList = response.data.cashJournalList;

        return response.data.cashJournalList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // // 거래처 관리 // //
    // 거래처 조회
    async SEARCH_CUSTOMER_CODE() {
      try {
        const response = await searchCustomerList();

        this.accountCustomerList = response.data.accountCustomerList;

        return response.data.accountCustomerList;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 거래처 추가
    async ADD_CUSTOMER_CODE(addCustomerInfo: any) {
      try {
        const response = await addCustomerCode(addCustomerInfo);

        this.accountCustomerList = response.data;

        return response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 거래처 수정
    async UPDATE_CUSTOMER_CODE(updateCustomerInfo: any) {
      try {
        const response = await updateCustomerCode(updateCustomerInfo);

        this.accountCustomerList = response.data;

        return response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 거래처 삭제
    async DELETE_CUSTOMER_CODE(customerCode: string) {
      try {
        await deleteCustomerCode(customerCode);
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
});
