<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { useRouter } from "vue-router";
import type { RouteLocationRaw } from "#vue-router";
import { accountStore } from "@/store/account/account";
import EditSlipModal from "@/components/account/account/Modal/EditSlipModal.vue";
import EditJournalModal from "@/components/account/account/Modal/EditJournalModal.vue";
import EditJournalDetailModal from "@/components/account/account/Modal/EditJournalDetailModal.vue";
import EditNoteDetailModal from "@/components/account/account/Modal/EditNoteDetailModal.vue";

// 페이지 이동시 사용될 router
const router = useRouter();

// 테이블 데이터
const originSlipForm: Ref<any[]> = ref([]);
const originJournalForm: Ref<any[]> = ref([]); // ref([])로 선언한 리스트는 Array<never> 이라 push사용 불가
const originJournalDetailForm: Ref<any[]> = ref([]);
const originNoteDetailForm: Ref<any[]> = ref([]);

const isEditSlipDialogVisible = ref(false);
const isEditJournalDialogVisible = ref(false);
const isEditJournalDetailDialogVisible = ref(false);
const isEditNoteDetailDialogVisible = ref(false);

const isSaveSnackbarVisible = ref(false);
const isCancelSnackbarVisible = ref(false);
const isRequestSelectJournalSnackBarVisible = ref(false);
const isRequestSelectJournalDetailSnackBarVisible = ref(false);
const isRequestSelectNoteDetailSnackBarVisible = ref(false);

const isJournalDetailExist = ref(true);
const isNoteDetailExist = ref(true);

const selectedJournal = ref([]);
const selectedJournalNo = ref("");
const selectedJournalDetail = ref([]);
const selectedJournalDetailNo = ref("");
const selectedNoteDetail = ref([]);
const selectedNoteDetailNo = ref("");

// 대차 합계 확인
const totalPrice = ref(0);
const clearPriceState = ref(false);

// 전표테이블 헤더
const slipField = [
  { title: "전표일련번호", key: "slipNo" },
  { title: "기수일련번호", key: "accountPeriodNo" },
  { title: "전표유형", key: "slipType" },
  { title: "부서명", key: "deptName" },
  { title: "품의내역", key: "expenseReport" },
  { title: "사용일자", key: "postingDate" },
  { title: "작성일자", key: "reportingDate" },
  { title: "작성자코드", key: "reportingEmpCode" },
  { title: "작성자명", key: "reportingEmpName" },
];

// 분개테이블 헤더
const journalField = [
  { title: "분개일련번호", key: "journalNo" },
  { title: "계정코드", key: "accountCode" },
  { title: "계정과목", key: "accountName" },
  { title: "거래처코드", key: "customerCode" },
  { title: "거래처명", key: "customerName" },
  { title: "대차구분", key: "balanceDivision" },
  { title: "차변금액", key: "leftDebitPrice" },
  { title: "대변금액", key: "rightCreditPrice" },
];

// 분개상세테이블 헤더
const journalDetailField = [
  { title: "분개상세번호", key: "journalDetailNo" },
  { title: "분개번호", key: "journalNo" },
  { title: "분개상세항목", key: "accountControlName" },
  { title: "코드", key: "accountControlType" },
  { title: "상세내용", key: "journalDescription" },
  { title: "", key: "showDetails" },
];

// 어음상세테이블 헤더
const noteDetailField = [
  { title: "어음번호", key: "noteNo", width: "250px" },
  { title: "분개일렬번호", key: "journalNo" },
  { title: "어음유형", key: "noteType" },
  { title: "계정코드", key: "accountInnerCode" },
  { title: "발행인", key: "drawer" },
  { title: "배서인", key: "endorser" },
  { title: "수금사원", key: "drawee" },
  { title: "발행일자", key: "issuanceDate" },
  { title: "만기일자", key: "maturityDate" },
];

