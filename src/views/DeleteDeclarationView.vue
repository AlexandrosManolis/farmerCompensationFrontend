<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";
import {useRemoteData} from "@/composables/useRemoteData.js";

const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);
const declarationIdRef = ref(null);



onMounted(() => {
  userIdRef.value = route.params.userId;
  declarationIdRef.value = route.params.declarationId;
  performRequest();
  router.push('/users');
});

const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+userIdRef.value+'/delete/'+ declarationIdRef.value ;
});

const authRef = ref(true);
const methodRef = ref("GET");

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