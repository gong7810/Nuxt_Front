<script setup lang="ts">
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

const emits = defineEmits(["selectedCustomer", "closeDialog"]);

const searchWordkplace = ref("");
const selectWorkplace = ref("BRC-04 : 보험사");

const options = ref<string[]>(["BRC-04 : 보험사"]);

const asset = [
  { title: "사업장코드", key: "workplaceCode" },
  { title: "거래처코드", key: "customerCode" },
  { title: "거래처명", key: "customerName" },
];

onMounted(() => {
  searchWordkplace.value = selectWorkplace.value.substring(0, 6);
});

const closeDialog = () => {
  emits("closeDialog");
};

const selectedRow = (selected: any, row: any) => {
  emits("selectedCustomer", { selected, row });
  closeDialog();
};
</script>

<template>
  <VDialog width="600">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>
      <VCardTitle style="margin-top: 15px; margin-left: 5px">
        고정자산정보
      </VCardTitle>
      <VRow justify="center">
        <VCol md="5">
          <VSelect
            v-model="selectWorkplace"
            :items="options"
            label="사업장코드"
          />
        </VCol>
      </VRow>
      <VContainer style="margin-top: 10px; margin-bottom: 50px">
        <VDataTableVirtual
          :headers="asset"
          :items="baseStore().accountCustomerList"
          :search="searchWordkplace"
          height="350"
          @click:row="selectedRow"
        />
      </VContainer>
    </VCard>
  </VDialog>
</template>
