<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import NewYearNewDay from "./NewYearNewDay.vue";
import NewWorkNewDept from "./NewWorkNewDept.vue";
import NewCalender from "./NewCalender.vue";
import { budgetStore } from "@/store/account/budget";
import type PeriodEntity from "@/type/budget/types";
import type DepartmentEntity from "@/type/budget/types";
import type AccountEntity from "@/type/budget/types";

const isDialogVisible = ref(false);
const isDialogVisible2 = ref(false);
const selectedRow = ref(null);

const accountPeriodNo = ref("");
const year = ref(null);
const workplaceName = ref([]);
const workplaceName2 = ref(null);
const workplaceCode2 = ref(null);
const deptList = ref([]);
const yeardata: PeriodEntity = ref([]);
const deptName = ref("");
const deptCode = ref("");
const deptInfo: DepartmentEntity = ref([]);
const accountCodeListTest: AccountEntity = ref([]);
const accountInnerCode = ref("");
const detailAccountList = ref([]);
const accountInnerInnerCode = ref("");
const accountName = ref("");
const accountNameTest = ref("");

const dialogToggle = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const dialogClose = () => {
  isDialogVisible.value = false;
};

const dialogToggle2 = () => {
  isDialogVisible2.value = !isDialogVisible2.value;
};

const dialogClose2 = () => {
  isDialogVisible2.value = false;
};

const headers = [
  { title: "계정과목코드", sortable: false, key: "accountInnerCode" },
  { title: "계정과목", key: "accountName" },
];

const headers2 = [
  { title: "계정과목코드", sortable: false, key: "accountInnerCode" },
  { title: "계정과목명", key: "accountName" },
];

const searchYearData = async () => {
  await budgetStore().SEARCH_YEAR_DATA();
  yeardata.value = budgetStore().periodList;
  console.log("🚀🚀🚀", yeardata.value);
};

const searchDeptList = async () => {
  await budgetStore().SEARCH_DEPT_LIST();
  workplaceName.value = budgetStore().deptList;

  const deptData = budgetStore().deptList;

  deptList.value = deptData.map((e: any) => ({
    value: e.workplaceCode,
    text: e.workplaceName,
  }));
};

const searchDeptDetailList = async (workplaceCode: string) => {
  await budgetStore().SEARCH_DEPT_DETAIL_LIST(workplaceCode);

  const detailDeptList = budgetStore().detailDeptList;

  deptInfo.value = detailDeptList;
  deptName.value = detailDeptList.deptName;
  deptCode.value = detailDeptList.deptCode;
};

const searchAccountCodeList = async () => {
  await budgetStore().SEARCH_ACCOUNT_CODE_LIST();
  accountCodeListTest.value = budgetStore().accountCodeList;
  console.log("accountCodeListTest.value", accountCodeListTest.value);
};

const searchDeptDetailInnerList = async (accountInnerCode: any) => {
  await budgetStore().SEARCH_ACCOUNT_INNER_CODE_LIST(accountInnerCode);
  detailAccountList.value = budgetStore().detailAccountList;
};

watch(
  () => workplaceCode2.value,
  (newVal, oldVal) => {
    searchDeptDetailList(newVal);
  }
);

watch(
  () => accountInnerCode.value,
  (newVal, oldVal) => {
    searchDeptDetailInnerList(newVal);
  }
);

const onSelected = ({ selected, a }: any) => {
  const startDate = new Date(a.internalItem.columns.periodStartDate);
  const endDate = new Date(a.internalItem.columns.periodEndDate);

  year.value = startDate.getFullYear();
  accountPeriodNo.value = a.internalItem.columns.accountPeriodNo;
};

const onSelected2 = ({ selected, b }: any) => {
  const workplaceCode = b.internalItem.columns.workplaceCode;
  const workplaceName = b.internalItem.columns.workplaceName;

  workplaceCode2.value = workplaceCode;
  workplaceName2.value = workplaceName;
};

const onSelected3 = ({ selected, c }: any) => {
  deptName.value = c.internalItem.columns.deptName;
  deptCode.value = c.internalItem.columns.deptCode;
  searchAccountCodeList();
};

const onSelected4 = (selected: any, d: any) => {
  accountInnerCode.value = d.internalItem.columns.accountInnerCode;
  accountName.value = d.internalItem.columns.accountName;

  searchDeptDetailInnerList(accountInnerCode.value);
};

const onSelected5 = (selected: any, e: any) => {
  selectedRow.value = selected;
  accountInnerInnerCode.value = e.internalItem.columns.accountInnerCode;
  accountNameTest.value = e.internalItem.columns.accountName;
};

onMounted(async () => {
  searchYearData();
  searchDeptList();
});
</script>

<template>
  <p class="text-2xl mb-6">예산 신청</p>
  <VRow>
    <!-- 첫 번째 카드 -->
    <VCol md="6">
      <VCard class="mb-6" title="계정과목선택" style="height: 100%">
        <VForm style="margin-left: 20px">
          <!-- 첫 번째 컴포넌트 -->
          <VRow>
            <VCol>
              <VTextField
                ref="inputYear"
                placeholder="회계연도"
                class="form-control"
                label="회계연도"
                v-model="year"
              />
            </VCol>

            <VCol>
              <NewYearNewDay
                :yeardata="yeardata"
                v-model="isDialogVisible"
                @selected="onSelected"
                @dialogToggle="dialogToggle"
                @dialogClose="dialogClose"
              />
            </VCol>
          </VRow>

          <!-- 두 번째 컴포넌트 -->
          <VRow>
            <VCol>
              <VTextField
                placeholder="사업장명"
                v-model="workplaceName2"
                label="사업장명"
              />
            </VCol>

            <VCol>
              <VTextField
                placeholder="부서명"
                v-model="deptName"
                label="부서명"
              />
            </VCol>

            <VCol>
              <VTextField
                placeholder="계정과목명"
                v-model="accountName"
                label="계정과목명"
                disabled
              />
            </VCol>

            <VCol>
              <NewWorkNewDept
                :deptInfo="deptInfo"
                :workplaceName="workplaceName"
                v-model="isDialogVisible2"
                @selected2="onSelected2"
                @selected3="onSelected3"
                @dialogToggle2="dialogToggle2"
                @dialogClose2="dialogClose2"
              />
            </VCol>

            <VDataTable
              :headers="headers2"
              :items="accountCodeListTest"
              :items-per-page="4"
              @click:row="onSelected4"
              :class="{ 'selected-row': selectedRow === item }"
            />
          </VRow>
        </VForm>
        <div />
      </VCard>
    </VCol>

    <!-- 두 번째 카드 -->
    <VCol md="6">
      <VCard class="mb-6" title="계정상세선택" style="height: 100%">
        <VCol>
          <VTextField
            placeholder="계정과목"
            v-model="accountNameTest"
            label="계정과목"
            disabled
          />
        </VCol>
        <VDataTable
          :headers="headers"
          :items="detailAccountList"
          :items-per-page="5"
          @click:row="onSelected5"
        />
      </VCard>
    </VCol>
  </VRow>

  <VRow class="mt-4">
    <VCol>
      <NewCalender
        :deptCode="deptCode"
        :workplaceCode2="workplaceCode2"
        :accountPeriodNo="accountPeriodNo"
        :accountInnerInnerCode="accountInnerInnerCode"
      />
    </VCol>
  </VRow>
</template>
