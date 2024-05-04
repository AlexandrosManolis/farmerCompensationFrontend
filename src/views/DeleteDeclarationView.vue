<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";

const router = useRouter();
const route = useRoute();
// Creating refs for userId and declarationId
const userIdRef = ref(null);
const declarationIdRef = ref(null);



onMounted(() => {
  userIdRef.value = route.params.userId;
  declarationIdRef.value = route.params.declarationId;
  performRequest();
  // Redirect to '/users' route after performing the request
  window.location.href='/users/'+userIdRef.value+'/user-declarations';
});

// Computed for constructing the delete API URL with userId and declarationId
const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+userIdRef.value+'/delete/'+ declarationIdRef.value ;
});

// Authentication status
const authRef = ref(true);
const methodRef = ref("GET");

// useRemoteData to perform the HTTP request
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