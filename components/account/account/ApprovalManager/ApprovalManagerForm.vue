<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { accountStore } from "@/store/account/account";

const productList = ref([]);
const currentSearchTerm = ref("");
const searchTermNo = ref("");
const searchTermReport = ref("");
const searchTermStatus = ref("");

const originflag = ref(false);
const approvalflag = ref(true);
const companionflag = ref(true);
const unProflag = ref(true);

const options = ref<string[]>([
  "--------------------",
  "1.승인",
  "2.반려",
  "3.미결",
]);

const selectedSlip = ref([]);
const selectedSlipNo = ref("");
const selectedSlipStatus = ref("");
const selectedSlipList: Ref<any[]> = ref([]);

const approvalFlag = ref(true);
const approvalBackFlag = ref(true);
const approvalCancelFlag = ref(true);

const getSelect = ref(false);
const getSelects = ref(false);

const rowSelect = ref(false);

const tooltipVisible = ref(false);
const isRequestSelectSlipSnackBarVisible = ref(false);
const isApprovalSlipSnackBarVisible = ref(false);
const isApprovalSlipBackSnackBarVisible = ref(false);
const isApprovalCancelSnackBarVisible = ref(false);
const isFailedSnackBarVisible = ref(false);
const isFailedSnackBarVisible2 = ref(false);
const isCancelFailedSnackBarVisible = ref(false);
const isCancelFailedSnackBarVisible2 = ref(false);
const isCancelFailedSnackBarVisible3 = ref(false);

const toDay = new Date();

// Dialog 데이터칼럼
// 전표
const accountPeriodNo = ref("");
const slipNo = ref("");
const slipType = ref("");
const deptCode = ref("");
const deptName = ref("");
const reportingEmpCode = ref("");
const reportingEmpName = ref("");
const expenseReport = ref("");
const authorizationStatus = ref("");
const postingDate = ref("");
const reportingDate = ref("");
const slipStatus = ref("");
const approvalEmpName = ref("");

// 분개
const journalNo = ref("");
const accountCode = ref("");
const accountName = ref("");
const balanceDivision = ref("");
const customerCode = ref("");
const customerName = ref("");
const leftDebitPrice = ref(0);
const rightCreditPrice = ref(0);

// 분개상세
const journalNo2 = ref("");
const journalDetailNo = ref("");
const accountControlName = ref("");
const accountControlType = ref("");
const journalDescription = ref("");

// 어음상세
const journalNo3 = ref("");
const noteNo = ref("");
const noteType = ref("");
const accountInnerCode = ref("");
const drawer = ref("");
const endorser = ref("");
const drawee = ref("");
const issuanceDate = ref("");
const maturityDate = ref("");

const originRow = ref("");
const selectForm = ref([]);

const slipData = ref(true);
const journalData = ref(false);
const journalDetailData = ref(false);
const noteDetailData = ref(false);

// 상세모달 탭
const userTab = ref(0);
const journalTabs: Ref<any[]> = ref([]);
const journalDetailTabs: Ref<any[]> = ref([]);
const noteDetailTabs: Ref<any[]> = ref([]);

// 상세모달 탭 번호
const journalTabNumer = ref(-1);
const journalDetailTabNumer = ref(-1);
const noteDetailTabNumer = ref(-1);

const nowYear = new Date().getFullYear();

const column = [
  {
    title: "전표일련번호",
    key: "slipNo",
  },
  {
    title: "부서코드",
    key: "deptCode",
  },
  {
    title: "작성자코드",
    key: "reportingEmpCode",
  },
  {
    title: "품의내역",
    key: "expenseReport",
  },
  {
    title: "승인상태",
    key: "slipStatus",
  },
  {
    title: "승인일자",
    key: "approvalDate",
  },
  {
    title: "승인자",
    key: "approvalEmpCode",
  },
];

const tabs = [
  { icon: "tabler-pencil", title: "전표" },
  { icon: "tabler-message", title: "분개" },
  { icon: "tabler-message-circle", title: "분개상세" },
  { icon: "tabler-database", title: "어음상세" },
];

