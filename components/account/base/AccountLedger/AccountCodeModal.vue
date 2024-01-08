<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

const emits = defineEmits(["selected", "closeDialog"]);

const searchData = ref("");
const accountCodeList = ref([]);

const headers = [
  { title: "계정코드", key: "accountInnerCode", align: "center" },
  { title: "계정과목", key: "accountName", align: "center" },
];

onMounted(async () => {
  await baseStore().SEARCH_ACCOUNT_CODE_LIST();

  accountCodeList.value = baseStore().accountCodeList;
});

const selectedRow = (selected, row) => {
  searchData.value = row.internalItem.columns.accountInnerCode;
  emits("selected", { selected, row });
};

const closeDialog = () => {
  emits("closeDialog");
  searchData.value = "";
};
</script>

<template>
  <VDialog width="600" height="700">
    <VCard>
      <VCardTitle class="headline" style="margin-bottom: 10px; margin-top: 5px">
        계정코드 찾기
      </VCardTitle>
      <VRow justify="center">
        <VCol md="7">
          <VTextField
            v-model="searchData"
            placeholder="계정코드를 입력하세요."
          />
        </VCol>
        <VCol md="2">
          <VBtn @click="closeDialog"> 확인 </VBtn>
        </VCol>
      </VRow>

      <VDataTable
        :headers="headers"
        :items="accountCodeList"
        :items-per-page="10"
        @click:row="selectedRow"
        class="text-center"
        :search="searchData"
      />
      <VCardText class="d-flex justify-end"> </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
