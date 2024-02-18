<script setup>
import {ref, computed, onMounted} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

const authRef = ref(true);

const formDataRef = ref({
  "username": "",
  "email": "",
  "address": "",
  "afm": "",
  "full_name": "",
  "identity": ""
});
  const router = useRouter();
  const route = useRoute();
  const userIdRef = ref(null);

userIdRef.value = route.params.id;

  const urlRef = computed(() => {
    return 'http://localhost:9090/api/users/edit/'+ userIdRef.value;
  });

const onSubmit = async () => {
  try {
    await performPostRequest();
    window.location.href="http://localhost:5173/users";  } catch (error) {
    console.error('Error submitting form', error);
  }
};

const methodRefPost = ref("POST");

const { performRequest: performPostRequest, loading } = useRemoteData(urlRef, authRef, methodRefPost, formDataRef);

onMounted(async () => {
  // Call a GET method on mount
  methodRefGet.value = "GET"; // Change the request method to GET
  await performGetRequest(); // Perform the GET request
});

const methodRefGet = ref("GET");

const { data: getData, performRequest: performGetRequest} = useRemoteData(urlRef, authRef, methodRefGet);

const goback = () => {
  router.push('/user-details/'+ userIdRef.value);
};

</script>


<template>
  <div class="container">
    <form @submit.prevent="onSubmit">

      <div v-if="getData">
        <div><h1>Edit User {{getData.id}}</h1></div>
        <div class="form-group">
          <label for="username">Username: (current data -> {{getData.username}})</label>
          <input type="text" id="username" class="form-control" v-model="formDataRef.username">

          <label for="email">Email: (current data -> {{getData.email}})</label>
          <input type="text" id="email" class="form-control" v-model="formDataRef.email" >

          <label for="address">Address: (current data -> {{getData.address}})</label>
          <input type="text" id="address" class="form-control" v-model="formDataRef.address" >

          <label for="afm">AFM: (current data -> {{getData.afm}})</label>
          <input type="text" id="afm" class="form-control" v-model="formDataRef.afm" >

          <label for="full_name">Full Name: (current data -> {{getData.full_name}})</label>
          <input type="text" id="full_name" class="form-control" v-model="formDataRef.full_name" >

          <label for="identity">Identity ID: (current data -> {{getData.identity}})</label>
          <input type="text" id="identity" class="form-control" v-model="formDataRef.identity" >
        </div>
        <div style="display: flex; justify-content: space-between;">
          <button type="button" class="btn-dark" @click="goback">Cancel Edit</button>
          <button type="submit" class="btn btn-primary" :disabled="loading"> {{ loading ? 'Loading...' : 'Submit Changes' }}</button>
        </div>

      </div>
      <div v-if="postLoading">
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