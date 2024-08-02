<script setup>

// Imports
import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";
const backendEnvVar = import.meta.env.VITE_BACKEND;

// Initializing router and route
const router = useRouter();
const route = useRoute();

// Creating refs for userId and declarationId
const userIdRef = ref(null);
const requestIdRef = ref(null);



onMounted(() => {
  // user and request IDs from the route params
  userIdRef.value = route.params.userId;
  requestIdRef.value = route.params.requestId;
  // Perform the reject request
  performRequest();
  // Redirection to the users page
  window.location.href='/users';
});

// Computed for the reject request URL
const urlRef = computed(() => {
  return backendEnvVar + '/api/admin/users/requests/reject/'+userIdRef.value+'/'+ requestIdRef.value ;
});

// Authentication
const authRef = ref(true);

// Define method reference for the request
const methodRef = ref("POST");

// useRemoteData composable to perform the reject request
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