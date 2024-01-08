import { accountApi } from "..";

// 회계기수 조회
function periodList() {
  return accountApi.get("budget/periodNoList");
}

// 사업장 조회
function workplaceList() {
  return accountApi.get("operate/deptList");
}

// 부서 조회
function deptList(payload: any) {
  return accountApi.get("/operate/detailDeptList", {
    params: { workplaceCode: payload.workplaceCode },
  });
}

// //예산 실적 현황 부서 조회
//
// function searchDeptList(payload) {
//     console.log("selectList",payload)
//     return accountApi.get('/operate/detailDeptList',
//         payload
//         // params: { workplaceCode: payload.params.workplaceCode }
//     )
// }
// 예산 신청 등록
function insertBudget(data: any) {
  console.log("누구게", data.deptCode);

  return accountApi.post("/budget/registerBudget", data);
}

// 예산 신청 조회
function searchBudgetList(action: any) {
  console.log("예산신청조회 API, data", action);

  return accountApi.get("/budget/findBudget", {
    params: {
      deptCode: action.deptCode,
      workplaceCode: action.workplaceCode,
      budgetingCode: action.budgetingCode,
      accountPeriodNo: action.accountPeriodNo,
      accountInnerCode: action.accountInnerCode,
    },
  });
}

// 예산 실적 조회
function searchBudgeStatus(action: any) {
  console.log("예산신청조회 API, data", action);

  return accountApi.get("/budget/callBudgetStatus", {
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

  return accountApi.get("/budget/comparisonBudget", {
    params: {
      deptCode: action.deptCode,
      workplaceCode: action.workplaceCode,
      accountPeriodNo: action.periodNo,
      accountInnerCode: action.accountCode,
    },
  });
}

// //예산 편성 등록
// function registerBudgetFormulation(action){
//     console.log('편성등록 action',action)
//     return accountApi.get('/budget/registerBudgetFormulation',action)
// }

export {
  periodList,
  workplaceList,
  deptList,
  insertBudget,
  searchBudgetList,
  searchBudgeStatus,
  searchComparisonBudget,
};
