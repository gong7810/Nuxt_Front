<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { assetsStore } from "@/store/account/assets";

const emits = defineEmits(["selectedAsset", "closeDialog"]);

const asset = [
  { title: "자산코드", key: "assetCode" },
  { title: "자산명", key: "assetName" },
];

const selectedRow = (selected, row) => {
  emits("selectedAsset", { selected, row });
  closeDialog();
};

const closeDialog = () => {
  emits("closeDialog");
};
</script>

<template>
  <VDialog width="500">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>
      <VCardTitle style="margin-top: 15px; margin-left: 5px">
        고정자산정보
      </VCardTitle>
      <VContainer style="margin-top: 10px; margin-bottom: 50px">
        <VDataTableVirtual
          :headers="asset"
          :items="assetsStore().searchFixedAssetsCodeList"
          height="350"
          @click:row="selectedRow"
        />
      </VContainer>
    </VCard>
  </VDialog>
</template>
