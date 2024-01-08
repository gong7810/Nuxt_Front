<script setup lang="ts">
import { baseStore } from "@/store/account/base";

const emits = defineEmits(["closeDialog", "cancelBtn"]);
const updateErrorAlert = ref(false);

const closeDialog = (UPDATE: any) => {
  emits("closeDialog", UPDATE);
};

const cancelBtn = () => {
  emits("cancelBtn");
};

const updateCustomerData = async () => {
  const updateCustomerInfo = {
    customerList: [
      {
        customerCode: baseStore().selectedRow.customerCode,
        workplaceCode: baseStore().selectedRow.workplaceCode,
        customerName: baseStore().selectedRow.customerName,
        customerCeo: baseStore().selectedRow.customerCeo,
        businessLicenseNumber: baseStore().selectedRow.businessLicenseNumber,
        customerBusinessConditions:
          baseStore().selectedRow.customerBusinessConditions,
        customerBusinessItems: baseStore().selectedRow.customerBusinessItems,
        customerBasicAddress: baseStore().selectedRow.customerBasicAddress,
      },
    ],
  };

  await baseStore().UPDATE_CUSTOMER_CODE(updateCustomerInfo);

  if (baseStore().selectedRow.customerName === "")
    updateErrorAlert.value = true;
  else closeDialog("UPDATE");
};

const rules = (v) => {
  return !!v || "필수 항목입니다.";
};
</script>

<template>
  <VDialog width="600">
    <VSnackbar
      v-model="updateErrorAlert"
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
        <VCardTitle style="margin-top: 5px"> 거래처 수정 </VCardTitle>

        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerCode"
            label="거래처코드"
            disabled
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.workplaceCode"
            label="사업장코드"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerName"
            label="거래처명"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerCeo"
            label="대표자"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.businessLicenseNumber"
            label="사업자등록번호"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerBusinessConditions"
            label="업태"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerBusinessItems"
            label="종목"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="baseStore().selectedRow.customerBasicAddress"
            label="주소"
          />
        </VCol>
      </div>

      <VCardText class="d-flex justify-end">
        <VBtn style="margin-right: 15px" @click="cancelBtn">
          <VIcon start icon="tabler-arrow-back" />취소
        </VBtn>
        <VBtn @click="updateCustomerData">
          <VIcon start icon="tabler-text-plus" />확인
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
