<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";
import {sharedState} from "@/stores/sharedState.js";
const backendEnvVar = import.meta.env.VITE_BACKEND;

const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);
const declarationIdRef = ref(null);

const rejectCause = sharedState.rejectCause;


onMounted(() => {
  userIdRef.value = route.params.userId;
  declarationIdRef.value = route.params.declarationId;
  performRequest();
  // Redirection to the user declarations page
  window.location.href='/users/'+ userIdRef.value +'/user-declarations';
});

// Computed for the reject report request URL
const urlRef = computed(() => {
  return backendEnvVar + `/api/declaration/report/`+userIdRef.value+`/rejectReport/`+ declarationIdRef.value+ `?rejectCause=${encodeURIComponent(rejectCause)}` ;
});

const authRef = ref(true);
// Define method reference for the request
const methodRef = ref("POST");

// useRemoteData to perform the reject report request
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