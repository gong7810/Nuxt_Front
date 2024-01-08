<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

import AddCustomerModal from "@/components/account/base/customerManager/AddCustomerModal.vue";
import UpdateCustomerModal from "@/components/account/base/customerManager/UpdateCustomerModal.vue";

const selectedCustomer = ref([]);

const accountCustomerList = ref([]);
const addDialogVisible = ref(false);
const updateDialogVisible = ref(false);
const updateErrorAlert = ref(false);
const deleteErrorAlert = ref(false);
const addSuccessAlert = ref(false);
const updateSuccessAlert = ref(false);
const deleteSuccessAlert = ref(false);

const isDeleteDialogVisibie = ref(false);
const isDeleteSuccessVisible = ref(false);

const headers = [
  { title: "거래처코드", key: "customerCode" },
  { title: "사업장코드", key: "workplaceCode" },
  { title: "거래처명", key: "customerName" },
  { title: "대표자", key: "customerCeo" },
  { title: "사업자등록번호", key: "businessLicenseNumber" },
  { title: "업태", key: "customerBusinessConditions" },
  { title: "종목", key: "customerBusinessItems" },
  { title: "주소", key: "customerBasicAddress" },
];

// onMounted(async () => {
//   accountCustomerList.value = await baseStore().SEARCH_CUSTOMER_CODE();
// });

watch(selectedCustomer, async (selectedValue: any) => {
  baseStore().selectedRow = toRaw(selectedValue[0]);
});

const closeDialog = async (value: any) => {
  if (value === "ADD") {
    addDialogVisible.value = false;
    addSuccessAlert.value = true;
  } else if (value === "UPDATE") {
    updateDialogVisible.value = false;
    updateSuccessAlert.value = true;
  }
  await baseStore().SEARCH_CUSTOMER_CODE();
  accountCustomerList.value = baseStore().accountCustomerList;
};

const cancelBtn = () => {
  addDialogVisible.value = false;
  updateDialogVisible.value = false;
};

const searchCustomerCode = async () => {
  await baseStore().SEARCH_CUSTOMER_CODE();
  accountCustomerList.value = baseStore().accountCustomerList;
};

const openAddCustomerModal = () => {
  addDialogVisible.value = true;
};

const openUpdateCustomerModal = () => {
  if (selectedCustomer.value.length === 0) updateErrorAlert.value = true;
  else updateDialogVisible.value = true;
};

const deleteCustomerCode = async () => {
  isDeleteDialogVisibie.value = false;

  const customerCode = selectedCustomer.value[0].customerCode;

  await baseStore().DELETE_CUSTOMER_CODE(customerCode);

  await baseStore().SEARCH_CUSTOMER_CODE();
  accountCustomerList.value = baseStore().accountCustomerList;

  selectedCustomer.value = [];

  deleteSuccessAlert.value = true;
};

const deleteCustomerCheck = () => {
  if (selectedCustomer.value.length === 0) 
    deleteErrorAlert.value = true;
  else isDeleteDialogVisibie.value = true;
}
</script>

<template>
  <p class="text-2xl mb-6">거래처 관리</p>

  <VSnackbar
    v-model="updateErrorAlert"
    :timeout="2000"
    color="error"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-alert-circle-filled" />수정할 거래처를
      선택해주세요.
    </div>
  </VSnackbar>
  <VSnackbar
    v-model="deleteErrorAlert"
    :timeout="2000"
    color="error"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-alert-circle-filled" />삭제할 거래처를
      선택해주세요.
    </div>
  </VSnackbar>
  <VSnackbar
    v-model="addSuccessAlert"
    :timeout="2000"
    color="success"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />추가 되었습니다.
    </div>
  </VSnackbar>
  <VSnackbar
    v-model="updateSuccessAlert"
    :timeout="2000"
    color="success"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />수정 되었습니다.
    </div>
  </VSnackbar>
  <VSnackbar
    v-model="deleteSuccessAlert"
    :timeout="2000"
    color="success"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />삭제 되었습니다.
    </div>
  </VSnackbar>

  <VBtn color="primary" class="btn" @click="searchCustomerCode">
    <VIcon start icon="tabler-search" />조회
  </VBtn>
  <VBtn color="primary" class="btn" @click="openAddCustomerModal">
    <VIcon start icon="tabler-playlist-add" />추가
  </VBtn>
  <VBtn color="primary" class="btn" @click="openUpdateCustomerModal">
    <VIcon start icon="tabler-user-edit" />수정
  </VBtn>
  <VBtn color="primary" class="btn" @click="deleteCustomerCheck">
    <VIcon start icon="tabler-trash" />삭제
  </VBtn>


  
  <VDataTable
    v-model="selectedCustomer"
    :headers="headers"
    :items="accountCustomerList"
    :items-per-page="15"
    select-strategy="single"
    return-object
    show-select
  />

  <AddCustomerModal
    v-model="addDialogVisible"
    @closeDialog="closeDialog('ADD')"
    @cancelBtn="cancelBtn"
  />
  <UpdateCustomerModal
    v-model="updateDialogVisible"
    @closeDialog="closeDialog('UPDATE')"
    @cancelBtn="cancelBtn"
  />
      <!-- 거래처 삭제 확인 Dialog -->
      <VDialog v-model="isDeleteDialogVisibie" width="400">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDeleteDialogVisibie = !isDeleteDialogVisibie" />

      <!-- Dialog Content -->
      <VCard title="거래처삭제">
        <VCardText> 해당 거래처를 삭제하시겠습니까? </VCardText>
        <VCardText class="d-flex justify-end">
          <VBtn
            color="blue-grey"
            variant="tonal"
            style="margin-left: 10px"
            @click="isDeleteDialogVisibie = false"
          >
            <VIcon start icon="tabler-x" size="22" />
            취소
          </VBtn>
          <VBtn style="margin-left: 10px" @click="deleteCustomerCode">
            <VIcon start icon="tabler-trash" size="22" />
            삭제
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
</template>

<style>
.btn {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>
