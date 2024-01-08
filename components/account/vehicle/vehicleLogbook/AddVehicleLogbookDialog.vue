<script setup lang="ts">
import { vehicleStore } from "@/store/account/vehicle";

const props = defineProps(["items"]);
const emits = defineEmits(["refreshVehicleList", "closeAddLogbookDialog"]);

const vehicleCode = ref("");
const vehicleNumber = ref("");
const vehicleType = ref("");
const useDate = ref("");
const startTime = ref("");
const empCode = ref("");
const empName = ref("");
const deptCode = ref("");
const deptName = ref("");
const distance = ref("");
const businessDistance = ref("");
const personalDistance = ref("");
const beforeOdometer = ref("");
const afterOdometer = ref("");
const notes = ref("");

const addErrorAlert = ref(false);

const addVehicleLogbookData = async () => {
  const addVehicleLogbookInfo = {
    vehicleLogbook: [
      {
        vehicleCode: vehicleCode.value,
        useDate: useDate.value,
        startTime: startTime.value,
        empCode: empCode.value,
        empName: empName.value,
        deptCode: deptCode.value,
        deptName: deptName.value,
        distance: distance.value,
        businessDistance: businessDistance.value,
        personalDistance: personalDistance.value,
        beforeOdometer: beforeOdometer.value,
        afterOdometer: afterOdometer.value,
        notes: notes.value,
      },
    ],
  };

  await vehicleStore().ADD_VEHICLE_LOGBOOK_LIST(addVehicleLogbookInfo);
  await vehicleStore().GET_VEHICLE_LIST();

  if (
    vehicleCode.value != "" &&
    useDate.value != "" &&
    startTime.value != "" &&
    distance.value != ""
  ) {
    refreshVehicleList();
    closeAddLogbookDialog();

    setTimeout(() => {
      vehicleCode.value = "";
      vehicleNumber.value = "";
      vehicleType.value = "";
      useDate.value = "";
      startTime.value = "";
      empCode.value = "";
      empName.value = "";
      deptCode.value = "";
      deptName.value = "";
      distance.value = "";
      businessDistance.value = "";
      personalDistance.value = "";
      beforeOdometer.value = "";
      afterOdometer.value = "";
      notes.value = "";
    }, 500);
  } else {
    addErrorAlert.value = true;
  }
};

const selectedList = (value) => {
  const matchedItem = vehicleStore().vehicleList.find(
    (item) => item.vehicleCode === value
  );

  if (matchedItem) {
    vehicleNumber.value = matchedItem.vehicleNumber;
    vehicleType.value = matchedItem.vehicleType;
    empCode.value = matchedItem.empCode;
    empName.value = matchedItem.empName;
    deptCode.value = matchedItem.deptCode;
    deptName.value = matchedItem.deptName;
  }
};

const refreshVehicleList = () => {
  emits("refreshVehicleList");
};

const closeAddLogbookDialog = () => {
  emits("closeAddLogbookDialog");
};

const rules = (v: any) => {
  return !!v || "필수 항목입니다.";
};

const distanceCalculate = () => {
  distance.value = afterOdometer.value - beforeOdometer.value;
};

const personalDistanceCalculate = () => {
  personalDistance.value = distance.value - businessDistance.value;
};

const businessDistanceCalculate = () => {
  businessDistance.value = distance.value - personalDistance.value;
};
</script>

<template>
  <VDialog width="650">
    <DialogCloseBtn @click="closeAddLogbookDialog" />

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
      <VCardTitle style="margin-top: 15px; margin-left: 5px">
        운행기록
      </VCardTitle>

      <VRow style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
        <VCol>
          <VSelect
            v-model="vehicleCode"
            :items="props.items"
            label="차량코드"
            placeholder="차량코드"
            :rules="[rules]"
            @update:modelValue="selectedList"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="vehicleNumber"
            label="차량번호"
            placeholder="차량번호"
            readonly
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="vehicleType"
            label="차종"
            placeholder="차종"
            readonly
          />
        </VCol>
      </VRow>
      <VRow style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="useDate"
            label="사용일자"
            placeholder="사용일자"
            type="date"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="startTime"
            label="시작시간"
            placeholder="시작시간"
            type="time"
            :rules="[rules]"
          />
        </VCol>
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="empCode"
            label="사원코드"
            placeholder="사원코드"
            readonly
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="empName"
            label="사원명"
            placeholder="사원명"
            readonly
          /> </VCol
        ><VCol />
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="deptCode"
            label="부서코드"
            placeholder="부서코드"
            readonly
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="deptName"
            label="부서명"
            placeholder="부서명"
            readonly
          /> </VCol
        ><VCol />
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="beforeOdometer"
            label="주행 전 계기판의 거리(km)"
            placeholder="주행 전 계기판의 거리(km)"
            @keyup="distanceCalculate"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="afterOdometer"
            label="주행 후 계기판의 거리(km)"
            placeholder="주행 후 계기판의 거리(km)"
            @keyup="distanceCalculate"
          />
        </VCol>
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="distance"
            label="주행거리(km)"
            placeholder="주행거리(km)"
            :rules="[rules]"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="businessDistance"
            label="업무용 사용거리(km)"
            placeholder="업무용 사용거리(km)"
            @keyup="personalDistanceCalculate"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="personalDistance"
            label="비업무용 사용거리(km)"
            placeholder="비업무용 사용거리(km)"
            @keyup="businessDistanceCalculate"
          />
        </VCol>
      </VRow>
      <VRow style="margin-left: 10px; margin-right: 10px">
        <VCol>
          <VTextField
            v-model="notes"
            label="비고"
            placeholder="비고"
            style="width: 400px"
          />
        </VCol>
      </VRow>

      <VCardText class="d-flex justify-end">
        <VBtn @click="addVehicleLogbookData">
          <VIcon start icon="tabler-device-floppy" />저장
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
