<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

const startDate = ref("");
const endDate = ref("");
const detailTrialBalanceList = ref([]);

const noDataAlert = ref(false);
const dateErrorAlert = ref(false);

const content = ref(null);
let html2pdf: any;

const headers = [
  { title: "차변금액", sortable: false, key: "debits" },
  { title: "계", key: "debitsSum" },
  { title: "대체", key: "exceptCashDebits" },
  { title: "현금", key: "cashDebits" },
  { title: "계정과목", key: "accountName" },
  { title: "현금", key: "cashCredits" },
  { title: "대체", key: "exceptCashCredits" },
  { title: "계", key: "creditsSum" },
  { title: "대변금액", sortable: false, key: "credits" },
];

const searchJournal = async () => {
  await baseStore().SEARCH_DETAIL_TRIAL_BALANCE_LIST({
    startDate,
    endDate,
  });
  detailTrialBalanceList.value = baseStore().detailTrialBalanceList;

  if (startDate.value === "" || endDate.value === "") {
    dateErrorAlert.value = true;
  } else {
    if (baseStore().detailTrialBalanceList === undefined)
      noDataAlert.value = true;
  }
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <VSnackbar
    v-model="dateErrorAlert"
    :timeout="2000"
    color="error"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-alert-circle-filled" />날짜를 입력해주세요.
    </div>
  </VSnackbar>
  <VSnackbar
    v-model="noDataAlert"
    :timeout="2000"
    color="error"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-alert-circle-filled" />데이터가 없습니다.
    </div>
  </VSnackbar>

  <p class="text-2xl mb-6">일(월)계표</p>
  <VContainer>
    <VRow>
      <VCol md="4">
        <VForm>
          <VTextField v-model="startDate" label="시작일" type="date" />
        </VForm>
      </VCol>
      <VCol md="4">
        <VForm>
          <VTextField v-model="endDate" label="종료일" type="date" />
        </VForm>
      </VCol>
      <VCol>
        <VBtn color="primary" style="margin-right: 15px" @click="searchJournal">
          <VIcon start icon="tabler-search" />조회
        </VBtn>
        <VBtn color="primary" @click="downloadPDF">
          <VIcon start icon="tabler-note" />출력
        </VBtn>
      </VCol>
    </VRow>
  </VContainer>

  <div ref="content">
    <VCard>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="detailTrialBalanceList"
          :items-per-page="50"
        />
      </VCardText>
    </VCard>
  </div>
</template>
