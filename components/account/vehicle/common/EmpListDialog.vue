<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { vehicleStore } from "@/store/account/vehicle";

const emits = defineEmits(["selectedEmp", "closeDialog"]);

const emp = [
  { title: "사원코드", key: "empCode" },
  { title: "사원명", key: "empName" },
];

const selectedRow = (selected, row) => {
  emits("selectedEmp", { selected, row });
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
        사원정보
      </VCardTitle>
      <VContainer style="margin-top: 10px; margin-bottom: 50px">
        <VDataTableVirtual
          :headers="emp"
          :items="vehicleStore().empList"
          height="350"
          @click:row="selectedRow"
        />
      </VContainer>
    </VCard>
  </VDialog>
</template>
