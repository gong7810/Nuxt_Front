<script setup lang="ts">
import axios from "axios";
import { VDataTable } from "vuetify/lib/labs/VDataTable/index.mjs";
import { budgetStore } from "@/store/account/budget";
import { searchBudgeStatus } from "@/api/account/budget";

// ref를 사용하여 데이터를 정의

const isDialogVisible = ref(false);
const isDialogVisible2 = ref(false);

const periodList = ref([]);
const workplaceList = ref([]);
const searchBudgetStatus = ref([]);
const searchComparisonBudget = ref([]);
const filteredDeptList = ref([]);

const year = ref(null);
const yeardata = ref([]);
const accountPeriodNo = ref("");
const workplaceCode = ref("");
const workplaceCode2 = ref("");
const workplaceName = ref("");
const workplaceName2 = ref("");
const deptName = ref("");
const deptCode = ref("");
const deptList = ref([]);
const deptInfo = ref([]);
const accountInnerCode = ref("");

const tableData = ref([]);
const selectedIndex = ref(-1); // 선택된 행의 인덱스
const hoveredIndex = ref(-1); // 마우스가 위에 있을 때 행의 인덱스
const sum_budgetStatus = ref([]);
const sum_abr = ref(0);
const sum_annualBudget = ref(0);
const sum_remainingBudget = ref(0);
const budgetExecRate = ref("");
const sum_ambr = ref(0);
const sum_budget = ref(0);
const sum_remainingMonthBudget = ref(0);
const monthBudgetExecRate = ref("");

// 예산 실적 대비 데이터
const columns = [
  { title: "구분", key: "budgetDate" },
  { title: "신청예산", key: "appBudget" },
  { title: "편성예산", key: "orgBudget" },
  { title: "집행실적", key: "execPerform" },
  { title: "예실대비", key: "budgetAccountComparison" },
];

// 회계연도 조회 시 데이터
const headers3 = [
  { title: "회계 시작일자", sortable: false, key: "periodStartDate" },
  { title: "회계 종료일자", key: "periodEndDate" },
  { title: "기간번호", key: "accountPeriodNo" },
];

// 사업장 조회 시 데이터
const headers4 = [
  { title: "사업장코드", sortable: false, key: "workplaceCode" },
  { title: "사업장명", key: "workplaceName" },
];

// 부서 조회 시 데이터
const headers5 = [
  { title: "부서코드", sortable: false, key: "deptCode" },
  { title: "부서명", key: "deptName" },
];

// 회계연도 조회시 필요한 데이터 가져옴
const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8282/acc/budget/periodNoList"
    );

    console.log("response👉👉👉", response.data.periodList);

    return response.data.periodList; // companyInfo 배열을 반환
  } catch (error) {
    console.error("Error fetching data:", error);

    return [];
  }
};

// 사업장 선택시 부서리스트 출력
const fetchData2 = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8282/acc/operate/deptList"
    );

    console.log("deptList", response.data.deptList);

    const deptData = response.data.deptList;

    deptList.value = deptData.map((e: any) => ({
      value: e.workplaceCode,
      text: e.workplaceName,
    }));

    console.log("deptList.value", deptList.value);

    return response.data.deptList; // companyInfo 배열을 반환
  } catch (error) {
    console.error("Error fetching data:", error);

    return [];
  }
};

// 부서명 조회할 때 부서리스트 가져옴
const fetchData3 = async (workplaceCode2: any) => {
  console.log("workplaceCode2", workplaceCode2);
  try {
    const response = await axios.get(
      "http://localhost:8282/acc/operate/detailDeptList",
      { params: { workplaceCode: workplaceCode2 } }
    );

    console.log("response", response);
    deptInfo.value = response.data.detailDeptList;
    deptName.value = response.data.detailDeptList.deptName;
    deptCode.value = response.data.detailDeptList.deptCode;

    return response.data.detailDeptList;
  } catch (error) {
    console.error("Error fetching data:", error);

    return [];
  }
};

// 계정과목 리스트 가져옴
const fetchData4 = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8282/acc/base/parentAccountList"
    );

    console.log("responseeeee", response);

    accountCodeListTest.value = response.data.accountCodeList;

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    return [];
  }
};

watch(
  () => workplaceCode2.value,
  (newVal, oldVal) => {
    fetchData3(newVal);
  }
);

watch(
  () => accountInnerCode.value,
  (newVal, oldVal) => {
    fetchData5(newVal);
  }
);

