<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useApplicationStore} from "@/stores/application.js";

// Initializing router and route
const router = useRouter();
const route = useRoute();

// Creating refs for userId and declarationId
const userIdRef = ref(null);
const declarationIdRef = ref(null);

// Setting userId and declarationId from route params
userIdRef.value = route.params.userId;
declarationIdRef.value = route.params.declarationId;

onMounted(() => {
  performRequest();
});

// API URL with userId and declarationId
const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+ userIdRef.value+'/details/' + declarationIdRef.value;
});

const authRef = ref(true);
const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

const applicationStore = useApplicationStore();
// Computed for loggedInRoles and loggedInId
const loggedInRoles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);
const loggedInId = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.id : null);

const checkUser = () => {
  return loggedInRoles.value.includes('ROLE_ADMIN') || (loggedInId.value == userIdRef.value);
};

const declarationId = declarationIdRef.value;


// Function to navigate back to the user-declarations route
const goback = () => {
  router.push('/users/'+ userIdRef.value+ '/user-declarations');
};
</script>

<template>
  <div class="container">
    <header>
      <div class="header text-center mb-4"><h1>Declaration {{declarationId}} details:</h1></div>
    </header>
      <div class="declaration-details">
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
        <th>Natural Disaster</th>
        <td>{{ data.naturalDisaster }}</td>
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
      <tr v-if="data.status !== 'Rejected' ">
        <th>Status</th>
        <td>{{ data.status }}</td>
      </tr>
      <tr v-if="data.status === 'Rejected'">
        <th>Status</th>
        <td>{{data.status}} ({{ data.rejectCause }})</td>
      </tr>
      <tr v-if="data.status === 'Accepted'">
        <th>Amount</th>
        <td>{{ data.amount }}</td>
      </tr>

      </tbody>
      <div class="d-flex justify-content-between align-items-end mt-3">

        <div class="col">
          <!-- Go back button -->
          <div class="mt-3">
            <button type="button" class="btn btn-dark btn-sm" @click="goback">Go Back</button>
          </div>
        </div>

        <!-- Show edit declaration link for admins or the user who owns the declaration -->
        <div class="col-auto">
          <div v-if="checkUser()">
            <RouterLink :to="{name: 'edit-declaration', params: {userId: userIdRef.value, declarationId: declarationIdRef.value}} "  class="btn btn-success btn-lg">Edit Declaration</RouterLink>
          </div>
        </div>

      </div>
    </table>
      </div>
  </div>

</template>

<style scoped>
:root {
  --primary-color: #007bff;
  --text-color: #333;
  --background-color: #f8f9fa;
  --white: #fff;
}

body {
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
  font-size: 2rem;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: var(--text-color);
}

.declaration-details {
  width: 100%;
  max-width: 600px;
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  color: var(--text-color);
}


/* Additional styling for buttons and icons */
.btn {
  margin-right: 8px;
  padding: 10px 24px; /* Increase padding */
  font-size: 16px; /* Increase font size */
}

.fa {
  margin-right: 5px;
}

</style>