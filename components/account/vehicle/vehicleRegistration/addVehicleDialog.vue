<script setup lang="ts">
import { vehicleStore } from "@/store/account/vehicle";
import DeptListDialog from "@/components/account/vehicle/common/DeptListDialog.vue";
import EmpListDialog from "@/components/account/vehicle/common/EmpListDialog.vue";

const emits = defineEmits(["addAlertEmits", "closeAddDialog"]);

const vehicleCode = ref("");
const vehicleNumber = ref("");
const vehicleType = ref("");
const deptCode = ref("");
const deptName = ref("");
const empCode = ref("");
const empName = ref("");
const availability = ref("");

const deptDialog = ref(false);
const empDialog = ref(false);

const addAlert = ref(false);
const addErrorAlert = ref(false);

const addVehicleData = async () => {
  const addVehicleInfo = {
    vehicleList: [
      {
        vehicleCode: vehicleCode.value,
        vehicleNumber: vehicleNumber.value,
        vehicleType: vehicleType.value,
        deptCode: deptCode.value,
        deptName: deptName.value,
        empCode: empCode.value,
        empName: empName.value,
        availability: availability.value,
      },
    ],
  };

  await vehicleStore().ADD_VEHICLE_LIST(addVehicleInfo);
  await vehicleStore().GET_DETAIL_VEHICLE_LIST();

  if (
    vehicleCode.value != "" &&
    vehicleNumber.value != "" &&
    availability.value != "" &&
    deptCode.value != "" &&
    empCode.value
  ) {
    addAlertEmits();
    closeAddDialog();

    setTimeout(() => {
      vehicleCode.value = "";
      vehicleNumber.value = "";
      vehicleType.value = "";
      deptCode.value = "";
      deptName.value = "";
      empCode.value = "";
      empName.value = "";
      availability.value = "";
    }, 500);
  } else {
    addErrorAlert.value = true;
  }
};

const selectedDept = ({ selected, row }: any) => {
  deptCode.value = row.internalItem.columns.deptCode;
  deptName.value = row.internalItem.columns.deptName;
};

const selectedEmp = ({ selected, row }: any) => {
  empCode.value = row.internalItem.columns.empCode;
  empName.value = row.internalItem.columns.empName;
};

const openDeptDialog = () => {
  deptDialog.value = true;
};

const openEmpDialog = () => {
  empDialog.value = true;
};

const closeDialog = () => {
  deptDialog.value = false;
  empDialog.value = false;
};

const closeAddDialog = () => {
  emits("closeAddDialog");
};

const addAlertEmits = () => {
  emits("addAlertEmits");
};

const rules = (v: any) => {
  return !!v || "필수 항목입니다.";
};
</script>

<template>
  <VDialog width="500">
    <VSnackbar
      v-model="addAlert"
      :timeout="2000"
      color="success"
      location="center"
    >
      <div align="center" style="color: white">
        <VIcon start icon="tabler-circle-check-filled" />추가 되었습니다.
      </div>
    </VSnackbar>
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

    <DialogCloseBtn @click="closeAddDialog" />
    <VCard>
      <VCardTitle style="margin-top: 15px; margin-left: 5px">
        차량등록
      </VCardTitle>
      <VRow style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="vehicleCode"
            label="차량코드"
            placeholder="차량코드"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="vehicleNumber"
            label="차량번호"
            placeholder="차량번호"
            :rules="[rules]"
          />
        </VCol>
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField v-model="vehicleType" label="차종" placeholder="차종" />
        </VCol>
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="deptCode"
            label="부서코드"
            placeholder="부서코드"
            :rules="[rules]"
            readonly
            @click="openDeptDialog"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="deptName"
            label="부서명"
            placeholder="부서명"
            :rules="[rules]"
            readonly
            @click="openDeptDialog"
          /> </VCol
        ><VCol />
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="empCode"
            label="사원코드"
            placeholder="사원코드"
            :rules="[rules]"
            readonly
            @click="openEmpDialog"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="empName"
            label="사원명"
            placeholder="사원명"
            :rules="[rules]"
            readonly
            @click="openEmpDialog"
          /> </VCol
        ><VCol>
          <VSelect
            v-model="availability"
            label="사용여부"
            :items="['사용', '미사용']"
            :rules="[rules]"
          />
        </VCol>
      </VRow>

      <VCardText class="d-flex justify-end">
        <VBtn @click="addVehicleData">
          <VIcon start icon="tabler-device-floppy" />저장
        </VBtn>
      </VCardText>
    </VCard>

    <DeptListDialog
      v-model="deptDialog"
      @selectedDept="selectedDept"
      @closeDialog="closeDialog"
    />
    <EmpListDialog
      v-model="empDialog"
      @selectedEmp="selectedEmp"
      @closeDialog="closeDialog"
    />
  </VDialog>
</template>
