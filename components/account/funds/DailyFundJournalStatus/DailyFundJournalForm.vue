<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { fundsStore } from "@/store/account/funds";

const userTab = ref(0);
const userTab2 = ref(-1);

const dailyTradeStatus = ref(true);
const inoutExpectedPrice = ref(false);
const financeStatus = ref(false);
const fundStatus = ref(false);
const generalFundStatus = ref(false);
const noteStatus = ref(false);

const selectedDate = ref("");
const selectedAccount = ref("");
const fromDate = ref("");
const toDate = ref("");

const dailyTradeStatusList: Ref<any[]> = ref([]);
const inExpectedPriceList: Ref<any[]> = ref([]);
const outExpectedPriceList: Ref<any[]> = ref([]);
const financeStatusList: Ref<any[]> = ref([]);
const generalFundStatusList: Ref<any[]> = ref([]);
const payableNoteStatusList: Ref<any[]> = ref([]);
const receivableNoteStatusList: Ref<any[]> = ref([]);

const isRequestDateSnackBarVisible = ref(false);
const isRequestAccountSnackBarVisible = ref(false);
const isNoDataSnackBarVisible = ref(false);
const isNoData2SnackBarVisible = ref(false);

const content = ref(null);
let html2pdf: any;

const tabs = [
  { icon: "tabler-mobiledata-off", title: "일일거래증감현황" },
  { icon: "tabler-plus-minus", title: "입출금예정액" },
  { icon: "tabler-pig-money", title: "예적금현황" },
  { icon: "tabler-wallet", title: "자금현황" },
];

const fundTabs = [
  { icon: "tabler-report-money", title: "총괄거래현황" },
  { icon: "tabler-cash-banknote", title: "어음현황" },
];

// 계정과목 구분
const options = ref<string[]>([
  "1.당좌예금",
  "2.보통예금",
  "3.제예금",
  "4.정기예금",
  "5.정기적금",
]);

// 일일거래증감현황 칼럼
const dailyTradeColumns = [
  { title: "", key: "&nbsp", sortable: false },
  {
    title: "구분",
    key: "accountName",
    sortable: false,
    width: 250,
  },
  { title: "전일잔액", key: "previousBalance", sortable: false },
  { title: "당일증가", key: "dayIncrease", sortable: false },
  { title: "당일감소", key: "dayDecrease", sortable: false },
  { title: "당일잔액", key: "dayBalance", sortable: false },
];

// 입출금예정액 칼럼
const inoutExpectedPriceColumns = [
  { title: "", key: "&nbsp", sortable: false },
  { title: "자금항목", key: "accountName", sortable: false },
  { title: "적요", key: "expenseReport", sortable: false },
  { title: "금액", key: "price", sortable: false },
];

// 예적금현황 칼럼
const financeStatusColumns = [
  { title: "CODE", key: "customerCode", sortable: false },
  { title: "개설점", key: "customerName", sortable: false },
  { title: "계좌번호", key: "accountNo", sortable: false },
  { title: "전일잔액", key: "previousBalance", sortable: false },
  { title: "증가", key: "increase", sortable: false },
  { title: "감소", key: "decrease", sortable: false },
  { title: "당일잔액", key: "dayBalance", sortable: false },
  { title: "한도잔액", key: "limitBalance", sortable: false },
];

// 총괄거래현황 칼럼
const generalFundStatusColumns = [
  { title: "", key: "&nbsp", sortable: false },
  { title: "NO", key: "indexNo", sortable: false },
  { title: "구분", key: "accountName", sortable: false },
  { title: "거래처", key: "customerName", sortable: false },
  { title: "전일잔액", key: "previousBalance", sortable: false },
  { title: "당일증감내역", key: "dayInout", sortable: false },
  { title: "당일잔액", key: "dayBalance", sortable: false },
];

