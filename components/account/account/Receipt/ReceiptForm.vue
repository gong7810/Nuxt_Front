<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { accountStore } from "@/store/account/account";

const receiptList = ref([]);
const currentSearchTerm = ref("");
const searchTermNo = ref("");
const searchTermReport = ref("");
const searchTermStatus = ref("");

const tooltipVisible = ref(false);

const isAddReceiptVisible = ref(false);
const isRequestSelectSlipSnackBarVisible = ref(false);
const isFileUploadFailedSnackBarVisible = ref(false);
const isAddReceiptSuccessSnackBarVisible = ref(false);
const isAddFailedReceiptSnackBarVisible = ref(false);
const isProofReceiptSnackBarVisible = ref(false);
const isReturnReceiptSnackBarVisible = ref(false);
const isDeleteReceiptSnackBarVisible = ref(false);
const isFailedSnackBarVisible = ref(false);
const isFailedSnackBarVisible2 = ref(false);
const isResetFailedSnackBarVisible = ref(false);

const rowSelect = ref(false);
const originRow = ref("");
const rowStatus = ref("");

const receiptType = ref("");

const options = ref<string[]>([
  "--------------------",
  "1.이체내역",
  "2.신용카드 매출전표",
  "3.현금영수증",
  "4.간이영수증",
]);

const selectedSlip = ref([]);
const selectedSlipNo = ref("");
const selectedProofReceiptStatus = ref("");
const selectedSlipList: Ref<any[]> = ref([]);
const selectedFileName = ref("");

const proofFlag = ref(false);

const cashbillField: any = [
  { title: "", key: "&nbsp", sortable: false },
  { title: "전표일련번호", key: "slipNo" },
  { title: "기수일련번호", key: "accountPeriodNo" },
  { title: "작성일자", key: "reportingDate" },
  { title: "품의내역", key: "expenseReport" },
  { title: "증빙유형", key: "receiptType" },
  { title: "증빙상태", key: "proofStatus" },
];

const accountData = {
  avatarImg: "/_nuxt/assets/images/receiptImg/file_not_found.png",
};

// 이미지 관련
const refInputEl = ref<HTMLElement>();
const accountDataLocal = ref(structuredClone(accountData));
const jsonKey = ref(0);
const fileImg = ref<File | null>(null);

// 전표 리스트 조회
const fetchData = async () => {
  await accountStore().FETCH_ALL_RECEIPT();
  receiptList.value = accountStore().receiptList;
};

onMounted(() => {
  fetchData();
});

watch(searchTermNo, () => {
  currentSearchTerm.value = searchTermNo.value;
  searchTermReport.value = "";
  searchTermStatus.value = "";
});

watch(searchTermReport, () => {
  currentSearchTerm.value = searchTermReport.value;
  searchTermNo.value = "";
  searchTermStatus.value = "";
});

