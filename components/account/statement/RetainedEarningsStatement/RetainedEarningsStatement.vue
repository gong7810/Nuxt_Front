<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";

const searchDate = ref("");
const retainedEarningsList = ref([]);

const retainedEarnings = [
  { title: "당기", sortable: false, key: "currentYear" },
  { title: "세부금액", key: "retained" },
  { title: "합계금액", key: "retainedSummary" },
  { title: "과목", key: "accountName" },
  { title: "전기", key: "fiscalYear" },
  { title: "세부금액", key: "preRetained" },
  { title: "합계금액", key: "preRetainedSummary" },
];

const searchRetainedEarningsStatement = async () => {
  await statementStore().SEARCH_RETAINED_EARNINGS_STATEMENT_LIST(
    searchDate.value
  );
  console.log("searchDate", searchDate.value);
  retainedEarningsList.value = statementStore().retainedEarningsList;
  console.log("이익😍😎😁", retainedEarningsList.value);
};
</script>

<template>
  <p class="text-2xl mb-6">이익잉여금 처분계산서</p>
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
          <VBtn color="primary" @click="searchRetainedEarningsStatement">
            <VIcon start icon="tabler-search" size="24" />조회
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>

  <VDataTable
    :headers="retainedEarnings"
    :items="retainedEarningsList"
    :items-per-page="22"
  />
</template>
