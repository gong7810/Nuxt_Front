import axios from "axios";

const BASE_URL = "http://localhost:8282/acc";

// 모달창
function getPeriodDataList() {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/findAccountPeriodList`);
}

// 합계잔액시산표 결산 전 저장
function getEarlyTotalTrialBalanceStatement(payload: any) {
  const { accountPeriodNo } = payload;

  console.log(accountPeriodNo);
  console.log("저장를 호출했습니다");

  return axios.get(`${BASE_URL}/statement/earlyTotaltrialBalances`, {
    params: {
      accountPeriodNo,
    },
  });
}

// 합계잔액시산표 결산 전 조회
function getEarlyTotalTrialBalanceStatementList(payload: any) {
  const { accountPeriodNo } = payload;

  console.log(accountPeriodNo);
  console.log("조회를 호출했습니다");

  return axios.get(`${BASE_URL}/statement/earlyTotaltrialBalancesList`, {
    params: {
      accountPeriodNo,
    },
  });
}

// 합계잔액시산표 결산
function getStatementList(payload: any) {
  const { accountPeriodNo, callResult, periodStartDate } = payload;

  console.log(accountPeriodNo, callResult, periodStartDate);
  console.log("결산을 호출했습니다");
  axios.get(`${BASE_URL}/statement/statementList`, {
    params: {
      accountPeriodNo,
      callResult,
      periodStartDate,
    },
  });
}

// 합계잔액시산표 결산 후 조회
function getTotalTrialBalance(payload1: any) {
  const { accountPeriodNo, callResult } = payload1;

  console.log(accountPeriodNo, callResult);
  console.log("조회를 호출했습니다");

  return axios.get(`${BASE_URL}/statement/totalTrialBalances`, {
    params: {
      accountPeriodNo,
      callResult,
    },
  });
}

// 합계잔액시산표 결산 후 수정
function getTotalTrialBalanceStatement(payload: any) {
  const { accountPeriodNo, callResult, periodStartDate } = payload;

  console.log(accountPeriodNo, callResult, periodStartDate);
  console.log("수정을 호출했습니다");

  return axios.get(`${BASE_URL}/statement/earlyStatements`, {
    params: {
      accountPeriodNo,
      callResult,
      periodStartDate,
    },
  });
}

// 합계잔액시산표 결산취소
function getCancelStatement(payload: any) {
  const { accountPeriodNo, callResult } = payload;

  console.log(accountPeriodNo, callResult);
  console.log("취소를 호출했습니다");

  return axios.get(`${BASE_URL}/statement/cancelStatement`, {
    params: {
      accountPeriodNo,
      callResult,
    },
  });
}

// 손익계산서
function getIncomeStatement(payload: any) {
  const { callResult, accountPeriodNo } = payload;

  console.log(callResult, accountPeriodNo);
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/incomeStatements`, {
    params: {
      accountPeriodNo,
      callResult,
    },
  });
}

// 재무상태표
function getFinancialPosition(payload: any) {
  const { callResult, accountPeriodNo } = payload;

  console.log(callResult, accountPeriodNo);
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/financialPositions`, {
    params: {
      accountPeriodNo,
      callResult,
    },
  });
}

// 월별손익계산서
function getMonthIncomeStatement(payload: any) {
  const { accountPeriodNo } = payload;

  console.log(accountPeriodNo);
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/monthIncomeStatements`, {
    params: {
      accountPeriodNo,
    },
  });
}

// 현금흐름표
function getCashFlowStatement(searchDate: any) {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/cashFlowStatements`, {
    params: {
      searchDate,
    },
  });
}

// 원가명세서
function getCostStatement(searchDate: any) {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/costStatements`, {
    params: {
      searchDate,
    },
  });
}

// 이익잉여금처분계산서
function getRetainedEarningsStatement(searchDate: any) {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/retainedEarningsStatements`, {
    params: {
      searchDate,
    },
  });
}

// 기간별원가명세서
function getMonthCostStatement(searchDate: any) {
  console.log("API를 호출했습니다.");

  return axios.get(`${BASE_URL}/statement/monthcosts`, {
    params: {
      searchDate,
    },
  });
}

export {
  getPeriodDataList, // 모달창
  getEarlyTotalTrialBalanceStatement, // 합계잔액시산표 결산 전 저장
  getEarlyTotalTrialBalanceStatementList, // 합계잔액시산표결산 전 조회
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
};
