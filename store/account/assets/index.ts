import { defineStore } from "pinia";
import {
  addFixedAssetsCodeList,
  deleteFixedAssetsCodeList,
  getDepreciationList,
  getFixedAssetsCodeList,
  getfixedAssetLedgerList,
  searchFixedAssetsCodeList,
  searchFixedAssetsDetailList,
  selectedDepreciationList,
  updateFixedAssetsCodeList,
} from "@/api/account/assets";

export const assetsStore = defineStore("assetsStore", {
  state: () => ({
    fixedAssetsCodeList: [],
    getDepreciationList: [],
    selectedDepreciationList: [],
    searchFixedAssetsCodeList: [],
    searchFixedAssetsDetailList: [],
    accountCodeList: [],
    selectedRow: [],
  }),
  actions: {
    //  고정자산 코드조회
    async GET_FIXED_ASSETS_CODE_LIST() {
      try {
        const response = await getFixedAssetsCodeList();

        this.fixedAssetsCodeList = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 감가상각현황 전체조회
    async GET_DEPRECIATION_LIST() {
      try {
        const response = await getDepreciationList();

        this.getDepreciationList = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 감가상각현황 조건조회
    async SELECTED_DEPRECIATION_LIST({ accountCode }: any) {
      try {
        const response = await selectedDepreciationList({ accountCode });

        this.selectedDepreciationList = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산관리대장 전체조회
    async GET_FIXED_ASSET_LEDGER_LIST() {
      try {
        const response = await getfixedAssetLedgerList();

        this.getDepreciationList = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산 조건조회
    async SEARCH_FIXED_ASSETS_CODE_LIST({
      fixedAssetsCode,
      fixedAssetsName,
    }: any) {
      try {
        const response = await searchFixedAssetsCodeList({
          fixedAssetsCode,
          fixedAssetsName,
        });

        this.searchFixedAssetsCodeList = response.data;

        return response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산 상세조회
    async SEARCH_FIXED_ASSETS_DETAIL_LIST({ assetCode }: any) {
      try {
        const response = await searchFixedAssetsDetailList({ assetCode });

        this.searchFixedAssetsDetailList = response.data;

        return response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산 추가
    async ADD_FIXED_ASSETS_CODE_LIST({ data }: any) {
      try {
        await addFixedAssetsCodeList({ data });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산 수정
    async UPDATE_FIXED_ASSETS_CODE_LIST({ data }: any) {
      try {
        await updateFixedAssetsCodeList({ data });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // 고정자산 삭제
    async DELETE_FIXED_ASSETS_CODE_LIST({ assetsCode }: any) {
      try {
        await deleteFixedAssetsCodeList({ assetsCode });
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
});
