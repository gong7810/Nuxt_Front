<script setup lang="ts">
import AddDeptCodeModal from "@/components/account/account/Modal/AddDeptCoedModal.vue";

const propz = defineProps(["defenseSlip", "isDialogVisible"]);
const emit = defineEmits(["submit", "update:isDialogVisible"]);

// Dialog 데이터칼럼
const accountPeriodNo = ref("5");
const slipNo = ref("NEW");
const slipType = ref("결산");
const reportingEmpCode = ref("EMP-20");
const reportingEmpName = ref("한겨울");
const deptCode = ref("");
const deptName = ref("");
const expenseReport = ref("");
const postingDate = ref("");
const reportingDate = ref("");
const slipStatus = ref("");
const status = ref("");

const isDeptCodeDialogVisible = ref(false);

const isDeptSnackBarVisible = ref(false);
const isExpenseReportSnackBarVisible = ref(false);
const isPostingDateSnackBarVisible = ref(false);
const isReportingDateSnackBarVisible = ref(false);

const deptCodeSelected = ({ selected, row }: any) => {
  deptCode.value = row.internalItem.columns.deptCode;
  deptName.value = row.internalItem.columns.deptName;
};

// 오늘 날짜로 세팅
const setToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고, 두 자리로 표현
  const day = String(today.getDate()).padStart(2, "0"); // 날짜를 두 자리로 표현

  postingDate.value = `${year}-${month}-${day}`;
  reportingDate.value = `${year}-${month}-${day}`;
};

const resetData = () => {
  accountPeriodNo.value = "5";
  slipNo.value = "NEW";
  slipType.value = "결산";
  reportingEmpCode.value = "EMP-20";
  reportingEmpName.value = "한겨울";
  deptCode.value = "";
  deptName.value = "";
  expenseReport.value = "";
  postingDate.value = "";
  reportingDate.value = "";
};

const dialogModelValueUpdate = (val: boolean) => {
  emit("update:isDialogVisible", val);
};

const formSubmit = () => {
  if (!deptCode.value) {
    isDeptSnackBarVisible.value = true;
  } else if (!expenseReport.value) {
    isExpenseReportSnackBarVisible.value = true;
  } else if (!postingDate.value) {
    isPostingDateSnackBarVisible.value = true;
  } else if (!reportingDate.value) {
    isReportingDateSnackBarVisible.value = true;
  } else {
    const slipDetailsArray: any = [
      {
        accountPeriodNo: accountPeriodNo.value,
        slipNo: slipNo.value,
        slipType: slipType.value,
        deptCode: deptCode.value,
        deptName: deptName.value,
        reportingEmpCode: reportingEmpCode.value,
        reportingEmpName: reportingEmpName.value,
        expenseReport: expenseReport.value,
        postingDate: postingDate.value,
        reportingDate: reportingDate.value,
        slipStatus: slipStatus.value,
        status: status.value,
      },
    ];

    emit("submit", slipDetailsArray);
    resetData();

    dialogModelValueUpdate(false);
  }
};
</script>

<template>
  <VDialog
    :model-value="propz.isDialogVisible"
    max-width="600"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props" :disabled="defenseSlip">
        <VIcon start icon="tabler-pencil-plus" size="22" />
        전표추가
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard title="전표 추가">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="accountPeriodNo" label="기수" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="slipNo" label="전표일렬번호" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="slipType" label="전표유형" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="reportingEmpCode"
              label="작성자코드"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="deptCode"
              label="부서코드"
              @click="isDeptCodeDialogVisible = !isDeptCodeDialogVisible"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="expenseReport"
              label="품의내역"
              type="text"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="postingDate" label="사용일자" type="date" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="reportingDate"
              label="작성일자"
              type="date"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="outlined" @click="setToday">
          <VIcon start icon="tabler-calendar" />
          Today
        </VBtn>
        <VBtn
          variant="tonal"
          color="secondary"
          @click="dialogModelValueUpdate(false)"
        >
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-pencil-plus" size="22" />
          추가
        </VBtn>
      </VCardText>
    </VCard>

    <AddDeptCodeModal
      v-model="isDeptCodeDialogVisible"
      @selected="deptCodeSelected"
      @dialogClose="isDeptCodeDialogVisible = !isDeptCodeDialogVisible"
    />
  </VDialog>
  <!-- 부서 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isDeptSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    사용부서를 선택해주세요.
  </VSnackbar>
  <!-- 품의내역 작성 요청 스낵바 -->
  <VSnackbar
    v-model="isExpenseReportSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    품의내역을 입력해주세요.
  </VSnackbar>
  <!-- 사용일자 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isPostingDateSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    사용일자를 선택해주세요.
  </VSnackbar>
  <!-- 작성일자 선택 요청 스낵바 -->
  <VSnackbar
    v-model="isReportingDateSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    작성일자를 선택해주세요.
  </VSnackbar>
</template>
