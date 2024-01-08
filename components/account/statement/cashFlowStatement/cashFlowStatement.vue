<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";

const cashFlowList = ref([]);
const searchDate = ref([]);

const cashFlowStatement = [
  { title: "과목", sortable: false, key: "accountName" },
  { title: "당기", key: "1" },
  { title: "세부금액", key: "cashFlow" },
  { title: "합계금액", key: "cashFlowSummary" },
  { title: "전기", key: "2" },
  { title: "세부금액", key: "earlyCashFlow" },
  { title: "합계금액", key: "earlyCashFlowSummary" },
];

const searchCashFlowList = async () => {
  await statementStore().SEARCH_CASH_FLOW_STATEMENT_LIST(searchDate.value);
  console.log("searchDate", searchDate.value);
  cashFlowList.value = statementStore().cashFlowList;
  console.log("현금😍😎😘", cashFlowList.value);
};
</script>

<template>
  <p class="text-2xl mb-6">현금 흐름표</p>
  <div
    div
    ref="content"
    class="demo-space-x app-user-search-filter d-flex align-center flex-wrap gap-4 justify-start"
  >
    <VContainer>
      <VRow>
        <VCol md="4">
          <VForm>
            <VTextField v-model="searchDate" type="date" />
          </VForm>
        </VCol>
        <VCol>
          <VBtn color="primary" @click="searchCashFlowList">
            <VIcon start icon="tabler-search" size="24" />조회
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>

  <VDataTable
    :headers="cashFlowStatement"
    :items="cashFlowList"
    :items-per-page="12"
  />
</template>
