<script setup>
import {ref, computed, onMounted} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

const authRef = ref(true);


const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);

userIdRef.value = route.params.id;
declarationIdRef.value = route.params.declarationId;


const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+ userIdRef.value+'/'+declarationIdRef.value;
});

const { data, performRequest, loading } = useRemoteData(urlRef, authRef);

const onSubmit =async () => {
  try {

    const formValues = {
      username: data.username,
      email: data.email,
      address: data.address,
      afm: document.getElementById('afm').value,
      full_name: document.getElementById('full_name').value,
      identity_id: document.getElementById('identity_id').value,
    };

    // Assuming you have an API endpoint for handling the form data
    const response = await fetch(urlRef.value, {
      method: "POST",
      body: JSON.stringify(formValues),
    });

    // Handle the response, e.g., show a success message
    console.log('Form submitted successfully', response);

    data.value = { ...data.value, ...formValues };

  } catch (error) {
    // Handle errors, e.g., show an error message
    console.error('Error submitting form', error);
  }
  performRequest();
  //window.location.href = '/users';
};


onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest(userIdRef.value);
});

const goback = () => {
  router.push('/user-details/'+ userIdRef.value);
};

</script>


<template>
  <div class="container">
    <form @submit.prevent="onSubmit">

      <div v-if="data">
        <div><h1> {{data.id}}</h1></div>
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
        <div style="display: flex; justify-content: space-between;">
          <button type="button" class="btn-dark" @click="goback">Cancel Edit</button>
          <button type="submit" class="btn btn-primary" :disabled="loading"> {{ getDataLoading ? 'Loading...' : 'Submit Changes' }}</button>
        </div>

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