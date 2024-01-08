<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { vehicleStore } from "@/store/account/vehicle";

const emits = defineEmits(["selectedDept", "closeDialog"]);

const dept = [
  { title: "부서코드", key: "deptCode" },
  { title: "부서명", key: "deptName" },
];

const selectedRow = (selected, row) => {
  emits("selectedDept", { selected, row });
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
        부서정보
      </VCardTitle>
      <VContainer style="margin-top: 10px; margin-bottom: 50px">
        <VDataTableVirtual
          :headers="dept"
          :items="vehicleStore().deptList"
          height="350"
          @click:row="selectedRow"
        />
      </VContainer>
    </VCard>
  </VDialog>
</template>
