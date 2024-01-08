<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { accountStore } from "@/store/account/account";

const emits = defineEmits(["selected", "dialogClose"]);
const searchData = ref("");
const accountControlCodeList = ref([]);

const headers = [
  { title: "코드", key: "accountControlType" },
  { title: "분개상세항목", key: "accountControlName" },
];

const getAccountControlCodeList = async () => {
  await accountStore().FETCH_ACCOUNT_CONTROL_CODE();
  accountControlCodeList.value = accountStore().accountControlCodeList;
};

const selectedRow = (selected: any, row: any) => {
  searchData.value = row.internalItem.columns.accountControlName;
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
        분개상세 항목 찾기
      </VCardTitle>
      <VRow justify="center">
        <VCol md="6" style="margin-left: 15px">
          <VTextField
            v-model="searchData"
            placeholder="분개상세항목"
            disabled
          />
        </VCol>
        <VCol md="5">
          <VBtn
            color="primary"
            variant="flat"
            @click="getAccountControlCodeList"
          >
            <VIcon start icon="tabler-zoom-in-area" size="23" />
            전체 조회
          </VBtn>
        </VCol>
      </VRow>

      <VDataTableVirtual
        :headers="headers"
        :items="accountControlCodeList"
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
