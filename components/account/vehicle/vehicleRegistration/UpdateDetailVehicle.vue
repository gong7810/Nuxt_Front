<script setup lang="ts">
import { vehicleStore } from "@/store/account/vehicle";
import AssetListDialog from "@/components/account/vehicle/common/AssetListDialog.vue";
import CustomerListDialog from "@/components/account/vehicle/common/CustomerListDialog.vue";

const props = defineProps(["vehicleList", "item"]);
const emits = defineEmits(["deleteAlertEmits"]);

const vehicleDetailList = vehicleStore().vehicleDetailList.find(
  (item: any) => item.vehicleCode === props.item.vehicleCode
);

const accountCode = ref("0208");
const accountName = ref("차량운반구");

const assetDialog = ref(false);
const customerDialog = ref(false);

const updateAlert = ref(false);

const openAssetDialog = () => {
  assetDialog.value = true;
};

const openCustomerDialog = () => {
  customerDialog.value = true;
};

const closeDialog = () => {
  assetDialog.value = false;
  customerDialog.value = false;
};

const updateVehicleDetailData = async (item: any) => {
  const updateVehicleDetailInfo = {
    vehicleDetailList: [
      {
        vehicleCode: item.vehicleCode,
        accountCode: accountCode.value,
        accountName: accountName.value,
        assetCode: vehicleDetailList.assetCode,
        assetName: vehicleDetailList.assetName,
        acquisitionDate: vehicleDetailList.acquisitionDate,
        disposalDate: vehicleDetailList.disposalDate,
        expenseCategory: vehicleDetailList.expenseCategory,
        insuranceStatus: vehicleDetailList.insuranceStatus,
        customerCode: vehicleDetailList.customerCode,
        insuranceCompany: vehicleDetailList.insuranceCompany,
        insuranceStartPeriod: vehicleDetailList.insuranceStartPeriod,
        insuranceEndPeriod: vehicleDetailList.insuranceEndPeriod,
        leaseType: vehicleDetailList.leaseType,
        leaseStartPeriod: vehicleDetailList.leaseStartPeriod,
        leaseEndPeriod: vehicleDetailList.leaseEndPeriod,
        usageType: vehicleDetailList.usageType,
      },
    ],
  };

  await vehicleStore().UPDATE_VEHICLE_DETAIL_LIST(updateVehicleDetailInfo);

  updateAlert.value = true;
};

const deleteVehicle = async (item: any) => {
  const index = props.vehicleList.findIndex(
    (v) => v.vehicleCode === item.vehicleCode
  );

  if (index !== -1) {
    deleteAlertEmits();
    props.vehicleList.splice(index, 1);
    await vehicleStore().DELETE_VEHICLE_LIST(item.vehicleCode);
  }
};

const selectedAsset = ({ selected, row }: any) => {
  vehicleDetailList.assetCode = row.internalItem.columns.assetCode;
  vehicleDetailList.assetName = row.item.assetName;
  vehicleDetailList.acquisitionDate = row.item.progress;
};

const selectedCustomer = ({ selected, row }: any) => {
  vehicleDetailList.customerCode = row.item.customerCode;
  vehicleDetailList.insuranceCompany = row.internalItem.columns.customerName;
};

const deleteConfirmDialog = ref(false);

const deleteConfirm = () => {
  deleteConfirmDialog.value = true;
};

const deleteAlertEmits = () => {
  emits("deleteAlertEmits");
};
</script>