// 전표 리스트 조회
const fetchData = async () => {
  await accountStore().FETCH_ALL_SLIP();
  productList.value = await accountStore().allSlipList.filter((slip: any) => {
    if (slip.authorizationStatus)
      return slip.authorizationStatus.trim() === "증빙완료";
  });
};

// 승인 / 반려 전표 조회
const fetchStatusData = async (status: string) => {
  await accountStore().FETCH_STATUS_SLIP(status);
  productList.value = await accountStore().statusSlipList.filter(
    (slip: any) => {
      if (slip.authorizationStatus)
        return slip.authorizationStatus.trim() === "증빙완료";
    }
  );
};

// 미결 전표 조회
const fetchUnproData = async () => {
  await accountStore().FETCH_UNPRO_SLIP();

  productList.value = await accountStore().unProSlipList.filter((slip: any) => {
    if (slip.authorizationStatus)
      return slip.authorizationStatus.trim() === "증빙완료";
  });
};

onMounted(() => {
  fetchData();
});

// 일렬번호 필터
watch(searchTermNo, () => {
  currentSearchTerm.value = searchTermNo.value;
  searchTermReport.value = "";
});

// 품의내역 필터
watch(searchTermReport, () => {
  currentSearchTerm.value = searchTermReport.value;
  searchTermNo.value = "";
});

// 승인상태 필터
watch(searchTermStatus, async () => {
  if (searchTermStatus.value === "--------------------") {
    if (originflag.value) {
      resetSelect();
      await fetchData();
      originflag.value = false;
    }

    approvalflag.value = true;
    companionflag.value = true;
    unProflag.value = true;

    currentSearchTerm.value = "";
    searchTermStatus.value = "";
  } else if (searchTermStatus.value === "1.승인") {
    if (approvalflag.value) {
      resetSelect();
      await fetchStatusData("승인");
      approvalflag.value = false;
    }

    originflag.value = true;
    companionflag.value = true;
    unProflag.value = true;

    currentSearchTerm.value = "";
    searchTermNo.value = "";
    searchTermReport.value = "";
  } else if (searchTermStatus.value === "2.반려") {
    if (companionflag.value) {
      resetSelect();
      await fetchStatusData("반려");
      companionflag.value = false;
    }

    originflag.value = true;
    approvalflag.value = true;
    unProflag.value = true;

    currentSearchTerm.value = "";
    searchTermNo.value = "";
    searchTermReport.value = "";
  } else if (searchTermStatus.value === "3.미결") {
    if (unProflag.value) {
      resetSelect();
      await fetchUnproData();
      unProflag.value = false;
    }

    originflag.value = true;
    approvalflag.value = true;
    companionflag.value = true;

    currentSearchTerm.value = "";
    searchTermNo.value = "";
    searchTermReport.value = "";
  }
});

// 툴팁 표시
const handleMouseEnter = () => {
  tooltipVisible.value = true;

  setTimeout(() => {
    tooltipVisible.value = false;
  }, 500);
};

// 전표 번호 선택
watch(selectedSlip, async (selectedValue: any) => {
  if (toRaw(selectedValue.length) === 0) {
    selectedSlipNo.value = "";
    selectedSlipStatus.value = "";
    selectedSlipList.value = [];
    getSelect.value = false;
    getSelects.value = false;
  } else if (toRaw(selectedValue.length) === 1) {
    selectedSlipNo.value = toRaw(selectedValue[0].slipNo);
    selectedSlipStatus.value = toRaw(selectedValue[0].slipStatus);
    selectedSlipList.value = toRaw(selectedValue);
    getSelect.value = true;
    getSelects.value = false;
  } else {
    selectedSlipNo.value = `${toRaw(selectedValue.length)}개 선택`;
    selectedSlipStatus.value = "여러개";
    selectedSlipList.value = toRaw(selectedValue);
    getSelect.value = false;
    getSelects.value = true;
  }
});

