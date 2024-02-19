<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRemoteData } from '@/composables/useRemoteData.js';

const router = useRouter();
const route = useRoute();

const userIdRef = ref(null);

const authRef = ref(true);

const urlRef = computed(() => {
  return 'http://localhost:9090/api/users/details/' + userIdRef.value;
});

const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

userIdRef.value = route.params.id;
onMounted(() => {
  performRequest();
});
const userid = userIdRef.value;
const goback = () => {
  router.push('/users');
};
</script>

<template>
  <div class="container">
    <div><h1>User details with ID: {{userid}}</h1></div>
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

      </tbody>
      <div>
        <button type="button" @click="goback">Go Back</button>

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