// 구 전표들중 분개 데이터가 하나라도 빠진 전표는 수정시 분개 데이터셋을 못불러옴
const fetchData = () => {
  const newSlipForm: any = [
    {
      slipNo: toRaw(accountStore().slipForm).slipNo,
      accountPeriodNo: toRaw(accountStore().slipForm).accountPeriodNo,
      slipType: toRaw(accountStore().slipForm).slipType,
      deptCode: toRaw(accountStore().slipForm).deptCode,
      deptName: toRaw(accountStore().slipForm).deptName,
      expenseReport: toRaw(accountStore().slipForm).expenseReport,
      postingDate: toRaw(accountStore().slipForm).postingDate,
      reportingDate: toRaw(accountStore().slipForm).reportingDate,
      reportingEmpCode: toRaw(accountStore().slipForm).reportingEmpCode,
      reportingEmpName: toRaw(accountStore().slipForm).reportingEmpName,
    },
  ];

  const newJournalList = [];
  const newJournalDetailList = [];
  for (let i = 0; i < toRaw(accountStore().slipForm).journalList.length; i++) {
    newJournalList.push({
      slipNo: toRaw(accountStore().slipForm).slipNo,
      journalNo: toRaw(accountStore().slipForm).journalList[i].journalNo,
      accountCode: toRaw(accountStore().slipForm).journalList[i].accountCode,
      accountName: toRaw(accountStore().slipForm).journalList[i].accountName,
      customerCode: toRaw(accountStore().slipForm).journalList[i].customerCode,
      customerName: toRaw(accountStore().slipForm).journalList[i].customerName,
      balanceDivision: toRaw(accountStore().slipForm).journalList[i]
        .balanceDivision,
      leftDebitPrice: toRaw(accountStore().slipForm).journalList[i]
        .leftDebitPrice,
      rightCreditPrice: toRaw(accountStore().slipForm).journalList[i]
        .rightCreditPrice,
    });

    for (
      let j = 0;
      j <
      toRaw(accountStore().slipForm).journalList[i]["journalDetailList"].length;
      j++
    ) {
      newJournalDetailList.push({
        journalDetailNo: toRaw(accountStore().slipForm).journalList[i]
          .journalDetailList[j].journalDetailNo,
        journalNo: toRaw(accountStore().slipForm).journalList[i]
          .journalDetailList[j].journalNo,
        accountControlName: toRaw(accountStore().slipForm).journalList[i]
          .journalDetailList[j].accountControlName,
        accountControlType: toRaw(accountStore().slipForm).journalList[i]
          .journalDetailList[j].accountControlType,
        journalDescription: toRaw(accountStore().slipForm).journalList[i]
          .journalDetailList[j].journalDescription,
      });
    }
  }

  const newNoteDetailList = [];
  for (let i = 0; i < toRaw(accountStore().slipForm).noteDetail.length; i++) {
    newNoteDetailList.push({
      journalNo: toRaw(accountStore().slipForm).noteDetail[i].journalNo,
      noteNo: toRaw(accountStore().slipForm).noteDetail[i].noteNo,
      noteType: toRaw(accountStore().slipForm).noteDetail[i].noteType,
      accountInnerCode: toRaw(accountStore().slipForm).noteDetail[i]
        .accountInnerCode,
      drawer: toRaw(accountStore().slipForm).noteDetail[i].drawer,
      endorser: toRaw(accountStore().slipForm).noteDetail[i].endorser,
      drawee: toRaw(accountStore().slipForm).noteDetail[i].drawee,
      issuanceDate: toRaw(accountStore().slipForm).noteDetail[i].issuanceDate,
      maturityDate: toRaw(accountStore().slipForm).noteDetail[i].maturityDate,
    });
  }

  originSlipForm.value = newSlipForm;
  originJournalForm.value = newJournalList;
  originJournalDetailForm.value = newJournalDetailList;
  originNoteDetailForm.value = newNoteDetailList;

  if (originJournalDetailForm.value.length === 0)
    isJournalDetailExist.value = false;
  if (originNoteDetailForm.value.length === 0) isNoteDetailExist.value = false;
};

