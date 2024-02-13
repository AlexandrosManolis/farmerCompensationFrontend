<script setup>

import {computed, onMounted, ref} from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useApplicationStore} from "@/stores/application.js";
import {useRoute} from "vue-router";


const route = useRoute();
const userIdRef = ref(null);
const urlRef = ref('http://localhost:9090/api/users');
const authRef = ref(true);
const {data, loading, performRequest} = useRemoteData(urlRef, authRef);

onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest();
});

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
          <div class="mb-4">
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
          <tr v-for="user in data" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <RouterLink :to="{name: 'user-details', params: { id: user.id }}" class="btn btn-primary">Details</RouterLink>
            </td>
              <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
                <RouterLink :to="{name: 'user-edit', params: { id: user.id }}" class="btn btn-primary" >Edit</RouterLink>

              </td>
              <td v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')">
                <RouterLink :to="{name: 'user-edit', params: { id: user.id }}" class="btn btn-primary" v-if="user.username === loggedInUsername" >Edit</RouterLink>
              </td>
            <td>
              <RouterLink :to="{name: 'user-declarations', params: { id: user.id }}" class="btn btn-primary" >Declarations</RouterLink>
            </td>

            <td v-if="loggedInRoles.includes('ROLE_ADMIN') && (user.roles.some(role => role.name === 'ROLE_INSPECTOR'))">

              <RouterLink :to="{name: 'delete-role', params: { userId: user.id, roleId: user.roles.find(role => role.name === 'ROLE_INSPECTOR')?.id}}" class="btn btn-danger" >Delete role {{user.roles.name}}</RouterLink>

            </td>

          </tr>
        </template>
        <template v-else>
          <tr>
            <td>{{ data.id }}</td>
            <td>{{ data.username }}</td>
            <td>{{ data.email }}</td>
            <td>
              <RouterLink :to="{name: 'user-details', params: { id: data.id }}" class="btn btn-primary">Details</RouterLink>
            </td>
            <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
              <RouterLink :to="{name: 'user-edit', params: { id: data.id }}" class="btn btn-primary" >Edit</RouterLink>
            </td>
            <td v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')">
              <RouterLink :to="{name: 'user-edit', params: { id: data.id }}" class="btn btn-primary" v-if="data.username === loggedInUsername" >Edit</RouterLink>
            </td>
            <td>
              <RouterLink :to="{name: 'user-declarations', params: { id: data.id }}" class="btn btn-primary" >Declarations</RouterLink>
            </td>

              <td v-if="loggedInRoles.includes('ROLE_FARMER') && (loggedInRoles.length === 1)">

              <RouterLink :to="{name: 'request-for-role', params: { userId: data.id}}" class="btn btn-success" v-if="data.username === loggedInUsername" >Request for
                {{ requestedRoleName }}</RouterLink>
              </td>

          </tr>
        </template>

        </tbody></table>
    </div>
          <div class="button-container mt-3">
            <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
              <RouterLink :to="{ name: 'user-requests'}" class="btn btn-primary ml-2">User Requests</RouterLink>
            </td>
            <td v-if="loggedInRoles.includes('ROLE_ADMIN')">
              <RouterLink :to="{ name: 'register'}" class="btn btn-primary ml-2">Create new user!</RouterLink>
            </td>
          </div>
        </div></div></div></div>
</template>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

}
.users-card {
  width: 90vw; /* Dynamic width based on viewport width */
  max-width: 900px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  overflow-x: auto;
  table-layout: auto;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.btn {
  cursor: pointer;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

@media (min-width: 768px) {
  .users-card {
    width: 50vw;
  }

  .button-container {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .btn-primary,
  .btn-success {
    width: auto;
  }
}
</style>