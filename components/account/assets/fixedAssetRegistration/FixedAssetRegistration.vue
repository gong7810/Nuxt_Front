<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { assetsStore } from "@/store/account/assets";

import DetailFixedAssetsCard from "@/components/account/assets/fixedAssetRegistration/DetailFixedAssetsCard.vue";

const fixedAssetsCodeList = ref([]);

const detailCardVisible = ref("");

const items = ref([]);

const headers = [
  { title: "계정코드", key: "accountCode" },
  { title: "계정명", key: "accountName" },
  { title: "자산코드", key: "assetCode" },
  { title: "자산명", key: "assetName" },
  { title: "취득일", key: "progress" },
  { title: "처리여부", key: "finalizeStatus" },
];

onMounted(async () => {
  await assetsStore().GET_FIXED_ASSETS_CODE_LIST();
  items.value = assetsStore().fixedAssetsCodeList.map(
    (item) => item.accountName
  );
});

const selectedList = async (value) => {
  const matchedItem = assetsStore().fixedAssetsCodeList.find(
    (item) => item.accountName === value
  );

  if (matchedItem) {
    const fixedAssetsCode = matchedItem.accountCode;
    const fixedAssetsName = matchedItem.accountName;

    await assetsStore().SEARCH_FIXED_ASSETS_CODE_LIST({
      fixedAssetsCode,
      fixedAssetsName,
    });
    fixedAssetsCodeList.value = assetsStore().searchFixedAssetsCodeList;
  }
  detailCardVisible.value = "";
};

const updateDetailCard = async (selected, row) => {
  if (
    detailCardVisible.value === "UPDATE" &&
    assetsStore().selectedRow === row.item
  ) {
    detailCardVisible.value = "";
  } else {
    assetsStore().selectedRow = row.item;

    const assetCode = row.item.assetCode;

    await assetsStore().SEARCH_FIXED_ASSETS_DETAIL_LIST({ assetCode });

    detailCardVisible.value = "UPDATE";
  }
};
</script>

<template>
  <p class="text-2xl mb-6">고정자산 조회</p>
  <VRow style="margin-bottom: 15px">
    <VAutocomplete
      label="자산유형"
      placeholder="Select"
      :items="items"
      style="margin-left: 10px; margin-right: 10px; max-width: 300px"
      @update:modelValue="selectedList"
    />
  </VRow>

  <VDataTable
    :headers="headers"
    :items="fixedAssetsCodeList"
    :items-per-page="10"
    @click:row="updateDetailCard"
  />

  <DetailFixedAssetsCard
    :detail-card-visible="detailCardVisible"
    :items="items"
  />
</template>

<style scoped>
.text-right {
  text-align: right;
}
</style>