// 지급어음현황 칼럼
const payableNoteStatusColumns = [
  { title: "거래처", key: "customerName", sortable: false },
  { title: "전일잔액", key: "previousBalance", sortable: false },
  { title: "당일증가", key: "dayIncrease", sortable: false },
  { title: "당일감소", key: "dayDecrease", sortable: false },
  { title: "당일잔액", key: "dayBalance", sortable: false },
];

// 받을어음현황 칼럼
const receivableNoteStatusColumns = [
  { title: "거래처", key: "customerName", sortable: false },
  { title: "전일잔액", key: "previousBalance", sortable: false },
  { title: "당일증가", key: "dayIncrease", sortable: false },
  { title: "당일감소", key: "dayDecrease", sortable: false },
  { title: "당일잔액", key: "dayBalance", sortable: false },
];

onMounted(() => {
  userTab.value = 0;
});

// 탭 변화 감시
watch(userTab, () => {
  if (userTab.value === 0) {
    dailyTradeStatus.value = true;
    inoutExpectedPrice.value = false;
    financeStatus.value = false;
    fundStatus.value = false;
    userTab2.value = -1;
  } else if (userTab.value === 1) {
    dailyTradeStatus.value = false;
    inoutExpectedPrice.value = true;
    financeStatus.value = false;
    fundStatus.value = false;
    userTab2.value = -1;
  } else if (userTab.value === 2) {
    dailyTradeStatus.value = false;
    inoutExpectedPrice.value = false;
    financeStatus.value = true;
    fundStatus.value = false;
    userTab2.value = -1;
  } else if (userTab.value === 3) {
    dailyTradeStatus.value = false;
    inoutExpectedPrice.value = false;
    financeStatus.value = false;
    fundStatus.value = true;
    userTab2.value = 0;
  }
});

// 자금현황 탭 감시
watch(userTab2, () => {
  if (userTab2.value === 0) {
    generalFundStatus.value = true;
    noteStatus.value = false;
  } else if (userTab2.value === 1) {
    generalFundStatus.value = false;
    noteStatus.value = true;
  }
});

