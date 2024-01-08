<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { accountStore } from "@/store/account/account";

const emits = defineEmits(["selected", "dialogClose"]);
const searchData = ref("");
const accountCodeList = ref([]);

const headers = [
  { title: "계정코드", key: "accountInnerCode" },
  { title: "계정과목", key: "accountName" },
];

const getAccountCodeList = async () => {
  await accountStore().FETCH_ACCOUNT_CODE_LIST();

  accountCodeList.value = accountStore().accountCodeList;
};

const searchAccountCode = async () => {
  const searchValue = searchData.value;

  const filteredData = accountStore().accountCodeList.filter(
    (item: any) =>
      item.accountInnerCode === searchValue || item.accountName === searchValue
  );

  if (filteredData.length > 0) {
    const { accountInnerCode, accountName } = filteredData[0];

    await accountStore().SEARCH_ACCOUNT_CODE({ accountInnerCode, accountName });
  }
  accountCodeList.value = accountStore().accountCode;
};

const selectedRow = (selected: any, row: any) => {
  searchData.value = row.internalItem.columns.accountInnerCode;
  emits("selected", { selected, row });
};

const dialogClose = () => {
  emits("dialogClose");
};
</script>

<template>
  <VDialog width="500">
    <VCard>
      <VCardTitle class="headline" style="margin-bottom: 10px; margin-top: 5px">
        계정코드 찾기
      </VCardTitle>
      <VRow justify="center">
        <VCol md="6" style="margin-left: 15px">
          <VTextField
            v-model="searchData"
            placeholder="계정코드를 입력하세요."
            @keyup.enter="searchAccountCode"
          />
        </VCol>
        <VCol md="5">
          <VBtnGroup color="primary" variant="flat" style="height: 42px">
            <VBtn @click="searchAccountCode">
              <VIcon icon="tabler-search" size="20" />
            </VBtn>
            <VBtn @click="getAccountCodeList">
              <VIcon start icon="tabler-zoom-in-area" size="23" />
              전체 조회
            </VBtn>
          </VBtnGroup>
        </VCol>
      </VRow>

      <VDataTable
        :headers="headers"
        :items="accountCodeList"
        :items-per-page="8"
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
