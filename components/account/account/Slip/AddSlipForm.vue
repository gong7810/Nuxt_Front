<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import type { RouteLocationRaw } from "#vue-router";
import { accountStore } from "@/store/account/account";
import AddSlipModal from "@/components/account/account/Modal/AddSlipModal.vue";
import AddJournalModal from "@/components/account/account/Modal/AddJournalModal.vue";
import AddJournalDetailModal from "@/components/account/account/Modal/AddJournalDetailModal.vue";

// 테이블 데이터
const newSlipForm: Ref<any[]> = ref([]);
const newJournalForm: Ref<any[]> = ref([]); // ref([])로 선언한 리스트는 Array<never> 이라 push사용 불가
const newJournalDetailForm: Ref<any[]> = ref([]);

// 카드 데이터
const newNoteDetailForm: Ref<any[]> = ref([]);

// 대차 합계 확인
const totalPrice = ref(0);
const clearPriceState = ref(true);

// Dialog창 visible조절
const isSlipDialogVisible = ref(false);
const isJournalDialogVisible = ref(false);
const isJournalDetailDialogVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const isFileUploadFailedSnackBarVisible = ref(false);
const isNoteDetailCardVisible = ref(false);
const isNoteDetailSuccessAlertVisible = ref(false);
const isRequestAllAlertVisible = ref(false);
const isRequestNoteDetailAlertVisible = ref(false);
const isAddSlipSuccessAlertVisible = ref(false);

// 버튼 visible조절
const openSlipButton = ref(false);
const openJournalButton = ref(true);

// 분개 상세페이지에 분개 일렬번호 전달
const rowJournalNo = ref("");
const count = ref(0);

// 어음상세 추가시 flag
const noteFlag = ref(true);

// 파일 관련
const refInputEl = ref<HTMLElement>();
const jsonKey = ref(0);
const fileKey = ref(0);
const file = ref<File | null>(null);
const slipJsonData = ref({});

const selectedFileName = ref("");

// 페이지 이동시 사용될 router
const router = useRouter();

// 전표테이블 헤더
const slipField: any = [
  { title: "전표유형", key: "slipType" },
  { title: "기수일련번호", key: "accountPeriodNo" },
  { title: "전표일련번호", key: "slipNo" },
  { title: "부서명", key: "deptName" },
  { title: "사용일자", key: "postingDate" },
  { title: "작성자코드", key: "reportingEmpCode" },
  { title: "작성자명", key: "reportingEmpName" },
  { title: "작성일자", key: "reportingDate" },
  { title: "품의내역", key: "expenseReport" },
];

// 분개테이블 헤더
const journalField: any = [
  { title: "분개일련번호", key: "journalNo" },
  { title: "계정코드", key: "accountCode" },
  { title: "계정과목", key: "accountName" },
  { title: "대차구분", key: "balanceDivision" },
  { title: "거래처코드", key: "customerCode" },
  { title: "거래처명", key: "customerName" },
  { title: "차변금액", key: "leftDebitPrice" },
  { title: "대변금액", key: "rightCreditPrice" },
];

// 분개상세테이블 헤더
const journalDetailField: any = [
  { title: "분개번호", key: "journalNo" },
  { title: "분개상세항목", key: "accountControlName" },
  { title: "코드", key: "accountControlType" },
  { title: "상세내용", key: "journalDescription" },
  { title: "", key: "showDetails" },
];

// 어음유형
const options = ref<string[]>(["1.당좌", "2.가계", "3.어음", "4.전자"]);

// 수금사원 리스트
const draweeList = ref<string[]>();

// 어음상세 데이터칼럼
const noteNo = ref("");
const noteType = ref("");
const accountInnerCode = ref("");
const drawer = ref("");
const endorser = ref("");
const drawee = ref("");
const issuanceDate = ref("");
const maturityDate = ref("");

// 어음 임력 rule
const noteRules = [
  (value: string | null) => {
    if (value?.length && value.length > 0) {
      if (value?.length && value.length === 20) return true;
      else return "올바른 어음번호가 아닙니다.";
    }

    return "필수 입력사항입니다.";
  },
];

// 사원정보 조회
const fetchData = async () => {
  await accountStore().FETCH_ALL_EMPLOYEES();
  draweeList.value = Object.values(accountStore().empList).map(
    (item: any) => item.empName
  );
};

onMounted(() => {
  fetchData();
});

