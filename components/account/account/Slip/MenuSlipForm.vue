<script setup lang="ts">
import ViewSlipDetailModal from "@/components/account/account/Modal/ViewSlipDetailModal.vue";

const propz = defineProps([
  "selectedSlipNo",
  "selectedSlipStatus",
  "selectedSlipList",
  "getSelect",
  "getSelects",
]);

const emit = defineEmits([
  "resetSelect",
  "requestSlipSelect",
  "isDetailDialogClose",
  "deleteFailed",
  "deleteSlip",
  "editSlip",
]);

const flag = ref(false);

const isSlipDetailVisible = ref(false);
const isDeleteDialogVisibie = ref(false);
const isDeleteListDialogVisibie = ref(false);
const isSnackBarVisible = ref(false);

const getSelectedSlipList: Ref<any[]> = ref([]);

// 선택 초기화
const resetSelect = () => {
  emit("resetSelect");
};

// 상세 모달창 ON
const propzSetting = () => {
  isSlipDetailVisible.value = true;
  getSelectedSlipList.value = propz.selectedSlipList;
};

// 상세 모달창 OFF
const isDialogClose = () => {
  isSlipDetailVisible.value = false;
  emit("isDetailDialogClose");
};

// 모달 외부 클릭으로 꺼졌을때 처리
watch(isSlipDetailVisible, () => {
  if (isSlipDetailVisible.value === false) emit("isDetailDialogClose");
});

// 전표 삭제 가능 체크
const deleteSlipCheck = () => {
  if (propz.selectedSlipList.length === 0) {
    emit("requestSlipSelect");
  } else if (propz.selectedSlipList.length === 1) {
    if (propz.selectedSlipStatus === "승인") emit("deleteFailed");
    else isDeleteDialogVisibie.value = true;
  } else {
    for (let i = 0; i < propz.selectedSlipList.length; i++) {
      if (propz.selectedSlipList[i].slipStatus === "승인") {
        emit("deleteFailed");
        flag.value = false;
        break;
      } else {
        flag.value = true;
      }
    }
    if (flag.value) isDeleteListDialogVisibie.value = true;
  }
};

// 전표 삭제
const deleteSlip = () => {
  isDeleteDialogVisibie.value = false;
  isDeleteListDialogVisibie.value = false;
  isSlipDetailVisible.value = false;

  emit("deleteSlip");
};

// 전표 수정
const editSlip = () => {
  if (propz.selectedSlipList.length > 1) isSnackBarVisible.value = true;
  else emit("editSlip");
};
</script>

<template>
  <!-- router 링크는 pages에 들어있어야함 -->
  <div
    class="app-user-search-filter d-flex align-center flex-wrap gap-4 justify-end"
  >
    <AppTextField
      v-if="propz.getSelects"
      v-model="propz.selectedSlipNo"
      placeholder="Selected SlipNo"
      style="width: 130px"
      append-inner-icon="tabler-x"
      @click:append-inner="resetSelect"
    />
    <VBtn
      v-if="getSelect"
      variant="outlined"
      color="primary"
      @click="propzSetting"
    >
      <VIcon start icon="tabler-indent-increase" size="22" />
      상세정보 확인
    </VBtn>
    <VBtn
      color="primary"
      variant="outlined"
      :to="{ name: 'account-account-AddSlipFormPage' }"
    >
      <VIcon start icon="tabler-pencil-plus" size="22" />
      전표추가
    </VBtn>
    <VBtn color="primary" @click="deleteSlipCheck">
      <VIcon start icon="tabler-trash" size="22" />
      전표삭제
    </VBtn>
    <VBtn color="primary" @click="editSlip">
      <VIcon start icon="tabler-tool" size="22" />
      전표수정
    </VBtn>
    <!-- 전표 상세정보 Dialog -->
    <ViewSlipDetailModal
      v-model="isSlipDetailVisible"
      :selectedSlipData="getSelectedSlipList"
      @isDialogClose="isDialogClose"
      @callDelete="deleteSlipCheck"
    />
    <!-- 전표 삭제 확인 Dialog -->
    <VDialog v-model="isDeleteDialogVisibie" width="400">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDeleteDialogVisibie = !isDeleteDialogVisibie" />

      <!-- Dialog Content -->
      <VCard title="전표삭제">
        <VCardText> 해당 전표를 삭제하시겠습니까? </VCardText>
        <VCardText class="d-flex justify-end">
          <VBtn
            color="blue-grey"
            variant="tonal"
            style="margin-left: 10px"
            @click="isDeleteDialogVisibie = false"
          >
            <VIcon start icon="tabler-x" size="22" />
            취소
          </VBtn>
          <VBtn style="margin-left: 10px" @click="deleteSlip">
            <VIcon start icon="tabler-trash" size="22" />
            삭제
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <!-- 전표리스트 삭제 확인 Dialog -->
    <VDialog v-model="isDeleteListDialogVisibie" width="400">
      <!-- Dialog close btn -->
      <DialogCloseBtn
        @click="isDeleteListDialogVisibie = !isDeleteListDialogVisibie"
      />

      <!-- Dialog Content -->
      <VCard title="전표 삭제">
        <VCardText> 선택한 전표들을 삭제하시겠습니까? </VCardText>
        <VCardText class="d-flex justify-end">
          <VBtn
            color="blue-grey"
            variant="tonal"
            style="margin-left: 10px"
            @click="isDeleteListDialogVisibie = false"
          >
            <VIcon start icon="tabler-x" size="22" />
            취소
          </VBtn>
          <VBtn style="margin-left: 10px" @click="deleteSlip">
            <VIcon start icon="tabler-trash" size="22" />
            삭제
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <!-- 수정 불가 알림 스낵바 -->
    <VSnackbar
      v-model="isSnackBarVisible"
      location="top"
      variant="tonal"
      color="primary"
      :timeout="1500"
    >
      <VIcon start icon="tabler-alert-circle-filled" />
      전표를 하나만 선택해주세요.
    </VSnackbar>
  </div>
</template>

<style scoped>
.justify-end {
  justify-content: flex-end;
}
</style>
