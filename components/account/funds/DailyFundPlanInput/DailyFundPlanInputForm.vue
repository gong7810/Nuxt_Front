<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { fundsStore } from "@/store/account/funds";
import AddFundCodeModal from "@/components/account/funds/Modal/AddFundCodeModal.vue";
import AddFundNameModal from "@/components/account/funds/Modal/AddFundNameModal.vue";
import AddFundCustomerCodeModal from "@/components/account/funds/Modal/AddFundCustomerCodeModal.vue";

const userTab = ref(-1);

const fundPlanInput = ref(false);
const fundPlanDetail = ref(false);

// 일자별자금계획 데이터
const planDate = ref("");
const fundCode = ref("");
const fundName = ref("");
const customerCode = ref("");
const customerName = ref("");
const expenseReport = ref("");
const balanceDivision = ref("");
const price = ref("");

const isRequestSnackBarVisible = ref(false);
const isAddPlanSuccessSnackBarVisible = ref(false);
const isRequestDateSnackBarVisible = ref(false);
const isRequestPlanSnackBarVisible = ref(false);
const isEditPlanSuccessSnackBarVisible = ref(false);
const isDeletePlanSuccessSnackBarVisible = ref(false);
const isFundCodeDialogVisible = ref(false);
const isFundNameDialogVisible = ref(false);
const isCustomerCodeDialogVisible = ref(false);
const isEditPlanDilogVisible = ref(false);
const isNoDataSnackBarVisible = ref(false);
const isDeletePlanVisible = ref(false);

const fromDate = ref("");
const toDate = ref("");

// 수입 지출 판단
const options = ref<string[]>(["수입", "지출"]);

const inExpectedPlanList: Ref<any[]> = ref([]);
const outExpectedPlanList: Ref<any[]> = ref([]);

const selectedPlan = ref("");
const planData = ref([]);

const tabs = [
  { icon: "tabler-calendar-plus", title: "자금계획입력" },
  { icon: "tabler-checklist", title: "자금계획상세보기" },
];

// 자금계획 데이터 칼럼
const dailyFundPlanField = [
  { title: "계획번호", key: "planNo" },
  { title: "계획일자", key: "planDate" },
  { title: "자금코드", key: "fundCode" },
  { title: "자금과목", key: "fundName" },
  { title: "거래처코드", key: "customerCode" },
  { title: "거래처명", key: "customerName" },
  { title: "적요", key: "expenseReport" },
  { title: "금액(₩)", key: "price" },
  { title: "ACTIONS", key: "actions" },
];

const content = ref(null);
let html2pdf: any;

onMounted(() => {
  userTab.value = 0;
});

// 탭 변화 감시
watch(userTab, async () => {
  if (userTab.value === 0) {
    fundPlanInput.value = true;
    fundPlanDetail.value = false;
  } else if (userTab.value === 1) {
    fundPlanInput.value = false;
    fundPlanDetail.value = true;
  }
});

// 값 초기화
const resetData = () => {
  planDate.value = "";
  fundCode.value = "";
  fundName.value = "";
  expenseReport.value = "";
  customerCode.value = "";
  customerName.value = "";
  balanceDivision.value = "";
  price.value = "";
};

const fundCodeSelected = ({ selected, row }: any) => {
  fundCode.value = row.internalItem.columns.accountInnerCode;
  fundName.value = row.internalItem.columns.accountName;
};

const customerCodeSelected = ({ selected, row }: any) => {
  customerCode.value = row.internalItem.columns.customerCode;
  customerName.value = row.internalItem.columns.customerName;
};