// 전표 행 선택
const showDetails = async (selected: any, row: any) => {
  if (originRow.value === row.internalItem.columns.slipNo) {
    rowSelect.value = false;
    originRow.value = "";
  } else {
    // 재선택시 Tab전부 비우기
    journalTabs.value = [];
    journalTabNumer.value = -1;
    journalDetailTabs.value = [];
    journalDetailTabNumer.value = -1;
    noteDetailTabs.value = [];
    noteDetailTabNumer.value = -1;

    // 행 재선택마다 전표탭으로 이동
    userTab.value = 0;
    rowSelect.value = true;

    await accountStore().FETCH_SLIP(row.internalItem.columns.slipNo);

    selectForm.value = accountStore().slipForm;

    // 전표는 바로 세팅
    accountPeriodNo.value = toRaw(selectForm.value).accountPeriodNo;
    slipNo.value = toRaw(selectForm.value).slipNo;
    slipType.value = toRaw(selectForm.value).slipType;
    deptCode.value = toRaw(selectForm.value).deptCode;
    deptName.value = toRaw(selectForm.value).deptName;
    expenseReport.value = toRaw(selectForm.value).expenseReport;
    authorizationStatus.value = toRaw(selectForm.value).authorizationStatus;
    postingDate.value = toRaw(selectForm.value).postingDate;
    reportingDate.value = toRaw(selectForm.value).reportingDate;
    reportingEmpCode.value = toRaw(selectForm.value).reportingEmpCode;
    reportingEmpName.value = toRaw(selectForm.value).reportingEmpName;
    slipStatus.value = toRaw(selectForm.value).slipStatus;
    approvalEmpName.value = toRaw(selectForm.value).approvalEmpName;

    // 분개 탭, 분개상세 탭 갯수 세팅
    let journalDetailCount = 1;
    let noteDetailCount = 1;
    for (let i = 0; i < toRaw(selectForm.value).journalList.length; i++) {
      journalTabs.value.push({
        icon: `tabler-pentagon-number-${i + 1}`,
        title: "분개",
      });
      for (
        let j = 0;
        j < toRaw(selectForm.value).journalList[i]["journalDetailList"].length;
        j++
      ) {
        journalDetailTabs.value.push({
          icon: `tabler-hexagon-number-${journalDetailCount}`,
          title: "분개상세",
        });
        journalDetailCount++;
      }
      if (
        toRaw(selectForm.value).journalList[i]["accountCode"] === "0110" ||
        toRaw(selectForm.value).journalList[i]["accountCode"] === "0252"
      ) {
        noteDetailTabs.value.push({
          icon: `tabler-hexagon-number-${noteDetailCount}`,
          title: "어음상세",
        });
        noteDetailCount++;
      }
    }
    originRow.value = row.internalItem.columns.slipNo;
  }
};

// 선택 초기화
const resetSelect = () => {
  selectedSlip.value = [];
  rowSelect.value = false;
};

// 선택 Tab 감시
watch(userTab, () => {
  if (userTab.value === 0) {
    slipData.value = true;
    journalData.value = false;
    journalDetailData.value = false;
    noteDetailData.value = false;
  } else if (userTab.value === 1) {
    if (journalTabs.value.length === 0) {
      journalNo.value = "분개 없음";
      accountCode.value = "";
      accountName.value = "";
      balanceDivision.value = "";
      customerCode.value = "";
      customerName.value = "";
      leftDebitPrice.value = 0;
      rightCreditPrice.value = 0;
    } else {
      journalTabNumer.value = 0;
    }
    journalDetailTabNumer.value = -1;
    noteDetailTabNumer.value = -1;
    slipData.value = false;
    journalData.value = true;
    journalDetailData.value = false;
    noteDetailData.value = false;
  } else if (userTab.value === 2) {
    if (journalDetailTabs.value.length === 0) {
      journalNo2.value = "분개상세 없음";
      journalDetailNo.value = "";
      accountControlName.value = "";
      accountControlType.value = "";
      journalDescription.value = "";
    } else {
      journalDetailTabNumer.value = 0;
      journalNo2.value = journalNo.value;
    }
    journalTabNumer.value = -1;
    noteDetailTabNumer.value = -1;
    slipData.value = false;
    journalData.value = false;
    journalDetailData.value = true;
    noteDetailData.value = false;
  } else if (userTab.value === 3) {
    if (noteDetailTabs.value.length === 0) {
      journalNo3.value = "어음상세 없음";
      noteNo.value = "";
      noteType.value = "";
      accountInnerCode.value = "";
      drawer.value = "";
      endorser.value = "";
      drawee.value = "";
      issuanceDate.value = "";
      maturityDate.value = "";
    } else {
      noteDetailTabNumer.value = 0;
      journalNo3.value = journalNo.value;
    }
    journalTabNumer.value = -1;
    journalDetailTabNumer.value = -1;
    slipData.value = false;
    journalData.value = false;
    journalDetailData.value = false;
    noteDetailData.value = true;
  }
});

