<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useApplicationStore} from "@/stores/application.js";

const router = useRouter();
const route = useRoute();

const userIdRef = ref(null);
const declarationIdRef = ref(null);

userIdRef.value = route.params.userId;
declarationIdRef.value = route.params.declarationId;

const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+ userIdRef.value+'/details/' + declarationIdRef.value;
});

const authRef = ref(true);
const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

const applicationStore = useApplicationStore();
const loggedInRoles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);

const loggedInId = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.id : null);

const declarationId = declarationIdRef.value;
const userId= userIdRef.value;
onMounted(() => {
  performRequest();
});

const goback = () => {
  router.push('/users/'+ userIdRef.value+ '/user-declarations');
};
</script>

<template>
  <div class="container">
    <header>
      <div><h1>Declaration {{declarationId}} details:</h1></div>
    </header>
    <table class="table">

      <thead>
      <tr>
        <th>Field Name</th>
        <th>Field Value</th>
      </tr>
      </thead>
      <tbody v-if="loading">
      <tr>
        <td colspan="2">Loading...</td>
      </tr>
      </tbody>
      <tbody v-if="data">
      <tr>
        <th>ID</th>
        <td>{{ data.id }}</td>
      </tr>
      <tr>
        <th>Submission Date</th>
        <td>{{ data.submissionDate }}</td>
      </tr>
      <tr>
        <th>Damage date</th>
        <td>{{ data.damageDate }}</td>
      </tr>
      <tr>
        <th>Plant production</th>
        <td>{{ data.plant_production }}</td>
      </tr>
      <tr>
        <th>Field Size</th>
        <td>{{ data.fieldSize }}</td>
      </tr>
      <tr>
        <th>Field Address</th>
        <td>{{ data.fieldAddress }}</td>
      </tr>
      <tr>
        <th>Description</th>
        <td>{{ data.description }}</td>
      </tr>
      <tr>
        <th>Annual Start Production</th>
        <td>{{ data.annualStartProduction }}</td>
      </tr>
      <tr>
        <th>Status</th>
        <td>{{ data.status }}</td>
      </tr>
      <tr v-if="data.status === 'Accepted'">
        <th>Amount</th>
        <td>{{ data.amount }}</td>
      </tr>

      </tbody>
      <button type="button" @click="goback" >Go Back!</button>
      <div v-if="loggedInRoles.includes('ROLE_ADMIN') || (loggedInId.value === userId)">
        <RouterLink :to="{name: 'edit-declaration', params: {userId: userIdRef.value, declarationId: declarationIdRef.value}}">Edit Declaration</RouterLink>

      </div>

    </table>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

}


.table {
  width: 90vw; /* Dynamic width based on viewport width */
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6; /* Set your desired border color */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary {
  width: 100%;
}

@media (min-width: 768px) {
  .table {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>