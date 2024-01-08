import { accountApi, hrApi } from "@/api";

const SLIP_URL = "/account/slips";
const JOURNAL_URL = "/account/journal";
const SLIP_APPROVAL_URL = "/account/slipList";
const ACCOUNTCODE_URL = "/base/accountCodes";
const ACCOUNTCUSTOMERCODE_URL = "/base/customers";
const ACCOUNTCONTROLLERCODES_URL = "/base/accountControllerCodes";

const RECEIPT_URL = "/account/receipt";

const EMP_URL = "/affair/empList";
const DEPT_URL = "/company/searchDepartment";

// 전표 전체조회
function selectSlips() {
  return accountApi.get(`${SLIP_URL}`);
}

// 승인 / 반려 전표 조회
function selectStatusSlips(status: string) {
  return accountApi.get(`${SLIP_URL}/status/${status}`);
}

// 미결 전표 조회
function selectUnProSlips() {
  return accountApi.get(`${SLIP_URL}/unProcessed`);
}

// 전표 한개조회
function selectSlip(slipNo: string) {
  return accountApi.get(`${SLIP_URL}/${slipNo}`);
}

// 전표 추가
function registerSlip(slip: any) {
  return accountApi.post(`${SLIP_URL}`, slip);
}

// 전표 파일로 추가
function registerSlipFile(slipList: any) {
  return accountApi.post(`${SLIP_URL}List`, slipList);
}

// 전표 승인
function approvalSlip(slip: any) {
  return accountApi.put(`${SLIP_APPROVAL_URL}`, slip);
}

// 전표 삭제
// Map 형식으로 받기 때문에 {data : {slipList : { [], [] } }} 꼴로 보내야함
function deleteSlip(slip: any) {
  return accountApi.delete(`${SLIP_URL}`, { data: slip });
}

// 전표 수정
function editSlip(slip: any) {
  return accountApi.put(`${SLIP_URL}`, slip);
}

// 분개 전체조회
function selectJournalList(slipNo: string) {
  return accountApi.get(`${JOURNAL_URL}/${slipNo}`);
}

// 계정코드 전체조회
function getAccountCodeList() {
  return accountApi.get(`${ACCOUNTCODE_URL}`);
}

// 계정코드 조건조회
function getAccountCode({ accountInnerCode, accountName }: any) {
  return accountApi.get(`${ACCOUNTCODE_URL}/${accountInnerCode}`, {
    params: {
      accountName,
    },
  });
}

// 거래처코드 조회
function fetchAccountCustomerCode() {
  return accountApi.get(`${ACCOUNTCUSTOMERCODE_URL}`);
}

// 분개상세 항목 조회
function fetchAccountControlCode() {
  return accountApi.get(`${ACCOUNTCONTROLLERCODES_URL}`);
}

// 분개장 검색
function selectJournals({ startDate, endDate }: any) {
  return accountApi.get(`${JOURNAL_URL}`, {
    params: {
      startDate,
      endDate,
    },
  });
}

// 지출증빙 전체조회
function selectReceipts() {
  return accountApi.get(`${RECEIPT_URL}`);
}

// 지출증빙 증빙등록
function registerReceipt(slipNo: string, type: string, file: any) {
  return accountApi.post(`${RECEIPT_URL}/${slipNo}/${type}`, file);
}

// 지출증빙 증빙삭제
function deleteReceipt(slipNo: string) {
  return accountApi.delete(`${RECEIPT_URL}/${slipNo}`);
}

// 지출증빙 증빙완료
function proofReceipt(slip: any) {
  return accountApi.put(`${RECEIPT_URL}`, slip);
}

// 사원 전체조회
function getEmpList() {
  return hrApi.get(`${EMP_URL}`);
}

// 부서 전체조회
function getDeptList() {
  return hrApi.get(`${DEPT_URL}`, {
    params: {
      searchCondition: "ALL",
      companyCode: "COM-01",
      workplaceCode: "BRC-01",
    },
  });
}

export {
  selectSlip,
  selectSlips,
  approvalSlip,
  selectJournalList,
  selectJournals,
  getAccountCodeList,
  getAccountCode,
  fetchAccountControlCode,
  fetchAccountCustomerCode,
  registerSlip,
  deleteSlip,
  editSlip,
  registerSlipFile,
  selectReceipts,
  registerReceipt,
  proofReceipt,
  getEmpList,
  getDeptList,
  deleteReceipt,
  selectStatusSlips,
  selectUnProSlips,
};
