<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { vehicleStore } from "@/store/account/vehicle";

const vehicleList = ref([]);
const vehicleLogbookList = ref([]);

const items = ref([]);

const addLogbookDialog = ref(false);
const addAlert = ref(false);
const deleteAlert = ref(false);

const headers = [
  { title: "차량코드", key: "vehicleCode", width: 80 },
  { title: "차량번호", key: "vehicleNumber", width: 110 },
  { title: "차종", key: "vehicleType", width: 150 },
  { title: "부서코드", value: "deptCode", width: 100 },
  { title: "부서명", value: "deptName", width: 100 },
  { title: "사원코드", key: "empCode", width: 100 },
  { title: "사원명", key: "empName", width: 100 },
  { title: "사용여부", key: "availability", width: 110 },
  { title: "주행거리(km)", key: "distance", width: 120 },
  { title: "업무용 사용거리(km)", key: "businessDistance", width: 110 },
  { title: "업무사용비율(%)", key: "businessUsageRatio", width: 120 },
];

const headers2 = [
  { title: "사용일자", key: "useDate", align: "center", width: 120 },
  { title: "시작시간", key: "startTime", width: 90 },
  { title: "사원코드", key: "empCode", width: 90 },
  { title: "사원명", key: "empName", width: 100 },
  { title: "부서코드", key: "deptCode", width: 90 },
  { title: "부서명", key: "deptName", width: 100 },
  { title: "주행거리(km)", key: "distance", width: 80 },
  { title: "업무용 사용거리(km)", key: "businessDistance", width: 110 },
  { title: "비업무용 사용거리(km)", key: "personalDistance", width: 110 },
  { title: "주행 전 계기판의 거리(km)", key: "beforeOdometer", width: 110 },
  { title: "주행 후 계기판의 거리(km)", key: "afterOdometer", width: 110 },
  { title: "비고", key: "notes", width: 170 },
  { title: "", key: "actions", align: "center" },
];

onMounted(async () => {
  await vehicleStore().GET_VEHICLE_LIST();
  vehicleList.value = vehicleStore().vehicleList;
  items.value = vehicleStore().vehicleList.map((item) => item.vehicleCode);

  await vehicleStore().GET_DEPT_LIST();
  await vehicleStore().GET_EMP_LIST();
});

const refreshVehicleList = () => {
  vehicleList.value = vehicleStore().vehicleList;
  addAlert.value = true;
};

const openAddVehicleLogbookDialog = () => {
  addLogbookDialog.value = true;
};

const closeAddLogbookDialog = () => {
  addLogbookDialog.value = false;
};

const selectedVehicle = async (selected, row) => {
  const vehicleCode = row.internalItem.columns.vehicleCode;

  await vehicleStore().GET_VEHICLE_LOGBOOK_LIST(vehicleCode);
  vehicleLogbookList.value = vehicleStore().vehicleLogbook;
};

const deleteLog = async (item, index) => {
  const matchedVehicleCode = vehicleLogbookList.value.filter(
    (v) => v.vehicleCode === item.vehicleCode
  );
  const matchedUseDate = vehicleLogbookList.value.filter(
    (v) => v.useDate === item.useDate
  );
  const matchedItems = matchedVehicleCode && matchedUseDate;
  if (index != -1) {
    vehicleLogbookList.value.splice(index, 1);
    await vehicleStore().DELETE_VEHICLE_LOGBOOK_LIST(
      matchedItems[0].vehicleCode,
      matchedItems[0].useDate
    );
  }
  deleteAlert.value = true;
  await vehicleStore().GET_VEHICLE_LIST();
  vehicleList.value = vehicleStore().vehicleList;
};
</script>

<template>
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
    v-model="deleteAlert"
    :timeout="2000"
    color="success"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />삭제 되었습니다.
    </div>
  </VSnackbar>

  <VDataTable
    :headers="headers"
    :items="vehicleList"
    :items-per-page="10"
    style="margin-bottom: 30px"
    @click:row="selectedVehicle"
  >
    <template #top>
      <VToolbar flat>
        <VToolbarTitle>업무용승용차 운행기록부</VToolbarTitle>
        <VBtn size="large" @click="openAddVehicleLogbookDialog">
          <VIcon start icon="tabler-playlist-add" />추가
        </VBtn>
      </VToolbar>
    </template>
  </VDataTable>

  <VDataTable
    :headers="headers2"
    :items="vehicleLogbookList"
    :items-per-page="10"
  >
    <template #item="{ item, index }">
      <tr>
        <td v-for="header in headers2" :key="header.key">
          {{ item[header.key] }}
          <template v-if="header.key === 'actions'">
            <td>
              <VBtn
                size="small"
                variant="text"
                icon="tabler-trash"
                @click="deleteLog(item, index)"
              />
            </td>
          </template>
        </td>
      </tr>
    </template>
  </VDataTable>

  <AddVehicleLogbookDialog
    v-model="addLogbookDialog"
    :items="items"
    @refreshVehicleList="refreshVehicleList"
    @closeAddLogbookDialog="closeAddLogbookDialog"
  />
</template>