// 일일거래증감현황 조회
const searchTradeData = async () => {
  if (selectedDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else {
    const date = selectedDate.value;

    await fundsStore().FETCH_DAILY_TRADE_STATUS({ date });
    dailyTradeStatusList.value = fundsStore().dailyTradeStatusList;

    if (
      dailyTradeStatusList.value.length === 4 &&
      dailyTradeStatusList.value[3].dayBalance === null
    )
      isNoDataSnackBarVisible.value = true;
  }
};

// 입출금예정액 조회
const searchInoutData = async () => {
  if (selectedDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else {
    const date = selectedDate.value;

    await fundsStore().FETCH_INOUT_EXPECTED_PRICE({ date });
    inExpectedPriceList.value = fundsStore().inExpectedPriceList;
    outExpectedPriceList.value = fundsStore().outExpectedPriceList;

    if (
      inExpectedPriceList.value.length === 0 &&
      outExpectedPriceList.value.length === 0
    )
      isNoDataSnackBarVisible.value = true;
  }
};

// 예적금현황 조회
const searchFinanceData = async () => {
  if (selectedDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else if (selectedAccount.value === "") {
    isRequestAccountSnackBarVisible.value = true;
  } else {
    const date = selectedDate.value;
    const accountName = selectedAccount.value.substring(2);

    await fundsStore().FETCH_FINANCE_STATUS({ date, accountName });
    financeStatusList.value = fundsStore().financeStatusList;

    if (
      financeStatusList.value.length === 1 &&
      financeStatusList.value[0].limitBalance === null
    )
      isNoData2SnackBarVisible.value = true;
  }
};

// 총괄거래현황 조회
const searchFundData = async () => {
  if (fromDate.value === "" || toDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else {
    const startDate = fromDate.value;
    const endDate = toDate.value;

    await fundsStore().FETCH_GENERAL_FUND_STATUS(startDate, endDate);

    generalFundStatusList.value = fundsStore().generalFundStatusList;

    if (
      generalFundStatusList.value.length === 1 &&
      generalFundStatusList.value[0].dayBalance === null
    )
      isNoData2SnackBarVisible.value = true;
  }
};

// 어음현황 조회
const searchNoteData = async () => {
  if (fromDate.value === "") {
    isRequestDateSnackBarVisible.value = true;
  } else {
    const date = fromDate.value;

    await fundsStore().FETCH_NOTE_STATUS({ date });

    payableNoteStatusList.value = fundsStore().payableNoteStatusList;
    receivableNoteStatusList.value = fundsStore().receivableNoteStatusList;

    if (
      payableNoteStatusList.value.length === 0 &&
      receivableNoteStatusList.value.length === 0
    )
      isNoDataSnackBarVisible.value = true;
  }
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">일일자금/분개현황</p>
  <VCard>
    <VTabs v-model="userTab" class="v-tabs-pill">
      <VTab v-for="tab in tabs" :key="tab.icon">
        <VIcon :size="22" :icon="tab.icon" />&nbsp;
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>
  </VCard>
  <!-- 일일거래증감현황 정보 -->
  <VCard v-if="dailyTradeStatus" class="mb-6">
    <VRow>
      <VCol md="4" style="margin: 20px 0 0 20px">
        <VForm>
          <VTextField v-model="selectedDate" label="조회일자" type="date" />
        </VForm>
      </VCol>
      <VCol style="margin-top: 20px">
        <VBtn
          color="primary"
          style="margin-right: 15px"
          @click="searchTradeData"
        >
          <VIcon start icon="tabler-search" size="22" />
          조회
        </VBtn>
        <VBtn color="primary" @click="downloadPDF">
          <VIcon start icon="tabler-note" size="22" />
          출력
        </VBtn>
      </VCol>
    </VRow>
    <div ref="content">
      <VCardText>
        <VDataTable
          :headers="dailyTradeColumns"
          :items="dailyTradeStatusList"
          :items-per-page="15"
        />
      </VCardText>
    </div>
  </VCard>
  <!-- .입출금예정액 정보 -->
  <VCard v-if="inoutExpectedPrice" class="mb-6">
    <VRow>
      <VCol md="4" style="margin: 20px 0 0 20px">
        <VForm style="margin-bottom: 20px">
          <VTextField v-model="selectedDate" label="조회일자" type="date" />
        </VForm>
      </VCol>
      <VCol style="margin-top: 20px">
        <VBtn
          color="primary"
          style="margin-right: 15px"
          @click="searchInoutData"
        >
          <VIcon start icon="tabler-search" size="22" />
          조회
        </VBtn>
        <VBtn color="primary" @click="downloadPDF">
          <VIcon start icon="tabler-note" size="22" />
          출력
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
  <div ref="content">
    <VCard v-if="inoutExpectedPrice" class="mb-6">
      <VRow>
        <VCol>
          <VCardTitle class="text-center" style="margin-top: 10px">
            출금예정
          </VCardTitle>
          <VDataTable
            :headers="inoutExpectedPriceColumns"
            :items="outExpectedPriceList"
            :items-per-page="20"
          />
        </VCol>
        <VCol>
          <VCardTitle class="text-center" style="margin-top: 10px">
            입금예정
          </VCardTitle>
          <VDataTable
            :headers="inoutExpectedPriceColumns"
            :items="inExpectedPriceList"
            :items-per-page="20"
          />
        </VCol>
      </VRow>
    </VCard>
  </div>
  <!-- 예적금현황 정보 -->
  <VCard v-if="financeStatus" class="mb-6">
    <div ref="content">
      <VRow>
        <VCol md="3" style="margin: 20px 0 0 20px">
          <VForm style="margin-bottom: 20px">
            <VTextField v-model="selectedDate" label="조회일자" type="date" />
          </VForm>
        </VCol>
        <VCol md="3" style="margin: 20px 0 0 0">
          <VForm style="margin-bottom: 20px">
            <VSelect v-model="selectedAccount" label="구분" :items="options" />
          </VForm>
        </VCol>
        <VCol style="margin-top: 20px">
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="searchFinanceData"
          >
            <VIcon start icon="tabler-search" size="22" />
            조회
          </VBtn>
          <VBtn color="primary" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />
            출력
          </VBtn>
        </VCol>
      </VRow>
      <VCardText>
        <VDataTable
          :headers="financeStatusColumns"
          :items="financeStatusList"
          :items-per-page="15"
        />
      </VCardText>
    </div>
  </VCard>
  <!-- 자금현황 정보 -->
  <VCard v-if="fundStatus" class="mb-6">
    <VTabs v-model="userTab2" class="v-tabs-pill" style="margin-left: 5px">
      <VTab v-for="tab in fundTabs" :key="tab.icon">
        <VIcon :size="22" :icon="tab.icon" />&nbsp;
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>

    <!-- 총괄거래현황 정보 -->
    <div ref="content">
      <VRow v-if="generalFundStatus">
        <VCol md="3" style="margin: 10px 0 0 20px">
          <VForm>
            <VTextField v-model="fromDate" label="조회시작일자" type="date" />
          </VForm>
        </VCol>
        <VCol md="3" style="margin: 10px 0 0 0">
          <VForm>
            <VTextField v-model="toDate" label="조회종료일자" type="date" />
          </VForm>
        </VCol>
        <VCol style="margin-top: 10px">
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="searchFundData"
          >
            <VIcon start icon="tabler-search" size="22" />조회
          </VBtn>
          <VBtn color="primary" style="margin-right: 15px" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />출력
          </VBtn>
        </VCol>
      </VRow>
      <VCardText v-if="generalFundStatus">
        <VDataTable
          :headers="generalFundStatusColumns"
          :items="generalFundStatusList"
          :items-per-page="15"
        />
      </VCardText>
    </div>
    <!-- 어음현황 정보 -->
    <div ref="content">
      <VRow v-if="noteStatus">
        <VCol md="3" style="margin: 10px 0 0 20px">
          <VForm>
            <VTextField v-model="fromDate" label="조회일자" type="date" />
          </VForm>
        </VCol>
        <VCol style="margin-top: 10px">
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="searchNoteData"
          >
            <VIcon start icon="tabler-search" size="22" />
            조회
          </VBtn>
          <VBtn color="primary" style="margin-right: 15px" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />
            출력
          </VBtn>
        </VCol>
      </VRow>
      <VRow v-if="noteStatus">
        <VCol>
          <VCardTitle
            v-if="noteStatus"
            class="text-center"
            style="margin-top: 10px"
          >
            지급어음현황
          </VCardTitle>
          <VDataTable
            :headers="payableNoteStatusColumns"
            :items="payableNoteStatusList"
            :items-per-page="5"
          />
        </VCol>
        <VCol>
          <VCardTitle
            v-if="noteStatus"
            class="text-center"
            style="margin-top: 10px"
          >
            받을어음현황
          </VCardTitle>
          <VDataTable
            :headers="receivableNoteStatusColumns"
            :items="receivableNoteStatusList"
            :items-per-page="5"
          />
        </VCol>
      </VRow>
    </div>
  </VCard>
  <!-- 조회일자 선택 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestDateSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    조회일자를 선택해주세요.
  </VSnackbar>
  <!-- 계정과목 선택 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestAccountSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    계정과목을 선택해주세요.
  </VSnackbar>
  <!-- 데이터 존재 X 알림 스낵바 -->
  <VSnackbar
    v-model="isNoDataSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    해당 날에는 데이터가 없습니다.
  </VSnackbar>
  <!-- 데이터 존재 X 알림2 스낵바 -->
  <VSnackbar
    v-model="isNoData2SnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    데이터가 없습니다.
  </VSnackbar>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