// 분개 계정과목 체크
const isjournalDetailVisible = (selected: any, row: any) => {
  if (rowJournalNo.value === row.internalItem.columns.journalNo) {
    rowJournalNo.value = "";
    isNoteDetailCardVisible.value = false;
  } else {
    rowJournalNo.value = row.internalItem.columns.journalNo;
    if (
      row.internalItem.columns.accountCode === "0110" ||
      row.internalItem.columns.accountCode === "0252"
    ) {
      accountInnerCode.value = row.internalItem.columns.accountCode;

      const noteflag = ref(true);
      for (let i = 0; i < newNoteDetailForm.value.length; i++) {
        if (newNoteDetailForm.value[i].journalNo === rowJournalNo.value) {
          noteNo.value = newNoteDetailForm.value[i].noteNo;
          noteType.value = newNoteDetailForm.value[i].noteType;
          issuanceDate.value = newNoteDetailForm.value[i].issuanceDate;
          maturityDate.value = newNoteDetailForm.value[i].maturityDate;
          drawer.value = newNoteDetailForm.value[i].drawer;
          endorser.value = newNoteDetailForm.value[i].endorser;
          drawee.value = newNoteDetailForm.value[i].drawee;

          noteflag.value = false;
          break;
        }
      }
      if (noteflag.value) {
        noteNo.value = "";
        noteType.value = "";
        issuanceDate.value = "";
        maturityDate.value = "";
        drawer.value = "";
        endorser.value = "";
        drawee.value = "";
      }

      isNoteDetailCardVisible.value = true;
    } else {
      isJournalDetailDialogVisible.value = true;
    }
  }
};

// 파일 Parsing
const parseExcel = (importfile: any) => {
  const reader = new FileReader();

  reader.readAsArrayBuffer(importfile);

  // reader가 readAsArrayBuffer로 파일을 다 읽으면 자동 트리거
  reader.onload = (e: any) => {
    try {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      // 엑셀 파일 시트를 할당
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // JSON 형식으로 변환
      slipJsonData.value = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    } catch (error: any) {
      console.error("Error parsing Excel file: ", error);
    }
  };
};

// 전표 파일 추가
const onChange = (event: any) => {
  const fileInput = event.target.files;

  if (fileInput.length > 0) {
    if (
      fileInput[0].name.includes(".xlsx") ||
      fileInput[0].name.includes(".xls")
    ) {
      file.value = fileInput[0];
      selectedFileName.value = fileInput[0].name;

      jsonKey.value++;

      newSlipForm.value = [];
      newJournalForm.value = [];
      newJournalDetailForm.value = [];

      openSlipButton.value = true;
      clearPriceState.value = false;

      parseExcel(file.value);
    } else {
      selectedFileName.value = "";
      isFileUploadFailedSnackBarVisible.value = true;
    }
  } else {
    selectedFileName.value = "";
    openSlipButton.value = false;
    clearPriceState.value = true;
  }
};

// 전표 추가
const updateNewSlipForm = (updatedData: any) => {
  newSlipForm.value = updatedData;
  openJournalButton.value = false;
};

// 분개 추가
const updateNewJournalForm = (updatedData: any) => {
  if (newJournalForm.value.length === 0) {
    newJournalForm.value = updatedData;
  } else {
    newJournalForm.value.push(updatedData[0]);
    for (const data of newJournalForm.value) {
      totalPrice.value += data.leftDebitPrice - data.rightCreditPrice;
      if (!totalPrice.value) clearPriceState.value = false;
      else clearPriceState.value = true;
    }
    totalPrice.value = 0;
  }

  if (
    updatedData[0].accountCode === "0110" ||
    updatedData[0].accountCode === "0252"
  ) {
    rowJournalNo.value = updatedData[0].journalNo;
    accountInnerCode.value = updatedData[0].accountCode;
    noteNo.value = "";
    noteType.value = "";
    issuanceDate.value = "";
    maturityDate.value = "";
    drawer.value = "";
    endorser.value = "";
    drawee.value = "";

    isNoteDetailCardVisible.value = true;
    noteFlag.value = false;
  }
};

// 분개상세 추가
const updateNewJournalDetailForm = (updatedData: any) => {
  if (newJournalDetailForm.value.length === 0)
    newJournalDetailForm.value = updatedData;
  else newJournalDetailForm.value.push(updatedData[0]);

  // id 증가
  count.value++;
};

