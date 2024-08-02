<script setup>

// Imports
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRemoteData } from '@/composables/useRemoteData.js';
const backendEnvVar = import.meta.env.VITE_BACKEND;

// Initializing router and route
const router = useRouter();
const route = useRoute();

// Define reference for the user ID
const userIdRef = ref(null);

// Authentication
const authRef = ref(true);

// Computed property for the URL to fetch user details
const urlRef = computed(() => {
  return backendEnvVar + '/api/users/details/' + userIdRef.value;
});

// useRemoteData composable to fetch user details
const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

userIdRef.value = route.params.id;
onMounted(() => {
  performRequest();
});

const userid = userIdRef.value;

// Function to navigate back to the users page
const goBack = () => {
  router.push('/users');
};
</script>


<template>
  <div class="container py-5">
    <div class="header text-center mb-4" >
      <h1>User Details with ID: {{ userid }}</h1>
    </div>
    <div class="user-details">
      <table class="table">
        <thead>
        <tr>
          <th class="fw-bold">Field Name</th>
          <th class="fw-bold">Field Value</th>
        </tr>
        </thead>
        <tbody v-if="loading">
        <tr>
          <td colspan="2" class="loading-cell">Loading...</td>
        </tr>
        </tbody>
        <tbody v-if="data" class="user-details">
        <tr>
          <th>ID</th>
          <td>{{ data.id }}</td>
        </tr>
        <tr>
          <th>Username</th>
          <td>{{ data.username }}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>{{ data.email }}</td>
        </tr>
        <tr>
          <th>Full Name</th>
          <td>{{ data.full_name }}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>{{ data.address }}</td>
        </tr>
        <tr>
          <th>AFM</th>
          <td>{{ data.afm }}</td>
        </tr>
        <tr>
          <th>Identity ID</th>
          <td>{{ data.identity }}</td>
        </tr>
        <tr>
          <th>User role</th>
          <td>
            <div v-for="(role, index) in data.roles" :key="index" class="role">
              {{ role.name }}
            </div>
          </td>
        </tr>
        </tbody>
        <!-- Go back button -->
        <div class="mt-3">
          <button type="button" class="btn btn-dark btn-sm" @click="goBack">Go Back</button>
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

.user-details {
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

.role {
  margin-bottom: 5px;
  color: var(--text-color);
}

/* Additional styling for buttons and icons */
.btn {
  margin-right: 8px;
  padding: 10px 24px; /* Increase padding */
  font-size: 16px; /* Increase font size */
}

</style>