// 분개 선택 Tab 감시
watch(journalTabNumer, () => {
  if (journalTabNumer.value !== -1) {
    for (let i = 0; i < toRaw(selectForm.value).journalList.length; i++) {
      if (journalTabNumer.value === i) {
        journalNo.value = toRaw(selectForm.value).journalList[i].journalNo;
        accountCode.value = toRaw(selectForm.value).journalList[i].accountCode;
        accountName.value = toRaw(selectForm.value).journalList[i].accountName;
        balanceDivision.value = toRaw(selectForm.value).journalList[
          i
        ].balanceDivision;
        customerCode.value = toRaw(selectForm.value).journalList[
          i
        ].customerCode;
        customerName.value = toRaw(selectForm.value).journalList[
          i
        ].customerName;
        leftDebitPrice.value = toRaw(selectForm.value).journalList[
          i
        ].leftDebitPrice;
        rightCreditPrice.value = toRaw(selectForm.value).journalList[
          i
        ].rightCreditPrice;
        break;
      }
    }
  }
});

// 분개상세 선택 Tab 감시
watch(journalDetailTabNumer, () => {
  if (journalDetailTabNumer.value !== -1) {
    let count = 0;
    for (let i = 0; i < toRaw(selectForm.value).journalList.length; i++) {
      for (
        let j = 0;
        j < toRaw(selectForm.value).journalList[i]["journalDetailList"].length;
        j++
      ) {
        if (journalDetailTabNumer.value === count) {
          journalNo2.value = toRaw(selectForm.value).journalList[i][
            "journalDetailList"
          ][j].journalNo;
          journalDetailNo.value = toRaw(selectForm.value).journalList[i][
            "journalDetailList"
          ][j].journalDetailNo;
          accountControlName.value = toRaw(selectForm.value).journalList[i][
            "journalDetailList"
          ][j].accountControlName;
          accountControlType.value = toRaw(selectForm.value).journalList[i][
            "journalDetailList"
          ][j].accountControlType;
          journalDescription.value = toRaw(selectForm.value).journalList[i][
            "journalDetailList"
          ][j].journalDescription;
        }
        count++;
      }
    }
  }
});

// 어음상세 선택 Tab 감시
watch(noteDetailTabNumer, () => {
  if (noteDetailTabNumer.value !== -1) {
    let count = 0;
    for (let i = 0; i < toRaw(accountStore().slipForm.noteDetail).length; i++) {
      if (noteDetailTabNumer.value === count) {
        journalNo3.value = toRaw(accountStore().slipForm.noteDetail)[
          i
        ].journalNo;
        noteType.value = toRaw(accountStore().slipForm.noteDetail)[i].noteType;
        noteNo.value = toRaw(accountStore().slipForm.noteDetail)[i].noteNo;
        accountInnerCode.value = toRaw(accountStore().slipForm.noteDetail)[
          i
        ].accountInnerCode;
        drawer.value = toRaw(accountStore().slipForm.noteDetail)[i].drawer;
        endorser.value = toRaw(accountStore().slipForm.noteDetail)[i].endorser;
        drawee.value = toRaw(accountStore().slipForm.noteDetail)[i].drawee;
        issuanceDate.value = toRaw(accountStore().slipForm.noteDetail)[
          i
        ].issuanceDate;
        maturityDate.value = toRaw(accountStore().slipForm.noteDetail)[
          i
        ].maturityDate;
      }
      count++;
    }
  }
});

