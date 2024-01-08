<script setup lang="ts">
import { assetsStore } from "@/store/account/assets";

const props = defineProps(["detailCardVisible", "items"]);

const accountCode = ref("");
const accountName = ref("");
const assetsCode = ref("");
const assetsName = ref("");
const progress = ref("");

const acquisitionCost = ref("");
const amortizationWay = ref("");
const amortizationWayList = ref(["정액법", "정률법"]);
const depreciation = ref("");
const bookValue = ref("");
const usefulLife = ref("");
const amortizationFinalYear = ref("");

const acquisitionQuantity = ref("");
const changeQuantity = ref("");
const remainQuantity = ref("");
const department = ref("");
const departmentList = ref(["재경부", "영업부", "생산부", "구매자재부"]);

const amortizationRate = ref("");
const months = ref("12");
const normalAmortization = ref("");
const accumulatedAmortization = ref("");
const bookValueEnd = ref("");

const year = new Date().getFullYear().toString().slice(-2);
const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
const date = new Date().getDate().toString().padStart(2, "0");

const addAlert = ref(false);
const addErrorAlert = ref(false);
const updateAlert = ref(false);
const deleteAlert = ref(false);

const formReset = () => {
  accountCode.value = "";
  assetsCode.value = "";
  assetsName.value = "";
  progress.value = "";

  acquisitionCost.value = "";
  depreciation.value = "";
  bookValue.value = "";
  usefulLife.value = "";
  amortizationFinalYear.value = "";

  acquisitionQuantity.value = "";
  changeQuantity.value = "";
  remainQuantity.value = "";
  department.value = "";

  amortizationRate.value = "";
  normalAmortization.value = "";
  accumulatedAmortization.value = "";
  bookValueEnd.value = "";
};

const addFixedAssetsCode = async () => {
  const data = {
    accountCode: accountCode.value,
    accountName: accountName.value,
    assetCode: assetsCode.value,
    assetName: assetsName.value,
    progress: progress.value,
    finalizeStatus: "진행",
    checkStatus: "insert",

    currentAssetDetailBean: [
      {
        assetCode: assetsCode.value,
        acquisitionCost: acquisitionCost.value,
        amortizationWay: amortizationWay.value,
        depreciation: depreciation.value,
        bookValue: bookValue.value,
        usefulLife: usefulLife.value,
        amortizationFinalYear: amortizationFinalYear.value,

        acquisitionQuantity: acquisitionQuantity.value,
        changeQuantity: changeQuantity.value,
        remainQuantity: remainQuantity.value,
        department: department.value,

        amortizationRate: amortizationRate.value,
        month: months.value,
        normalAmortization: normalAmortization.value,
        accumulatedAmortization: accumulatedAmortization.value,
        bookValueEnd: bookValueEnd.value,
      },
    ],
  };

  await assetsStore().ADD_FIXED_ASSETS_CODE_LIST({ data });

  if (
    accountCode.value != "" &&
    assetsName.value != "" &&
    acquisitionCost.value != ""
  )
    addAlert.value = true;
  else addErrorAlert.value = true;
};

const updateFixedAssetsCode = async () => {
  const data = {
    accountCode: assetsStore().selectedRow.accountCode,
    accountName: assetsStore().selectedRow.accountName,
    assetCode: assetsStore().selectedRow.assetCode,
    assetName: assetsStore().selectedRow.assetName,
    progress: assetsStore().selectedRow.progress,
    finalizeStatus: "진행",
    checkStatus: "update",

    currentAssetDetailBean: [
      {
        assetCode: assetsStore().selectedRow.assetCode,
        acquisitionCost:
          assetsStore().searchFixedAssetsDetailList[0].acquisitionCost,
        amortizationWay:
          assetsStore().searchFixedAssetsDetailList[0].amortizationWay,
        depreciation: assetsStore().searchFixedAssetsDetailList[0].depreciation,
        bookValue: assetsStore().searchFixedAssetsDetailList[0].bookValue,
        usefulLife: assetsStore().searchFixedAssetsDetailList[0].usefulLife,
        amortizationFinalYear:
          assetsStore().searchFixedAssetsDetailList[0].amortizationFinalYear,

        acquisitionQuantity:
          assetsStore().searchFixedAssetsDetailList[0].acquisitionQuantity,
        changeQuantity:
          assetsStore().searchFixedAssetsDetailList[0].changeQuantity,
        remainQuantity:
          assetsStore().searchFixedAssetsDetailList[0].remainQuantity,
        department: assetsStore().selectedRow.department,

        amortizationRate:
          assetsStore().searchFixedAssetsDetailList[0].amortizationRate,
        month: assetsStore().searchFixedAssetsDetailList[0].month,
        normalAmortization:
          assetsStore().searchFixedAssetsDetailList[0].normalAmortization,
        accumulatedAmortization:
          assetsStore().searchFixedAssetsDetailList[0].accumulatedAmortization,
        bookValueEnd: assetsStore().searchFixedAssetsDetailList[0].bookValueEnd,
      },
    ],
  };

  await assetsStore().UPDATE_FIXED_ASSETS_CODE_LIST({ data });

  updateAlert.value = true;
};

