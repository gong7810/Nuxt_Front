<script setup lang="ts">
import axios from "axios";

const propz = defineProps([
  "deptCode",
  "workplaceCode2",
  "accountPeriodNo",
  "accountInnerInnerCode",
]);

const month1 = ref("");
const month2 = ref("");
const month3 = ref("");
const month4 = ref("");
const month5 = ref("");
const month6 = ref("");
const month7 = ref("");
const month8 = ref("");
const month9 = ref("");
const month10 = ref("");
const month11 = ref("");
const month12 = ref("");

const insertBudget = async () => {
  const data = {
    deptCode: propz.deptCode,
    workplaceCode: propz.workplaceCode2,
    accountPeriodNo: propz.accountPeriodNo,
    accountInnerCode: propz.accountInnerInnerCode,
    budgetingCode: "1",
    m1Budget: month1.value,
    m2Budget: month2.value,
    m3Budget: month3.value,
    m4Budget: month4.value,
    m5Budget: month5.value,
    m6Budget: month6.value,
    m7Budget: month7.value,
    m8Budget: month8.value,
    m9Budget: month9.value,
    m10Budget: month10.value,
    m11Budget: month11.value,
    m12Budget: month12.value,
  };

  if (Object.values(data).some((dataValue) => dataValue == "")) {
    alert("월별 신청값을 입력해 주십시오");
  } else {
    console.log(Object.values(data));
    try {
      const response = await axios.post(
        "http://localhost:8282/acc/budget/registerBudget",
        data
      );

      console.log(response);
      console.log("🐢🐢🐢");
    } catch (error) {
      // axios.post에서 발생한 오류는 이곳에서 잡히게 됩니다.
      console.error("Error in insertBudget:", error);
      throw error; // 오류를 다시 던져서 상위 호출자에게 전달합니다.
    }
    alert("저장되었습니다");
  }
};
</script>

<template>
  <h1></h1>
  <VCard class="mb-6" title="예산 신청">
    <VForm @submit.prevent="() => {}" style="margin: 0 20px 0 20px">
      <VRow>
        <VCol cols="12" md="3">
          <AppTextField v-model="month1" label="1월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month2" label="2월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month3" label="3월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month4" label="4월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month5" label="5월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month6" label="6월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month7" label="7월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month8" label="8월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month9" label="9월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month10" label="10월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month11" label="11월" />
        </VCol>

        <VCol cols="12" md="3">
          <AppTextField v-model="month12" label="12월" />
        </VCol>

        <VCol cols="12" class="d-flex gap-4" style="margin-bottom: 20px">
          <VBtn @click="insertBudget"> Submit </VBtn>

          <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCard>
</template>