// 전표 승인
const approvalSlip = async () => {
  isApprovalSlipSnackBarVisible.value = true;

  const Year = toDay.getFullYear().toString();
  const Month = String(toDay.getMonth() + 1).padStart(2, "0");
  const Date = String(toDay.getDate()).padStart(2, "0");

  const updateSlipList = [];
  for (let length = 0; length < selectedSlipList.value.length; length++) {
    await accountStore().FETCH_SLIP(selectedSlipList.value[length].slipNo);

    updateSlipList.push({
      slipNo: accountStore().slipForm.slipNo,
      accountPeriodNo: accountStore().slipForm.accountPeriodNo,
      slipType: accountStore().slipForm.slipType,
      deptCode: accountStore().slipForm.deptCode,
      expenseReport: accountStore().slipForm.expenseReport,
      authorizationStatus: accountStore().slipForm.authorizationStatus,
      postingDate: accountStore().slipForm.postingDate,
      reportingDate: accountStore().slipForm.reportingDate,
      reportingEmpCode: accountStore().slipForm.reportingEmpCode,
      reportingEmpName: accountStore().slipForm.reportingEmpName,
      journalList: toRaw(accountStore().slipForm.journalList),
      approvalDate: `${Year}-${Month}-${Date}`,
      approvalEmpCode: "EMP-01",
      slipStatus: "승인",
    });
  }

  console.log("승인 폼", { slipList: updateSlipList });

  const updateSlipForm = { slipList: updateSlipList };

  await accountStore().APPROVAL_SLIP(updateSlipForm);

  // 선택 초기화
  selectedSlip.value = [];
  selectedSlipNo.value = "";
  selectedSlipStatus.value = "";

  console.log(searchTermStatus.value);
  // table reloading
  if (searchTermStatus.value === "1.승인" || searchTermStatus.value === "2.반려") fetchStatusData(searchTermStatus.value.substring(2))
  else if (searchTermStatus.value === "3.미결") fetchUnproData();
  else fetchData();

  rowSelect.value = false;
};

// 전표 반려
const approvalSlipBack = async () => {
  isApprovalSlipBackSnackBarVisible.value = true;

  const updateSlipList = [];
  for (let length = 0; length < selectedSlipList.value.length; length++) {
    await accountStore().FETCH_SLIP(selectedSlipList.value[length].slipNo);

    updateSlipList.push({
      slipNo: accountStore().slipForm.slipNo,
      accountPeriodNo: accountStore().slipForm.accountPeriodNo,
      slipType: accountStore().slipForm.slipType,
      deptCode: accountStore().slipForm.deptCode,
      expenseReport: accountStore().slipForm.expenseReport,
      authorizationStatus: accountStore().slipForm.authorizationStatus,
      postingDate: accountStore().slipForm.postingDate,
      reportingDate: accountStore().slipForm.reportingDate,
      reportingEmpCode: accountStore().slipForm.reportingEmpCode,
      reportingEmpName: accountStore().slipForm.reportingEmpName,
      journalList: toRaw(accountStore().slipForm.journalList),
      approvalDate: "",
      approvalEmpCode: "",
      slipStatus: "반려",
    });
  }

  console.log("반려 폼", { slipList: updateSlipList });

  const updateSlipForm = { slipList: updateSlipList };

  await accountStore().APPROVAL_SLIP(updateSlipForm);

  // 선택 초기화
  selectedSlip.value = [];
  selectedSlipNo.value = "";
  selectedSlipStatus.value = "";

  // table reloading
  if (searchTermStatus.value === "1.승인" || searchTermStatus.value === "2.반려") fetchStatusData(searchTermStatus.value.substring(2))
  else if (searchTermStatus.value === "3.미결") fetchUnproData();
  else fetchData();

  rowSelect.value = false;
};