const deleteFixedAssetsCode = async () => {
  assetsCode.value = assetsStore().selectedRow.assetCode;
  await assetsStore().DELETE_FIXED_ASSETS_CODE_LIST({ assetsCode });

  deleteAlert.value = true;
};

const selectedAccountName = async (value: any) => {
  const matchedItem = assetsStore().fixedAssetsCodeList.find(
    (item: any) => item.accountName === value
  );

  if (matchedItem) {
    accountCode.value = matchedItem.accountCode;
    accountName.value = matchedItem.accountName;
    assetsStore().selectedRow.accountCode = matchedItem.accountCode;
    assetsStore().selectedRow.accountName = matchedItem.accountName;

    // 자산코드
    const getRandomLetters = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";

      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);

        result += alphabet[randomIndex];
      }

      return result;
    };

    assetsCode.value = `${year}${month}${date}${getRandomLetters()}`;
  }
};

const selectedAmortizationWay = async (value: any) => {
  amortizationWay.value = value;
  assetsStore().selectedRow.amortizatinWay = value;
};

const selectedDepartment = async (value: any) => {
  department.value = value;
  assetsStore().selectedRow.department = value;
};

const bookValueCalculate = () => {
  if (props.detailCardVisible === "") {
    bookValue.value = acquisitionCost.value - depreciation.value;
  } else {
    assetsStore().searchFixedAssetsDetailList[0].bookValue =
      assetsStore().searchFixedAssetsDetailList[0].acquisitionCost -
      assetsStore().searchFixedAssetsDetailList[0].depreciation;
  }
};

const amortizationRateCalculate = () => {
  if (props.detailCardVisible === "") {
    amortizationRate.value = 1 / usefulLife.value;
    amortizationFinalYear.value =
      Number.parseInt(progress.value.match(/^\d{4}/)[0]) +
      Number.parseInt(usefulLife.value);
    normalAmortization.value = acquisitionCost.value / usefulLife.value;
    accumulatedAmortization.value =
      (Number.parseInt(depreciation.value) || 0) +
      Number.parseInt(normalAmortization.value);
    bookValueEnd.value = acquisitionCost.value - accumulatedAmortization.value;
  } else {
    assetsStore().searchFixedAssetsDetailList[0].amortizationRate =
      1 / assetsStore().searchFixedAssetsDetailList[0].usefulLife;
    assetsStore().searchFixedAssetsDetailList[0].amortizationFinalYear =
      Number.parseInt(assetsStore().selectedRow.progress.match(/^\d{4}/)[0]) +
      Number.parseInt(assetsStore().searchFixedAssetsDetailList[0].usefulLife);
    assetsStore().searchFixedAssetsDetailList[0].normalAmortization =
      assetsStore().searchFixedAssetsDetailList[0].acquisitionCost /
      assetsStore().searchFixedAssetsDetailList[0].usefulLife;
    assetsStore().searchFixedAssetsDetailList[0].accumulatedAmortization =
      Number.parseInt(
        assetsStore().searchFixedAssetsDetailList[0].depreciation
      ) +
      Number.parseInt(
        assetsStore().searchFixedAssetsDetailList[0].normalAmortization
      );
    assetsStore().searchFixedAssetsDetailList[0].bookValueEnd =
      assetsStore().searchFixedAssetsDetailList[0].acquisitionCost -
      assetsStore().searchFixedAssetsDetailList[0].accumulatedAmortization;
  }
};

const remainQuantityCalculate = () => {
  if (props.detailCardVisible === "") {
    remainQuantity.value = acquisitionQuantity.value;
  } else {
    assetsStore().searchFixedAssetsDetailList[0].remainQuantity =
      Number.parseInt(
        assetsStore().searchFixedAssetsDetailList[0].acquisitionQuantity
      ) +
      Number.parseInt(
        assetsStore().searchFixedAssetsDetailList[0].changeQuantity
      );
  }
};
</script>

