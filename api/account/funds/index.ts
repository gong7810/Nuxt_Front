import { accountApi } from "@/api";

const PLAN_URL = "/funds/dailyFundPlan";
const CALENDAR_URL = "funds/calendar";
const NOTE_URL = "/funds/notes";
const DAILY_TRADE_URL = "/funds/dailyTradeStatus";
const INOUT_EXPECTED_URL = "/funds/inoutExpectedPrice";
const FINANCE_URL = "/funds/financeStatus";
const GENERAL_FUND_URL = "/funds/generalFundStatus";

// 일자별자금계획 추가
function registerPlan(plan: any) {
  return accountApi.post(`${PLAN_URL}`, plan);
}

// 일자별자금계획 조회
function selectPlan({ startDate, endDate }: any) {
  return accountApi.get(`${PLAN_URL}`, {
    params: {
      startDate,
      endDate,
    },
  });
}

// 일자별자금계획 삭제
function deletePlan(planNo: string) {
  return accountApi.delete(`${PLAN_URL}/${planNo}`);
}

// 일자별자금계획 수정
function updatePlan(plan: any) {
  return accountApi.put(`${PLAN_URL}`, plan);
}

// 자금계획카렌다 날짜별 수입조회
function fetchDateIncome(day: any) {
  return accountApi.get(`${CALENDAR_URL}Income/${day}`);
}

// 자금계획카렌다 날짜별 지출조회
function fetchDateExpenditure(day: any) {
  return accountApi.get(`${CALENDAR_URL}Expenditure/${day}`);
}

// 자금계획카렌다 날짜별 계획상세조회
function fetchDateDetail(date: string) {
  return accountApi.get(`${CALENDAR_URL}/${date}`);
}

// 어음명세서 조회
function selectNote(accountCode: string) {
  return accountApi.get(`${NOTE_URL}/${accountCode}`);
}

// 일일거래증감현황 조회
function selectDailyTradeStatus({ date }: any) {
  return accountApi.get(`${DAILY_TRADE_URL}`, {
    params: {
      date,
    },
  });
}

// 입출금예정액 조회
function selectInoutExpectedPrice({ date }: any) {
  return accountApi.get(`${INOUT_EXPECTED_URL}`, {
    params: {
      date,
    },
  });
}

// 예적금현황 조회
function selectFinanceStatus({ date, accountName }: any) {
  return accountApi.get(`${FINANCE_URL}/${accountName}`, {
    params: {
      date,
    },
  });
}

// 총괄거래현황 조회
function selectGeneralFundStatus(startDate: any, endDate: any) {
  return accountApi.get(`${GENERAL_FUND_URL}/${startDate}/${endDate}`);
}

// 어음현황 조회
function selectNoteStatus({ date }: any) {
  return accountApi.get(`${NOTE_URL}`, {
    params: {
      date,
    },
  });
}

export {
  selectNote,
  selectDailyTradeStatus,
  selectInoutExpectedPrice,
  registerPlan,
  selectPlan,
  deletePlan,
  updatePlan,
  fetchDateIncome,
  fetchDateExpenditure,
  fetchDateDetail,
  selectFinanceStatus,
  selectGeneralFundStatus,
  selectNoteStatus,
};