watch(searchTermStatus, () => {
  if (
    searchTermStatus.value === "--------------------" ||
    searchTermStatus.value.length === 0
  ) {
    currentSearchTerm.value = "";
    searchTermStatus.value = "";
  } else {
    currentSearchTerm.value = searchTermStatus.value.substring(2);
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

// 선택 초기화
const resetSelect = () => {
  receiptType.value = "";
  selectedSlip.value = [];
  selectedSlipNo.value = "";
  selectedProofReceiptStatus.value = "";
  selectedSlipList.value = [];
  selectedFileName.value = "";
  fileImg.value = null;

  isAddReceiptVisible.value = false;
};

// 행 선택 감시
watch(selectedSlip, async (selectedValue: any) => {
  console.log(toRaw(selectedValue));
  if (toRaw(selectedValue.length) === 0) {
    selectedSlipNo.value = "";
    selectedProofReceiptStatus.value = "";
    selectedSlipList.value = [];
  } else if (toRaw(selectedValue.length) === 1) {
    selectedSlipNo.value = toRaw(selectedValue[0].slipNo);
    selectedProofReceiptStatus.value = toRaw(selectedValue[0].proofStatus);
    selectedSlipList.value = toRaw(selectedValue);
  } else {
    selectedSlipNo.value = `${toRaw(selectedValue.length)}개 선택`;
    selectedProofReceiptStatus.value = "여러개";
    selectedSlipList.value = toRaw(selectedValue);
  }
});

// 전표 행 선택
const showDetails = async (selected: any, row: any) => {
  if (originRow.value === row.internalItem.columns.slipNo) {
    rowSelect.value = false;
    originRow.value = "";
    rowStatus.value = "";
  } else {
    rowSelect.value = true;
    originRow.value = row.internalItem.columns.slipNo;
    rowStatus.value = row.internalItem.columns.proofStatus;

    const filePath = `/_nuxt/assets/images/receiptImg/${originRow.value}.png`;

    await fetch(filePath, { method: "HEAD" })
      .then((response: any) => {
        if (response.url.length === 74) {
          accountDataLocal.value.avatarImg = filePath;
        } else {
          accountDataLocal.value.avatarImg =
            "/_nuxt/assets/images/receiptImg/file_not_found.png";
        }
      })
      .catch((error: any) => {
        console.error("파일 확인 중 오류가 발생했습니다.", error);
      });
  }
};

// 이미지 저장
const onImageChange = (event: Event) => {
  // const fileReader = new FileReader();
  const { files } = event.target as HTMLInputElement;

  if (files && files.length > 0) {
    if (
      files[0].name.includes(".jpg") ||
      files[0].name.includes(".jpeg") ||
      files[0].name.includes(".png")
    ) {
      selectedFileName.value = `${files[0].name.substring(0, 5)}...png`;
      fileImg.value = files[0];
      jsonKey.value++;
    } else {
      selectedFileName.value = "";
      fileImg.value = null;
      isFileUploadFailedSnackBarVisible.value = true;
    }
  }
};

// 전표 선택 체크
const selectCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (selectedProofReceiptStatus.value === "증빙완료") {
      isFailedSnackBarVisible.value = true;
      resetSelect();
    } else {
      isAddReceiptVisible.value = true;
    }
  } else {
    isAddFailedReceiptSnackBarVisible.value = true;
  }
};

// reset 버튼
const resetAvatar = async () => {
  if (rowStatus.value === "증빙완료") {
    isResetFailedSnackBarVisible.value = true;
  } else {
    accountDataLocal.value.avatarImg = accountData.avatarImg;

    await accountStore().DELETE_RECEIPT_FILE(originRow.value);

    isDeleteReceiptSnackBarVisible.value = true;
    rowSelect.value = false;
    rowSelect.value = true;

    fetchData();
  }
};

// 파일 등록
const formSubmit = async () => {
  if (!receiptType.value) {
    isFailedSnackBarVisible.value = true;
  } else if (!fileImg.value) {
    isFailedSnackBarVisible.value = true;
  } else {
    const formData = new FormData();

    formData.append("file", fileImg.value);

    await accountStore().ADD_RECEIPT_FILE(
      selectedSlipNo.value,
      receiptType.value.substring(2),
      formData
    );

    // 초기화
    resetSelect();
    isAddReceiptSuccessSnackBarVisible.value = true;

    rowSelect.value = false;

    fetchData();
  }
};

// 증빙완료
const proofReceipt = async () => {
  isProofReceiptSnackBarVisible.value = true;

  const updateSlipList = [];
  for (let i = 0; i < selectedSlipList.value.length; i++) {
    updateSlipList.push({
      slipNo: selectedSlipList.value[i].slipNo,
      accountPeriodNo: selectedSlipList.value[i].accountPeriodNo,
      reportingDate: selectedSlipList.value[i].reportingDate,
      expenseReport: selectedSlipList.value[i].expenseReport,
      receiptType: selectedSlipList.value[i].receiptType,
      proofStatus: "증빙완료",
    });
  }

  console.log("증빙완료 폼", { receiptList: updateSlipList });

  const updateSlipForm = { receiptList: updateSlipList };

  await accountStore().PROOF_RECEIPT(updateSlipForm);

  resetSelect();

  // // table reloading
  fetchData();
};

// 상태미흡
const returnReceipt = async () => {
  isReturnReceiptSnackBarVisible.value = true;

  const updateSlipList = [];
  for (let i = 0; i < selectedSlipList.value.length; i++) {
    updateSlipList.push({
      slipNo: selectedSlipList.value[i].slipNo,
      accountPeriodNo: selectedSlipList.value[i].accountPeriodNo,
      reportingDate: selectedSlipList.value[i].reportingDate,
      expenseReport: selectedSlipList.value[i].expenseReport,
      receiptType: selectedSlipList.value[i].receiptType,
      proofStatus: "상태미흡",
    });
  }

  console.log("상태미흡 폼", { receiptList: updateSlipList });

  const updateSlipForm = { receiptList: updateSlipList };

  await accountStore().PROOF_RECEIPT(updateSlipForm);

  resetSelect();

  // // table reloading
  fetchData();
};

// 증빙완료체크
const proofReceiptCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (selectedProofReceiptStatus.value === "증빙완료") {
      isFailedSnackBarVisible.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedProofReceiptStatus.value = "";
    } else {
      proofReceipt();
    }
  } else {
    proofFlag.value = true;
    for (let i = 0; i < selectedSlipList.value.length; i++) {
      if (selectedSlipList.value[i].proofStatus === "증빙완료") {
        isFailedSnackBarVisible2.value = true;
        proofFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedProofReceiptStatus.value = "";
        break;
      }
    }
    if (proofFlag.value) proofReceipt();
  }
};

// 상태미흡체크
const returnReceiptCheck = () => {
  if (selectedSlipList.value.length === 0) {
    isRequestSelectSlipSnackBarVisible.value = true;
  } else if (selectedSlipList.value.length === 1) {
    if (selectedProofReceiptStatus.value === "증빙완료") {
      isFailedSnackBarVisible.value = true;

      // 선택 초기화
      selectedSlip.value = [];
      selectedSlipNo.value = "";
      selectedProofReceiptStatus.value = "";
    } else {
      returnReceipt();
    }
  } else {
    proofFlag.value = true;
    for (let i = 0; i < selectedSlipList.value.length; i++) {
      if (selectedSlipList.value[i].proofStatus === "증빙완료") {
        isFailedSnackBarVisible2.value = true;
        proofFlag.value = false;

        // 선택 초기화
        selectedSlip.value = [];
        selectedSlipNo.value = "";
        selectedProofReceiptStatus.value = "";
        break;
      }
    }
    if (proofFlag.value) returnReceipt();
  }
};
</script>

