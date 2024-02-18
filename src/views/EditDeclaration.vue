<script setup>
import {ref, computed, onMounted} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

const formValues = ref({
  fieldAddress: "",
  description: "",
  plant_production: "",
  annualStartProduction: "",
  fieldSize: "",
  damageDate: "",
});


const router = useRouter();
const route = useRoute();
const userIdRef = ref(null);
const declarationIdRef = ref(null);

userIdRef.value = route.params.userId;
declarationIdRef.value = route.params.declarationId;

const onSubmit = async () => {
  try {
    await performPostRequest();
    router.push('/' + userIdRef.value + '/declaration-details/' + declarationIdRef.value);
  } catch (error) {
    console.error('Error submitting form', error);
  }
};

const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/' + userIdRef.value + '/edit/' + declarationIdRef.value;
});
const authRefPost = ref(true);
const methodRefPost = ref("POST");

const {performRequest: performPostRequest, loading} = useRemoteData(urlRef, authRefPost, methodRefPost, formValues);

onMounted(async () => {
  // Call a GET method on mount
  methodRefGet.value = "GET"; // Change the request method to GET
  await performGetRequest(); // Perform the GET request
});


const authRefGet = ref(true);
const methodRefGet = ref("GET");

const { data: getData, performRequest: performGetRequest} = useRemoteData(urlRef, authRefGet, methodRefGet);

const goback = () => {
  router.push('/users/'+userIdRef.value+'/user-declarations');
};

</script>


<template>
  <div class="container">
    <form @submit.prevent="onSubmit">

      <div v-if="getData">

      <div><h1> Declaration {{getData.id}}</h1></div>
        <div class="form-group">
          <label for="fieldAddress">Field Address: (current data -> {{getData.fieldAddress}})</label>
          <input type="text" id="fieldAddress" class="form-control" v-model="formValues.fieldAddress">

          <label for="description">Description: (current data -> {{getData.description}})</label>
          <input type="text" id="description" class="form-control" v-model="formValues.description">

          <label for="plant_production">Plant Production: (current data -> {{getData.plant_production}})</label>
          <input type="text" id="plant_production" class="form-control" v-model="formValues.plant_production">

          <label for="annualStartProduction">Annual Start Production: (current data -> {{getData.annualStartProduction}})</label>
          <input type="date" id="annualStartProduction" class="form-control" v-model="formValues.annualStartProduction">

          <label for="fieldSize">Field Size: (current data -> {{getData.fieldSize}})</label>
          <input type="text" id="fieldSize" class="form-control" v-model.lazy="formValues.fieldSize" >

          <label for="damageDate">Damage Date: (current data -> {{getData.damageDate}})</label>
          <input type="date" id="damageDate" class="form-control" v-model="formValues.damageDate">
        </div>
        <div style="display: flex; justify-content: space-between;">
          <button type="button" class="btn-dark" @click="goback">Cancel Edit</button>
          <button type="submit" class="btn btn-primary" :disabled="loading"> {{ loading ? 'Loading...' : 'Submit Changes' }}</button>
        </div>

      <div v-if="loading">
        Loading...
      </div>

      </div></form></div>
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