// 승인 취소
const approvalCancel = async () => {
  isApprovalCancelSnackBarVisible.value = true;

  const updateSlipList = [];
  for (let length = 0; length < selectedSlipList.value.length; length++) {
    await accountStore().FETCH_SLIP(selectedSlipList.value[length].slipNo);

    updateSlipList.push({
      slipNo: accountStore().slipForm.slipNo,
      accountPeriodNo: accountStore().slipForm.accountPeriodNo,
      slipType: accountStore().slipForm.slipType,
      deptCode: accountStore().slipForm.deptCode,
      expenseReport: accountStore().slipForm.expenseReport,
      authorizationStatus: accountStore().slipForm.authorizationStatus,
      postingDate: accountStore().slipForm.postingDate,
      reportingDate: accountStore().slipForm.reportingDate,
      reportingEmpCode: accountStore().slipForm.reportingEmpCode,
      reportingEmpName: accountStore().slipForm.reportingEmpName,
      journalList: toRaw(accountStore().slipForm.journalList),
      approvalDate: "",
      approvalEmpCode: "",
      slipStatus: "",
    });
  }

  console.log("취소 폼", { slipList: updateSlipList });

  const updateSlipForm = { slipList: updateSlipList };

  await accountStore().APPROVAL_SLIP(updateSlipForm);

  // 선택 초기화
  selectedSlip.value = [];
  selectedSlipNo.value = "";
  selectedSlipStatus.value = "";

  // table reloading
  if (searchTermStatus.value === "1.승인" || searchTermStatus.value === "2.반려") fetchStatusData(searchTermStatus.value.substring(2))
  else if (searchTermStatus.value === "3.미결") fetchUnproData();
  else fetchData();

  rowSelect.value = false;
};

// 전표 승인 가능 체크
const approvalSlipCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (
      selectedSlipStatus.value === "승인" ||
      selectedSlipStatus.value === "반려"
    ) {
      isFailedSnackBarVisible.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedSlipStatus.value = "";
    } else approvalSlip();
  } else {
    approvalFlag.value = true;
    for (let i = 0; i < selectedSlipList.value.length; i++) {
      if (
        selectedSlipList.value[i].slipStatus === "승인" ||
        selectedSlipList.value[i].slipStatus === "반려"
      ) {
        isFailedSnackBarVisible2.value = true;
        approvalFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedSlipStatus.value = "";
        break;
      }
    }
    if (approvalFlag.value) approvalSlip();
  }
};

// 전표 반려 가능 체크
const approvalSlipBackCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (
      selectedSlipStatus.value === "승인" ||
      selectedSlipStatus.value === "반려"
    ) {
      isFailedSnackBarVisible.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedSlipStatus.value = "";
    } else approvalSlipBack();
  } else {
    approvalBackFlag.value = true;
    for (let i = 0; i < selectedSlipList.value.length; i++) {
      if (
        selectedSlipList.value[i].slipStatus === "승인" ||
        selectedSlipList.value[i].slipStatus === "반려"
      ) {
        isFailedSnackBarVisible2.value = true;
        approvalBackFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedSlipStatus.value = "";
        break;
      }
    }
    if (approvalBackFlag.value) approvalSlipBack();
  }
};

// 승인 취소 가능 체크
const approvalCancelCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (selectedSlipStatus.value === null) {
      isCancelFailedSnackBarVisible.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedSlipStatus.value = "";
    } else if (
      selectedSlipStatus.value === "승인" &&
      parseInt(selectedSlipList.value[0].approvalDate.substring(0, 4)) < nowYear
    ) {
      isCancelFailedSnackBarVisible3.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedSlipStatus.value = "";
    } else approvalCancel();
  } else {
    approvalCancelFlag.value = true;
    for (let i = 0; i < selectedSlipList.value.length; i++) {
      if (selectedSlipList.value[i].slipStatus === null) {
        isCancelFailedSnackBarVisible2.value = true;
        approvalCancelFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedSlipStatus.value = "";
        break;
      } else if (
        selectedSlipList.value[i].slipStatus === "승인" &&
        parseInt(selectedSlipList.value[i].approvalDate.substring(0, 4)) <
          nowYear
      ) {
        isCancelFailedSnackBarVisible3.value = true;
        approvalCancelFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedSlipStatus.value = "";
      }
    }
    if (approvalCancelFlag.value) approvalCancel();
  }
};
</script>

