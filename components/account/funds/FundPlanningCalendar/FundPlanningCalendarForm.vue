<script setup lang="ts">
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { fundsStore } from "@/store/account/funds";

const selectedDate = ref("2024-01");

const year = ref<string>("2024");
const month = ref<string>("01");
const calendar = ref<number[][]>([]);

const incomeResults = ref({});
const expenditureResults = ref({});

const fundIncomePlanDetail = ref(false);
const fundExpenditurePlanDetail = ref(false);
const selectDay = ref(-1);
const selectflag = ref(false);

const isSameCalendarSnackBarVisible = ref(false);

const inExpectedPlanList: Ref<any[]> = ref([]);
const outExpectedPlanList: Ref<any[]> = ref([]);

const content = ref(null);
let html2pdf: any;

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
];

// 달력 세팅
const generateCalendar = () => {
  const firstDayOfMonth = new Date(year.value, month.value - 1, 1);
  const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, ...

  const startDate = new Date(firstDayOfMonth);

  startDate.setDate(1 - startingDay);

  const endDate = new Date(year.value, month.value, 0);

  const tempCalendar: number[][] = [];
  // eslint-disable-next-line prefer-const
  let currentDate = new Date(startDate);

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    const week: number[] = Array(7)
      .fill(0)
      .map(() => {
        const day =
          currentDate.getMonth() === month.value - 1
            ? currentDate.getDate()
            : 0;

        currentDate.setDate(currentDate.getDate() + 1);

        return day;
      });

    tempCalendar.push(week);
  }

  calendar.value = tempCalendar;
};

// 토요일 체크
const isSaturday = (day: any) => {
  return day !== 0 && new Date(year.value, month.value - 1, day).getDay() === 6;
};

// 일요일 체크
const isSunday = (day: any) => {
  return day !== 0 && new Date(year.value, month.value - 1, day).getDay() === 0;
};

// 공휴일 / 직원생일 체크
const isHoliday = (day: any) => {
  if (Number(month.value) === 12 && day === 25) return "🎅";
  else if (month.value === "01" && day === 1) return "☀️";
  else if (month.value === "08" && day === 15) return "🗽";
  else if (month.value === "08" && day === 14) return "🎂"; // su생일
  else if (month.value === "10" && day === 25) return "🎂"; // yj생일
  else if (month.value === "01" && day === 19) return "🎂"; // jh생일
  else if (month.value === "01" && day === 29) return "🎂"; // ye생일
  else if (month.value === "09" && day === 1) return "🎂"; // yj생일
  else if (month.value === "04" && day === 23) return "🎂"; // sw생일
  else if (month.value === "02" && day === 29) return "🎂"; // jh생일
  else return day;
};

onMounted(() => {
  generateCalendar();
});

// 선택 초기화
const reset = () => {
  fundIncomePlanDetail.value = false;
  fundExpenditurePlanDetail.value = false;
  selectDay.value = -1;
};

// 달력 조회
const searchMonthPlan = () => {
  if (
    Number(year.value) !== Number(selectedDate.value.substring(0, 4)) ||
    Number(month.value) !== Number(selectedDate.value.substring(5))
  ) {
    year.value = selectedDate.value.substring(0, 4);
    month.value = selectedDate.value.substring(5);

    generateCalendar();
    reset();
  } else {
    isSameCalendarSnackBarVisible.value = true;
  }
};

// 이전달
const searchPreviousPlan = () => {
  month.value = Number(month.value) - 1;

  if (month.value < 10) {
    if (month.value > 0) {
      selectedDate.value = `${year.value}-0${month.value}`;
    } else {
      selectedDate.value = `${Number(year.value) - 1}-${
        Number(month.value) + 12
      }`;
    }
  } else {
    selectedDate.value = `${year.value}-${month.value}`;
  }

  year.value = selectedDate.value.substring(0, 4);
  month.value = selectedDate.value.substring(5);

  generateCalendar();
  reset();
};

// 다음달
const searchNextPlan = () => {
  month.value = Number(month.value) + 1;

  if (month.value >= 10) {
    if (month.value < 13) {
      selectedDate.value = `${year.value}-${month.value}`;
      console.log(selectedDate.value);
    } else {
      selectedDate.value = `${Number(year.value) + 1}-0${
        Number(month.value) - 12
      }`;
    }
  } else {
    selectedDate.value = `${year.value}-0${month.value}`;
  }

  year.value = selectedDate.value.substring(0, 4);
  month.value = selectedDate.value.substring(5);

  generateCalendar();
  reset();
};

// // 날짜별 수입확인
const hasIncomePlanCheck = async (day: any) => {
  const date =
    day < 10
      ? `${year.value}-${month.value}-0${day}`
      : `${year.value}-${month.value}-${day}`;

  const price = await fundsStore().FETCH_DATE_INCOME(date);

  return price.data.price === null ? "수입 : 0" : `수입 : ${price.data.price}`;
};

// // 날짜별 지출확인
const hasExpenditurePlanCheck = async (day: any) => {
  const date =
    day < 10
      ? `${year.value}-${month.value}-0${day}`
      : `${year.value}-${month.value}-${day}`;

  const price = await fundsStore().FETCH_DATE_EXPENDITURE(date);

  return price.data.price === null ? "지출 : 0" : `지출 : ${price.data.price}`;
};

