<script setup>
import {ref, computed, onMounted} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

// Initializing form values
const formValues = ref({
  fieldAddress: "",
  description: "",
  plant_production: "",
  fieldSize: "",
  naturalDisaster: "",
  otherDisaster:"",
  annualStartProduction: "",
  damageDate: "",
});


const router = useRouter();
const route = useRoute();
// Creating refs for userId, declarationId, and error handling
const userIdRef = ref(null);
const declarationIdRef = ref(null);
const errorRef = ref(null);

// Assigning values to userId and declarationId from route params
userIdRef.value = route.params.userId;
declarationIdRef.value = route.params.declarationId;

// Function to handle form submission
// Validation checks for form fields and displaying error messages if validation fails
// Submit form data if validation passes
const onSubmit = async () => {
  if(formValues.value.otherDisaster != "Other"){
    formValues.value.naturalDisaster = formValues.value.otherDisaster;
  }

  if (!formValues.value.fieldAddress || !formValues.value.description || !formValues.value.plant_production || !formValues.value.annualStartProduction || !formValues.value.fieldSize || !formValues.value.damageDate || !formValues.value.naturalDisaster) {
    errorRef.value = "Please fill in all fields.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  if (!isNaN(formValues.value.plant_production)) {
    errorRef.value = "Plant Production should not contain any numbers.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  const currentDate = new Date();
  const selectedStartDate = new Date(formValues.value.annualStartProduction);

  if (selectedStartDate > currentDate) {
    errorRef.value = 'Please select a proper date for Annual Start Production.';
    return;
  }

  if (isNaN(formValues.value.fieldSize)) {
    errorRef.value = "Field Size should contain only numbers.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  const selectedDamageDate = new Date(formValues.value.damageDate);

  if (selectedDamageDate > currentDate) {
    errorRef.value = 'Please select a proper date for Damage Date.';
    return;
  }

  if (selectedDamageDate < selectedStartDate) {
    errorRef.value = 'Damage Date must be greater than or equal to Annual Start Production.';
    return;
  }


  try {
    await performPostRequest();
    window.location.href='/'+userIdRef.value+'/declaration-details/'+declarationIdRef.value;
  } catch (error) {
    console.error('Error submitting form', error);
  }
};

// Computed for constructing the URL for updating declaration data
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

// Function to handle navigation back to previous page
const goback = () => {
  router.push('/'+userIdRef.value+'/declaration-details/'+ declarationIdRef.value);
};

</script>


<template>
  <!-- Form for editing declaration data -->
  <div class="container">
    <form @submit.prevent="onSubmit">

      <!-- Display form fields with current data -->
      <div v-if="getData">

      <div><h1> Edit declaration {{getData.id}}:</h1></div>
        <div class="form-group">
          <label for="fieldAddress">Field Address: (current data -> {{getData.fieldAddress}})</label>
          <input type="text" id="fieldAddress" class="form-control" v-model="formValues.fieldAddress">

          <label for="description">Description: (current data -> {{getData.description}})</label>
          <input type="text" id="description" class="form-control" v-model="formValues.description">

          <label for="plant_production">Plant Production: (current data -> {{getData.plant_production}})</label>
          <input type="text" id="plant_production" class="form-control" v-model="formValues.plant_production">

          <label for="fieldSize">Field Size: (current data -> {{getData.fieldSize}})</label>
          <input type="text" id="fieldSize" class="form-control" v-model.lazy="formValues.fieldSize" >


          <label for="dropdown">Natural Disaster: (current data -> {{getData.naturalDisaster}})</label>
          <select class="form-control" v-model="formValues.otherDisaster" id="dropdown">
            <option>Bad Weather</option>
            <option>Flood</option>
            <option>Wildfire</option>
            <option>Landslide</option>
            <option>Other</option>
          </select>

          <div v-if="formValues.otherDisaster === 'Other'">
            <label for="otherDisaster">Other (please specify):</label>
            <input type="text" class="form-control" v-model="formValues.naturalDisaster">
          </div>

          <label for="annualStartProduction">Annual Start Production: (current data -> {{getData.annualStartProduction}})</label>
          <input type="date" id="annualStartProduction" class="form-control" v-model="formValues.annualStartProduction">

          <label for="damageDate">Damage Date: (current data -> {{getData.damageDate}})</label>
          <input type="date" id="damageDate" class="form-control" v-model="formValues.damageDate">
        </div>

        <!-- Error message display -->
        <div v-if="errorRef" class="text-danger mb-2">{{ errorRef }}</div>
        <!-- Buttons for canceling edit and submitting changes -->
        <div style="display: flex; justify-content: space-between;">
          <button type="button" class="btn btn-dark btn-sm" @click="goback">Cancel Edit</button>
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