<template>
  <VSnackbar v-model="addAlert" :timeout="2000" color="success" location="center">
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />추가 되었습니다.
    </div>
  </VSnackbar>
  <VSnackbar v-model="addErrorAlert" :timeout="2000" color="error" location="center">
    <div align="center" style="color: white">
      <VIcon start icon="tabler-alert-circle-filled" />값을 입력해주세요.
    </div>
  </VSnackbar>
  <VSnackbar v-model="updateAlert" :timeout="2000" color="success" location="center">
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />수정 되었습니다.
    </div>
  </VSnackbar>
  <VSnackbar v-model="deleteAlert" :timeout="2000" color="success" location="center">
    <div align="center" style="color: white">
      <VIcon start icon="tabler-circle-check-filled" />삭제 되었습니다.
    </div>
  </VSnackbar>

  <VCard v-if="props.detailCardVisible === ''" style="margin-top: 10px">

    <v-row style="margin-top: 10px; margin-left: 105px;" fixed>
      <VBtn style="margin-right: 15px" @click="addFixedAssetsCode">
        <VIcon start icon="tabler-playlist-add" />추가
      </VBtn>
      <VBtn @click="formReset">
        <VIcon start icon="tabler-eraser" />취소
      </VBtn>
    </v-row>

    <VContainer style="margin-top: 10px">
      <v-row>
        <v-col>
          <VTextField v-model="accountCode" label="계정코드" disabled />
        </v-col>
        <v-col>
          <VAutocomplete label="자산유형" placeholder="Select" :items="props.items"
            @update:modelValue="selectedAccountName" />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsCode" label="자산코드" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="assetsName" label="자산명" />
        </v-col>
        <v-col>
          <VTextField v-model="progress" label="취득일" type="date" />
        </v-col><v-col />
      </v-row>

      <v-row>
        <v-col>
          <VTextField v-model="acquisitionCost" label="취득원가" />
        </v-col>
        <v-col>
          <VAutocomplete label="상각방법" :items="amortizationWayList" @update:modelValue="selectedAmortizationWay" />
        </v-col><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="depreciation" label="전기말상각누계액" @keyup="bookValueCalculate" />
        </v-col><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="bookValue" label="전기말장부가액" disabled />
        </v-col><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="usefulLife" label="내용연수" @keyup="amortizationRateCalculate" />
        </v-col>
        <v-col>
          <VTextField v-model="amortizationFinalYear" label="상각완료년도" disabled />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VAutocomplete label="관리부서" :items="departmentList" @update:modelValue="selectedDepartment"
            style="width:250px" />
        </v-col>
        <v-col>
          <VTextField v-model="acquisitionQuantity" label="취득수량" @keyup="remainQuantityCalculate" />
        </v-col>
        <v-col>
          <VTextField v-model="changeQuantity" label="증감수량" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="remainQuantity" label="잔존수량" disabled />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="amortizationRate" label="상각률" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="months" label="월수" disabled />
        </v-col><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="normalAmortization" label="일반상각비" />
        </v-col>
        <v-col>
          <VTextField v-model="accumulatedAmortization" label="당기말상각누계액" disabled />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="bookValueEnd" label="당기말장부가액" disabled />
        </v-col><v-col />
      </v-row>
    </VContainer>
  </VCard>

  <VCard v-if="props.detailCardVisible === 'UPDATE'" style="margin-top: 10px">
    <v-row style="margin-top: 10px; margin-left: 105px">
      <VBtn style="margin-right: 15px" @click="updateFixedAssetsCode">
        <VIcon start icon="tabler-tool" />수정
      </VBtn>
      <VBtn @click="deleteFixedAssetsCode">
        <VIcon start icon="tabler-trash" />삭제
      </VBtn>
    </v-row>
    <VContainer style="margin-top: 10px">
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().selectedRow.accountCode" label="계정코드" disabled />
        </v-col>
        <v-col>
          <VAutocomplete v-model="assetsStore().selectedRow.accountName" label="자산유형" placeholder="Select"
            :items="props.items" @update:modelValue="selectedAccountName" />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().selectedRow.assetCode" label="자산코드" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().selectedRow.assetName" label="자산명" />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().selectedRow.progress" label="취득일" type="date" />
        </v-col>
        <v-col />
      </v-row>

      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].acquisitionCost
            " label="취득원가" />
        </v-col>
        <v-col>
          <VAutocomplete v-model="assetsStore().searchFixedAssetsDetailList[0].amortizationWay
            " label="상각방법" :items="amortizationWayList" @update:modelValue="selectedAmortizationWay" />
        </v-col>
        <v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].depreciation" label="전기말상각누계액"
            @keyup="bookValueCalculate" />
        </v-col>
        <v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].bookValue" label="전기말장부가액" disabled />
        </v-col>
        <v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].usefulLife" label="내용연수"
            @keyup="amortizationRateCalculate" />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].amortizationFinalYear
            " label="상각완료년도" disabled />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VAutocomplete v-model="assetsStore().searchFixedAssetsDetailList[0].department" label="관리부서"
            :items="departmentList" @update:modelValue="selectedDepartment" style="width:250px" />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].acquisitionQuantity
            " label="취득수량" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].changeQuantity
            " label="증감수량" @keyup="remainQuantityCalculate" />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].remainQuantity
            " label="잔존수량" disabled />
        </v-col><v-col /><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].amortizationRate" label="상각률" disabled />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].month" label="월수" disabled />
        </v-col><v-col /><v-col />
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].normalAmortization
            " label="일반상각비" />
        </v-col>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0]
            .accumulatedAmortization
            " label="당기말상각누계액" disabled />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <VTextField v-model="assetsStore().searchFixedAssetsDetailList[0].bookValueEnd" label="당기말장부가액" disabled />
        </v-col>
        <v-col />
      </v-row>
    </VContainer>
  </VCard>
</template>
