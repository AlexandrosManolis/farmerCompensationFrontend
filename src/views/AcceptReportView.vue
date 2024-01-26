<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";
import {sharedState} from "@/stores/sharedState.js";

const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);
const declarationIdRef = ref(null);

const amount = sharedState.amount;

onMounted(() => {
  userIdRef.value = route.params.userId;
  declarationIdRef.value = route.params.declarationId;
  performRequest();
  router.push('/users/'+ userIdRef.value +'/user-declarations');
});

const urlRef = computed(() => {
  return `http://localhost:9090/api/declaration/report/${userIdRef.value}/acceptReport/${declarationIdRef.value}?amount=${encodeURIComponent(amount)}`;
  });

const authRef = ref(true);
const methodRef = ref("POST");

const { data, performRequest } = useRemoteData(urlRef, authRef, methodRef);


</script>

<template>
  <tbody v-if="loading" class="loading-spinner">
  <tr>
    <td colspan="5">Loading...</td>
  </tr>
  </tbody>
</template>


<style scoped>

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>