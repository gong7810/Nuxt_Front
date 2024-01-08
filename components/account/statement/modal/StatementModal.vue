<script lang="ts" setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { statementStore } from "@/store/account/statement";

const propz = defineProps(["periodData", "isDialogVisible"]);
const emits = defineEmits(["selected", "cancelModal", "resultList"]);

const periodDatalist = ref([]);
const selectedRow = ref("");

const isPeriodDataDialogVisible = ref(false);

const setPeriod = () => {
  fetchPeriodDataList();
  isPeriodDataDialogVisible.value = true;
};

const periodData = [
  { title: "기수일렬번호", key: "accountPeriodNo", align: "center" },
  { title: "회계연도", key: "fiscalYear" },
  { title: "시작일자", key: "periodStartDate" },
  { title: "종료일자", key: "periodEndDate" },
];

const fetchPeriodDataList = async () => {
  await statementStore().SEARCH_PERIOD_DATA_LIST();
  periodDatalist.value = statementStore().periodDataList;
  console.log("나와라😍", periodDatalist.value);
};

const onRowSelected = (selected: any, row: any) => {
  console.log(toRaw(row));
  console.log(toRaw(row.internalItem.index));
  selectedRow.value = toRaw(row.internalItem.index);
  console.log("나와라😍", selectedRow.value);
  emits("selected", selectedRow);
};

const cancelModal = () => {
  emits("cancelModal");
};

const resultList = () => {
  emits("resultList");
  isPeriodDataDialogVisible.value = false;
};
</script>

<template>
  <VBtn color="primary" @click="setPeriod">
    <VIcon start icon="tabler-report-money" size="22"/>
     결산 
  </VBtn>
  <VDialog v-model="isPeriodDataDialogVisible" max-width="600">
    <!-- Dialog Activator -->
    <!-- <template #activator="{ props }">
      
    </template> -->

    <!-- Dialog Content -->
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12">
              <VCardText>
                <VDataTable
                  :headers="periodData"
                  :items="periodDatalist"
                  @click:row="onRowSelected"
                />
              </VCardText>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isPeriodDataDialogVisible = !isPeriodDataDialogVisible"
        >
          Cancel
        </VBtn>
        <VBtn @click="resultList"> OK </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
