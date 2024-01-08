<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { vehicleStore } from "@/store/account/vehicle";
import { assetsStore } from "@/store/account/assets";
import { baseStore } from "@/store/account/base";
import AddVehicleDialog from "@/components/account/vehicle/vehicleRegistration/AddVehicleDialog.vue";
import UpdateDetailVehicle from "@/components/account/vehicle/vehicleRegistration/UpdateDetailVehicle.vue";

const vehicleList = ref([]);
const vehicleDetailList = ref([]);

const fixedAssetsCode = "0208";
const fixedAssetsName = "차량운반구";

const addDialog = ref(false);
const addAlert = ref(false);
const deleteAlert = ref(false);

const headers = [
  { title: "", key: "data-table-expand" },
  { title: "차량코드", key: "vehicleCode" },
  { title: "차량번호", key: "vehicleNumber", width: 150 },
  { title: "차종", key: "vehicleType", width: 120 },
  { title: "부서코드", value: "deptCode" },
  { title: "부서명", value: "deptName" },
  { title: "사원코드", key: "empCode" },
  { title: "사원명", key: "empName" },
  { title: "사용여부", key: "availability" },
];

onMounted(async () => {
  await vehicleStore().GET_VEHICLE_LIST();
  vehicleList.value = vehicleStore().vehicleList;
  await vehicleStore().GET_DETAIL_VEHICLE_LIST();
  vehicleDetailList.value = vehicleStore().vehicleDetailList;

  await vehicleStore().GET_DEPT_LIST();
  await vehicleStore().GET_EMP_LIST();
  await assetsStore().SEARCH_FIXED_ASSETS_CODE_LIST({
    fixedAssetsCode,
    fixedAssetsName,
  });
  await baseStore().SEARCH_CUSTOMER_CODE();
});

const expandedRow = async (value) => {
  console.log(vehicleDetailList.value);
};

const openAddVehicleDialog = () => {
  addDialog.value = true;
};

const closeAddVehicleDialog = async () => {
  addDialog.value = false;

  await vehicleStore().GET_VEHICLE_LIST();
  vehicleList.value = vehicleStore().vehicleList;
};

const addAlertEmits = () => {
  addAlert.value = true;
};

const deleteAlertEmits = () => {
  deleteAlert.value = true;
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
    item-value="vehicleCode"
    show-expand
    :items-per-page="10"
    @update:expanded="expandedRow"
  >
    <template v-slot:top>
      <VToolbar flat>
        <VToolbarTitle>업무용승용차 차량등록</VToolbarTitle>
        <VBtn size="large" @click="openAddVehicleDialog">
          <VIcon start icon="tabler-playlist-add" />
          추가
        </VBtn>
      </VToolbar>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <UpdateDetailVehicle
            :vehicleList="vehicleList"
            :item="item"
            @deleteAlertEmits="deleteAlertEmits"
          />
        </td>
      </tr>
    </template>
  </VDataTable>

  <AddVehicleDialog
    v-model="addDialog"
    @addAlertEmits="addAlertEmits"
    @closeAddDialog="closeAddVehicleDialog"
  />
</template>
