<script setup lang="ts">
import AddAccountCodeModal from "@/components/account/account/Modal/AddAccountCodeModal.vue";
import AddAccountNameModal from "@/components/account/account/Modal/AddAccountNameModal.vue";

const propz = defineProps(["isDialogVisible", "defenseJournal"]);
const emit = defineEmits(["submit", "update:isDialogVisible"]);

const leftSum = ref(0);
const rightSum = ref(0);
const leftOrright = ref(0);

const debitAvailable = ref(false);
const creditAvailable = ref(false);

const isAccountCodeSnackBarVisible = ref(false);
const isCustomerCodeSnackBarVisible = ref(false);
const isBalanceDivisionSnackBarVisible = ref(false);
const isLeftDebitPriceSnackBarVisible = ref(false);
const isRightCreditPriceSnackBarVisible = ref(false);

const isAccountCodeDialogVisible = ref(false);
const isAccountNameDialogVisible = ref(false);
const isCustomerCodeDialogVisible = ref(false);

// Dialog 데이터칼럼
const journalNo = ref("");
const accountCode = ref("");
const accountName = ref("");
const balanceDivision = ref("");
const customerCode = ref("");
const customerName = ref("");
const leftDebitPrice = ref(0);
const rightCreditPrice = ref(0);

const options = ref<string[]>(["차변", "대변"]);

const generateJournalNo = () => {
  const toDay = new Date();

  const monthName = new Date(0, toDay.getMonth())
    .toLocaleString("en", {
      month: "short",
    })
    .toUpperCase();

  const Year = toDay.getFullYear().toString().slice(-2);
  const timestamp = toDay.getTime().toString().slice(-4);

  journalNo.value = Year + monthName + timestamp;
};

watch(balanceDivision, () => {
  if (balanceDivision.value === "차변") {
    rightCreditPrice.value = 0;
    debitAvailable.value = false;
    creditAvailable.value = true;
  } else {
    leftDebitPrice.value = 0;
    debitAvailable.value = true;
    creditAvailable.value = false;
  }
});

const accountCodeSelected = ({ selected, row }: any) => {
  accountCode.value = row.internalItem.columns.accountInnerCode;
  accountName.value = row.internalItem.columns.accountName;
};

const customerCodeSelected = ({ selected, row }: any) => {
  customerCode.value = row.internalItem.columns.customerCode;
  customerName.value = row.internalItem.columns.customerName;
};

const resetData = () => {
  leftSum.value =
    Number.parseInt(leftSum.value) + Number.parseInt(leftDebitPrice.value); // 차변 총합
  rightSum.value =
    Number.parseInt(rightSum.value) + Number.parseInt(rightCreditPrice.value); // 대변 총합
  leftOrright.value =
    Number.parseInt(leftSum.value) - Number.parseInt(rightSum.value);

  if (leftOrright.value > 0) {
    rightCreditPrice.value = leftOrright.value;
    leftDebitPrice.value = 0;
    balanceDivision.value = "대변";
  } else if (leftOrright.value < 0) {
    leftDebitPrice.value = leftOrright.value;
    rightCreditPrice.value = 0;
    balanceDivision.value = "차변";
  } else {
    leftDebitPrice.value = 0;
    rightCreditPrice.value = 0;
    balanceDivision.value = "";
  }
  journalNo.value = "NEW";
  accountCode.value = "";
  accountName.value = "";
  customerCode.value = "";
  customerName.value = "";
};

const dialogModelValueUpdate = (val: boolean) => {
  emit("update:isDialogVisible", val);
};

const formSubmit = () => {
  if (!accountCode.value) {
    isAccountCodeSnackBarVisible.value = true;
  } else if (!customerCode.value) {
    isCustomerCodeSnackBarVisible.value = true;
  } else if (!balanceDivision.value) {
    isBalanceDivisionSnackBarVisible.value = true;
  } else if (balanceDivision.value === "차변" && !leftDebitPrice.value) {
    isLeftDebitPriceSnackBarVisible.value = true;
  } else if (balanceDivision.value === "대변" && !rightCreditPrice.value) {
    isRightCreditPriceSnackBarVisible.value = true;
  } else {
    const journalArray: any = [
      {
        journalNo: journalNo.value,
        accountCode: accountCode.value,
        accountName: accountName.value,
        balanceDivision: balanceDivision.value,
        customerCode: customerCode.value,
        customerName: customerName.value,
        leftDebitPrice: leftDebitPrice.value,
        rightCreditPrice: rightCreditPrice.value,
      },
    ];

    emit("submit", journalArray);
    resetData();

    debitAvailable.value = false;
    creditAvailable.value = false;

    dialogModelValueUpdate(false);
  }
};
</script>

<template>
  <VDialog
    :model-value="propz.isDialogVisible"
    max-width="600"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        @click="generateJournalNo"
        :disabled="defenseJournal"
      >
        <VIcon start icon="tabler-message-plus" size="22" />
        분개추가
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard title="분개 추가">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="journalNo" label="분개일렬번호" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="accountCode"
              label="계정코드"
              @click="isAccountCodeDialogVisible = !isAccountCodeDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="accountName"
              label="계정과목"
              @click="isAccountNameDialogVisible = !isAccountNameDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppSelect
              v-model="balanceDivision"
              :items="options"
              label="대차구분"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="customerCode"
              label="거래처코드"
              @click="
                isCustomerCodeDialogVisible = !isCustomerCodeDialogVisible
              "
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="leftDebitPrice"
              label="차변"
              placeholder="0"
              type="number"
              :disabled="debitAvailable"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="rightCreditPrice"
              label="대변"
              placeholder="0"
              type="number"
              :disabled="creditAvailable"
            />
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
          <VIcon start icon="tabler-message-plus" size="22" />
          추가
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
  <!-- 계정코드 작성 요청 스낵바 -->
  <VSnackbar
    v-model="isAccountCodeSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    계정코드를 선택해주세요.
  </VSnackbar>
  <!-- 거래처코드 작성 요청 스낵바 -->
  <VSnackbar
    v-model="isCustomerCodeSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    거래처코드를 선택해주세요.
  </VSnackbar>
  <!-- 대차 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isBalanceDivisionSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    대차구분을 선택해주세요.
  </VSnackbar>
  <!-- 차변 입력 요청 스낵바 -->
  <VSnackbar
    v-model="isLeftDebitPriceSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    차변을 입력해주세요.
  </VSnackbar>
  <!-- 대변 입력 요청 스낵바 -->
  <VSnackbar
    v-model="isRightCreditPriceSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    대변을 입력해주세요.
  </VSnackbar>
</template>
