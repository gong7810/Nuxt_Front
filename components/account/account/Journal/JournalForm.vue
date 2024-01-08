<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { accountStore } from "@/store/account/account";

const fromDate = ref("");
const toDate = ref("");
const journalList = ref([]);

const content = ref(null);
let html2pdf: any;

const columns = [
  { title: "", key: "&nbsp", sortable: false },
  {
    title: "승인일자",
    key: "reportingDate",
  },
  {
    title: "차변계정",
    key: "leftAccountName",
  },
  {
    title: "차변금액",
    key: "leftDebitPrice",
  },
  {
    title: "대변계정",
    key: "rightAccountName",
  },
  {
    title: "대변금액",
    key: "rightCreditPrice",
  },
  {
    title: "거래처",
    key: "customerName",
  },
  {
    title: "적요",
    key: "expenseReport",
  },
];

// 분개 전체 조회
const fetchJournal = async () => {
  const startDate = fromDate.value;
  const endDate = toDate.value;

  await accountStore().SEARCH_JOURNAL({ startDate, endDate });
  journalList.value = accountStore().journalList;

  if (journalList.value.length === 0) {
    alert("해당범위에는 데이터가 존재하지않습니다.");
    journalList.value = [];
  }
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">분개장</p>
  <div style="font-family: 'Franklin Gothic Demi'">
    <div class="custom-search">
      <VRow>
        <VCol md="3">
          <VForm>
            <VFormGroup>
              <label>시작일</label>
              <AppDateTimePicker
                v-model="fromDate"
                title="시작일"
                placeholder="Select date"
                append-inner-icon="tabler-calendar-filled"
              />
            </VFormGroup>
          </VForm>
        </VCol>
        <VCol md="3">
          <VForm>
            <VFormGroup>
              <label>종료일</label>
              <AppDateTimePicker
                v-model="toDate"
                title="종료일"
                placeholder="Select date"
                append-inner-icon="tabler-calendar-filled"
              />
            </VFormGroup>
          </VForm>
        </VCol>
        <VCol style="margin-top: 23px">
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="fetchJournal"
          >
            <VIcon start icon="tabler-search" size="22" />
            조회
          </VBtn>
          <VBtn color="primary" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />
            출력
          </VBtn>
        </VCol>
      </VRow>
    </div>
    <div ref="content" style="margin-top: 20px">
      <VCard>
        <VCardText>
          <VDataTable
            :headers="columns"
            :items="journalList"
            :items-per-page="15"
          />
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