<template>
  <VSnackbar
    v-model="updateAlert"
    :timeout="2000"
    color="success"
    location="center"
  >
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />수정 되었습니다.
    </div>
  </VSnackbar>

  <VRow style="margin-top: 5px; margin-right: 30px">
    <VCol>
      <p class="text-2xl mb-6" style="margin-top: 20px; margin-left: 15px">
        상세정보
      </p>
    </VCol>
    <VCol style="margin-top: 10px" class="d-flex justify-end">
      <VBtn
        size="large"
        variant="text"
        icon="tabler-pencil-plus"
        @click="() => updateVehicleDetailData(item)"
      />

      <VDialog v-model="deleteConfirmDialog" persistent width="auto">
        <template #activator="{ props }">
          <VBtn
            size="large"
            v-bind="props"
            variant="text"
            icon="tabler-trash"
            @click="deleteConfirm"
          />
        </template>
        <VCard>
          <VCardTitle style="margin-top: 20px">
            "{{ props.item.vehicleNumber }}" {{ props.item.vehicleType }} 를(을)
            삭제할까요?
          </VCardTitle>
          <VCardText>
            차량의 상세정보와 운행기록을 포함한 모든 데이터가 지워집니다.
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn
              color="primary"
              variant="text"
              @click="deleteConfirmDialog = false"
            >
              취소
            </VBtn>
            <VBtn
              color="error"
              variant="text"
              @click="() => deleteVehicle(item)"
            >
              삭제
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCol>
  </VRow>

  <VRow style="margin-top: 5px; margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">계정과목 :</h3>
    <VCol>
      <VTextField
        v-model="accountCode"
        readonly
        style="margin-left: 10px; width: 150px"
      />
    </VCol>
    <VCol>
      <VTextField v-model="accountName" readonly style="width: 250px" />
    </VCol>
    <VBtn
      style="margin-top: 5px"
      icon="tabler-wifi-0"
      variant="plain"
      :ripple="false"
      color="black"
    />
    <VCol /><VCol />
    <h3 style="margin-top: 20px">취득일자 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.acquisitionDate"
        type="date"
        style="width: 250px"
      /> </VCol
    ><VCol /><VCol /><VCol />
  </VRow>

  <VRow style="margin-top: 5px; margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">고정자산 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.assetCode"
        readonly
        style="margin-left: 10px; width: 150px"
      />
    </VCol>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.assetName"
        readonly
        style="width: 250px"
      />
    </VCol>
    <VBtn
      style="margin-top: 5px"
      icon="tabler-search"
      variant="text"
      @click="openAssetDialog"
    />
    <AssetListDialog
      v-model="assetDialog"
      @selectedAsset="selectedAsset"
      @closeDialog="closeDialog"
    />
    <VCol /><VCol />
    <h3 style="margin-top: 20px">처분일자 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.disposalDate"
        type="date"
        style="width: 250px"
      /> </VCol
    ><VCol /><VCol /><VCol />
  </VRow>

  <VRow style="margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">경비구분 :</h3>
    <VCol>
      <VSelect
        v-model="vehicleDetailList.expenseCategory"
        :items="['0. 800번대', '1. 500번대', '2. 600번대', '3. 700번대']"
        style="margin-left: 10px; width: 200px"
      />
    </VCol>
  </VRow>

  <VRow style="margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">보험여부 :</h3>
    <VCol>
      <VSelect
        v-model="vehicleDetailList.insuranceStatus"
        :items="['0. 부', '1. 여']"
        style="margin-left: 10px; width: 100px"
      /> </VCol
    ><VCol />
    <h3 style="margin-top: 20px">보험회사 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.customerCode"
        readonly
        style="margin-left: 10px; width: 150px"
      />
    </VCol>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.insuranceCompany"
        readonly
        style="width: 250px"
      />
    </VCol>
    <VBtn
      style="margin-top: 5px"
      icon="tabler-search"
      variant="text"
      @click="openCustomerDialog"
    />
    <CustomerListDialog
      v-model="customerDialog"
      @selectedCustomer="selectedCustomer"
      @closeDialog="closeDialog"
    />
    <VCol /><VCol /><VCol /><VCol /><VCol /><VCol />
  </VRow>

  <VRow style="margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">보험기간 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.insuranceStartPeriod"
        type="date"
        style="margin-left: 10px; width: 250px"
      />
    </VCol>
    <h2 style="margin-top: 15px">~</h2>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.insuranceEndPeriod"
        type="date"
        style="width: 250px"
      /> </VCol
    ><VCol /><VCol /><VCol />
  </VRow>

  <VRow style="margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">임차구분 :</h3>
    <VCol>
      <VSelect
        v-model="vehicleDetailList.leaseType"
        :items="[
          '0. 자가',
          '1. 렌트',
          '2. 리스',
          '3. 직원명의',
          '4. 직원소유타인명의',
        ]"
        style="margin-left: 10px; width: 300px"
      />
    </VCol>
  </VRow>

  <VRow style="margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">임차기간 :</h3>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.leaseStartPeriod"
        type="date"
        style="margin-left: 10px; width: 250px"
      />
    </VCol>
    <h2 style="margin-top: 15px">~</h2>
    <VCol>
      <VTextField
        v-model="vehicleDetailList.leaseEndPeriod"
        type="date"
        style="width: 250px"
      /> </VCol
    ><VCol /><VCol /><VCol />
  </VRow>

  <VRow style="margin-bottom: 50px; margin-left: 50px; margin-right: 50px">
    <h3 style="margin-top: 20px">사용구분 :</h3>
    <VCol>
      <VSelect
        v-model="vehicleDetailList.usageType"
        :items="['0. 일반업무용', '1. 출·퇴근용']"
        style="margin-left: 10px; width: 200px"
      />
    </VCol>
  </VRow>
</template>
