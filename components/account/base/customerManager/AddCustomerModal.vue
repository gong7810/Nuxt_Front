<script setup lang="ts">
import { baseStore } from "@/store/account/base";

const emits = defineEmits(["closeDialog", "cancelBtn"]);
const customerCode = ref("");
const workplaceCode = ref("");
const customerName = ref("");
const customerCeo = ref("");
const businessLicenseNumber = ref("");
const customerBusinessConditions = ref("");
const customerBusinessItems = ref("");
const customerBasicAddress = ref("");

const addErrorAlert = ref(false);

const closeDialog = (ADD) => {
  emits("closeDialog", ADD);
};

const cancelBtn = () => {
  emits("cancelBtn");
};

const addCustomerData = async () => {
  const addCustomerInfo = {
    customerList: [
      {
        customerCode: customerCode.value,
        workplaceCode: workplaceCode.value,
        customerName: customerName.value,
        customerCeo: customerCeo.value,
        businessLicenseNumber: businessLicenseNumber.value,
        customerBusinessConditions: customerBusinessConditions.value,
        customerBusinessItems: customerBusinessItems.value,
        customerBasicAddress: customerBasicAddress.value,
      },
    ],
  };

  await baseStore().ADD_CUSTOMER_CODE(addCustomerInfo);

  if (customerCode.value === "" || customerName.value === "")
    addErrorAlert.value = true;
  else closeDialog("ADD");
};

const rules = (v) => {
  return !!v || "필수 항목입니다.";
};
</script>

<template>
  <VDialog width="600">
    <VSnackbar
      v-model="addErrorAlert"
      :timeout="2000"
      color="error"
      location="center"
    >
      <div align="center" style="color: white">
        <VIcon start icon="tabler-alert-circle-filled" />값을 입력해주세요.
      </div>
    </VSnackbar>

    <VCard>
      <div style="margin-left: 10px; margin-right: 10px">
        <VCardTitle style="margin-top: 5px"> 거래처 추가 </VCardTitle>

        <VCol>
          <VTextField
            v-model="customerCode"
            label="거래처코드"
            placeholder="거래처코드"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="workplaceCode"
            label="사업장코드"
            placeholder="사업장코드"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="customerName"
            label="거래처명"
            placeholder="거래처명"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="customerCeo"
            label="대표자"
            placeholder="대표자"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="businessLicenseNumber"
            label="사업자등록번호"
            placeholder="사업자등록번호"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="customerBusinessConditions"
            label="업태"
            placeholder="업태"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="customerBusinessItems"
            label="종목"
            placeholder="종목"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="customerBasicAddress"
            label="주소"
            placeholder="주소"
          />
        </VCol>
      </div>

      <VCardText class="d-flex justify-end">
        <VBtn style="margin-right: 15px" @click="cancelBtn">
          <VIcon start icon="tabler-arrow-back" />취소
        </VBtn>
        <VBtn @click="addCustomerData">
          <VIcon start icon="tabler-text-plus" />확인
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
