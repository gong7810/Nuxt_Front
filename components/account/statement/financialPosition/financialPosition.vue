<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";
import StatementModal from "@/components/account/statement/modal/StatementModal.vue";

const isDialogVisible = ref(false);
const financialPositionList = ref([]);
const selectedRow = ref("");
const periodData = ref([]);
const content = ref(null);
let html2pdf: any;

const financial = [
  { title: "당기", sortable: false, key: "1" },
  { title: "당기 세부금액", key: "balanceDetail" },
  { title: "당기 합계금액", key: "balanceSummary" },
  { title: "과목", key: "accountName" },
  { title: "전기 세부금액", key: "preBalanceDetail" },
  { title: "전기 합계금액", key: "preBalanceSummary" },
  { title: "전기", key: "2" },
];

const onRowSelected = (selectedrow: any) => {
  console.log(selectedrow.value);
  selectedRow.value = selectedrow.value;
};

const searchFinancialPosition = async () => {
  const payload = {
    callResult: "SEARCH",
    accountPeriodNo: selectedRow.value + 1,
  };

  console.log("payload", payload);
  await statementStore().SEARCH_FINANCIAL_POSITION_LIST(payload);
  financialPositionList.value = statementStore().financialPositionList;
  console.log("재무😁😎😍", financialPositionList.value);
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">재무상태표</p>
  <div
    ref="content"
    class="demo-space-x app-user-search-filter d-flex align-center flex-wrap gap-4 justify-start"
  >
    <!-- <VBtn color="primary" > 결산 </VBtn> -->
    <StatementModal
      v-model="isDialogVisible"
      :period-data="periodData"
      @selected="onRowSelected"
      @resultList="searchFinancialPosition"
    />

    <VBtn color="primary" @click="downloadPDF">
      <VIcon start icon="tabler-file-type-pdf" size="22" />
      출력
    </VBtn>

    <VDataTable
      :headers="financial"
      :items="financialPositionList"
      :items-per-page="10"
    />
  </div>
</template>