/* 회계연도 조회 */
const onSelected = (selected: any, a: any) => {
  year.value = new Date(a.internalItem.columns.periodStartDate).getFullYear();

  accountPeriodNo.value = a.internalItem.columns.accountPeriodNo;
};

// 사업장명 조회
const onSelected2 = (selected: any, b: any) => {
  console.log("b", b);

  const workplaceCode = b.internalItem.columns.workplaceCode;
  const workplaceName = b.internalItem.columns.workplaceName;

  console.log("👉👉👉", workplaceCode, workplaceName);

  workplaceCode2.value = workplaceCode;
  workplaceName2.value = workplaceName;
};

// 부서명 조회
const onSelected3 = (selected: any, c: any) => {
  deptName.value = c.internalItem.columns.deptName;
  deptCode.value = c.internalItem.columns.deptCode;
  console.log("c", c);
  fetchData4();
};

// 예산 실적 조회시 필요한 데잍터 함수 (뭐가 좀 많음)
// 합계 값을 계산하고 각 변수에 할당하는 함수
const setValues = () => {
  budgetExecRate.value =
    sum_annualBudget.value === 0
      ? "-"
      : ((sum_abr.value / sum_annualBudget.value) * 100).toFixed(3);
  monthBudgetExecRate.value =
    sum_budget.value === 0
      ? "-"
      : ((sum_ambr.value / sum_budget.value) * 100).toFixed(3);

  // 각 항목이 0일 경우 초기화
  sum_abr.value = sum_abr.value || 0;
  sum_annualBudget.value = sum_annualBudget.value || 0;
  sum_remainingBudget.value = sum_remainingBudget.value || 0;
  sum_ambr.value = sum_ambr.value || 0;
  sum_budget.value = sum_budget.value || 0;
  sum_remainingMonthBudget.value = sum_remainingMonthBudget.value || 0;
};

// 예산 데이터 계산 함수
const getPinnedBottomRowData = (budgetStatus: any) => {
  console.log("budgetStatus", budgetStatus);
  if (!budgetStatus) return [];

  // 각 항목을 더하기
  for (let i = 0; i < budgetStatus.length; i++) {
    sum_abr.value += budgetStatus[i].abr;
    sum_annualBudget.value += budgetStatus[i].annualBudget;
    sum_remainingBudget.value += budgetStatus[i].remainingBudget;
    sum_ambr.value += budgetStatus[i].ambr;
    sum_budget.value += budgetStatus[i].monthBudget;
    sum_remainingMonthBudget.value += budgetStatus[i].remainingMonthBudget;
  }

  // 각 항목에 대한 계산을 수행합니다.
  setValues();
};

// 예산실적조회 버튼 실행
const searchBudget = async () => {
  const data = {
    periodNo: accountPeriodNo.value,
    workplaceCode: workplaceCode.value,
    deptCode: deptCode.value,
  };
  const response = await searchBudgeStatus(data);
  const commit = commit("SEARCH_BUDGET_STATUS", response.data.budgetStatusList);

  await budgetStore().SEARCH_BUDGET_STATUS_REQUEST(commit, data);

  console.log("searchBudgetStatus 값 나오나", searchBudgetStatus.value);
  getPinnedBottomRowData(searchBudgetStatus.value);
};

onMounted(async () => {
  yeardata.value = await fetchData();
  workplaceName.value = await fetchData2();
});
</script>