onMounted(() => {
  fetchData();
});

// 분개 번호 선택
watch(selectedJournal, async (selectedValue: any) => {
  if (toRaw(selectedValue.length) === 0) selectedJournalNo.value = "";
  else selectedJournalNo.value = toRaw(selectedValue[0]["journalNo"]);
});

// 분개상세 번호 선택
watch(selectedJournalDetail, async (selectedValue: any) => {
  if (toRaw(selectedValue.length) === 0) selectedJournalDetailNo.value = "";
  else
    selectedJournalDetailNo.value = toRaw(selectedValue[0]["journalDetailNo"]);
});

// 어음상세 번호 선택
watch(selectedNoteDetail, async (selectedValue: any) => {
  if (toRaw(selectedValue.length) === 0) selectedNoteDetailNo.value = "";
  else selectedNoteDetailNo.value = toRaw(selectedValue[0]["noteNo"]);
});

// 분개 선택 확인
const selectJournalCheck = () => {
  if (selectedJournalNo.value === "")
    isRequestSelectJournalSnackBarVisible.value = true;
  else isEditJournalDialogVisible.value = true;
};

// 분개상세 선택 확인
const selectJournalDetailCheck = () => {
  if (selectedJournalDetailNo.value === "")
    isRequestSelectJournalDetailSnackBarVisible.value = true;
  else isEditJournalDetailDialogVisible.value = true;
};

// 어음상세 선택 확인
const selectNoteDetailCheck = () => {
  if (selectedNoteDetailNo.value === "")
    isRequestSelectNoteDetailSnackBarVisible.value = true;
  else isEditNoteDetailDialogVisible.value = true;
};

// 전표 수정
const editSlipData = (editData: any) => {
  originSlipForm.value = editData;
};

// 분개 수정
const editJournalData = (editData: any) => {
  const index = editData[0].index;

  originJournalForm.value[index] = editData[0];
  totalPrice.value = 0;
  for (let i = 0; i < originJournalForm.value.length; i++) {
    totalPrice.value +=
      originJournalForm.value[i].leftDebitPrice -
      originJournalForm.value[i].rightCreditPrice;
  }
  if (totalPrice.value === 0) clearPriceState.value = false;
  else clearPriceState.value = true;

  selectedJournalNo.value = "";
};

// 분개상세 수정
const editJournalDetailData = (editData: any) => {
  const index = editData[0].index;

  originJournalDetailForm.value[index] = editData[0];
  selectedJournalDetailNo.value = "";
};

// 어음상세 수정
const editNoteDetailData = (editData: any) => {
  const index = editData[0].index;

  originNoteDetailForm.value[index] = editData[0];
  selectedNoteDetailNo.value = "";
};

