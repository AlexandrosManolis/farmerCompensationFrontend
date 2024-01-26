<script setup>
import {computed, onMounted, ref} from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';



const authRef = ref(true);


const urlRef = computed(() => {
  return 'http://localhost:9090/api/admin/users/requests';
});
const {data, loading, performRequest} = useRemoteData(urlRef, authRef);

onMounted(() => {
  performRequest();
});
</script>

<template>
  <div class="container">
    <h1>User Requests</h1>
    <div>
      <table class="table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>User's Username</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody v-if="loading" class="loading-spinner">
        <tr>
          <td colspan="5">Loading...</td>
        </tr>
        </tbody>
        <tbody v-if="data">

        <template v-if="Array.isArray(data) && data.length > 0">
          <tr v-for="request in data" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.status }}</td>
            <td>{{request.user.username}}</td>
            <td><RouterLink :to="{name: 'reject-request', params: { userId: request.user.id, requestId: request.id }}" class="btn btn-danger">Reject!</RouterLink></td>
              <td><RouterLink :to="{name: 'approve-request', params: { userId: request.user.id, requestId: request.id }}" class="btn btn-success">Approve!</RouterLink></td>

          </tr>
        </template>
        <template v-else-if="data.length === 0">
          <tr>
            <td colspan="3">No User requests found!</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td>{{ data.id }}</td>
            <td>{{ data.status }}</td>
            <td>{{data.user.username}}</td>
            <RouterLink :to="{name: 'reject-request', params: { userId: data.user.id, requestId: data.id }}" class="btn btn-danger">Reject!</RouterLink>
            <RouterLink :to="{name: 'approve-request', params: { userId: data.user.id, requestId: data.id }}" class="btn btn-success">Approve!</RouterLink>

          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
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
  .users-card {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>