<!-- UI 출력 템플릿 설정 -->
<template>
  <!-- 첫번째 컴포넌트 -->
  <div>
    <VCard class="mt-2">
      <VRow>
        <VCol class="mt-4" cols="12" md="2">
          <VTextField
            ref="inputYear"
            v-model="year"
            placeholder="회계연도"
            class="form-control"
            label="회계연도"
          />
        </VCol>

        <VCol class="mt-4" cols="12" md="1">
          <VDialog v-model="isDialogVisible" width="500">
            <template #activator="{ props }">
              <IconBtn class="me-1" @click="Shepherd.activeTour?.cancel()">
                <VIcon v-bind="props" size="26" icon="tabler-search" />
              </IconBtn>
            </template>
            <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

            <!-- Dialog Content -->
            <VCard title="회계연도">
              <VContainer>
                <VDataTable
                  :key="(row: any) => row.id"
                  :headers="headers3"
                  :items="yeardata"
                  :items-per-page="5"
                  selectable
                  select-mode="single"
                  @click:row="onSelected"
                />
                <VCardText class="d-flex justify-end">
                  <VBtn @click="isDialogVisible = false"> OK </VBtn>
                </VCardText>
              </VContainer>
            </VCard>
          </VDialog>

          <p class="h4 mb-4">
            <VIcon v-b-modal.searchYear style="height: 70px" icon="search" />
          </p>
        </VCol>

        <VCol class="mt-4" cols="12" md="3">
          <VTextField
            v-model="workplaceName2"
            placeholder="사업장명"
            label="사업장명"
          />
        </VCol>

        <VCol class="mt-4" cols="12" md="3">
          <VTextField v-model="deptName" placeholder="부서명" label="부서명" />
        </VCol>
        <VCol class="mt-4" cols="12" md="1">
          <VDialog v-model="isDialogVisible2" width="500">
            <template #activator="{ props }">
              <IconBtn class="me-1" @click="Shepherd.activeTour?.cancel()">
                <VIcon v-bind="props" size="26" icon="tabler-search" />
              </IconBtn>
            </template>

            <DialogCloseBtn @click="isDialogVisible2 = !isDialogVisible2" />
            <!-- Dialog Content -->
            <VCard title="사업장/부서 선택">
              <VContainer>
                <VDataTable
                  :headers="headers4"
                  :items="workplaceName"
                  :items-per-page="5"
                  @click:row="onSelected2"
                />
                <VDataTable
                  :headers="headers5"
                  :items="deptInfo"
                  :items-per-page="5"
                  @click:row="onSelected3"
                />

                <VCardText class="d-flex justify-end">
                  <VBtn @click="isDialogVisible2 = false"> OK </VBtn>
                </VCardText>
              </VContainer>
            </VCard>
          </VDialog>
        </VCol>

        <VCol class="mb-1" cols="12" md="2">
          <p style="margin-top: 17px">
            <VBtn @click="searchBudget"> 예산실적조회 </VBtn>
          </p>
        </VCol>
      </VRow>
    </VCard>
    <div>
      <table :show-footer="true">
        <thead>
          <tr>
            <th colspan="2">계정</th>
            <th colspan="4">누계예산대비실적</th>
            <th colspan="4">당월예산대비실적</th>
          </tr>
          <tr>
            <th>계정과목코드</th>
            <th>계정과목명</th>
            <th>실적</th>
            <th>예산</th>
            <th>잔여예산</th>
            <th>집행율(%)</th>
            <th>실적</th>
            <th>예산</th>
            <th>잔여예산</th>
            <th>집행율(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in searchBudgetStatus"
            :key="index"
            :value="item.accountInnerCode"
            :class="{
              selected: selectedIndex === index,
              hovered: hoveredIndex === index,
            }"
            @click="rowSelect(item)"
            @mouseover="hoveredIndex = index"
            @mouseleave="hoveredIndex = -1"
          >
            <td class="center">
              {{ item.accountInnerCode }}
            </td>
            <td class="center">
              {{ item.accountName }}
            </td>
            <td class="center">
              {{ item.abr }}
            </td>
            <td class="center">
              {{ item.annualBudget }}
            </td>
            <td class="center">
              {{ item.remainingBudget }}
            </td>
            <td class="center">
              {{ item.budgetExecRate }}
            </td>
            <td class="center">
              {{ item.ambr }}
            </td>
            <td class="center">
              {{ item.budget }}
            </td>
            <td class="center">
              {{ item.remainingMonthBudget }}
            </td>
            <td class="center">
              {{ item.monthBudgetExecRate }}
            </td>
          </tr>
          <tr>
            <td colspan="2" class="center" style="background-color: darkgray">
              합계
            </td>
            <td class="center">
              {{ sum_abr }}
            </td>
            <td class="center">
              {{ sum_annualBudget }}
            </td>
            <td class="center">
              {{ sum_remainingBudget }}
            </td>
            <td class="center">
              {{ budgetExecRate }}
            </td>
            <td class="center">
              {{ sum_ambr }}
            </td>
            <td class="center">
              {{ sum_budget }}
            </td>
            <td class="center">
              {{ sum_remainingMonthBudget }}
            </td>
            <td class="center">
              {{ monthBudgetExecRate }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <br />

      <h3>예산 실적 대비</h3>
      <VDataTable
        hover
        sticky-header="true"
        :headers="columns"
        :items="searchComparisonBudget"
        :fields="columns"
      />
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  color: black;
}

th {
  border: 1px solid;
  text-align: center;
  background-color: lightgray;
}

td {
  border: 1px solid;
  text-align: center;
  background-color: white;
}

.selected {
  background-color: yellow;
}

.hovered {
  background-color: gray;
}
</style>
