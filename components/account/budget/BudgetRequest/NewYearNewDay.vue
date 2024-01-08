<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";

const propz = defineProps(["yeardata", "isDialogVisible"]);
const emits = defineEmits(["selected", "dialogToggle", "dialogClose"]);

const headers3 = [
  { title: "회계 시작일자", sortable: false, key: "periodStartDate" },
  { title: "회계 종료일자", key: "periodEndDate" },
  { title: "기간번호", key: "accountPeriodNo" },
];

const onRowSelected = (selected, a) => {
  console.log("aaa", selected);
  console.log("bbb", a);
  emits("selected", { selected, a });
};

const dialogToggle = () => {
  emits("dialogToggle");
};

const dialogClose = () => {
  emits("dialogClose");
};
</script>

<template>
  <VDialog v-model="propz.isDialogVisible" width="500">
    <template #activator="{ props }">
      <IconBtn class="me-1" @click="Shepherd.activeTour?.cancel()">
        <VIcon v-bind="props" size="26" icon="tabler-search" />
      </IconBtn>
    </template>
    <DialogCloseBtn @click="dialogToggle" />

    <VCard title="회계년도">
      <VContainer>
        <VDataTable
          :headers="headers3"
          :items="propz.yeardata"
          :items-per-page="5"
          :key="(row) => row.id"
          @click:row="onRowSelected"
        />
        <VCardText class="d-flex justify-end">
          <VBtn @click="dialogClose"> OK </VBtn>
        </VCardText>
      </VContainer>
    </VCard>
  </VDialog>
</template>