// 어음상세 추가 / 수정
const updateNewNoteDetailForm = () => {
  if (
    noteNo.value === "" ||
    noteType.value === "" ||
    accountInnerCode.value === "" ||
    issuanceDate.value === "" ||
    maturityDate.value === "" ||
    drawer.value === "" ||
    endorser.value === "" ||
    drawee.value === ""
  ) {
    isRequestAllAlertVisible.value = true;
  } else {
    const flag = ref(true);
    for (let i = 0; i < newNoteDetailForm.value.length; i++) {
      if (newNoteDetailForm.value[i].journalNo === rowJournalNo.value) {
        (newNoteDetailForm.value[i].noteNo = noteNo.value),
          (newNoteDetailForm.value[i].noteType = noteType.value),
          (newNoteDetailForm.value[i].accountInnerCode =
            accountInnerCode.value),
          (newNoteDetailForm.value[i].issuanceDate = issuanceDate.value),
          (newNoteDetailForm.value[i].maturityDate = maturityDate.value),
          (newNoteDetailForm.value[i].drawer = drawer.value),
          (newNoteDetailForm.value[i].endorser = endorser.value),
          (newNoteDetailForm.value[i].drawee = drawee.value),
          (flag.value = false);
        break;
      }
    }

    if (flag.value) {
      newNoteDetailForm.value.push({
        journalNo: rowJournalNo.value,
        noteNo: noteNo.value,
        noteType: noteType.value,
        accountInnerCode: accountInnerCode.value,
        issuanceDate: issuanceDate.value,
        maturityDate: maturityDate.value,
        drawer: drawer.value,
        endorser: endorser.value,
        drawee: drawee.value,
      });
    }

    isNoteDetailSuccessAlertVisible.value = true;

    noteFlag.value = true;
  }
};

// DB 저장
const addSlipToDB = async () => {
  if (!noteFlag.value) {
    isRequestNoteDetailAlertVisible.value = true;
    isConfirmDialogVisible.value = false;
  } else {
    const newJournalList = [];
    for (let i = 0; i < newJournalForm.value.length; i++) {
      const flag = ref(false);
      const newJournalDetailList = [];
      for (let j = 0; j < newJournalDetailForm.value.length; j++) {
        if (
          newJournalForm.value[i].journalNo ===
          newJournalDetailForm.value[j].journalNo
        ) {
          newJournalDetailList.push({
            journalNo: newJournalDetailForm.value[j].journalNo,
            accountControlName:
              newJournalDetailForm.value[j].accountControlName,
            accountControlType:
              newJournalDetailForm.value[j].accountControlType,
            journalDescription:
              newJournalDetailForm.value[j].journalDescription,
          });
          flag.value = true;
        }
      }

      if (flag.value) {
        newJournalList.push({
          journalNo: newJournalForm.value[i].journalNo,
          accountCode: newJournalForm.value[i].accountCode,
          accountName: newJournalForm.value[i].accountName,
          balanceDivision: newJournalForm.value[i].balanceDivision,
          customerCode: newJournalForm.value[i].customerCode,
          customerName: newJournalForm.value[i].customerName,
          leftDebitPrice: newJournalForm.value[i].leftDebitPrice,
          rightCreditPrice: newJournalForm.value[i].rightCreditPrice,
          journalDetailList: newJournalDetailList,
        });
      } else {
        newJournalList.push({
          journalNo: newJournalForm.value[i].journalNo,
          accountCode: newJournalForm.value[i].accountCode,
          accountName: newJournalForm.value[i].accountName,
          balanceDivision: newJournalForm.value[i].balanceDivision,
          customerCode: newJournalForm.value[i].customerCode,
          customerName: newJournalForm.value[i].customerName,
          leftDebitPrice: newJournalForm.value[i].leftDebitPrice,
          rightCreditPrice: newJournalForm.value[i].rightCreditPrice,
          journalDetailList: [],
        });
      }
    }

    const resultSlipForm: any = [
      {
        accountPeriodNo: newSlipForm.value[0].accountPeriodNo,
        slipNo: newSlipForm.value[0].slipNo,
        slipType: newSlipForm.value[0].slipType,
        reportingEmpCode: newSlipForm.value[0].reportingEmpCode,
        reportingEmpName: newSlipForm.value[0].reportingEmpName,
        expenseReport: newSlipForm.value[0].expenseReport,
        postingDate: newSlipForm.value[0].postingDate,
        reportingDate: newSlipForm.value[0].reportingDate,
        deptCode: newSlipForm.value[0].deptCode,
        slipStatus: "",
        journalList: newJournalList,
        noteDetail: toRaw(newNoteDetailForm.value),
      },
    ];

    console.log("추가 폼 :", resultSlipForm[0]);

    const response = await accountStore().CREATE_SLIP(resultSlipForm[0]);

    console.log("추가 되었습니다: ", response);

    isAddSlipSuccessAlertVisible.value = true;
    isConfirmDialogVisible.value = false;

    addSlipSuccess();
  }
};

