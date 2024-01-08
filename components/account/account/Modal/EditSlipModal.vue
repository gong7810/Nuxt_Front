<script setup lang="ts">
import AddDeptCodeModal from '@/components/account/account/Modal/AddDeptCoedModal.vue'

const propz = defineProps(["isEditSlipDialogOpen", "slipData"]);
const emit = defineEmits(["submit", "isDialogClose"]);

// Dialog 데이터칼럼
const accountPeriodNo = ref("");
const slipNo = ref("");
const slipType = ref("");
const deptCode = ref("");
const deptName = ref("");
const expenseReport = ref("");
const postingDate = ref("");
const reportingDate = ref("");
const reportingEmpCode = ref("");
const reportingEmpName = ref("");
const slipStatus = ref(""); // null

const isDeptCodeDialogVisible = ref(false);

// Dialog 창이 켜질때 해당값 할당
watch(
  () => propz.isEditSlipDialogOpen,
  () => {
    accountPeriodNo.value = propz.slipData[0].accountPeriodNo;
    slipNo.value = propz.slipData[0].slipNo;
    slipType.value = propz.slipData[0].slipType;
    deptCode.value = propz.slipData[0].deptCode;
    deptName.value = propz.slipData[0].deptName;
    expenseReport.value = propz.slipData[0].expenseReport;
    postingDate.value = propz.slipData[0].postingDate;
    reportingDate.value = propz.slipData[0].reportingDate;
    reportingEmpCode.value = propz.slipData[0].reportingEmpCode;
    reportingEmpName.value = propz.slipData[0].reportingEmpName;
    slipStatus.value = propz.slipData[0].slipStatus; // null
  }
);

const deptCodeSelected = ({ selected, row }: any) => {
  deptCode.value = row.internalItem.columns.deptCode;
  deptName.value = row.internalItem.columns.deptName;
};

const dialogClose = () => {
  emit("isDialogClose");
};

const formSubmit = () => {
  const editSlipArray: any = [
    {
      accountPeriodNo: accountPeriodNo.value,
      slipNo: slipNo.value,
      slipType: slipType.value,
      deptCode: deptCode.value,
      deptName: deptName.value,
      expenseReport: expenseReport.value,
      postingDate: postingDate.value,
      reportingDate: reportingDate.value,
      reportingEmpCode: reportingEmpCode.value,
      reportingEmpName: reportingEmpName.value,
      slipStatus: slipStatus.value,
    },
  ];

  emit("submit", editSlipArray);

  dialogClose();
};
</script>

<template>
  <VDialog max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogClose" />

    <VCard title="전표 수정">
      <VCardText>
        <VRow>
          <VCol cols="10" sm="4" md="6">
            <AppTextField v-model="slipNo" label="전표일렬번호" disabled />
          </VCol>
          <VCol cols="10" sm="4" md="3">
            <AppTextField v-model="accountPeriodNo" label="기수" disabled />
          </VCol>
          <VCol cols="10" sm="4" md="3">
            <AppTextField
              v-model="slipType"
              label="전표유형"
              placeholder="결산"
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="reportingEmpCode"
              label="작성자코드"
              disabled
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="reportingEmpName"
              label="작성자명"
              disabled
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="deptCode"
              label="부서코드"
              @click="isDeptCodeDialogVisible = !isDeptCodeDialogVisible"
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="deptName"
              label="부서명"
              disabled
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="expenseReport"
              label="품의내역"
              type="text"
            />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField v-model="postingDate" label="사용일자" type="date" />
          </VCol>
          <VCol cols="10" sm="4" md="6">
            <AppTextField
              v-model="reportingDate"
              label="작성일자"
              type="date"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="dialogClose">
          <VIcon start icon="tabler-x" size="22"/>
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-pencil-cog" size="22"/>
          저장
        </VBtn>
      </VCardText>
    </VCard>

    <AddDeptCodeModal
      v-model="isDeptCodeDialogVisible" @selected="deptCodeSelected"
      @dialogClose="isDeptCodeDialogVisible = !isDeptCodeDialogVisible" />
  </VDialog>
</template>
