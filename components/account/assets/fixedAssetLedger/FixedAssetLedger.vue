<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { assetsStore } from "@/store/account/assets";

const fixedAssetsList = ref([]);

const headers = [
  { title: "계정코드", key: "accountCode", width: 110 },
  { title: "계정과목명", key: "accountName", width: 160 },
  { title: "자산코드", key: "assetCode", width: 110 },
  { title: "자산명", key: "assetName", width: 150 },
  { title: "취득일자", key: "progress", width: 120 },
  { title: "기초가액", key: "acquisitionCost", width: 130 },
  { title: "당기증감", key: "t", width: 130 },
  { title: "기말잔액", key: "a", width: 110 },
  { title: "전기말상각누계액", key: "depreciation", width: 180 },
  { title: "당기감가상각비", key: "normalAmortization", width: 180 },
  { title: "당기말상각누계액", key: "accumulatedAmortization", width: 180 },
  { title: "당기말장부가액", key: "bookValueEnd", width: 180 },
];

onMounted(async () => {
  await assetsStore().GET_FIXED_ASSET_LEDGER_LIST();
  fixedAssetsList.value = assetsStore().getDepreciationList;
});
</script>

<template>
  <p class="text-2xl mb-6">고정자산관리대장</p>

  <VDataTable
    :headers="headers"
    :items="fixedAssetsList"
    :items-per-page="50"
  />
</template>