// 리스트로 DB 저장
const addSlipListToDB = async () => {
  const lengthOfKeys = Object.keys(toRaw(slipJsonData.value)).length; // 엑셀행
  const slipJsonList: any = toRaw(slipJsonData.value);

  const flag = ref("");

  const fileSlipForm = [];
  const fileJournalForm = [];
  const fileJournalDetailForm = [];
  const fileNoteDetailForm = [];

  for (let i = 0; i < lengthOfKeys; i++) {
    if (slipJsonList[`${i}`][0] === "전표") {
      flag.value = "slip";
      continue;
    } else if (slipJsonList[`${i}`][0] === "분개") {
      flag.value = "journal";
      continue;
    } else if (slipJsonList[`${i}`][0] === "분개상세") {
      flag.value = "journalDetail";
      continue;
    } else if (slipJsonList[`${i}`][0] === "어음상세") {
      flag.value = "noteDetail";
      continue;
    }

    // 칼럼 수 = 전표:9, 분개:9, 분개상세:4 고정
    if (flag.value === "slip") {
      fileSlipForm.push({
        slipType: slipJsonList[`${i}`][0],
        postingDate: slipJsonList[`${i}`][1],
        accountPeriodNo: slipJsonList[`${i}`][2],
        deptCode: slipJsonList[`${i}`][3],
        slipNo: slipJsonList[`${i}`][4],
        reportingEmpCode: slipJsonList[`${i}`][5],
        reportingEmpName: slipJsonList[`${i}`][6],
        reportingDate: slipJsonList[`${i}`][7],
        expenseReport: slipJsonList[`${i}`][8],
        slipStatus: "",
      });
    } else if (flag.value === "journal") {
      fileJournalForm.push({
        slipNo: slipJsonList[`${i}`][0],
        journalNo: slipJsonList[`${i}`][1],
        accountCode: slipJsonList[`${i}`][2],
        accountName: slipJsonList[`${i}`][3],
        balanceDivision: slipJsonList[`${i}`][4],
        customerCode: slipJsonList[`${i}`][5],
        customerName: slipJsonList[`${i}`][6],
        leftDebitPrice: slipJsonList[`${i}`][7],
        rightCreditPrice: slipJsonList[`${i}`][8],
      });
    } else if (flag.value === "journalDetail") {
      fileJournalDetailForm.push({
        journalNo: slipJsonList[`${i}`][0],
        accountControlName: slipJsonList[`${i}`][1],
        accountControlType: slipJsonList[`${i}`][2],
        journalDescription: slipJsonList[`${i}`][3],
      });
    } else if (flag.value === "noteDetail") {
      fileNoteDetailForm.push({
        journalNo: slipJsonList[`${i}`][0],
        noteNo: slipJsonList[`${i}`][1],
        noteType: slipJsonList[`${i}`][2],
        accountInnerCode: slipJsonList[`${i}`][3],
        issuanceDate: slipJsonList[`${i}`][4],
        maturityDate: slipJsonList[`${i}`][5],
        drawer: slipJsonList[`${i}`][6],
        endorser: slipJsonList[`${i}`][7],
        drawee: slipJsonList[`${i}`][8],
      });
    }
  }

  // 중간 세팅 완료
  // 백단 보낼 파일세팅 시작

  const fileJournalList = [];
  for (let j = 0; j < fileJournalForm.length; j++) {
    const fileJournalDetailList = [];
    const journalDetailflag = ref(false);
    for (let k = 0; k < fileJournalDetailForm.length; k++) {
      if (fileJournalDetailForm[k].journalNo === fileJournalForm[j].journalNo) {
        fileJournalDetailList.push(fileJournalDetailForm[k]);
        journalDetailflag.value = true;
      }
    }
    if (journalDetailflag.value) {
      fileJournalList.push({
        slipNo: fileJournalForm[j].slipNo,
        journalNo: fileJournalForm[j].journalNo,
        accountCode: fileJournalForm[j].accountCode,
        accountName: fileJournalForm[j].accountName,
        balanceDivision: fileJournalForm[j].balanceDivision,
        customerCode: fileJournalForm[j].customerCode,
        customerName: fileJournalForm[j].customerName,
        leftDebitPrice: fileJournalForm[j].leftDebitPrice,
        rightCreditPrice: fileJournalForm[j].rightCreditPrice,
        journalDetailList: fileJournalDetailList,
      });
    } else {
      fileJournalList.push({
        slipNo: fileJournalForm[j].slipNo,
        journalNo: fileJournalForm[j].journalNo,
        accountCode: fileJournalForm[j].accountCode,
        accountName: fileJournalForm[j].accountName,
        balanceDivision: fileJournalForm[j].balanceDivision,
        customerCode: fileJournalForm[j].customerCode,
        customerName: fileJournalForm[j].customerName,
        leftDebitPrice: fileJournalForm[j].leftDebitPrice,
        rightCreditPrice: fileJournalForm[j].rightCreditPrice,
        journalDetailList: [],
      });
    }
  }

  const fileSlipList = [];
  for (let i = 0; i < fileSlipForm.length; i++) {
    const journalList = [];
    const journalflag = ref(false);
    for (let j = 0; j < fileJournalList.length; j++) {
      if (fileJournalList[j].slipNo === fileSlipForm[i].slipNo) {
        journalList.push(fileJournalList[j]);
        journalflag.value = true;
      }
    }
    if (journalflag.value) {
      fileSlipList.push({
        slipType: fileSlipForm[i].slipType,
        postingDate: fileSlipForm[i].postingDate,
        accountPeriodNo: fileSlipForm[i].accountPeriodNo,
        deptCode: fileSlipForm[i].deptCode,
        slipNo: fileSlipForm[i].slipNo,
        reportingEmpCode: fileSlipForm[i].reportingEmpCode,
        reportingEmpName: fileSlipForm[i].reportingEmpName,
        reportingDate: fileSlipForm[i].reportingDate,
        expenseReport: fileSlipForm[i].expenseReport,
        slipStatus: "",
        journalList: journalList,
        noteDetail: fileNoteDetailForm,
      });
    } else {
      fileSlipList.push({
        slipType: fileSlipForm[i].slipType,
        postingDate: fileSlipForm[i].postingDate,
        accountPeriodNo: fileSlipForm[i].accountPeriodNo,
        deptCode: fileSlipForm[i].deptCode,
        slipNo: fileSlipForm[i].slipNo,
        reportingEmpCode: fileSlipForm[i].reportingEmpCode,
        reportingEmpName: fileSlipForm[i].reportingEmpName,
        reportingDate: fileSlipForm[i].reportingDate,
        expenseReport: fileSlipForm[i].expenseReport,
        slipStatus: "",
        journalList: [],
        noteDetail: fileNoteDetailForm,
      });
    }
  }

  console.log("파일로 전표추가 폼", { slipList: fileSlipList });

  const slipList = { slipList: fileSlipList };

  const response = await accountStore().CREATE_SLIP_FILE(slipList);

  console.log("추가 되었습니다: ", response);

  isAddSlipSuccessAlertVisible.value = true;
  isConfirmDialogVisible.value = false;

  // addSlipSuccess();
};

