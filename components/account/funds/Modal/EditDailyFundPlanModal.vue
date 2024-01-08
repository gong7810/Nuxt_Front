<script setup lang="ts">
import AddFundCodeModal from "@/components/account/funds/Modal/AddFundCodeModal.vue";
import AddFundNameModal from "@/components/account/funds/Modal/AddFundNameModal.vue";
import AddFundCustomerCodeModal from "@/components/account/funds/Modal/AddFundCustomerCodeModal.vue";

const propz = defineProps(["isEditPlanDialogOpen", "planData"]);

const emit = defineEmits(["editFailed", "submit", "isDialogClose"]);

const isFundCodeDialogVisible = ref(false);
const isFundNameDialogVisible = ref(false);
const isFundCustomerCodeDialogVisible = ref(false);

const planNo = ref("");
const planDate = ref("");
const fundCode = ref("");
const fundName = ref("");
const customerCode = ref("");
const customerName = ref("");
const expenseReport = ref("");
const price = ref("");

// Dialog 창이 켜질때 해당값 할당
watch(
  () => propz.isEditPlanDialogOpen,
  () => {
    planNo.value = propz.planData.planNo;
    planDate.value = propz.planData.planDate;
    fundCode.value = propz.planData.fundCode;
    fundName.value = propz.planData.fundName;
    customerCode.value = propz.planData.customerCode;
    customerName.value = propz.planData.customerName;
    expenseReport.value = propz.planData.expenseReport;
    price.value = propz.planData.price.replace(/,/g, "");
  }
);

const fundCodeSelected = ({ selected, row }: any) => {
  fundCode.value = row.internalItem.columns.accountInnerCode;
  fundName.value = row.internalItem.columns.accountName;
};

const customerCodeSelected = ({ selected, row }: any) => {
  customerCode.value = row.internalItem.columns.customerCode;
  customerName.value = row.internalItem.columns.customerName;
};

const dialogClose = () => {
  emit("isDialogClose");
};

const formSubmit = () => {
  if (
    planDate.value === "" ||
    fundCode.value === "" ||
    customerCode.value === "" ||
    expenseReport.value === "" ||
    price.value === ""
  ) {
    emit("editFailed");
  } else {
    console.log(price.value);
    const editPlanArray: any = [
      {
        planNo: planNo.value,
        planDate: planDate.value,
        fundCode: fundCode.value,
        fundName: fundName.value,
        customerCode: customerCode.value,
        customerName: customerName.value,
        expenseReport: expenseReport.value,
        price: price.value,
      },
    ];

    emit("submit", editPlanArray);

    dialogClose();
  }
};
</script>

<template>
  <VDialog max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogClose" />

    <VCard title="자금계획 수정">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4" md="6">
            <VTextField v-model="planNo" label="계획번호" disabled />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField
              v-model="planDate"
              label="계획년월"
              type="date"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField
              v-model="fundCode"
              label="자금코드"
              @click="isFundCodeDialogVisible = !isFundCodeDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField
              v-model="fundName"
              label="계정과목"
              @click="isFundNameDialogVisible = !isFundNameDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField
              v-model="customerCode"
              label="거래처코드"
              @click="
                isFundCustomerCodeDialogVisible =
                  !isFundCustomerCodeDialogVisible
              "
            />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField v-model="customerName" label="거래처명" disabled />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField v-model="expenseReport" label="적요" />
          </VCol>
          <VCol cols="12" sm="4" md="6">
            <VTextField v-model="price" label="금액" />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="dialogClose">
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-tool" size="22" /> 저장
        </VBtn>
      </VCardText>
    </VCard>
    <AddFundCodeModal
      v-model="isFundCodeDialogVisible"
      @selected="fundCodeSelected"
      @dialogClose="isFundCodeDialogVisible = !isFundCodeDialogVisible"
    />
    <AddFundNameModal
      v-model="isFundNameDialogVisible"
      @selected="fundCodeSelected"
      @dialogClose="isFundNameDialogVisible = !isFundNameDialogVisible"
    />
    <AddFundCustomerCodeModal
      v-model="isFundCustomerCodeDialogVisible"
      @selected="customerCodeSelected"
      @dialogClose="
        isFundCustomerCodeDialogVisible = !isFundCustomerCodeDialogVisible
      "
    />
  </VDialog>
</template>
