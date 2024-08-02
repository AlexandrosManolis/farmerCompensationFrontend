<script setup>
import {useRouter} from "vue-router";
import {useApplicationStore} from "@/stores/application.js";
import {onBeforeMount, ref} from "vue";
const backendEnvVar = import.meta.env.VITE_BACKEND;

const router = useRouter();
// Accessing necessary functions from the application store
const { setUserData, persistUserData, isAuthenticated }= useApplicationStore();
// Creating a reactive variable for loading state
const loading = ref(false);

// Creating a reactive variable for storing user credentials
const credentials = ref({
  username: '', password:''
});
// Creating a reactive variable for tracking authentication failure
const authenticationFailed = ref(false);

// Function to handle form submission
const onFormSubmit = () => {
  loading.value = true;
  authenticationFailed.value = false;

  fetch(backendEnvVar + '/api/auth/signin', {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials.value)
  })
      .then((response) =>{
        if(response.ok){
          response.json().then((data) => {
            // Set user data in the application store
            setUserData(data);
            // Persist user data
            persistUserData(data);
            // Redirect user to the home page upon successful login
            router.push({name: 'home'});
          });
        }else {
          // Authentication failure if response is not okay
          authenticationFailed.value = true;
        }
      })
      .catch((err) => {
        console.warn(err);
        // Authentication failure if if there's an error
        authenticationFailed.value= true;

      })
      .finally(() => {
        loading.value = false;
      });
};


onBeforeMount(() => {
  if (isAuthenticated === true) {
    router.push({ name: 'home' });
  }
});
</script>


<template>

  <div class="container">
    <div class="login-card">

      <div class="card mb-4">
        <h1 class="fs-3 text-center mb-4">Login</h1>
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Login form -->
      <form v-else>

        <div class="mb-2" v-if="authenticationFailed">
          <div class="alert alert-danger" role="alert">
            Authentication failed!
          </div>
        </div>

        <!-- Username input field -->
        <div class="mb-2">
          <label for="usernameFormControl" class="form-label mb-1">Username</label>
          <input v-model="credentials.username" type="text" class="form-control" id="usernameFormControl" />
        </div>

        <!-- Password input field -->
        <div class="mb-2">
          <label for="passwordFormControl" class="form-label mb-1">Password</label>
          <input v-model="credentials.password" type="password" class="form-control" id="passwordFormControl" />
        </div>

        <button @click="onFormSubmit" type="submit" class="btn btn-primary">Login</button>
        <span class="fst-italic" v-if="credentials.username">as {{ credentials.username }}</span>

      </form>
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

.login-card {
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
  .login-card {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>
