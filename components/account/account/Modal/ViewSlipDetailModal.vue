<script setup lang="ts">
import { accountStore } from "@/store/account/account";

const propz = defineProps(["selectedSlipData"]);
const emit = defineEmits(["isDialogClose", "callDelete"]);

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
const postingDate = ref("");
const reportingDate = ref("");

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

// 모달에 띄울 데이터
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

const tabs = [
  { icon: "tabler-pencil", title: "전표" },
  { icon: "tabler-message", title: "분개" },
  { icon: "tabler-message-circle", title: "분개상세" },
  { icon: "tabler-database", title: "어음상세" },
];

const isDialogClose = () => {
  userTab.value = 0;
  journalTabNumer.value = -1;
  journalDetailTabNumer.value = -1;
  noteDetailTabNumer.value = -1;
  emit("isDialogClose");
};

// 모달에서 삭제요청
const callDelete = () => {
  emit("callDelete");
};

// 전표 선택 감시
watch(
  () => propz.selectedSlipData,
  async () => {
    // 재선택시 Tab전부 비우기
    userTab.value = 0;
    journalTabs.value = [];
    journalTabNumer.value = -1;
    journalDetailTabs.value = [];
    journalDetailTabNumer.value = -1;
    noteDetailTabs.value = [];
    noteDetailTabNumer.value = -1;

    if (propz.selectedSlipData.length === 1) {
      await accountStore().FETCH_SLIP(propz.selectedSlipData[0].slipNo);

      accountPeriodNo.value = toRaw(accountStore().slipForm).accountPeriodNo;
      slipNo.value = toRaw(accountStore().slipForm).slipNo;
      slipType.value = toRaw(accountStore().slipForm).slipType;
      deptCode.value = toRaw(accountStore().slipForm).deptCode;
      deptName.value = toRaw(accountStore().slipForm).deptName;
      expenseReport.value = toRaw(accountStore().slipForm).expenseReport;
      postingDate.value = toRaw(accountStore().slipForm).postingDate;
      reportingDate.value = toRaw(accountStore().slipForm).reportingDate;
      reportingEmpCode.value = toRaw(accountStore().slipForm).reportingEmpCode;
      reportingEmpName.value = toRaw(accountStore().slipForm).reportingEmpName;

      await accountStore().FETCH_ALL_JOURNAL(propz.selectedSlipData[0].slipNo);
      for (let i = 0; i < accountStore().allJournalList.length; i++) {
        journalTabs.value.push({
          icon: `tabler-pentagon-number-${i + 1}`,
          title: "분개",
        });
      }
      let journalDetailCount = 1;
      let noteDetailCount = 1;
      for (let i = 0; i < accountStore().allJournalList.length; i++) {
        for (
          let j = 0;
          j < accountStore().allJournalList[i]["journalDetailList"].length;
          j++
        ) {
          journalDetailTabs.value.push({
            icon: `tabler-hexagon-number-${journalDetailCount}`,
            title: "분개상세",
          });
          journalDetailCount++;
        }
        if (
          accountStore().allJournalList[i]["accountCode"] === "0110" ||
          accountStore().allJournalList[i]["accountCode"] === "0252"
        ) {
          noteDetailTabs.value.push({
            icon: `tabler-hexagon-number-${noteDetailCount}`,
            title: "어음상세",
          });
          noteDetailCount++;
        }
      }
    } else {
      accountPeriodNo.value = "";
      slipNo.value = "";
      slipType.value = "";
      deptCode.value = "";
      deptName.value = "";
      expenseReport.value = "";
      postingDate.value = "";
      reportingDate.value = "";
      reportingEmpCode.value = "";
      reportingEmpName.value = "";
    }
  }
);

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
    for (let i = 0; i < accountStore().allJournalList.length; i++) {
      if (journalTabNumer.value === i) {
        journalNo.value = accountStore().allJournalList[i].journalNo;
        accountCode.value = accountStore().allJournalList[i].accountCode;
        accountName.value = accountStore().allJournalList[i].accountName;
        balanceDivision.value =
          accountStore().allJournalList[i].balanceDivision;
        customerCode.value = accountStore().allJournalList[i].customerCode;
        customerName.value = accountStore().allJournalList[i].customerName;
        leftDebitPrice.value = accountStore().allJournalList[i].leftDebitPrice;
        rightCreditPrice.value =
          accountStore().allJournalList[i].rightCreditPrice;
        break;
      }
    }
  }
});

// 분개상세 선택 Tab 감시
watch(journalDetailTabNumer, () => {
  if (journalDetailTabNumer.value !== -1) {
    let count = 0;
    for (let i = 0; i < accountStore().allJournalList.length; i++) {
      for (
        let j = 0;
        j < accountStore().allJournalList[i]["journalDetailList"].length;
        j++
      ) {
        if (journalDetailTabNumer.value === count) {
          journalNo2.value =
            accountStore().allJournalList[i]["journalDetailList"][j].journalNo;
          journalDetailNo.value =
            accountStore().allJournalList[i]["journalDetailList"][
              j
            ].journalDetailNo;
          accountControlName.value =
            accountStore().allJournalList[i]["journalDetailList"][
              j
            ].accountControlName;
          accountControlType.value =
            accountStore().allJournalList[i]["journalDetailList"][
              j
            ].accountControlType;
          journalDescription.value =
            accountStore().allJournalList[i]["journalDetailList"][
              j
            ].journalDescription;
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
</script>

<template>
  <VDialog max-width="700">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogClose" />
    <VTabs v-model="userTab" class="v-tabs-pill">
      <VTab v-for="tab in tabs" :key="tab.icon">
        <VIcon :size="22" :icon="tab.icon" />&nbsp;
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>
    <!-- 전표 정보 -->
    <VCard title="전표 정보" v-if="slipData">
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
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn color="primary" @click="callDelete">
          <VIcon start icon="tabler-trash" size="22" />
          삭제
        </VBtn>
      </VCardText>
    </VCard>
    <!-- 분개 정보 -->
    <VCard title="분개 정보" v-if="journalData">
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
            <AppTextField v-model="customerCode" label="거래처코드" readonly />
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

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn color="primary" @click="callDelete">
          <VIcon start icon="tabler-trash" size="22" />
          삭제
        </VBtn>
      </VCardText>
    </VCard>
    <!-- 분개상세 정보 -->
    <VCard title="분개상세 정보" v-if="journalDetailData">
      <VTabs v-model="journalDetailTabNumer">
        <VTab v-for="tab in journalDetailTabs" :key="tab.icon">
          <span>{{ tab.title }}&nbsp;</span>
          <VIcon :size="20" :icon="tab.icon" class="me-1" />
        </VTab>
      </VTabs>

      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="8">
            <AppTextField v-model="journalNo2" label="분개일렬번호" readonly />
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
            <AppTextField v-model="accountControlType" label="코드" readonly />
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

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn color="primary" @click="callDelete">
          <VIcon start icon="tabler-trash" size="22" />
          삭제
        </VBtn>
      </VCardText>
    </VCard>
    <!-- 어음상세 정보 -->
    <VCard title="어음상세 정보" v-if="noteDetailData">
      <VTabs v-model="noteDetailTabNumer">
        <VTab v-for="tab in noteDetailTabs" :key="tab.icon">
          <span>{{ tab.title }}&nbsp;</span>
          <VIcon :size="20" :icon="tab.icon" class="me-1" />
        </VTab>
      </VTabs>

      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="8">
            <AppTextField v-model="journalNo3" label="분개일렬번호" readonly />
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

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn color="primary" @click="callDelete">
          <VIcon start icon="tabler-trash" size="22" />
          삭제
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
