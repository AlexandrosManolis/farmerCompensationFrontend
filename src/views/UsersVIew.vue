<script setup>

// Imports
import {computed, onMounted, ref} from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useApplicationStore} from "@/stores/application.js";
import {useRoute} from "vue-router";
const backendEnvVar = import.meta.env.VITE_BACKEND;

// Initializing route
const route = useRoute();

// Reference for the user ID
const userIdRef = ref(null);

// Reference for the API URL
const urlRef = ref(backendEnvVar + '/api/users');

// Reference for authentication status
const authRef = ref(true);

// Fetch user data from the API
const {data, loading, performRequest} = useRemoteData(urlRef, authRef);

onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest();
});


// Set up authentication-related variables
const applicationStore = useApplicationStore();
const loggedInUsername = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.username : null);
const loggedInRoles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);
const requestedRoleName = 'ROLE INSPECTOR';

</script>

<template xmlns:sec="http://www.w3.org/1999/xhtml">

  <div class="container">
    <div class="users-card">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="header">
            <h1 class="fs-3 text-center">Users</h1>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody v-if="loading" class="loading-spinner">
              <tr>
                <td colspan="5">Loading...</td>
              </tr>
              </tbody>
              <tbody v-if="data">
              <template v-if="Array.isArray(data)">
                <!-- Loop through user data -->
                <tr v-for="user in data" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <!-- View user details -->
                  <td>
                    <router-link :to="{name: 'user-details', params: { id: user.id }}" class="btn btn-primary">
                      <i class="fas fa-info-circle"></i> Details
                    </router-link>
                  </td>
                  <!-- Edit user (admin) -->
                  <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
                    <router-link :to="{name: 'user-edit', params: { id: user.id }}" class="btn btn-primary">
                      <i class="fas fa-edit"></i> Edit
                    </router-link>
                  </td>
                  <!-- Edit user (inspector or farmer) -->
                  <td v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')">
                    <router-link :to="{name: 'user-edit', params: { id: user.id }}" class="btn btn-primary" v-if="user.username === loggedInUsername">
                      <i class="fas fa-edit"></i> Edit
                    </router-link>
                  </td>
                  <!-- View user declarations -->
                  <td>
                    <router-link :to="{name: 'user-declarations', params: { id: user.id }}" class="btn btn-primary">
                      <i class="fas fa-file-alt"></i> Declarations
                    </router-link>
                  </td>
                  <!-- Delete user role (admin) -->
                  <td v-if="loggedInRoles.includes('ROLE_ADMIN') && (user.roles.some(role => role.name === 'ROLE_INSPECTOR'))">
                    <router-link :to="{name: 'delete-role', params: { userId: user.id, roleId: user.roles.find(role => role.name === 'ROLE_INSPECTOR')?.id}}" class="btn btn-danger">
                      <i class="fas fa-trash"></i> Delete role {{user.roles.name}}
                    </router-link>
                  </td>
                </tr>
              </template>
              <template v-else>
                <!-- Single user data -->
                <tr>
                  <td>{{ data.id }}</td>
                  <td>{{ data.username }}</td>
                  <td>{{ data.email }}</td>
                  <!-- View user details -->
                  <td>
                    <router-link :to="{name: 'user-details', params: { id: data.id }}" class="btn btn-primary">
                      <i class="fas fa-info-circle"></i> Details
                    </router-link>
                  </td>
                  <!-- Edit user (admin) -->
                  <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
                    <router-link :to="{name: 'user-edit', params: { id: data.id }}" class="btn btn-primary">
                      <i class="fas fa-edit"></i> Edit
                    </router-link>
                  </td>
                  <!-- Edit user (inspector or farmer) -->
                  <td v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')">
                    <router-link :to="{name: 'user-edit', params: { id: data.id }}" class="btn btn-primary" v-if="data.username === loggedInUsername">
                      <i class="fas fa-edit"></i> Edit
                    </router-link>
                  </td>
                  <!-- View user declarations -->
                  <td>
                    <router-link :to="{name: 'user-declarations', params: { id: data.id }}" class="btn btn-primary">
                      <i class="fas fa-file-alt"></i> Declarations
                    </router-link>
                  </td>
                  <!-- Request for role (farmer) -->
                  <td v-if="loggedInRoles.includes('ROLE_FARMER') && (loggedInRoles.length === 1)">
                    <router-link :to="{name: 'request-for-role', params: { userId: data.id}}" class="btn btn-success" v-if="data.username === loggedInUsername">
                      <i class="fas fa-plus"></i> Request for {{ requestedRoleName }}
                    </router-link>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
          <!-- User Requests and Create new user buttons for admin -->
          <div class="button-container mt-3">
            <router-link v-if="loggedInRoles.includes('ROLE_ADMIN')" :to="{ name: 'user-requests'}" class="btn btn-primary ml-2">
              <i class="fas fa-user-plus"></i> User Requests
            </router-link>
            <router-link v-if="loggedInRoles.includes('ROLE_ADMIN')" :to="{ name: 'register'}" class="btn btn-primary ml-2">
              <i class="fas fa-user-plus"></i> Create new user!
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.users-card {
  width: 80vw;
  max-width: 800px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  table-layout: auto;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
}

.btn {
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.btn-primary {
  background-color: #3490dc;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #2779bd;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .users-card {
    width: 60vw;
  }
}
</style>