// DB 저장
const saveEditSlipToDB = async () => {
  const editJournalList = [];
  for (let i = 0; i < originJournalForm.value.length; i++) {
    const flag = ref(false);
    const editJournalDetailList = [];
    for (let j = 0; j < originJournalDetailForm.value.length; j++) {
      if (
        originJournalForm.value[i].journalNo ===
        originJournalDetailForm.value[j].journalNo
      ) {
        editJournalDetailList.push({
          journalDetailNo: originJournalDetailForm.value[j].journalDetailNo,
          journalNo: originJournalDetailForm.value[j].journalNo,
          accountControlName:
            originJournalDetailForm.value[j].accountControlName,
          accountControlType:
            originJournalDetailForm.value[j].accountControlType,
          journalDescription:
            originJournalDetailForm.value[j].journalDescription,
        });
        flag.value = true;
      }
    }
    if (flag.value) {
      editJournalList.push({
        slipNo: originSlipForm.value[0].slipNo,
        journalNo: originJournalForm.value[i].journalNo,
        accountCode: originJournalForm.value[i].accountCode,
        accountName: originJournalForm.value[i].accountName,
        balanceDivision: originJournalForm.value[i].balanceDivision,
        customerCode: originJournalForm.value[i].customerCode,
        customerName: originJournalForm.value[i].customerName,
        leftDebitPrice: originJournalForm.value[i].leftDebitPrice,
        rightCreditPrice: originJournalForm.value[i].rightCreditPrice,
        journalDetailList: editJournalDetailList,
      });
    } else {
      editJournalList.push({
        slipNo: originSlipForm.value[0].slipNo,
        journalNo: originJournalForm.value[i].journalNo,
        accountCode: originJournalForm.value[i].accountCode,
        accountName: originJournalForm.value[i].accountName,
        balanceDivision: originJournalForm.value[i].balanceDivision,
        customerCode: originJournalForm.value[i].customerCode,
        customerName: originJournalForm.value[i].customerName,
        leftDebitPrice: originJournalForm.value[i].leftDebitPrice,
        rightCreditPrice: originJournalForm.value[i].rightCreditPrice,
        journalDetailList: [],
      });
    }
  }

  console.log("수정분개", editJournalList);

  const resultEditSlipForm: any = [
    {
      slipNo: originSlipForm.value[0].slipNo,
      accountPeriodNo: originSlipForm.value[0].accountPeriodNo,
      slipType: originSlipForm.value[0].slipType,
      deptCode: originSlipForm.value[0].deptCode,
      reportingEmpCode: originSlipForm.value[0].reportingEmpCode,
      reportingEmpName: originSlipForm.value[0].reportingEmpName,
      expenseReport: originSlipForm.value[0].expenseReport,
      postingDate: originSlipForm.value[0].postingDate,
      reportingDate: originSlipForm.value[0].reportingDate,
      slipStatus: originSlipForm.value[0].slipStatus,
      status: originSlipForm.value[0].status,
      journalList: editJournalList,
      noteDetail: toRaw(originNoteDetailForm.value),
    },
  ];

  console.log("수정전표", resultEditSlipForm);

  await accountStore().EDIT_SLIP(resultEditSlipForm[0]);

  editSlipSuccess();
};

// 저장시 이동 페이지
const toProofReceipt: RouteLocationRaw = {
  name: "account-account-ReceiptFormPage",
};

// 취소시 이동 페이지
const toSlipForm: RouteLocationRaw = {
  name: "account-account-SlipFormPage",
};

const editSlipSuccess = () => {
  isSaveSnackbarVisible.value = true;

  setTimeout(() => {
    router.push(toProofReceipt);
  }, 500);
};

const editSlipCancel = () => {
  isCancelSnackbarVisible.value = true;

  setTimeout(() => {
    router.push(toSlipForm);
  }, 500);
};
</script>

