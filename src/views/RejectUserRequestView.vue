<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";

const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);
const requestIdRef = ref(null);



onMounted(() => {
  userIdRef.value = route.params.userId;
  requestIdRef.value = route.params.requestId;
  performRequest();
  router.push('/users');
});

const urlRef = computed(() => {
  return 'http://localhost:9090/api/admin/users/requests/reject/'+userIdRef.value+'/'+ requestIdRef.value ;
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