<script setup lang="ts">
import { baseStore } from "@/store/account/base";

const emits = defineEmits(["closeDialog"]);

const closeDialog = () => {
  emits("closeDialog");
};

const updateAccountCode = async () => {
  closeDialog();
};
</script>

<template>
  <VDialog width="500">
    <VCard>
      <VCardTitle style="margin-top: 5px"> 계정과목 수정 </VCardTitle>

      <VContainer>
        <VRow>
          <VCol>
            <VTextField
              v-model="baseStore().selectedRow.accountInnerCode"
              label="계정코드"
              readonly
            />
          </VCol>
          <VCol>
            <VTextField
              v-model="baseStore().selectedRow.accountName"
              label="계정명"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              v-model="baseStore().selectedRow.accountCharacter"
              label="성격"
            />
          </VCol>
          <VCol>
            <VTextField v-model="baseStore().selectedRow.target" label="관계" />
          </VCol>
        </VRow>
      </VContainer>

      <VCardText class="d-flex justify-end">
        <VBtn style="margin-right: 15px" @click="closeDialog"> 취소 </VBtn>
        <VBtn @click="updateAccountCode"> 확인 </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