// 일자별자금계획 추가
const submitFundPlan = async () => {
  if (
    planDate.value === "" ||
    fundCode.value === "" ||
    customerCode.value === "" ||
    expenseReport.value === "" ||
    balanceDivision.value === "" ||
    price.value === ""
  ) {
    isRequestSnackBarVisible.value = true;
  } else {
    const newPlanForm: any = [
      {
        planNo: "",
        planDate: planDate.value,
        fundCode: fundCode.value,
        fundName: fundName.value,
        customerCode: customerCode.value,
        customerName: customerName.value,
        expenseReport: expenseReport.value,
        balanceDivision: balanceDivision.value,
        price: price.value,
      },
    ];

    console.log("추가 폼 :", newPlanForm[0]);

    const response = await fundsStore().CREATE_PLAN(newPlanForm[0]);

    console.log("추가 되었습니다:", response);

    isAddPlanSuccessSnackBarVisible.value = true;

    resetData();
  }
};

// 일자별자금계획 조회
const searchFundPlan = async (alert: boolean) => {
  if (fromDate.value === "" || toDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else {
    const startDate = fromDate.value;
    const endDate = toDate.value;

    await fundsStore().FETCH_PLAN({ startDate, endDate });

    inExpectedPlanList.value = fundsStore().inExpectedPlanList;
    outExpectedPlanList.value = fundsStore().outExpectedPlanList;

    if (
      alert &&
      inExpectedPlanList.value.length === 0 &&
      outExpectedPlanList.value.length === 0
    )
      isNoDataSnackBarVisible.value = true;
  }
};

// 삭제 Dialog
const deletePlan = (item: any) => {
  selectedPlan.value = item.planNo;

  isDeletePlanVisible.value = true;
};

// 일자별자금계획 삭제
const deletePlanData = async () => {
  isDeletePlanVisible.value = false;

  const response = await fundsStore().DELETE_PLAN(selectedPlan.value);

  console.log("결과메세지 : ", response.data);

  isDeletePlanSuccessSnackBarVisible.value = true;

  selectedPlan.value = "";

  // table reloading
  searchFundPlan(false);
};

// 수정 Dialog
const editPlan = (item: any) => {
  planData.value = item;

  isEditPlanDilogVisible.value = true;
};

// 일자별자금계획 수정
const editPlanData = async (editData: any) => {
  const response = await fundsStore().UPDATE_PLAN(editData[0]);

  console.log("결과 메세지 : ", response.data);

  isEditPlanSuccessSnackBarVisible.value = true;

  searchFundPlan(false);
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">일자별자금계획</p>
  <VCard>
    <VTabs v-model="userTab" class="v-tabs-pill">
      <VTab v-for="tab in tabs" :key="tab.icon">
        <VIcon :size="22" :icon="tab.icon" />&nbsp;
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>
  </VCard>
  <!-- 자금계획입력 -->
  <VCard v-if="fundPlanInput" title="일자별계획입력" class="mb-6">
    <VCardText>
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VTextField v-model="planDate" label="계획년월" type="date" />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VTextField
            v-model="fundCode"
            label="자금코드"
            @click="isFundCodeDialogVisible = !isFundCodeDialogVisible"
          />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VTextField
            v-model="fundName"
            label="자금과목"
            @click="isFundNameDialogVisible = !isFundNameDialogVisible"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VTextField
            v-model="customerCode"
            label="거래처코드"
            @click="isCustomerCodeDialogVisible = !isCustomerCodeDialogVisible"
          />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VTextField v-model="customerName" label="거래처명" disabled />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VTextField v-model="expenseReport" label="적요" />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VSelect v-model="balanceDivision" :items="options" label="구분" />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VTextField v-model="price" label="금액" />
        </VCol>
        <VBtn
          color="primary"
          style="margin: 12px 0 0 10px"
          @click="submitFundPlan"
        >
          <VIcon start icon="tabler-playlist-add" size="22" />
          추가
        </VBtn>
        <VBtn
          color="secondary"
          style="margin: 12px 0 0 10px"
          @click="resetData"
        >
          <VIcon start icon="tabler-eraser" size="22" />
          취소
        </VBtn>
      </VRow>
    </VCardText>
  </VCard>
  <AddFundCodeModal
    v-model="isFundCodeDialogVisible"
    @selected="fundCodeSelected"
    @dialogClose="isFundCodeDialogVisible = !isFundCodeDialogVisible"
  />
  <AddFundNameModal
    v-model="isFundNameDialogVisible"
    @selected="fundCodeSelected"
    @dialogClose="isFundNameDialogVisible = !isFundNameDialogVisible"
  />
  <AddFundCustomerCodeModal
    v-model="isCustomerCodeDialogVisible"
    @selected="customerCodeSelected"
    @dialogClose="isCustomerCodeDialogVisible = !isCustomerCodeDialogVisible"
  />
  <!-- 자금계획상세보기 -->
  <VCard v-if="fundPlanDetail" class="mb-6">
    <VContainer>
      <VRow>
        <VCol md="3">
          <VForm>
            <VTextField v-model="fromDate" label="조회시작일자" type="date" />
          </VForm>
        </VCol>
        <VCol md="3">
          <VForm>
            <VTextField v-model="toDate" label="조회종료일자" type="date" />
          </VForm>
        </VCol>
        <VCol>
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="searchFundPlan(true)"
          >
            <VIcon start icon="tabler-search" size="22" />조회
          </VBtn>
          <VBtn color="primary" style="margin-right: 15px" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />출력
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
  <div ref="content">
    <VCard v-if="fundPlanDetail" title="수입예정" class="mb-6">
      <VCardText>
        <VDataTable
          :headers="dailyFundPlanField"
          :items="inExpectedPlanList"
          :items-per-page="10"
        >
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <IconBtn @click="editPlan(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="deletePlan(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
    <VCard v-if="fundPlanDetail" title="지출예정">
      <VCardText>
        <VDataTable
          :headers="dailyFundPlanField"
          :items="outExpectedPlanList"
          :items-per-page="10"
        >
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <IconBtn @click="editPlan(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="deletePlan(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
  <EditDailyFundPlanModal
    v-model="isEditPlanDilogVisible"
    :isEditPlanDialogOpen="isEditPlanDilogVisible"
    :planData="planData"
    @isDialogClose="isEditPlanDilogVisible = !isEditPlanDilogVisible"
    @edit-failed="isRequestSnackBarVisible = !isRequestSnackBarVisible"
    @submit="editPlanData"
  />
  <!-- 계획 삭제 확인 Dialog -->
  <VDialog v-model="isDeletePlanVisible" width="400">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDeletePlanVisible = !isDeletePlanVisible" />

    <!-- Dialog Content -->
    <VCard title="계획삭제">
      <VCardText> 해당 계획을 삭제하시겠습니까? </VCardText>
      <VCardText class="d-flex justify-end">
        <VBtn
          color="blue-grey"
          variant="tonal"
          style="margin-left: 10px"
          @click="isDeletePlanVisible = false"
        >
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn style="margin-left: 10px" @click="deletePlanData">
          <VIcon start icon="tabler-trash" size="22" />
          삭제
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 미입력 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    모두 입력해주세요.
  </VSnackbar>
  <!-- 등록 성공 알림 스낵바 -->
  <VSnackbar
    v-model="isAddPlanSuccessSnackBarVisible"
    location="top"
    color="success"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    자금계획이 등록되었습니다.
  </VSnackbar>
  <!-- 조회일자 선택 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestDateSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    조회일자를 선택해주세요.
  </VSnackbar>
  <!-- 계획 선택 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestPlanSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    자금계획을 선택해주세요.
  </VSnackbar>
  <!-- 데이터 x 알림 스낵바 -->
  <VSnackbar
    v-model="isNoDataSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    해당 기간에 계획이 없습니다.
  </VSnackbar>
  <!-- 수정 알림 스낵바 -->
  <VSnackbar
    v-model="isEditPlanSuccessSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    수정되었습니다.
  </VSnackbar>
  <!-- 삭제 알림 스낵바 -->
  <VSnackbar
    v-model="isDeletePlanSuccessSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    삭제되었습니다.
  </VSnackbar>
</template>
