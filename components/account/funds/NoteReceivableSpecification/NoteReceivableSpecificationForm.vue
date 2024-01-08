<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { fundsStore } from "@/store/account/funds";

const receivableNoteList: Ref<any[]> = ref([]);

const ischeckTooltipVisible = ref(false);

const content = ref(null);
let html2pdf: any;

const noteDetailField: any = [
  { title: "", key: "data-table-expand", sortable: false },
  { title: "거래처명", key: "customerName" },
  { title: "거래처코드", key: "customerCode" },
  { title: "어음유형", key: "noteType" },
  { title: "어음번호", key: "noteNo" },
  { title: "어음금액", key: "notePrice" },
  { title: "어음만기일", key: "maturityDate" },
  { title: "비고", key: "" },
];

const fetchData = async () => {
  await fundsStore().FETCH_ALL_NOTE("0110");

  receivableNoteList.value = fundsStore().noteList;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고, 두 자리로 표현

  for (let i = 0; i < receivableNoteList.value.length - 1; i++) {
    if (
      receivableNoteList.value[i].maturityDate.substring(0, 7) ===
      `${year}-${month}`
    ) {
      ischeckTooltipVisible.value = true;
      break;
    }
  }
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};

const checkRow = (id: any) => {
  return !(id === "0");
};
</script>

<template>
  <p class="text-2xl mb-6">받을어음 명세서</p>
  <div
    class="app-user-search-filter d-flex align-center flex-wrap gap-4 justify-end"
    style="margin: 10px 0 10px"
  >
    <VTooltip v-if="ischeckTooltipVisible" location="left">
      <template #activator="{ props }">
        <VIcon
          color="warning"
          v-bind="props"
          size="30"
          icon="tabler-alert-triangle-filled"
        />
      </template>
      <span>이번 달 만기예정인 어음이 있습니다.</span>
    </VTooltip>
    <VBtn color="primary" @click="fetchData">
      <VIcon start icon="tabler-search" size="22" />
      조회
    </VBtn>
    <VBtn color="primary" @click="downloadPDF">
      <VIcon start icon="tabler-note" size="22" />
      출력
    </VBtn>
  </div>
  <div ref="content">
    <VCard>
      <VCardText>
        <VDataTable
          :headers="noteDetailField"
          :items="receivableNoteList"
          :items-per-page="10"
          expand-on-click
        >
          <!-- Expanded Row Data -->
          <template #expanded-row="slotProps">
            <tr v-if="checkRow(slotProps.item.id)" class="v-data-table__tr">
              <td :colspan="noteDetailField.length">
                <VCardText>
                  <VRow>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.slipNo"
                        label="전표일렬번호"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.journalNo"
                        label="분개일렬번호"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.expenseReport"
                        label="적요"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.drawer"
                        label="발행인"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.endorser"
                        label="배서인"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.drawee"
                        label="수금사원"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.issuanceDate"
                        label="발행일자"
                        type="date"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.maturityDate"
                        label="만기일자"
                        type="date"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" sm="6" md="4">
                      <AppTextField
                        v-model="slotProps.item.approvalEmpCode"
                        label="승인자코드"
                        readonly
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>
