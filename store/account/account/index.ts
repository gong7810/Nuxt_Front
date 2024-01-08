import { defineStore } from "pinia";
import {
  approvalSlip,
  deleteReceipt,
  deleteSlip,
  editSlip,
  fetchAccountControlCode,
  fetchAccountCustomerCode,
  getAccountCode,
  getAccountCodeList,
  getDeptList,
  getEmpList,
  proofReceipt,
  registerReceipt,
  registerSlip,
  registerSlipFile,
  selectJournalList,
  selectJournals,
  selectReceipts,
  selectSlip,
  selectSlips,
  selectStatusSlips,
  selectUnProSlips,
} from "@/api/account/account/index";

export const accountStore = defineStore("accountStore", {
  state: () => ({
    allSlipList: [] as any, // 전표 전체
    statusSlipList: [] as any, // 승인 / 반려 전표
    unProSlipList: [] as any, // 미결 전표 전체
    slipForm: [] as any, // 전표 한개
    allJournalList: [] as any, // 분개 전체
    journalList: [] as any, // 분개
    accountCodeList: [] as any, // 계정코드 전체
    accountCode: [] as any, // 계정코드
    accountCustomerList: [] as any, // 거래처 전체
    accountControlCodeList: [] as any, // 분개상세 코드
    receiptList: [] as any, // 지출증빙 전체
    empList: [] as any, // 사원 전체
    departmentList: [] as any, // 부서 전체
  }),
  actions: {
    // 전표 전체조회
    async FETCH_ALL_SLIP() {
      try {
        const response = await selectSlips();

        this.allSlipList = response.data.SlipList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 승인 / 반려 전표 조회
    async FETCH_STATUS_SLIP(status: string) {
      try {
        const response = await selectStatusSlips(status);

        this.statusSlipList = response.data.statusSlipList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 미결 전표 조회
    async FETCH_UNPRO_SLIP() {
      try {
        const response = await selectUnProSlips();
        this.unProSlipList = response.data.unProSlipList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 한개조회
    async FETCH_SLIP(slipNo: string) {
      try {
        const { data } = await selectSlip(slipNo);

        this.slipForm = data.slipForm;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 추가
    async CREATE_SLIP(slip: any) {
      try {
        const response = await registerSlip(slip);

        return response.data.newSlipNo;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 파일로 추가
    async CREATE_SLIP_FILE(slipList: any) {
      try {
        const response = await registerSlipFile(slipList);

        return response.data.errorMsg;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 승인
    async APPROVAL_SLIP(slipList: any) {
      try {
        const response = await approvalSlip(slipList);

        console.log("결과 메세지: ", response.data["updateMsg"]);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 삭제
    async DELETE_SLIP(slipList: any) {
      try {
        return await deleteSlip(slipList);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 전표 수정
    async EDIT_SLIP(slipList: any) {
      try {
        const response = await editSlip(slipList);

        console.log("수정된 전표 번호 : ", response.data);

        return response;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 분개 전체조회
    async FETCH_ALL_JOURNAL(slipNo: string) {
      try {
        const response = await selectJournalList(slipNo);

        this.allJournalList = response.data.JournalList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 계정코드 전체조회
    async FETCH_ACCOUNT_CODE_LIST() {
      try {
        const response = await getAccountCodeList();

        this.accountCodeList = response.data.accountCodeList.filter(
          (item: any) => item.accountInnerCode.length === 4
        );
      } catch (error: any) {
        console.error(error);
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
      } catch (error: any) {
        console.error(error);
      }
    },

    // 거래처코드 조회
    async FETCH_ACCOUNT_CUSTOMER_CODE() {
      try {
        const { data } = await fetchAccountCustomerCode();

        this.accountCustomerList = data.accountCustomerList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 분개상세 항목 조회
    async FETCH_ACCOUNT_CONTROL_CODE() {
      try {
        const { data } = await fetchAccountControlCode();

        this.accountControlCodeList = data.accountControlCodeList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 분개장 조회
    async SEARCH_JOURNAL({ startDate, endDate }: any) {
      try {
        const response = await selectJournals({ startDate, endDate });

        this.journalList = response.data;
      } catch (err: any) {
        console.error();
      }
    },

    // 지출증빙 전체조회
    async FETCH_ALL_RECEIPT() {
      try {
        const response = await selectReceipts();

        this.receiptList = response.data.receiptList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 지출증빙 증빙등록
    async ADD_RECEIPT_FILE(slipNo: string, type: string, file: any) {
      try {
        const response = await registerReceipt(slipNo, type, file);

        console.log("결과 메세지 : ", response.data);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 지출증빙 증빙삭제
    async DELETE_RECEIPT_FILE(slipNo: string) {
      try {
        const response = await deleteReceipt(slipNo);

        console.log("결과 메세지 : ", response.data);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 지출증빙 증빙완료
    async PROOF_RECEIPT(slip: any) {
      try {
        const response = await proofReceipt(slip);

        console.log("결과 메세지 : ", response.data);
      } catch (error: any) {
        console.error(error);
      }
    },

    // 사원 전체조회
    async FETCH_ALL_EMPLOYEES() {
      try {
        const response = await getEmpList();

        this.empList = response.data.empList;
      } catch (error: any) {
        console.error(error);
      }
    },

    // 부서 전체조회
    async FETCH_ALL_DEPARTMENT() {
      try {
        const response = await getDeptList();

        this.departmentList = response.data.departmentList;
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
