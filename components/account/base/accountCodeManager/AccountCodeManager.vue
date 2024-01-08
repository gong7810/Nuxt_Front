<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { baseStore } from "@/store/account/base";

import UpdateAccountCodeModal from "@/components/account/base/accountCodeManager/UpdateAccountCodeModal.vue";

const headers = [
  { title: "계정과목코드", sortable: true, key: "accountInnerCode" },
  { title: "계정과목명", key: "accountName" },
  { title: "성격", key: "accountCharacter" },
  { title: "관계", key: "target" },
];

const selectedCode = ref([]);

const accountCodeList = ref([]);

const assetLevel = ref([]);
const liabilitiesLevel = ref([]);
const equityLevel = ref([]);
const incomeLevel = ref([]);
const specialAccountsLevel = ref([]);

const dialogVisible = ref(false);

const asset = [[], []];
const liabilities = [];
const equity = [];
const income = [];
const specialAccounts = [];

const selectedRow = (selected, row) => {
  baseStore().selectedRow = row.item;
};

const parentAccountCode = (value: any) => {
  accountCodeList.value = baseStore().accountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === value
  );
};

const openUpdateAccountCodeModal = () => {
  if (
    baseStore().selectedRow.accountName === "사용자설정계정과목" ||
    baseStore().selectedRow.accountName === "특수계정과목"
  )
    dialogVisible.value = true;
};

const closeDialog = async () => {
  dialogVisible.value = false;
};

onMounted(async () => {
  await baseStore().SEARCH_ACCOUNT_CODE_LIST();
  accountCodeList.value = baseStore().accountCodeList;

  // 자산
  assetLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "0101-0175"
  );
  for (let i = 0; i < assetLevel.value.length; i++)
    asset[0].push(assetLevel.value[i]);

  assetLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "0176-0250"
  );
  for (let i = 0; i < assetLevel.value.length; i++)
    asset[1].push(assetLevel.value[i]);

  console.log(asset[1]);

  // 부채
  liabilitiesLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "0251-0330"
  );
  for (let i = 0; i < liabilitiesLevel.value.length; i++)
    liabilities.push(liabilitiesLevel.value[i]);

  // 자본
  equityLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "0331-0400"
  );
  for (let i = 0; i < equityLevel.value.length; i++)
    equity.push(equityLevel.value[i]);

  // 손익
  incomeLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "0401-0999"
  );
  for (let i = 0; i < incomeLevel.value.length; i++)
    income.push(incomeLevel.value[i]);

  // 특수계정과목
  specialAccountsLevel.value = baseStore().fullAccountCodeList.filter(
    (item: any) => item.parentAccountInnerCode === "1000-1010"
  );
  for (let i = 0; i < specialAccountsLevel.value.length; i++)
    specialAccounts.push(specialAccountsLevel.value[i]);
});
</script>

<template>
  <p class="text-2xl mb-6">계정과목 관리</p>

  <VRow>
    <VList
      style="margin-top: 15px; margin-right: 20px"
      width="300px"
      height="auto"
    >
      <VListGroup>
        <template #activator="{ props }">
          <VListItem v-bind="props" title="자산" />
        </template>
        <VListGroup>
          <template #activator="{ props }">
            <VListItem v-bind="props" title="Ⅰ. 유동자산" />
          </template>
          <VListItem
            v-for="(title, i) in asset[0]"
            :key="i"
            :title="title.accountName"
            @click="parentAccountCode(title.accountInnerCode)"
          />
        </VListGroup>
        <VListGroup>
          <template #activator="{ props }">
            <VListItem v-bind="props" title="Ⅱ. 비유동자산" />
          </template>
          <VListItem
            v-for="(title, i) in asset[1]"
            :key="i"
            :title="title.accountName"
            @click="parentAccountCode(title.accountInnerCode)"
          />
        </VListGroup>
      </VListGroup>

      <VListGroup>
        <template #activator="{ props }">
          <VListItem v-bind="props" title="부채" />
        </template>
        <VListItem
          v-for="(title, i) in liabilities"
          :key="i"
          :title="title.accountName"
          @click="parentAccountCode(title.accountInnerCode)"
        />
      </VListGroup>

      <VListGroup>
        <template #activator="{ props }">
          <VListItem v-bind="props" title="자본" />
        </template>

        <VListItem
          v-for="(title, i) in equity"
          :key="i"
          :title="title.accountName"
          @click="parentAccountCode(title.accountInnerCode)"
        />
      </VListGroup>

      <VListGroup>
        <template #activator="{ props }">
          <VListItem v-bind="props" title="손익" />
        </template>

        <VListItem
          v-for="(title, i) in income"
          :key="i"
          :title="title.accountName"
          @click="parentAccountCode(title.accountInnerCode)"
        />
      </VListGroup>

      <VListItem title="특수계정과목" @click="parentAccountCode('1000-1010')" />
    </VList>

    <div style="flex: 1">
      <VDataTable
        v-model="selectedCode"
        :headers="headers"
        :items="accountCodeList"
        :items-per-page="15"
        style="margin-top: 15px"
        @click="openUpdateAccountCodeModal"
        @click:row="selectedRow"
      />
    </div>
  </VRow>

  <UpdateAccountCodeModal v-model="dialogVisible" @closeDialog="closeDialog" />
</template>

<style>
.btn {
  margin-right: 15px;
}
</style>
