<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";

const propz = defineProps(["deptInfo", "workplaceName", "isDialogVisible2"]);

const emits = defineEmits([
  "selected2",
  "selected3",
  "dialogToggle2",
  "dialogClose2",
]);

const headers4 = [
  { title: "사업장코드", sortable: false, key: "workplaceCode" },
  { title: "사업장명", key: "workplaceName" },
];

const headers5 = [
  { title: "부서코드", sortable: false, key: "deptCode" },
  { title: "부서명", key: "deptName" },
];

const onRowSelected2 = (selected, b) => {
  console.log(selected);
  console.log(b);
  emits("selected2", { selected, b });
};

const onRowSelected3 = (selected, c) => {
  console.log(selected);
  console.log(c);
  emits("selected3", { selected, c });
};

const dialogToggle2 = () => {
  emits("dialogToggle2");
};

const dialogClose2 = () => {
  emits("dialogClose2");
};
</script>

<template>
  <VDialog v-model="propz.isDialogVisible2" width="500">
    <template #activator="{ props }">
      <IconBtn class="me-1" @click="Shepherd.activeTour?.cancel()">
        <VIcon v-bind="props" size="26" icon="tabler-search" />
      </IconBtn>
    </template>
    <DialogCloseBtn @click="dialogToggle2" />

    <VCard title="사업장 및 부서 선택">
      <VContainer>
        <VDataTable
          :headers="headers4"
          :items="workplaceName"
          :items-per-page="5"
          @click:row="onRowSelected2"
        />
        <VDataTable
          :headers="headers5"
          :items="deptInfo"
          :items-per-page="5"
          @click:row="onRowSelected3"
        />
        <VCardText class="d-flex justify-end">
          <VBtn @click="dialogClose2"> OK </VBtn>
        </VCardText>
      </VContainer>
    </VCard>
  </VDialog>
</template>
