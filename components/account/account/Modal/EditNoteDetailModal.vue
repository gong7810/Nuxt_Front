<script setup lang="ts">
import { accountStore } from "@/store/account/account";

const propz = defineProps([
  "isEditNoteDetailDialogOpen",
  "selectedNoteDetailNo",
  "noteDetailData",
]);

const emit = defineEmits(["submit", "dialogClose"]);

// Dialog 데이터칼럼
const journalNo = ref("");
const noteNo = ref("");
const noteType = ref("");
const accountInnerCode = ref("");
const drawer = ref("");
const endorser = ref("");
const drawee = ref("");
const issuanceDate = ref("");
const maturityDate = ref("");
const index = ref(0);

const options = ref<string[]>(["1.당좌", "2.가계", "3.어음", "4.전자"]);
const draweeList = ref<string[]>();

watch(
  () => propz.isEditNoteDetailDialogOpen,
  () => {
    for (let i = 0; i < propz.noteDetailData.length; i++) {
      if (propz.noteDetailData[i].noteNo === propz.selectedNoteDetailNo) {
        journalNo.value = propz.noteDetailData[i].journalNo;
        noteNo.value = propz.noteDetailData[i].noteNo;
        noteType.value = propz.noteDetailData[i].noteType;
        accountInnerCode.value = propz.noteDetailData[i].accountInnerCode;
        drawer.value = propz.noteDetailData[i].drawer;
        endorser.value = propz.noteDetailData[i].endorser;
        drawee.value = propz.noteDetailData[i].drawee;
        issuanceDate.value = propz.noteDetailData[i].issuanceDate;
        maturityDate.value = propz.noteDetailData[i].maturityDate;

        // 어음 index
        index.value = i;
        break;
      }
    }
  }
);

// 어음 임력 rule
const noteRules = [
  (value: string | null) => {
    if (value?.length && value.length > 0) {
      if (value?.length && value.length === 20) return true;
      else return "올바른 어음번호가 아닙니다.";
    }

    return "필수 입력사항입니다.";
  },
];

// 사원정보 조회
const fetchData = async () => {
  await accountStore().FETCH_ALL_EMPLOYEES();
  draweeList.value = Object.values(accountStore().empList).map(
    (item: any) => item.empName
  );
};

onMounted(() => {
  fetchData();
});

const dialogClose = () => {
  emit("isDialogClose");
};

const formSubmit = () => {
  const noteDetailsArray: any = [
    {
      journalNo: journalNo.value,
      noteNo: noteNo.value,
      noteType: noteType.value,
      accountInnerCode: accountInnerCode.value,
      drawer: drawer.value,
      endorser: endorser.value,
      drawee: drawee.value,
      issuanceDate: issuanceDate.value,
      maturityDate: maturityDate.value,
      index: index.value,
    },
  ];

  emit("submit", noteDetailsArray);

  dialogClose();
};
</script>

<template>
  <VDialog max-width="600">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogClose" />

    <VCard title="어음상세 수정">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="8">
            <AppTextField v-model="journalNo" label="분개번호" disabled />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField
              v-model="accountInnerCode"
              label="계정코드"
              disabled
            />
          </VCol>
          <VCol cols="12" sm="6" md="8">
            <AppTextField
              v-model="noteNo"
              label="어음번호"
              placeholder="123-12345678-12345678-1"
              :rules="noteRules"
            />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppSelect v-model="noteType" :items="options" label="어음유형" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="drawer" label="발행인" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="endorser" label="배서인" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppSelect v-model="drawee" :items="draweeList" label="수금사원" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="issuanceDate" label="발행일자" type="date" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="maturityDate" label="만기일자" type="date" />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="dialogClose">
          <VIcon start icon="tabler-x" size="22" />
          취소
        </VBtn>
        <VBtn type="submit" @click="formSubmit">
          <VIcon start icon="tabler-database-cog" size="22" />
          저장
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
