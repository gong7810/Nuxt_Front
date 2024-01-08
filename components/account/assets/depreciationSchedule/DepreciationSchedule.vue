<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { assetsStore } from "@/store/account/assets";

const fixedAssetsList = ref([]);
const fixedAssetsList2 = ref([]);

const headers = [
  { title: "코드", key: "accountCode", width: 110 },
  { title: "계정과목명", key: "accountName", width: 150 },
  { title: "기초가액", key: "acquisitionCost", width: 130 },
  { title: "당기증감액", key: "t", width: 130 },
  { title: "기말잔액", key: "dsf", width: 110 },
  { title: "전기말상각누계액", key: "depreciation", width: 180 },
  { title: "당기감가상각비", key: "zxc", width: 180 },
  { title: "충당금감소액", key: "sdf", width: 180 },
  { title: "감가상각누계액", key: "normalAmortization", width: 180 },
  { title: "미상각잔액", key: "bookValueEnd", width: 180 },
];

const headers2 = [
  { title: "코드", key: "assetCode", width: 110 },
  { title: "고정자산명", key: "assetName", width: 150 },
  { title: "기초가액", key: "acquisitionCost", width: 130 },
  { title: "당기증감액", key: "t", width: 130 },
  { title: "기말잔액", key: "dsf", width: 110 },
  { title: "전기말상각누계액", key: "depreciation", width: 180 },
  { title: "당기감가상각비", key: "zxc", width: 180 },
  { title: "충당금감소액", key: "sdf", width: 180 },
  { title: "감가상각누계액", key: "normalAmortization", width: 180 },
  { title: "미상각잔액", key: "bookValueEnd", width: 180 },
];

onMounted(async () => {
  await assetsStore().GET_DEPRECIATION_LIST();
  fixedAssetsList.value = assetsStore().getDepreciationList;
});

const selectedFixedAsset = async (selected, row) => {
  const matchedItem = assetsStore().getDepreciationList.find(
    (item) => item.accountName === row.item.accountName
  );

  if (matchedItem) {
    const accountCode = matchedItem.accountCode;

    await assetsStore().SELECTED_DEPRECIATION_LIST({ accountCode });
    fixedAssetsList2.value = assetsStore().selectedDepreciationList;
  }
};
</script>

<template>
  <p class="text-2xl mb-6">감가상각비현황</p>

  <VDataTable
    :headers="headers"
    :items="fixedAssetsList"
    :items-per-page="10"
    style="margin-bottom: 50px"
    @click:row="selectedFixedAsset"
  />

  <VDataTable
    :headers="headers2"
    :items="fixedAssetsList2"
    :items-per-page="10"
  />
</template>
