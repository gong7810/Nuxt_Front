<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { useRouter } from "vue-router";
import type { RouteLocationRaw } from "#vue-router";
import { accountStore } from "@/store/account/account";
import MenuSlipForm from "@/components/account/account/Slip/MenuSlipForm.vue";

// 페이지 이동시 사용될 router
const router = useRouter();

const productList = ref([]);
const currentSearchTerm = ref("");
const searchTermNo = ref("");
const searchTermDate = ref("");
const searchTermStatus = ref("");

const originflag = ref(false);
const approvalflag = ref(true);
const companionflag = ref(true);

const options = ref<string[]>(["--------------------", "1.승인", "2.반려"]);

const getSelect = ref(false);
const getSelects = ref(false);

const isRequestSelectSlipSnackBarVisible = ref(false);
const isDeleteFailedSnackBarVisible = ref(false);
const isEditFailedSnackBarVisible = ref(false);
const isSlipDeleteVisible = ref(false);

const selectedSlip = ref([]);
const selectedSlipNo = ref("");
const selectedSlipStatus = ref("");
const selectedSlipList: Ref<any[]> = ref([]);

// 가로행 데이터 칼럼
const column = [
  {
    title: "전표일련번호",
    key: "slipNo",
  },
  {
    title: "기수일련번호",
    key: "accountPeriodNo",
  },
  {
    title: "부서코드",
    key: "deptCode",
  },
  {
    title: "품의내역",
    key: "expenseReport",
  },
  {
    title: "작성자명",
    key: "reportingEmpName",
  },
  {
    title: "작성일자",
    key: "reportingDate",
  },
  {
    title: "승인상태",
    key: "slipStatus",
  },
];

// 전표 리스트 조회
const fetchData = async () => {
  await accountStore().FETCH_ALL_SLIP();
  productList.value = accountStore().allSlipList;
};

// 승인 / 반려 전표 조회
const fetchStatusData = async (status: string) => {
  await accountStore().FETCH_STATUS_SLIP(status);
  productList.value = await accountStore().statusSlipList;
};

onMounted(() => {
  fetchData();
});

// 일렬번호 필터
watch(searchTermNo, () => {
  currentSearchTerm.value = searchTermNo.value;
  searchTermDate.value = "";
});

// 작성일자 필터
watch(searchTermDate, () => {
  currentSearchTerm.value = searchTermDate.value;
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

    currentSearchTerm.value = "";
    searchTermNo.value = "";
    searchTermDate.value = "";
  } else if (searchTermStatus.value === "2.반려") {
    if (companionflag.value) {
      resetSelect();
      await fetchStatusData("반려");
      companionflag.value = false;
    }

    originflag.value = true;
    approvalflag.value = true;

    currentSearchTerm.value = "";
    searchTermNo.value = "";
    searchTermDate.value = "";
  }
});