// 파일등록 / 직접입력 체크
const checkFile = () => {
  if (selectedFileName.value.length > 0) addSlipListToDB();
  else addSlipToDB();
};

// 추가시 이동 페이지
const toProofReceipt: RouteLocationRaw = {
  name: "account-account-ReceiptFormPage",
};

const addSlipSuccess = () => {
  setTimeout(() => {
    router.push(toProofReceipt);
  }, 1000);
};
</script>

<template>
  <p class="text-2xl mb-6">전표 추가</p>
  <div
    class="app-user-search-filter d-flex align-center flex-wrap gap-4 justify-end"
  >
    <!-- 전표 파일 추가 -->
    <div>
      <VBtn color="primary" variant="outlined" @click="refInputEl?.click()">
        <VIcon start icon="tabler-link" size="22" />
        <span class="d-none d-sm-block">파일추가</span>
      </VBtn>
      <input
        ref="refInputEl"
        type="file"
        id="fileInput"
        hidden
        accept=".xls, .xlsx"
        :key="fileKey"
        @change="onChange"
      />
      <span class="file-input-label">{{ selectedFileName }}</span>
    </div>
    <!-- 전표 추가 Dialog -->
    <AddSlipModal
      v-model:isDialogVisible="isSlipDialogVisible"
      :defenseSlip="openSlipButton"
      @submit="updateNewSlipForm"
    />
    <!-- 분개 추가 Dialog -->
    <AddJournalModal
      v-model:isDialogVisible="isJournalDialogVisible"
      :defenseJournal="openJournalButton"
      @submit="updateNewJournalForm"
    />
    <!-- 분개상세 추가 Dialog -->
    <AddJournalDetailModal
      v-model="isJournalDetailDialogVisible"
      :selectedNo="rowJournalNo"
      @submit="updateNewJournalDetailForm"
      @dialogClose="
        isJournalDetailDialogVisible = !isJournalDetailDialogVisible
      "
    />
    <VBtn
      color="primary"
      :disabled="clearPriceState"
      @click="isConfirmDialogVisible = !isConfirmDialogVisible"
    >
      <VIcon start icon="tabler-stack-push" size="22" />
      저장
    </VBtn>
  </div>
  <div>
    <h1>전표</h1>
    <VDataTable :headers="slipField" :items="newSlipForm" />

    <h1>분개</h1>
    <VDataTable
      :headers="journalField"
      :items="newJournalForm"
      @click:row="isjournalDetailVisible"
    />
    <!-- 어음상세 입력 카드 -->
    <div class="text-2xl mb-2" style="margin: 25px 0 0 0">
      <!-- 어음상세 -->
      <VCard v-if="isNoteDetailCardVisible" title="어음상세" class="mb-6">
        <VCardText>
          <VRow>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="rowJournalNo" label="분개번호" disabled />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="noteNo"
                label="어음번호"
                placeholder="123-12345678-12345678-1"
                :rules="noteRules"
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppSelect v-model="noteType" :items="options" label="어음유형" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="accountInnerCode"
                label="계정코드"
                disabled
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="issuanceDate"
                label="발행일자"
                type="date"
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="maturityDate"
                label="만기일자"
                type="date"
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="drawer" label="발행인" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="endorser" label="배서인" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppSelect
                v-model="drawee"
                :items="draweeList"
                label="수금사원"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn color="primary" @click="updateNewNoteDetailForm">
            <VIcon start icon="tabler-database-plus" size="22" />
            저장
          </VBtn>
        </VCardText>
      </VCard>
    </div>
    <h1>분개상세</h1>
    <VDataTable :headers="journalDetailField" :items="newJournalDetailForm" />
  </div>
  <!-- 전표 등록 확인 Dialog -->
  <VDialog v-model="isConfirmDialogVisible" width="400">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isConfirmDialogVisible = !isConfirmDialogVisible" />

    <VCard>
      <VCol style="text-align: center; margin-top: 10px">
        <!-- Dialog Content -->
        <VAvatar variant="outlined" size="120" color="success" rounded="pill">
          <VIcon size="90" icon="tabler-exclamation-mark" />
        </VAvatar>
      </VCol>

      <VCardText style="text-align: center">
        전표를 추가 하시겠습니까?
      </VCardText>
      <VCardText style="text-align: center">
        <VBtn color="success" @click="checkFile">
          <VIcon start icon="tabler-checkbox" size="22" />
          확인
        </VBtn>
        <VBtn
          color="blue-grey"
          variant="tonal"
          style="margin-left: 10px"
          @click="isConfirmDialogVisible = !isConfirmDialogVisible"
        >
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 파일형식 오류 스낵바 -->
  <VSnackbar
    v-model="isFileUploadFailedSnackBarVisible"
    location="top"
    color="error"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    파일형식을 .xlsx / .xls 로 지정해주세요.
  </VSnackbar>
  <!-- 어음상세 저장 스낵바 -->
  <VSnackbar
    v-model="isNoteDetailSuccessAlertVisible"
    location="bottom"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    어음상세 저장완료.
  </VSnackbar>
  <!-- 어음상세 작성요청 스낵바 -->
  <VSnackbar
    v-model="isRequestNoteDetailAlertVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    어음상세를 입력해주세요.
  </VSnackbar>
  <!-- 모두 입력 요청 스낵바 -->
  <VSnackbar
    v-model="isRequestAllAlertVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    모두 입력해주세요.
  </VSnackbar>
  <!-- 전표 추가 알림 스낵바 -->
  <VSnackbar
    v-model="isAddSlipSuccessAlertVisible"
    location="top"
    color="success"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    전표 추가완료
  </VSnackbar>
</template>

<style>
.justify-end {
  justify-content: flex-end;
}

/* Style the file input label */
.file-input-label {
  margin-left: 10px;
}
</style>
