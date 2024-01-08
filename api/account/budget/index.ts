import axios from "axios";

const BASE_URL = "http://localhost:8282/acc";

function getYearData() {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/budget/periodNoList`);
}

function getDeptList() {
  return axios.get(`${BASE_URL}/operate/deptList`);
}

function getDeptDetailList(workplaceCodeValue: string) {
  return axios.get(`${BASE_URL}/operate/detailDeptList`, {
    params: { workplaceCode: workplaceCodeValue },
  });
}

function getAccountCodeList() {
  return axios.get(`${BASE_URL}/base/parentAccountList`);
}

function getAccountInnerCodeList(accountInnerCode: any) {
  return axios.get(`${BASE_URL}/base/account/findDetailAccountList`, {
    params: { code: accountInnerCode },
  });
}

// 예산 실적 조회
function searchBudgeStatus(action: any) {
  return axios.get(`${BASE_URL}/budget/callBudgetStatus`, {
    params: {
      deptCode: action.deptCode,
      workplaceCode: action.workplaceCode,
      accountPeriodNo: action.periodNo,
    },
  });
}

function searchComparisonBudget(action: any) {
  console.log("예산대비 API, data", action);
  console.log("예산대비API 값", action.deptCode);

  return axios.get(`${BASE_URL}/budget/comparisonBudget`, {
    params: {
      deptCode: action.deptCode,
      workplaceCode: action.workplaceCode,
      accountPeriodNo: action.periodNo,
      accountInnerCode: action.accountCode,
    },
  });
}

export {
  getYearData,
  getDeptList,
  getDeptDetailList,
  getAccountCodeList,
  getAccountInnerCodeList,
  searchBudgeStatus,
  searchComparisonBudget,
};