<template>
  <p class="text-2xl mb-6">지출증빙 관리</p>
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
                label="증빙유형"
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
      <VBtn
        color="primary"
        variant="outlined"
        :to="{ name: 'account-account-ApprovalManagerFormPage' }"
      >
        <VIcon start icon="tabler-checkbox" size="22" />
        전표승인
      </VBtn>
      <VBtn color="primary" @click="selectCheck">
        <VIcon start icon="tabler-photo-plus" size="22" />
        증빙등록
      </VBtn>
      <VBtnGroup style="height: 38px">
        <VBtn color="primary" @click="proofReceiptCheck">
          <VIcon start icon="tabler-eye-check" size="25" />
          증빙완료
        </VBtn>
        <VBtn color="secondary" variant="outlined" @click="returnReceiptCheck">
          <VIcon start icon="tabler-eye-question" size="25" />
          상태미흡 </VBtn
        >
      </VBtnGroup>
    </div>
    <VDataTable
      v-model="selectedSlip"
      class="text-no-wrap"
      :headers="cashbillField"
      :items="receiptList"
      :search="currentSearchTerm"
      :items-per-page="5"
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
      <span>증빙파일 보기</span>
    </VTooltip>
  </VCard>
  <div class="text-2xl mb-2" style="margin: 25px 0 0 0">
    <VCard v-if="rowSelect">
      <VCard>
        <VCardTitle class="d-flex justify-space-between"> 증빙파일 </VCardTitle>
        <VCardText class="d-flex align-center">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="800"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />
          <!-- 👉 Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                type="reset"
                color="secondary"
                variant="outlined"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
              </VBtn>
            </div>
            <p class="text-body-1 mb-0">Allowed JPG, JPEG or PNG.</p>
          </form>
        </VCardText>
      </VCard>
    </VCard>
  </div>
  <!-- 증빙 등록 Dialog -->
  <VDialog v-model="isAddReceiptVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isAddReceiptVisible = !isAddReceiptVisible" />
    <VCard title="증빙파일 등록">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="6">
            <VSelect v-model="receiptType" :items="options" label="유형선택" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <VBtn variant="outlined" @click="refInputEl?.click()">
              <VIcon start icon="tabler-link" size="22" />
              <span class="d-none d-sm-block">파일추가</span>
            </VBtn>
            <input
              ref="refInputEl"
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              hidden
              @change="onImageChange"
            />
            <span class="file-input-label">{{ selectedFileName }}</span>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="resetSelect">
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-cloud-plus" size="22" />
          등록
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 행 선택 알림 스낵바 -->
  <VSnackbar
    v-model="isRequestSelectSlipSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    전표를 선택해주세요.
  </VSnackbar>
  <!-- 파일형식 오류 스낵바 -->
  <VSnackbar
    v-model="isFileUploadFailedSnackBarVisible"
    location="top"
    color="error"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    파일형식을 jpg / jpeg / png 로 지정해주세요.
  </VSnackbar>
  <!-- 증빙 등록 알림 스낵바 -->
  <VSnackbar
    v-model="isAddReceiptSuccessSnackBarVisible"
    location="top"
    color="success"
    :timeout="2000"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    지출증빙파일 등록 완료!
  </VSnackbar>
  <!-- 증빙 등록 불가 알림 스낵바 -->
  <VSnackbar
    v-model="isAddFailedReceiptSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    전표를 하나만 선택해주세요.
  </VSnackbar>
  <!-- 증빙 완료 알림 스낵바 -->
  <VSnackbar
    v-model="isProofReceiptSnackBarVisible"
    location="top"
    color="success"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    증빙이 완료되었습니다.
  </VSnackbar>
  <!-- 상태 미흡처리 알림 스낵바 -->
  <VSnackbar
    v-model="isReturnReceiptSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    상태미흡 처리되었습니다.
  </VSnackbar>
  <!-- 증빙파일 삭제 알림 스낵바 -->
  <VSnackbar
    v-model="isDeleteReceiptSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-circle-check-filled" />
    증빙파일이 삭제되었습니다.
  </VSnackbar>
  <!-- 증빙완료 실패 스낵바 -->
  <VSnackbar
    v-model="isFailedSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    이미 증빙완료 되었습니다.
  </VSnackbar>
  <!-- 증빙완료 실패 스낵바2 -->
  <VSnackbar
    v-model="isFailedSnackBarVisible2"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    이미 증빙완료된 전표가 있습니다.
  </VSnackbar>
  <!-- 파일 reset 실패 스낵바 -->
  <VSnackbar
    v-model="isResetFailedSnackBarVisible"
    location="top"
    color="blue-grey"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    증빙완료되어 삭제할 수 없습니다.
  </VSnackbar>
</template>
