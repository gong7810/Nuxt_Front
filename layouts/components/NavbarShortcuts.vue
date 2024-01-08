<script setup lang="ts">
const shortcuts = [
  {
    icon: "tabler-cash",
    title: "회계",
    subtitle: "Accounting",
    to: { name: "account-Home" },
  },
  {
    icon: "tabler-truck-delivery",
    title: "물류",
    subtitle: "Logistics",
    to: { name: "logistic-Home" },
  },
  {
    icon: "tabler-user",
    title: "인사",
    subtitle: "HumanResources",
    to: { name: "hr-Home" },
  },
  {
    icon: "tabler-settings",
    title: "공통",
    subtitle: "Common",
    to: { name: "apps-calendar" },
  },
];
</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