// 날짜별 비동기함수 실행
watchEffect(() => {
  const promises = [];
  for (const week of calendar.value) {
    for (const day of week) {
      if (day !== 0) {
        promises.push(hasIncomePlanCheck(day));
        promises.push(hasExpenditurePlanCheck(day));
      }
    }
  }

  Promise.all(promises)
    .then((results: any) => {
      for (let i = 0; i < results.length; i += 2) {
        const day = i / 2 + 1;

        incomeResults.value[day] = results[i];
        expenditureResults.value[day] = results[i + 1];
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
});

// 날짜 선택
const isSelect = (day: number) => {
  return selectDay.value === day;
};

watch(inExpectedPlanList, () => {
  if (inExpectedPlanList.value.length) fundIncomePlanDetail.value = true;
  else fundIncomePlanDetail.value = false;
});

watch(outExpectedPlanList, () => {
  if (outExpectedPlanList.value.length) fundExpenditurePlanDetail.value = true;
  else fundExpenditurePlanDetail.value = false;
});

// 날짜별 계획 상세보기
const showDetail = async (day: number) => {
  selectDay.value = day;

  const date =
    day < 10
      ? `${year.value}-${month.value}-0${day}`
      : `${year.value}-${month.value}-${day}`;

  await fundsStore().FETCH_DATE_DETAIL(date);

  inExpectedPlanList.value = fundsStore().inExpectedPlanList;
  outExpectedPlanList.value = fundsStore().outExpectedPlanList;

  selectflag.value = true;
};

// 파일 다운로드
const downloadPDF = async () => {
  if (!html2pdf) html2pdf = await import("html2pdf.js");

  html2pdf.default(content.value);
};
</script>

<template>
  <p class="text-2xl mb-6">자금계획 카렌다</p>
  <div>
    <VCard class="mb-6">
      <VRow style="margin-bottom: 10px">
        <VCol md="3" style="margin: 20px 0 0 20px">
          <VForm>
            <VTextField v-model="selectedDate" label="계획년월" type="month" />
          </VForm>
        </VCol>
        <VCol style="margin: 21px 0 0 -10px">
          <VIcon icon="tabler-chevron-left" @click="searchPreviousPlan" />
          <VIcon icon="tabler-chevron-right" @click="searchNextPlan" />
          &nbsp;&nbsp;
          <VBtn
            color="primary"
            style="margin-right: 15px"
            @click="searchMonthPlan"
          >
            <VIcon start icon="tabler-search" size="22" />
            조회
          </VBtn>
          <VBtn color="primary" style="margin-right: 15px" @click="downloadPDF">
            <VIcon start icon="tabler-note" size="22" />
            출력
          </VBtn>
          <VBtn
            color="primary"
            variant="outlined"
            :to="{ name: 'account-funds-DailyFundPlanInputFormPage' }"
          >
            <VIcon start icon="tabler-playlist-add" size="22" />
            추가
          </VBtn>
        </VCol>
      </VRow>

      <div ref="content">
        <h2 style="margin: 0 20px 10px auto; width: fit-content">
          {{ year }}년 {{ month }}월
        </h2>
        <h5 style="margin: 0 20px 10px auto; width: fit-content">
          (단위:천원)
        </h5>
        <table>
          <tr>
            <th class="sun">Sun</th>
            <th class="other">Mon</th>
            <th class="other">Tue</th>
            <th class="other">Wed</th>
            <th class="other">Thu</th>
            <th class="other">Fri</th>
            <th class="sat">Sat</th>
          </tr>
          <tr v-for="week in calendar" :key="week" class="days">
            <td
              v-for="day in week"
              :key="day"
              :class="{
                'other-month': day === 0,
                'fixed-width-cell': day !== 0,
                'saturday-text': isSaturday(day),
                'sunday-text': isSunday(day),
                'select-date': isSelect(day),
              }"
              style="text-align: right; border: 1px solid #ddd"
            >
              {{ day !== 0 ? isHoliday(day) : "" }} <br />
              <template v-if="day !== 0">
                <div
                  style="text-align: left; color: grey"
                  @click="showDetail(day)"
                >
                  {{ incomeResults[day] }} <br />
                  {{ expenditureResults[day] }}
                </div>
              </template>
            </td>
          </tr>
        </table>
      </div>
    </VCard>
  </div>
  <VCard v-if="fundIncomePlanDetail" title="수입예정" class="mb-6">
    <VCardText>
      <VDataTable
        :headers="dailyFundPlanField"
        :items="inExpectedPlanList"
        :items-per-page="10"
      />
    </VCardText>
  </VCard>
  <VCard v-if="fundExpenditurePlanDetail" title="지출예정">
    <VCardText>
      <VDataTable
        :headers="dailyFundPlanField"
        :items="outExpectedPlanList"
        :items-per-page="10"
      />
    </VCardText>
  </VCard>
  <!-- 알림 스낵바 -->
  <VSnackbar
    v-model="isSameCalendarSnackBarVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    현재 조회중인 캘린더입니다.
  </VSnackbar>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

td {
  border: 10px solid #ddd;
}

.other {
  background-color: rgb(180, 180, 180);
  color: white;
}

.sun {
  background-color: tomato;
  color: white;
}

.sunday-text {
  color: tomato;
}

.sat {
  background-color: skyblue;
  color: white;
}

.saturday-text {
  color: skyblue;
}

.other-month {
  color: #ccc;
}

.fixed-width-cell {
  width: 100px;
  height: 70px;
}

.select-date {
  color: rgb(60, 185, 60);
}
</style>
