import axios from "axios";

const BASE_URL = "http://localhost:8282/acc";

// 계정코드 전체조회
function searchAccountCodeList() {
  return axios.get(`${BASE_URL}/base/accountCodes`);
}

// 계정코드 조건조회
function getAccountCode({ accountInnerCode, accountName }: any) {
  return axios.get(`${BASE_URL}/base/accountCodes/${accountInnerCode}`, {
    params: {
      accountName,
    },
  });
}

// 계정별원장
function getAccountLedger({ accountCode, startDate, endDate }: any) {
  return axios.get(`${BASE_URL}/base/accounts/${accountCode.value}`, {
    params: {
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
}

// 총계정원장
function getGeneralAccountLedger({ startDate, endDate }: any) {
  return axios.get(`${BASE_URL}/base/accounts`, {
    params: {
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
}

// 일(월)계표
function getDetailTrialBalance({ startDate, endDate }: any) {
  return axios.get(`${BASE_URL}/statement/detailTrialBalances`, {
    params: {
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
}

// 현금출납장
function getCashJournal({ startDate, endDate }: any) {
  return axios.get(`${BASE_URL}/statement/cashJournals`, {
    params: {
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
}

// 거래처 관리 //

// 거래처 조회
function searchCustomerList() {
  return axios.get(`${BASE_URL}/base/customers`);
}

// 거래처 추가
function addCustomerCode(addCustomerInfo: any) {
  return axios.post(`${BASE_URL}/base/addCustomer`, addCustomerInfo);
}

// 거래처 수정
function updateCustomerCode(updateCustomerInfo: any) {
  return axios.put(`${BASE_URL}/base/updateCustomer`, updateCustomerInfo);
}

// 거래처 삭제
function deleteCustomerCode(customerCode: string) {
  return axios.delete(`${BASE_URL}/base/deleteCustomer`, {
    params: {
      customerCode,
    },
  });
}

export {
  searchAccountCodeList,
  getAccountCode,
  getAccountLedger,
  getGeneralAccountLedger,
  getDetailTrialBalance,
  getCashJournal,
  searchCustomerList,
  addCustomerCode,
  updateCustomerCode,
  deleteCustomerCode,
};