<template>
  <p class="text-2xl mb-6">전표 수정</p>
  <div
    class="app-user-search-filter d-flex align-center flex-wrap gap-4 justify-end"
  >
    <VBtn @click="isEditSlipDialogVisible = !isEditSlipDialogVisible">
      <VIcon start icon="tabler-pencil-cog" size="22" />
      전표수정
    </VBtn>
    <VBtn @click="selectJournalCheck">
      <VIcon start icon="tabler-message-cog" size="22" />
      분개수정
    </VBtn>
    <VBtn v-if="isJournalDetailExist" @click="selectJournalDetailCheck">
      <VIcon start icon="tabler-message-circle-cog" size="22" />
      분개상세수정
    </VBtn>
    <VBtn v-if="isNoteDetailExist" @click="selectNoteDetailCheck">
      <VIcon start icon="tabler-database-cog" size="22" />
      어음상세수정
    </VBtn>
    <VBtnGroup style="height: 39px">
      <VBtn
        variant="tonal"
        :disabled="clearPriceState"
        @click="saveEditSlipToDB"
      >
        저장 <VIcon end icon="tabler-stack-push" size="22" />
      </VBtn>
      <VBtn color="secondary" @click="editSlipCancel">
        <VIcon start icon="tabler-arrow-back-up" size="22" /> 취소
      </VBtn>
    </VBtnGroup>
  </div>
  <div>
    <h1>전표</h1>
    <VDataTable :headers="slipField" :items="originSlipForm" />

    <h1>분개</h1>
    <VDataTable
      v-model="selectedJournal"
      :headers="journalField"
      :items="originJournalForm"
      show-select
      select-strategy="single"
      return-object
    />

    <h1 v-if="isJournalDetailExist">분개상세</h1>
    <VDataTable
      v-if="isJournalDetailExist"
      v-model="selectedJournalDetail"
      :headers="journalDetailField"
      :items="originJournalDetailForm"
      show-select
      select-strategy="single"
      return-object
    />

    <h1 v-if="isNoteDetailExist">어음상세</h1>
    <VDataTable
      v-if="isNoteDetailExist"
      v-model="selectedNoteDetail"
      :headers="noteDetailField"
      :items="originNoteDetailForm"
      show-select
      select-strategy="single"
      return-object
    />
  </div>

  <!-- 전표 수정 Dialog -->
  <EditSlipModal
    v-model="isEditSlipDialogVisible"
    :isEditSlipDialogOpen="isEditSlipDialogVisible"
    :slipData="originSlipForm"
    @isDialogClose="isEditSlipDialogVisible = !isEditSlipDialogVisible"
    @submit="editSlipData"
  />
  <!-- 분개 수정 Dialog -->
  <EditJournalModal
    v-model="isEditJournalDialogVisible"
    :isEditJournalDialogOpen="isEditJournalDialogVisible"
    :selectedJournalNo="selectedJournalNo"
    :journalData="originJournalForm"
    @isDialogClose="isEditJournalDialogVisible = !isEditJournalDialogVisible"
    @submit="editJournalData"
  />
  <!-- 분개상세 수정 Dialog -->
  <EditJournalDetailModal
    v-model="isEditJournalDetailDialogVisible"
    :isEditJournalDetailDialogOpen="isEditJournalDetailDialogVisible"
    :selectedJournalDetailNo="selectedJournalDetailNo"
    :journalDetailData="originJournalDetailForm"
    @isDialogClose="
      isEditJournalDetailDialogVisible = !isEditJournalDetailDialogVisible
    "
    @submit="editJournalDetailData"
  />
  <!-- 어음상세 수정 Dialog -->
  <EditNoteDetailModal
    v-model="isEditNoteDetailDialogVisible"
    :isEditNoteDetailDialogOpen="isEditNoteDetailDialogVisible"
    :selectedNoteDetailNo="selectedNoteDetailNo"
    :noteDetailData="originNoteDetailForm"
    @isDialogClose="
      isEditNoteDetailDialogVisible = !isEditNoteDetailDialogVisible
    "
    @submit="editNoteDetailData"
  />
  <!-- 저장시 스낵바 -->
  <VSnackbar
    v-model="isSaveSnackbarVisible"
    location="top"
    variant="tonal"
    color="success"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    수정이 완료되었습니다.
  </VSnackbar>
  <!-- 저장 취소시 스낵바 -->
  <VSnackbar
    v-model="isCancelSnackbarVisible"
    location="top"
    variant="tonal"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    수정이 취소되었습니다.
  </VSnackbar>
  <!-- 분개 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isRequestSelectJournalSnackBarVisible"
    location="top"
    variant="tonal"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    분개를 선택해주세요.
  </VSnackbar>
  <!-- 분개상세 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isRequestSelectJournalDetailSnackBarVisible"
    location="top"
    variant="tonal"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    분개상세를 선택해주세요.
  </VSnackbar>
  <!-- 어음상세 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isRequestSelectNoteDetailSnackBarVisible"
    location="top"
    variant="tonal"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    어음상세를 선택해주세요.
  </VSnackbar>
</template>

<style>
.justify-end {
  justify-content: flex-end;
}
</style>
