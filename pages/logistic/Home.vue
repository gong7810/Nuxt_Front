<script setup lang="ts">
import { onMounted } from "vue";
import { commonStore } from '@/store/common'

onMounted(() => {
  commonStore().FETCH_MENU('물류')
  console.log(commonStore().menu)
})
</script>

<template>
  <div style="font-family: '카페24 써라운드'">
    <VCard title="Kick start your project ✈️" style="margin-bottom: 25px">
      <VCardText>물류관리 페이지입니다</VCardText>
      <VCardText>
        업무관련은 아래로 연락해주세요
        <a
          href="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/"
          target="_blank"
          >문의 페이지.
        </a>
        <!-- vlink가 없어 a태그로 수정 -->
        저녁 7시 이후로는 급한용무만 관리자에게 연락 바랍니다.
      </VCardText>
      <VCardText>
        📞 TEL : 055-753-3677 &nbsp;&nbsp; 📲 PHONE : 010-4513-9743
      </VCardText>
    </VCard>

    <VCard title="Want to integrate JWT? 🔒" style="margin: 25px 0 0 0">
      <VCardText>
        We carefully crafted JWT flow so you can implement JWT with ease and
        with minimum efforts.
      </VCardText>
      <VCardText>
        Please read our JWT Documentation to get more out of JWT authentication.
      </VCardText>
    </VCard>
  </div>
</template>
