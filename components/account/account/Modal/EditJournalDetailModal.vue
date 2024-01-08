<script setup lang="ts">
import AddAccountControlCodeModal from "@/components/account/account/Modal/AddAccountControlCodeModal.vue";

const propz = defineProps([
  "isEditJournalDetailDialogOpen",
  "selectedJournalDetailNo",
  "journalDetailData",
]);

const emit = defineEmits(["submit", "dialogClose"]);

const isAccountControlCodeDialogVisible = ref(false);

// Dialog 데이터칼럼
const journalDetailNo = ref("");
const journalNo = ref("");
const accountControlName = ref("");
const accountControlType = ref("");
const journalDescription = ref("");
const showDetails = ref("");
const index = ref(0);

watch(
  () => propz.isEditJournalDetailDialogOpen,
  () => {
    for (let i = 0; i < propz.journalDetailData.length; i++) {
      if (
        propz.journalDetailData[i].journalDetailNo ===
        propz.selectedJournalDetailNo
      ) {
        journalDetailNo.value = propz.journalDetailData[i].journalDetailNo;
        journalNo.value = propz.journalDetailData[i].journalNo;
        accountControlName.value =
          propz.journalDetailData[i].accountControlName;
        accountControlType.value =
          propz.journalDetailData[i].accountControlType;
        journalDescription.value =
          propz.journalDetailData[i].journalDescription;
        showDetails.value = propz.journalDetailData[i].showDetails;

        // 분개 index
        index.value = i;
        break;
      }
    }
  }
);

const accountControlCodeSelected = ({ selected, row }: any) => {
  accountControlType.value = row.internalItem.columns.accountControlType;
  accountControlName.value = row.internalItem.columns.accountControlName;
};

const dialogClose = () => {
  emit("isDialogClose");
};

const formSubmit = () => {
  const journalDetailsArray: any = [
    {
      journalDetailNo: journalDetailNo.value,
      journalNo: journalNo.value,
      accountControlName: accountControlName.value,
      accountControlType: accountControlType.value,
      journalDescription: journalDescription.value,
      showDetails: showDetails.value,
      index: index.value,
    },
  ];

  emit("submit", journalDetailsArray);

  dialogClose();
};
</script>

<template>
  <VDialog max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogClose" />

    <VCard title="분개상세 수정">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              id="journalNo"
              v-model="journalDetailNo"
              label="분개상세번호"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              id="journalNo"
              v-model="journalNo"
              label="분개일렬번호"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="accountControlName"
              label="분개상세항목"
              @click="
                isAccountControlCodeDialogVisible =
                  !isAccountControlCodeDialogVisible
              "
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField v-model="accountControlType" label="코드" disabled />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField v-model="journalDescription" label="상세내용" />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="dialogClose">
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-message-circle-cog" size="22" />
          저장
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
