<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";

const searchDate = ref("");
const startDate = ref("");
const endDate = ref("");
const monthCostList = ref([]);

const monthCost = [
  { title: "과목", sortable: false, key: "accountName", width: "100px" },
  { title: "합계", key: "costSummary" },
  { title: "1월", key: "january" },
  { title: "2월", key: "february" },
  { title: "3월", key: "march" },
  { title: "4월", key: "april" },
  { title: "5월", key: "may" },
  { title: "6월", key: "june" },
  { title: "7월", key: "july" },
  { title: "8월", key: "august" },
  { title: "9월", key: "september" },
  { title: "10월", key: "october" },
  { title: "11월", key: "november" },
  { title: "12월", key: "december" },
];

const searchMonthCostList = async () => {
  await statementStore().SEARCH_MONTH_COST_STATEMENT_LIST(searchDate.value);
  console.log("searchDate", searchDate.value);
  monthCostList.value = statementStore().monthCostList;
  console.log("원가😍😎😁", monthCostList.value);
};
</script>

<template>
  <p class="text-2xl mb-6">기간별 원가명세서</p>
  <div
    div
    ref="content"
    class="demo-space-x app-user-search-filter d-flex align-center flex-wrap gap-4 justify-start"
  >
    <VContainer>
      <VRow>
        <VCol md="3">
          <VForm>
            <VTextField v-model="startDate" label="시작일자" type="date" />
          </VForm>
        </VCol>
        <VCol md="3">
          <VForm>
            <VTextField v-model="endDate" label="종료일자" type="date" />
          </VForm>
        </VCol>
        <VCol>
          <VBtn color="primary" @click="searchMonthCostList">
            <VIcon start icon="tabler-search" size="24" />조회
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>

  <VDataTable
    :headers="monthCost"
    :items="monthCostList"
    :items-per-page="15"
  />
</template>