// 전표 번호 선택
watch(selectedSlip, (selectedValue: any) => {
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

// 선택 초기화
const resetSelect = () => {
  selectedSlip.value = [];
};

// 전표 삭제
const deleteSlip = async () => {
  isSlipDeleteVisible.value = true;

  const deleteSlipList = [];
  for (let length = 0; length < selectedSlipList.value.length; length++) {
    await accountStore().FETCH_SLIP(selectedSlipList.value[length].slipNo);

    const deleteJournalDetailList = [];
    for (
      let i = 0;
      i < toRaw(accountStore().slipForm).journalList.length;
      i++
    ) {
      if (
        toRaw(accountStore().slipForm).journalList[i].journalDetailList
          .length !== 0
      ) {
        deleteJournalDetailList.push([
          {
            journalDetailNo: toRaw(accountStore().slipForm).journalList[i]
              .journalDetailList[0].journalDetailNo,
            journalNo: toRaw(accountStore().slipForm).journalList[i]
              .journalDetailList[0].journalNo,
            accountControlName: toRaw(accountStore().slipForm).journalList[i]
              .journalDetailList[0].accountControlName,
            accountControlType: toRaw(accountStore().slipForm).journalList[i]
              .journalDetailList[0].accountControlType,
            journalDescription: toRaw(accountStore().slipForm).journalList[i]
              .journalDetailList[0].journalDescription,
          },
        ]);
      } else {
        deleteJournalDetailList.push([]);
      }
    }

    const deleteJournalList = [];
    for (
      let i = 0;
      i < toRaw(accountStore().slipForm).journalList.length;
      i++
    ) {
      deleteJournalList.push({
        slipNo: toRaw(accountStore().slipForm).slipNo,
        journalNo: toRaw(accountStore().slipForm).journalList[i].journalNo,
        accountCode: toRaw(accountStore().slipForm).journalList[i].accountCode,
        accountName: toRaw(accountStore().slipForm).journalList[i].accountName,
        customerCode: toRaw(accountStore().slipForm).journalList[i]
          .customerCode,
        customerName: toRaw(accountStore().slipForm).journalList[i]
          .customerName,
        balanceDivision: toRaw(accountStore().slipForm).journalList[i]
          .balanceDivision,
        leftDebitPrice: toRaw(accountStore().slipForm).journalList[i]
          .leftDebitPrice,
        rightCreditPrice: toRaw(accountStore().slipForm).journalList[i]
          .rightCreditPrice,
        journalDetailList: deleteJournalDetailList[i],
      });
    }

    deleteSlipList.push({
      slipNo: toRaw(accountStore().slipForm).slipNo,
      accountPeriodNo: toRaw(accountStore().slipForm).accountPeriodNo,
      slipType: toRaw(accountStore().slipForm).slipType,
      deptCode: toRaw(accountStore().slipForm).deptCode,
      expenseReport: toRaw(accountStore().slipForm).expenseReport,
      postingDate: toRaw(accountStore().slipForm).postingDate,
      reportingDate: toRaw(accountStore().slipForm).reportingDate,
      reportingEmpCode: toRaw(accountStore().slipForm).reportingEmpCode,
      reportingEmpName: toRaw(accountStore().slipForm).reportingEmpName,
      slipStatus: toRaw(accountStore().slipForm).slipStatus,
      journalList: deleteJournalList,
    });

    // 사진파일 삭제
    // 서버 측에서 처리하는것이 안전
  }

  console.log("삭제 폼", { slipList: deleteSlipList });

  // map 형식
  const deleteSlipForm = { slipList: deleteSlipList };

  const response = await accountStore().DELETE_SLIP(deleteSlipForm);

  console.log("결과메세지 : ", response);

  selectedSlip.value = [];
  selectedSlipNo.value = "";
  selectedSlipStatus.value = "";
  selectedSlipList.value = [];

  // table reloading
  fetchData();
};

// 전표 수정
const editSlip = async () => {
  if (selectedSlipNo.value === "") {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (
    selectedSlipStatus.value === "승인" ||
    selectedSlipStatus.value === "반려"
  ) {
    isEditFailedSnackBarVisible.value = true;
    resetSelect();
  } else {
    await accountStore().FETCH_SLIP(selectedSlipNo.value);

    editSlipSuccess();
  }
};

// 삭제 실패
const deleteFailed = () => {
  isDeleteFailedSnackBarVisible.value = true;
  resetSelect();
};

// 수정시 이동 페이지
const toEditSlipForm: RouteLocationRaw = {
  name: "account-account-EditSlipFormPage",
};

const editSlipSuccess = () => {
  router.push(toEditSlipForm);
};
</script>

<template>
  <p class="text-2xl mb-6">전표 조회</p>
  <VCard class="mb-6">
    <div class="custom-search">
      <VRow>
        <VCol md="4">
          <VCardText>
            <VFormGroup>
              <!-- vue:b-form-input => nuxt:AppTextField -->
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
                v-model="searchTermDate"
                label="작성일자"
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
                placeholder="Select"
                :items="options"
              />
            </VFormGroup>
          </VCardText>
        </VCol>
      </VRow>
    </div>
  </VCard>
  <VCard>
    <div style="margin: 10px 10px">
      <MenuSlipForm
        :selectedSlipNo="selectedSlipNo"
        :selectedSlipStatus="selectedSlipStatus"
        :selectedSlipList="selectedSlipList"
        :getSelect="getSelect"
        :getSelects="getSelects"
        @resetSelect="resetSelect"
        @isDetailDialogClose="resetSelect"
        @requestSlipSelect="
          isRequestSelectSlipSnackBarVisible =
            !isRequestSelectSlipSnackBarVisible
        "
        @deleteFailed="deleteFailed"
        @deleteSlip="deleteSlip"
        @editSlip="editSlip"
      />
    </div>
    <VDataTable
      v-model="selectedSlip"
      class="text-no-wrap"
      :headers="column"
      :items="productList"
      :search="currentSearchTerm"
      :items-per-page="10"
      density="compact"
      show-select
      select-strategy="page"
      return-object
    />
  </VCard>
  <!-- 전표 삭제 알림 Dialog -->
  <VDialog v-model="isSlipDeleteVisible" width="400">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isSlipDeleteVisible = !isSlipDeleteVisible" />

    <!-- Dialog Content -->
    <VCard title="전표삭제">
      <VCardText> 전표가 삭제 되었습니다. </VCardText>
      <VCardText class="d-flex justify-end">
        <VBtn
          variant="outlined"
          @click="isSlipDeleteVisible = !isSlipDeleteVisible"
        >
          확인
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
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
  <!-- 삭제 불가 알림 스낵바 -->
  <VSnackbar
    v-model="isDeleteFailedSnackBarVisible"
    location="top"
    color="error"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    승인된 전표는 삭제할 수 없습니다.
  </VSnackbar>
  <!-- 수정 불가 알림 스낵바 -->
  <VSnackbar
    v-model="isEditFailedSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    승인 / 반려된 전표는 수정할 수 없습니다.
  </VSnackbar>
</template>
