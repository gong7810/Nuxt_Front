<script setup lang="ts">
import AddAccountCodeModal from "@/components/account/account/Modal/AddAccountCodeModal.vue";
import AddAccountNameModal from "@/components/account/account/Modal/AddAccountNameModal.vue";
import AddCustomerCodeModal from "@/components/account/account/Modal/AddCustomerCodeModal.vue";

const propz = defineProps([
  "isEditJournalDialogOpen",
  "selectedJournalNo",
  "journalData",
]);

const emit = defineEmits(["submit", "isDialogClose"]);

const isAccountCodeDialogVisible = ref(false);
const isAccountNameDialogVisible = ref(false);
const isCustomerCodeDialogVisible = ref(false);

// Dialog 데이터칼럼
const journalNo = ref("");
const accountCode = ref("");
const accountName = ref("");
const customerCode = ref("");
const customerName = ref("");
const balanceDivision = ref("");
const leftDebitPrice = ref(0);
const rightCreditPrice = ref(0);
const index = ref(0);

const options = ref<string[]>(["차변", "대변"]);

// Dialog 창이 켜질때 해당값 할당
watch(
  () => propz.isEditJournalDialogOpen,
  () => {
    for (let i = 0; i < propz.journalData.length; i++) {
      if (propz.journalData[i].journalNo === propz.selectedJournalNo) {
        journalNo.value = propz.journalData[i].journalNo;
        accountCode.value = propz.journalData[i].accountCode;
        accountName.value = propz.journalData[i].accountName;
        customerCode.value = propz.journalData[i].customerCode;
        customerName.value = propz.journalData[i].customerName;
        balanceDivision.value = propz.journalData[i].balanceDivision;
        leftDebitPrice.value = propz.journalData[i].leftDebitPrice;
        rightCreditPrice.value = propz.journalData[i].rightCreditPrice;

        // 분개 index
        index.value = i;
        break;
      }
    }
  }
);

const accountCodeSelected = ({ selected, row }: any) => {
  accountCode.value = row.internalItem.columns.accountInnerCode;
  accountName.value = row.internalItem.columns.accountName;
};

const customerCodeSelected = ({ selected, row }: any) => {
  customerCode.value = row.internalItem.columns.customerCode;
  customerName.value = row.internalItem.columns.customerName;
};

const dialogClose = () => {
  emit("isDialogClose");
};

const formSubmit = () => {
  const editJournalArray: any = [
    {
      journalNo: journalNo.value,
      accountCode: accountCode.value,
      accountName: accountName.value,
      customerCode: customerCode.value,
      customerName: customerName.value,
      balanceDivision: balanceDivision.value,
      leftDebitPrice: leftDebitPrice.value,
      rightCreditPrice: rightCreditPrice.value,
      index: index.value,
    },
  ];

  emit("submit", editJournalArray);

  // id.value += 1;
  dialogClose();
};
</script>

<template>
  <VDialog max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogClose" />

    <VCard title="분개 수정">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4" md="6">
            <AppTextField v-model="journalNo" label="분개일렬번호" disabled />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="accountCode"
              label="계정코드"
              @click="isAccountCodeDialogVisible = !isAccountCodeDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="accountName"
              label="계정과목"
              @click="isAccountNameDialogVisible = !isAccountNameDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="customerCode"
              label="거래처코드"
              @click="
                isCustomerCodeDialogVisible = !isCustomerCodeDialogVisible
              "
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppSelect
              v-model="balanceDivision"
              :items="options"
              label="대차구분"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="leftDebitPrice"
              label="차변"
              placeholder="0"
              type="number"
              :disabled="balanceDivision === '대변'"
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <AppTextField
              v-model="rightCreditPrice"
              label="대변"
              placeholder="0"
              type="number"
              :disabled="balanceDivision === '차변'"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="dialogClose">
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-message-cog" size="22" />
          저장
        </VBtn>
      </VCardText>
    </VCard>
    <AddAccountCodeModal
      v-model="isAccountCodeDialogVisible"
      @selected="accountCodeSelected"
      @dialogClose="isAccountCodeDialogVisible = !isAccountCodeDialogVisible"
    />
    <AddAccountNameModal
      v-model="isAccountNameDialogVisible"
      @selected="accountCodeSelected"
      @dialogClose="isAccountNameDialogVisible = !isAccountNameDialogVisible"
    />
    <AddCustomerCodeModal
      v-model="isCustomerCodeDialogVisible"
      @selected="customerCodeSelected"
      @dialogClose="isCustomerCodeDialogVisible = !isCustomerCodeDialogVisible"
    />
  </VDialog>
</template>
