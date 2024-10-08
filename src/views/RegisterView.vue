<script setup>
import {computed, ref} from 'vue';
import { useRemoteData } from "@/composables/useRemoteData.js";
import router from "@/router/index.js";
const backendEnvVar = import.meta.env.VITE_BACKEND;

// Define a reactive reference for form data
const formDataRef = ref({
  "email": "",
  "username": "",
  "password": "",
  "full_name": "",
  "address": "",
  "afm": "",
  "identity": "",
});
// Define references for error and success messages
const errorRef = ref(null);
const successRef = ref(null);

// Function to handle form submission
const onSubmit = async (event) => {
  if (validateFormData()) {
    // Perform the request to create a new user
    await performRequest();
    // Display success message
    successRef.value = 'User registered successfully!';
    // Redirect the user
    event.preventDefault();
    window.location.href='/users';  }
};


// Computed property for the request URL
const urlRef = computed(() => {
  return backendEnvVar + '/api/auth/signup';
});

const authRef = ref(true);
const methodRef = ref("POST");

const { performRequest } = useRemoteData(urlRef, authRef, methodRef, formDataRef);



// Function to validate form data
const validateFormData = () => {
  let isValid = true;

  if (!formDataRef.value.email || !formDataRef.value.username || !formDataRef.value.password || !formDataRef.value.full_name || !formDataRef.value.address || !formDataRef.value.afm || !formDataRef.value.identity) {
    errorRef.value = "Please fill in all fields.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^\S+@\S+\.\S+$/.test(formDataRef.value.email)) {
    errorRef.value = "Email address should follow the format 'something@something.com'";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^\S+\s+\S+$/.test(formDataRef.value.full_name)) {
    errorRef.value = "Please enter your full name in the format 'First name last name'.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^\S+\s+\d+$/.test(formDataRef.value.address)) {
    errorRef.value = "Please enter your address in the format 'Street number'.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^\d{9}$/.test(formDataRef.value.afm)) {
    errorRef.value = "Afm should contain exactly 9 digits.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^[A-Z]{2}\d{6}$/.test(formDataRef.value.identity)) {
    errorRef.value = "Identity ID should follow the format 'AA123456'.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  if (!/^.{5,}$/.test(formDataRef.value.password)) {
    errorRef.value = "Password should contain at least 5 characters long.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return false;
  }

  return isValid;
}

// Function to navigate back to user details page
const goback = () => {
  router.push('/users');
};
</script>

<template>
  <div class="container">
    <div class="signup-card">
      <div class="col-md-8">
        <div class="fs-3 text-center mb-4">
          <h1>Create new User!</h1>
        </div>

        <div class="mb-2">
          <label for="email">Email</label>
          <input class="form-control" id="email" v-model="formDataRef.email" type="email" required />
        </div>
        <div class="mb-2">
          <label for="username">Username</label>
          <input class="form-control" id="username" v-model="formDataRef.username" type="text" required />
          <div v-if="errorRef && errorRef.includes('Username')" class="text-danger mb-2">{{ errorRef }}</div>
        </div>
        <div class="mb-2">
          <label for="password">Password</label>
          <input class="form-control" id="password" v-model="formDataRef.password" type="password" required />
        </div>
        <div class="mb-2">
          <label for="full_name">Full_name</label>
          <input class="form-control" id="full_name" v-model="formDataRef.full_name" type="text" required />
        </div>
        <div class="mb-2">
          <label for="address">Address</label>
          <input class="form-control" id="address" v-model="formDataRef.address" type="text" required />
        </div>
        <div class="mb-2">
          <label for="afm">Afm</label>
          <input class="form-control" id="afm" v-model="formDataRef.afm" type="text" required />
        </div>
        <div class="mb-2">
          <label for="identity">Identity</label>
          <input class="form-control" id="identity" v-model="formDataRef.identity" type="text" required />
        </div>
        <div>
          <div v-if="errorRef && !errorRef.includes('Email') && !errorRef.includes('Username')" class="text-danger mb-2">
            {{ errorRef }}
          </div>
          <div v-if="errorRef && errorRef.includes('Email')" class="text-danger mb-2">{{ errorRef }}</div>
          <div v-if="successRef" class="text-success mb-2">
            {{ successRef }}
          </div>
          <!-- Submit button -->
          <button class="btn btn-primary" @click="onSubmit" type="button">Create new User</button>
          <button type="button" class="btn btn-dark btn-sm" @click="goback">Cancel</button>
        </div>
      </div>
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

.signup-card {
  width: 90vw;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6;
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

/* Media query for smaller screens */
@media (max-width: 600px) {
  .signup-card {
    width: 80vw;
  }
}
</style>