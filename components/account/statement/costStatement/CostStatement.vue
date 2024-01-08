<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";

const searchDate = ref("");
const costList = ref([]);

const costStatement = [
  { title: "과목", sortable: false, key: "accountName" },
  { title: "당기", key: "1" },
  { title: "세부금액", key: "cost" },
  { title: "합계금액", key: "costSummary" },
  { title: "전기", key: "2" },
  { title: "세부금액", key: "earlyCost" },
  { title: "합계금액", key: "earlyCostSummary" },
];

const searchCostList = async () => {
  await statementStore().SEARCH_COST_STATEMENT_LIST(searchDate.value);
  console.log("searchDate", searchDate.value);
  costList.value = statementStore().costList;
  console.log("원가😍😎😁", costList.value);
};
</script>

<template>
  <p class="text-2xl mb-6">원가명세서</p>
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
          <VBtn color="primary" @click="searchCostList">
            <VIcon start icon="tabler-search" size="24" />조회
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>

  <VDataTable :headers="costStatement" :items="costList" :items-per-page="12" />
</template>
