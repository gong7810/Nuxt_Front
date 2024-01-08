<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";
import StatementModal from "@/components/account/statement/modal/StatementModal.vue";

const isDialogVisible = ref(false);
const incomeList = ref([]);
const selectedRow = ref("");
const periodData = ref([]);
const content = ref(null);
let html2pdf: any;

const income = [
  { title: "계정명", sortable: false, key: "accountName" },
  { title: "당기 합계금액", key: "incomeSummary" },
  { title: "당기 세부금액", key: "income" },
  { title: "전기 합계금액", key: "earlyIncomeSummary" },
  { title: "전기 세부금액", key: "earlyIncome" },
];

const onRowSelected = (selectedrow: any) => {
  console.log(selectedrow.value);
  selectedRow.value = selectedrow.value;
};

const searchIncomeStatement = async () => {
  const payload = {
    callResult: "SEARCH",
    accountPeriodNo: selectedRow.value + 1,
  };

  console.log("payload", payload);
  await statementStore().SEARCH_INCOME_STATEMENT_LIST(payload);
  incomeList.value = statementStore().incomeStatement;
  console.log("손익😍😎😘❤️", incomeList.value);
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">손익계산서</p>
  <div
    ref="content"
    class="demo-space-x app-user-search-filter d-flex align-center flex-wrap gap-4 justify-start"
  >
    <!-- <VBtn color="primary" > 결산 </VBtn> -->
    <StatementModal
      v-model="isDialogVisible"
      :period-data="periodData"
      @selected="onRowSelected"
      @resultList="searchIncomeStatement"
    />

    <VBtn color="primary" @click="downloadPDF">
      <VIcon start icon="tabler-file-type-pdf" size="22" />
      출력
    </VBtn>

    <VDataTable :headers="income" :items-per-page="10" :items="incomeList" />
  </div>
</template>
