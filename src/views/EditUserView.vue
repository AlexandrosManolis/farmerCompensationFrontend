<script setup>
import {ref, computed, onMounted} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";
const backendEnvVar = import.meta.env.VITE_BACKEND;

const authRef = ref(true);
const errorRef = ref(null);

// Initializing refs for authentication, error handling, and form data
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

// Computed for constructing the URL for updating user data
const urlRef = computed(() => {
    return backendEnvVar + '/api/users/edit/' + userIdRef.value;
  });

// Function to handle form submission
// Validation checks for form fields and displaying error messages if validation fails
// Submit form data if validation passes
const onSubmit = async () => {
  try {

    if (!checkFieldsNotEmpty(formDataRef.value)) {
      errorRef.value = "Please fill in all fields.";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }

    if (!validateEmail(formDataRef.value.email)) {
      errorRef.value = "Email address should follow the format 'something@something.com'";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }

    if (!validateAddress(formDataRef.value.address)) {
      errorRef.value = "Please enter your address in the format 'Street number'.";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }

    if (!validateAFM(formDataRef.value.afm)) {
      errorRef.value = "AFM should contain exactly 9 digits.";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }

    if (!validateFullName(formDataRef.value.full_name)) {
      errorRef.value = "Please enter your full name in the format 'First name last name'.";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }

    if (!validateIdentityID(formDataRef.value.identity)) {
      errorRef.value = "Identity ID should follow the format 'AA123456'.";
      setTimeout(() => {
        errorRef.value = null;
      }, 6000);
      return;
    }


    await performPostRequest();
    window.location.href='/users';  } catch (error) {
    console.error('Error submitting form', error);
  }
};

// Validation functions for form fields
const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validateAddress = (address) => {
  return /^[A-Za-z\s\.\'\-]+\s+\d+[A-Za-z]?$/.test(address);
};

const validateAFM = (afm) => {
  return /^\d{9}$/.test(afm);
};

const validateFullName = (fullName) => {
  return /^\S+\s+\S+$/.test(fullName);
};

const validateIdentityID = (identityID) => {
  return /^[A-Z]{2}\d{6}$/.test(identityID);
};

const checkFieldsNotEmpty = (formData) => {
  for (const key in formData) {
    if (!formData[key]) {
      return false;
    }
  }
  return true;
};


const methodRefPost = ref("POST");

// useRemoteData to perform the POST request with form data
const { performRequest: performPostRequest, loading } = useRemoteData(urlRef, authRef, methodRefPost, formDataRef);

// Fetch user data when mounted
onMounted(async () => {
  // Call a GET method on mount
  methodRefGet.value = "GET"; // Change the request method to GET
  await performGetRequest(); // Perform the GET request
});

const methodRefGet = ref("GET");

const { data: getData, performRequest: performGetRequest} = useRemoteData(urlRef, authRef, methodRefGet);

// Function to navigate back to user details page
const goback = () => {
  router.push('/user-details/'+ userIdRef.value);
};

</script>


<template>
  <!-- Form for editing user data -->
  <div class="container">
    <form @submit.prevent="onSubmit">

      <!-- Display form fields with current data -->
      <div v-if="getData">
        <div><h1>Edit User with ID: {{getData.id}}:</h1></div>
        <div class="form-group">
          <!-- Input fields for editing user data -->
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

        <!-- Error message display -->
        <div v-if="errorRef" class="text-danger mb-2">
          {{ errorRef }}
        </div>
        <!-- Buttons for canceling edit and submitting changes -->
        <div style="display: flex; justify-content: space-between;">
          <button type="button" class="btn btn-dark btn-sm" @click="goback">Cancel Edit</button>
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