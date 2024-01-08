<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";
// import StatementModal from "@/components/account/statement/modal/StatementModal.vue";

// const isDialogVisible = ref(false);
const startDate = ref("");
const endDate = ref("");
// const periodData = ref([]);
const monthIncomeList = ref([]);
const content = ref(null);
let html2pdf: any;

const monthIncome = [
  { title: "연도", sortable: false, key: "year" },
  { title: "월", key: "month" },
  { title: "매출액", key: "salesSummary" },
  { title: "매출원가", key: "salesCostSummary" },
  { title: "매출총액", key: "grossMargin" },
  { title: "판관비", key: "salesManageCostSummary" },
  { title: "영업이익", key: "operatingProfit" },
  { title: "영업외수익", key: "nonOperatingProfitSummary" },
  { title: "영업외비용", key: "nonOperatingCostSummary" },
  { title: "법인세차감전이익", key: "ordinaryProfit" },
  { title: "법인세", key: "corporateTaxSummary" },
  { title: "당기순이익", key: "netIncome" },
];

// const onRowSelected = (selectedrow: any) => {
//   console.log(selectedrow.value);
//   selectedRow.value = selectedrow.value;
// };

const searchMonthIncomeStatement = async () => {
  const payload = { accountPeriodNo: 2 };

  console.log("payload", payload);
  await statementStore().SEARCH_MONTH_INCOME_STATEMENT_LIST(payload);
  monthIncomeList.value = statementStore().monthIncomeStatementList;
  console.log("월별😍😎😁❤️", monthIncomeList.value);
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">기간별 손익계산서</p>
  <!-- <div class="demo-space-x" ref="content">
    <VBtn color="primary" > 결산 </VBtn>
    <StatementModal
      v-model="isDialogVisible"
      :periodData="periodData"
      @selected="onRowSelected"
      @resultList="searchMonthIncomeStatement"
    /> -->

    <VRow style="margin-bottom: 10px;">
      <VCol md="3">
        <VForm>
          <VTextField v-model="startDate" label="시작일" type="date" />
        </VForm>
      </VCol>
      <VCol md="3">
        <VForm>
          <VTextField v-model="endDate" label="종료일" type="date" />
        </VForm>
      </VCol>
      <VCol>
        <VBtn color="primary" @click="searchMonthIncomeStatement">
          <VIcon start icon="tabler-search" size="24" />
          결산
        </VBtn>
        <VBtn color="primary" style="margin-left: 10px" @click="downloadPDF">
          <VIcon start icon="tabler-file-type-pdf" size="22" />
          출력
        </VBtn>
      </VCol>
  </VRow> 

  <VDataTable
    :headers="monthIncome"
    :items="monthIncomeList"
    :items-per-page="12"
  />
  <!-- </div> -->
</template>
