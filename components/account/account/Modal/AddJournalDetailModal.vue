<script setup lang="ts">
import AddAccountControlCodeModal from "@/components/account/account/Modal/AddAccountControlCodeModal.vue";

const propz = defineProps(["isDialogVisible", "selectedNo"]);
const emit = defineEmits(["submit", "dialogClose", "update:isDialogVisible"]);

const isAccountControlCodeDialogVisible = ref(false);

// Dialog 데이터칼럼
const journalNo = ref("");
const accountControlName = ref("");
const accountControlType = ref("");
const journalDescription = ref("");
const showDetails = ref("");

const accountControlCodeSelected = ({ selected, row }: any) => {
  accountControlType.value = row.internalItem.columns.accountControlType;
  accountControlName.value = row.internalItem.columns.accountControlName;
};

const resetData = () => {
  journalNo.value = "";
  accountControlName.value = "";
  accountControlType.value = "";
  journalDescription.value = "";
  showDetails.value = "";
};

const dialogModelValueUpdate = (val: boolean) => {
  emit("update:isDialogVisible", val);
  emit("dialogClose");
};

const formSubmit = () => {
  const journalDetailsArray: any = [
    {
      journalNo: propz.selectedNo,
      accountControlName: accountControlName.value,
      accountControlType: accountControlType.value,
      journalDescription: journalDescription.value,
      showDetails: showDetails.value,
    },
  ];

  emit("submit", journalDetailsArray);
  resetData();

  dialogModelValueUpdate(false);
};
</script>

<template>
  <VDialog
    :model-value="propz.isDialogVisible"
    max-width="600"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard title="분개상세 추가">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="journalNo"
              label="분개일렬번호"
              :placeholder="selectedNo"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="accountControlName"
              label="분개상세항목"
              @click="
                isAccountControlCodeDialogVisible =
                  !isAccountControlCodeDialogVisible
              "
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="accountControlType" label="코드" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="journalDescription" label="상세내용" />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="dialogModelValueUpdate(false)"
        >
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-message-circle-plus" size="22" />
          추가
        </VBtn>
      </VCardText>
    </VCard>
    <AddAccountControlCodeModal
      v-model="isAccountControlCodeDialogVisible"
      @selected="accountControlCodeSelected"
      @dialogClose="
        isAccountControlCodeDialogVisible = !isAccountControlCodeDialogVisible
      "
    />
  </VDialog>
</template>