<template>
  <p class="text-2xl mb-6">전표 승인</p>
  <VCard class="mb-6">
    <div class="custom-search">
      <VRow>
        <VCol md="4">
          <VCardText>
            <VFormGroup>
              <VTextField
                v-model="searchTermNo"
                label="전표일렬번호"
                append-inner-icon="tabler-search"
                type="text"
              />
            </VFormGroup>
          </VCardText>
        </VCol>
        <VCol md="4">
          <VCardText>
            <VFormGroup>
              <VTextField
                v-model="searchTermReport"
                label="품의내역"
                append-inner-icon="tabler-search"
                type="text"
              />
            </VFormGroup>
          </VCardText>
        </VCol>
        <VCol md="4">
          <VCardText>
            <VFormGroup>
              <VSelect
                v-model="searchTermStatus"
                label="승인상태"
                :items="options"
              />
            </VFormGroup>
          </VCardText>
        </VCol>
      </VRow>
    </div>
  </VCard>
  <VCard>
    <div
      class="app-user-search-filter d-flex align-center flex-wrap gap-4 justify-end"
      style="margin: 10px 10px"
    >
      <AppTextField
        v-if="getSelects"
        v-model="selectedSlipNo"
        placeholder="Selected SlipNo"
        style="width: 130px"
        append-inner-icon="tabler-x"
        @click:append-inner="resetSelect"
      />
      <VBtn color="primary" @click="approvalSlipCheck">
        <VIcon start icon="tabler-checkbox" size="22" />
        전표승인
      </VBtn>
      <VBtn color="primary" @click="approvalSlipBackCheck">
        <VIcon start icon="tabler-player-pause" size="22" />
        전표반려
      </VBtn>
      <VBtn color="primary" @click="approvalCancelCheck">
        <VIcon start icon="tabler-player-stop" size="22" />
        승인 / 반려 취소
      </VBtn>
    </div>
    <VDataTable
      v-model="selectedSlip"
      :headers="column"
      :items="productList"
      :search="currentSearchTerm"
      :items-per-page="5"
      class="text-no-wrap"
      density="compact"
      show-select
      select-strategy="page"
      return-object
      @click:row="showDetails"
      @mouseenter="handleMouseEnter"
    />
    <VTooltip
      v-model="tooltipVisible"
      location="bottom"
      activator="parent"
      transition="scroll-y-transition"
    >
      <span>상세보기</span>
    </VTooltip>
  </VCard>
  <!-- 상세보기 카드 -->
  <div class="text-2xl mb-2" style="margin: 25px 0 0 0">
    <VCard v-if="rowSelect">
      <VTabs v-model="userTab" class="v-tabs-pill">
        <VTab v-for="tab in tabs" :key="tab.icon">
          <VIcon :size="22" :icon="tab.icon" />&nbsp;
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
      <!-- 전표 정보 -->
      <VCard v-if="slipData" class="mb-6">
        <VCardText>
          <VRow>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="slipNo" label="전표일렬번호" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="accountPeriodNo" label="기수" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="slipType" label="전표유형" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="deptCode" label="부서코드" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="deptName" label="부서명" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="expenseReport"
                label="품의내역"
                type="text"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="reportingEmpCode"
                label="작성자코드"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="reportingEmpName"
                label="작성자명"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="approvalEmpName"
                label="승인자명"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="postingDate"
                label="사용일자"
                type="date"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="reportingDate"
                label="작성일자"
                type="date"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="slipStatus" label="승인상태" readonly />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <!-- 분개 정보 -->
      <VCard v-if="journalData">
        <VTabs v-model="journalTabNumer">
          <VTab v-for="tab in journalTabs" :key="tab.icon">
            <span>{{ tab.title }}&nbsp;</span>
            <VIcon :size="20" :icon="tab.icon" class="me-1" />
          </VTab>
        </VTabs>

        <VCardText>
          <VRow>
            <VCol cols="12" sm="6" md="8">
              <AppTextField v-model="journalNo" label="분개일렬번호" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="accountCode" label="계정코드" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="accountName" label="계정과목" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="customerCode"
                label="거래처코드"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="customerName" label="거래처명" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppSelect v-model="balanceDivision" label="대차구분" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="leftDebitPrice" label="차변" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="rightCreditPrice" label="대변" readonly />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <!-- 분개상세 정보 -->
      <VCard v-if="journalDetailData">
        <VTabs v-model="journalDetailTabNumer">
          <VTab v-for="tab in journalDetailTabs" :key="tab.icon">
            <span>{{ tab.title }}&nbsp;</span>
            <VIcon :size="20" :icon="tab.icon" class="me-1" />
          </VTab>
        </VTabs>

        <VCardText>
          <VRow>
            <VCol cols="12" sm="6" md="8">
              <AppTextField
                v-model="journalNo2"
                label="분개일렬번호"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="journalDetailNo"
                label="분개상세번호"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="accountControlName"
                label="분개상세항목"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="accountControlType"
                label="코드"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="journalDescription"
                label="상세내용"
                readonly
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <!-- 어음상세 정보 -->
      <VCard v-if="noteDetailData">
        <VTabs v-model="noteDetailTabNumer">
          <VTab v-for="tab in noteDetailTabs" :key="tab.icon">
            <span>{{ tab.title }}&nbsp;</span>
            <VIcon :size="20" :icon="tab.icon" class="me-1" />
          </VTab>
        </VTabs>

        <VCardText>
          <VRow>
            <VCol cols="12" sm="6" md="8">
              <AppTextField
                v-model="journalNo3"
                label="분개일렬번호"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="noteType" label="어음유형" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="8">
              <AppTextField v-model="noteNo" label="어음번호" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="accountInnerCode"
                label="계정코드"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="drawer" label="발행인" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="endorser" label="배서인" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="drawee" label="수금사원" readonly />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="issuanceDate"
                label="발행일자"
                type="date"
                readonly
              />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField
                v-model="maturityDate"
                label="만기일자"
                type="date"
                readonly
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCard>
  </div>
  <!-- 전표 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isRequestSelectSlipSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    전표를 선택해주세요.
  </VSnackbar>
  <!-- 전표 승인 알림 스낵바 -->
  <VSnackbar
    v-model="isApprovalSlipSnackBarVisible"
    location="top"
    color="success"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    전표가 승인 되었습니다.
  </VSnackbar>
  <!-- 전표 반려 알림 스낵바 -->
  <VSnackbar
    v-model="isApprovalSlipBackSnackBarVisible"
    location="top"
    color="error"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    전표가 반려 되었습니다.
  </VSnackbar>
  <!-- 승인 취소 알림 스낵바 -->
  <VSnackbar
    v-model="isApprovalCancelSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-square-rounded-minus" />
    승인 / 반려 취소 되었습니다.
  </VSnackbar>
  <!-- 승인 / 반려 실패 스낵바 -->
  <VSnackbar
    v-model="isFailedSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    이미 승인 / 반려되었습니다.
  </VSnackbar>
  <!-- 승인 / 반려 실패 스낵바2 -->
  <VSnackbar
    v-model="isFailedSnackBarVisible2"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    이미 승인 / 반려된 전표가 있습니다.
  </VSnackbar>
  <!-- 승인 취소 실패 스낵바 -->
  <VSnackbar
    v-model="isCancelFailedSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    아직 승인 / 반려 처리가 되지않았습니다.
  </VSnackbar>
  <!-- 승인 취소 실패 스낵바2 -->
  <VSnackbar
    v-model="isCancelFailedSnackBarVisible2"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    승인 / 반려 처리가 되지않은 전표가 있습니다.
  </VSnackbar>
  <!-- 승인 취소 실패 스낵바3 -->
  <VSnackbar
    v-model="isCancelFailedSnackBarVisible3"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    승인 후 1년이 경화한 전표는 취소할 수 없습니다.
  </VSnackbar>
</template>
