<script setup>
import {computed, ref} from 'vue';
import {useRemoteData} from "@/composables/useRemoteData.js";
import router from "@/router/index.js";

const formDataRef = ref({
  "email":"",
  "username":"",
  "password":"",
  "full_name":"",
  "address":"",
  "afm":"",
  "identity_id":"",
});

const onSubmit = () => {
  performRequest();
  router.push('/login');
};

const urlRef = computed(() => {
  return 'http://localhost:9090/api/auth/signup';
});

const methodRef = ref("POST");

const { data, performRequest } = useRemoteData(urlRef, methodRef, formDataRef);

</script>

<template>
  <div class="container">
    <div class="signup-card">
      <div class="col-md-8">
        <div class="fs-3 text-center mb-4">
    <h1>Create new User!</h1>
  </div>
  <div>
    <pre>{{ data }}</pre>
  </div>

    <div class="mb-2">
      <label for="firstName">Email</label>
      <input class="form-control" id="email" v-model="formDataRef.email" type="email" />
    </div>
    <div class="mb-2">
      <label for="username">Username</label>
      <input class="form-control" id="username" v-model="formDataRef.username" type="text" />
    </div>
    <div class="mb-2">
      <label for="password">Password</label>
      <input class="form-control" id="password" v-model="formDataRef.password" type="password" />
    </div>
    <div class="mb-2">
      <label for="full_name">Full_name</label>
      <input class="form-control" id="full_name" v-model="formDataRef.full_name" type="text" />
    </div>
    <div class="mb-2">
      <label for="address">Address</label>
      <input class="form-control" id="address" v-model="formDataRef.address" type="text" />
    </div>
    <div class="mb-2">
      <label for="afm">Afm</label>
      <input class="form-control" id="afm" v-model="formDataRef.afm" type="text" />
    </div>
    <div class="mb-2">
      <label for="identity_id">Identity_id</label>
      <input class="form-control" id="identity_id" v-model="formDataRef.identity_id" type="text" />
    </div>
    <div class="">
      <button class="btn btn-primary" @click="onSubmit" type="button">Create new User</button>
    </div>
      </div></div></div>
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