<script setup>
import { ref, onMounted } from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import { useRoute } from "vue-router";

// Define refs
const authRef = ref(true);

// Use useRoute to get the route parameter
const route = useRoute();

const userIdRef = ref(route.params.id);
const getUrl = 'http://localhost:9090/api/users/edit/'+ userIdRef.value + '/new';
const postUrl = 'http://localhost:9090/api/users/edit/'+ userIdRef.value + '/new';

// Fetch existing data on component mount
const { data, loading: getDataLoading, performRequest } = useRemoteData(getUrl, authRef, "GET");

// Function to handle form submission
const onSubmit = async () => {
  console.log("User data updated successfully!");

  // Assuming 'data' contains the user information
  const requestData = {
    username: data.username,
    email: data.email,
    address: data.address,
    afm: data.afm,
    full_name: data.full_name,
    identity_id: data.identity_id
  };

  const { performRequest, error: postError } = useRemoteData(postUrl, authRef, "POST");

  if (postError) {
    console.error("Error updating user data:", postError);
    return; // Don't proceed with the update if there was an error
  }

  await performRequest(requestData);
  console.log("User data updated successfully!");

};

onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest();
});
</script>


<template>
  <div class="container">
    <form @submit.prevent="onSubmit">

      <div v-if="data">

        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" class="form-control" v-model="data.username">

          <label for="email">Email</label>
          <input type="text" id="email" class="form-control" v-model="data.email">

          <label for="address">Address</label>
          <input type="text" id="address" class="form-control" v-model="data.address">

          <label for="afm">AFM</label>
          <input type="text" id="afm" class="form-control" v-model="data.afm">

          <label for="full_name">Full Name</label>
          <input type="text" id="full_name" class="form-control" v-model="data.full_name">

          <label for="identity_id">Identity ID</label>
          <input type="text" id="identity_id" class="form-control" v-model="data.identity_id">
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading"> {{ getDataLoading ? 'Loading...' : 'Submit Changes' }}</button>
        </div>
      <div v-if="loading">
        Loading...
      </div>

    </form></div>
</template>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

}


.form-group {
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
  .form-group {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>