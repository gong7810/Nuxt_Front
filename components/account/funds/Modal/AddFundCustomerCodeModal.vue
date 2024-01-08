<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { accountStore } from "@/store/account/account";

const emits = defineEmits(["selected", "dialogClose"]);
const searchData = ref("");
const searchWordkplace = ref("");
const selectWorkplace = ref("");
const accountCustomerList = ref([]);

const options = ref<string[]>([
  "--------------------",
  "BRC-01 : 본사",
  "BRC-02 : 아웃소싱",
  "BRC-03 : 은행",
  "BRC-04 : 보험사",
  "BRC-05 : 요식업체",
  "BRC-06 : 병원",
]);

const headers = [
  { title: "사업장코드", key: "workplaceCode" },
  { title: "거래처코드", key: "customerCode" },
  { title: "거래처명", key: "customerName" },
];

watch(selectWorkplace, () => {
  if (selectWorkplace.value === "--------------------") {
    searchWordkplace.value = "";
    selectWorkplace.value = "";
  } else {
    searchWordkplace.value = selectWorkplace.value.substring(0, 6);
  }
});

const getAccountCustomerCodeList = async () => {
  await accountStore().FETCH_ACCOUNT_CUSTOMER_CODE();
  accountCustomerList.value = accountStore().accountCustomerList;
};

onMounted(() => {
  getAccountCustomerCodeList();
});

const selectedRow = (selected: any, row: any) => {
  searchData.value = row.internalItem.columns.customerCode;
  emits("selected", { selected, row });
};

const dialogClose = () => {
  emits("dialogClose");
};
</script>

<template>
  <VDialog width="600">
    <VCard>
      <VCardTitle class="headline" style="margin-bottom: 10px; margin-top: 5px">
        거래처코드 찾기
      </VCardTitle>
      <VRow justify="center">
        <VCol md="3">
          <VTextField v-model="searchData" placeholder="거래처코드" disabled />
        </VCol>
        <VCol md="5">
          <VSelect
            v-model="selectWorkplace"
            :items="options"
            label="사업장코드"
          />
        </VCol>
      </VRow>

      <VDataTableVirtual
        :headers="headers"
        :items="accountCustomerList"
        :search="searchWordkplace"
        height="400"
        @click:row="selectedRow"
      />
      <VCardText class="d-flex justify-end">
        <VBtn @click="dialogClose">
          <VIcon start icon="tabler-zoom-check" size="22" />
          확인
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
