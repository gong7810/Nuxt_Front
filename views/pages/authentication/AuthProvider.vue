<script setup lang="ts">
import axios from "axios";
import { useTheme } from "vuetify";

const emit = defineEmits(["oauthClear"]);

const { global } = useTheme();
const isFacebookTwitterVisible = ref(false);

const authProviders = [
  {
    icon: "fa-google",
    color: "#dd4b39",
    colorInDark: "#db4437",
    model: "google",
  },
  {
    icon: "tabler-brand-netflix",
    color: "#2ADC4D",
    colorInDark: "#2ADC4D",
    model: "naver",
  },
  {
    icon: "tabler-brand-kickstarter",
    color: "#EEE607",
    colorInDark: "#EEE607",
    model: "kakao",
  },
  {
    icon: "fa-facebook",
    color: "#4267b2",
    colorInDark: "#4267b2",
    model: "facebook",
  },
  {
    icon: "fa-twitter",
    color: "#1da1f2",
    colorInDark: "#1da1f2",
    model: "twitter",
  },
];

const oauth2 = async (model: any) => {
  console.log(model);
  if (model === "google") {
    window.location.href = "http://localhost:8282/oauth2/authorization/google";

    const response = await axios.get(
      `http://localhost:8282/sys/loginForm/${model}`
    );
  } else if (model === "naver") {
    window.location.href = "http://localhost:8282/oauth2/authorization/naver";

    const response = await axios.get(
      `http://localhost:8282/sys/loginForm/${model}`
    );
  } else if (model === "kakao") {
    window.location.href = "http://localhost:8282/oauth2/authorization/kakao";

    const response = await axios.get(
      `http://localhost:8282/sys/loginForm/${model}`
    );
  } else {
    isFacebookTwitterVisible.value = true;
  }
};
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-3">
    <VBtn
      v-for="link in authProviders"
      v-model="link.model"
      :key="link.icon"
      icon
      variant="tonal"
      size="38"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color"
      class="rounded"
      @click="oauth2(link.model)"
    >
      <VIcon size="18" :icon="link.icon" />
    </VBtn>
  </div>
  <!-- 준비중 알림 스낵바 -->
  <VSnackbar
    v-model="isFacebookTwitterVisible"
    location="top"
    color="primary"
    :timeout="1500"
  >
    <VIcon start icon="tabler-alert-circle-filled" />
    준비중입니다.
  </VSnackbar>
</template>
