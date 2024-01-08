<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

import AccountCodeModal from "@/components/account/base/accountLedger/AccountCodeModal.vue";

const accountCode = ref("");
const startDate = ref("");
const endDate = ref("");

const accountLedgerList = ref([]);

const dialogVisible = ref(false);
const noDataAlert = ref(false);
const dateErrorAlert = ref(false);

const content = ref(null);
let html2pdf: any;

const headers = [
  { title: "등록일자", sortable: false, key: "reportingDate" },
  { title: "적요", key: "expenseReport" },
  { title: "계정명", key: "accountName" },
  { title: "거래처코드", key: "customerCode" },
  { title: "차변금액", key: "leftDebitPrice" },
  { title: "대변금액", key: "rightCreditPrice" },
];

const openAccountCodeModal = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const onSelected = ({ selected, row }: any) => {
  accountCode.value = row.internalItem.columns.accountInnerCode;
};

const searchJournal = async () => {
  await baseStore().SEARCH_ACCOUNT_LEDGER({ accountCode, startDate, endDate });
  accountLedgerList.value = baseStore().accountLedgerList;

  if (startDate.value === "" || endDate.value === "")
    dateErrorAlert.value = true;
  else if (baseStore().accountLedgerList === undefined)
    noDataAlert.value = true;
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

  <p class="text-2xl mb-6">계정별원장</p>
  <VContainer>
    <VRow>
      <VCol md="2">
        <VForm>
          <VTextField
            v-model="accountCode"
            label="계정조회"
            persistent-placeholder
            @click="openAccountCodeModal"
          />
        </VForm>
      </VCol>
      <VCol>
        <VForm>
          <VTextField v-model="startDate" label="시작일" type="date" />
        </VForm>
      </VCol>
      <VCol>
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
          :items="accountLedgerList"
          :items-per-page="10"
        />
      </VCardText>
    </VCard>
  </div>

  <AccountCodeModal
    v-model="dialogVisible"
    @selected="onSelected"
    @closeDialog="closeDialog"
  />
</template>
