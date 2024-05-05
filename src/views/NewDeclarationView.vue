<script setup>
import {computed, onMounted, ref} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

// Define a reactive reference for form data
const formDataRef = ref({
  "fieldAddress": "",
  "description": "",
  "plant_production": "",
  "fieldSize": "",
  "naturalDisaster": "",
  "otherDisaster":"",
  "annualStartProduction": "",
  "damageDate": "",
  "annualRevenues": ""

});

const route = useRoute();
const router = useRouter();
const userIdRef = ref(null);
const errorRef = ref(null);


// Computed for the request URL
const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+userIdRef.value+'/new';
});

// Authentication
const authRef = ref(true);
const methodRef = ref("POST");

onMounted(() => {
  userIdRef.value = route.params.id;
});

// Function to handle form submission
const onSubmit = () => {

  if(formDataRef.value.otherDisaster != "Other"){
    formDataRef.value.naturalDisaster = formDataRef.value.otherDisaster;
  }

  if (!formDataRef.value.fieldAddress || !formDataRef.value.description || !formDataRef.value.plant_production || !formDataRef.value.annualStartProduction || !formDataRef.value.fieldSize || !formDataRef.value.damageDate || !formDataRef.value.naturalDisaster || !formDataRef.value.annualRevenues) {
    errorRef.value = "Please fill in all fields.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  if (!isNaN(formDataRef.value.plant_production)) {
    errorRef.value = "Plant Production should not contain any numbers.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  const currentDate = new Date();
  const selectedStartDate = new Date(formDataRef.value.annualStartProduction);

  if (selectedStartDate > currentDate) {
    errorRef.value = 'Please select a proper date for Annual Start Production.';
    return;
  }

  if (isNaN(formDataRef.value.fieldSize)) {
    errorRef.value = "Field Size should contain only numbers.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  const selectedDamageDate = new Date(formDataRef.value.damageDate);

  if (selectedDamageDate > currentDate) {
    errorRef.value = 'Please select a proper date for Damage Date.';
    return;
  }

  if (selectedDamageDate < selectedStartDate) {
    errorRef.value = 'Damage Date must be greater than or equal to Annual Start Production.';
    return;
  }

  if (isNaN(formDataRef.value.annualRevenues)) {
    errorRef.value = "Annual revenues should contain only numbers.";
    setTimeout(() => {
      errorRef.value = null;
    }, 6000);
    return;
  }

  performRequest();
  window.location.href = '/users/'+userIdRef.value+'/user-declarations';
};

const { data, performRequest } = useRemoteData(urlRef, authRef, methodRef, formDataRef);

const goback = () => {
  router.push('/users/'+userIdRef.value+'/user-declarations');

};

</script>

<template >
  <div class="container">
    <div class="declarations-card">
      <div class="col-md-8 mx-auto">
        <div class="fs-3 text-center mb-4">
          <h1>New Declaration</h1>
        </div>
        <!-- Form inputs for new declaration -->
        <div>
          <pre>{{ data }}</pre>
        </div>

    <div class="mb-2">
      <label for="fieldAddress">Field Address</label>
      <input class="form-control" id="fieldAddress" v-model="formDataRef.fieldAddress" type="text" />
    </div>
    <div class="mb-2">
      <label for="description">Description</label>
      <input class="form-control" id="description" v-model="formDataRef.description" type="text" />
    </div>
    <div class="mb-2">
      <label for="plant_production">Plant Production</label>
      <input class="form-control" id="plant_production" v-model="formDataRef.plant_production" type="text" />
    </div>


    <div class="mb-2">
      <label for="fieldSize">Field Size: (only acre)</label>
      <input class="form-control" id="fieldSize" v-model="formDataRef.fieldSize" type="text"  />
    </div>

    <div class="form-group">
      <label for="dropdown">Natural Disaster:</label>
      <select class="form-control" v-model="formDataRef.otherDisaster" id="dropdown">
        <option>Bad Weather</option>
        <option>Flood</option>
        <option>Wildfire</option>
        <option>Landslide</option>
        <option>Other</option>
      </select>
    </div>
    <div v-if="formDataRef.otherDisaster === 'Other'">
      <label for="otherDisaster">Other (please specify):</label>
      <input type="text" class="form-control" v-model="formDataRef.naturalDisaster">
    </div>

        <div class="mb-2">
      <label for="annualStartProduction">Annual Start Production</label>
      <input class="form-control" id="annualStartProduction" v-model="formDataRef.annualStartProduction" type="date"/>
    </div>
    <div class="mb-2">
      <label for="damageDate">Damage Date</label>
      <input class="form-control" id="damageDate" v-model="formDataRef.damageDate" type="date" />
    </div>
    <div class="mb-2">
      <label for="annualRevenues">Annual Revenues</label>
      <input class="form-control" id="annualRevenues" v-model="formDataRef.annualRevenues" type="text" />
    </div>

        <div v-if="errorRef" class="text-danger mb-2">{{ errorRef }}</div>
        <div class="d-flex justify-content-between align-items-end mt-3">
          <div class="">
            <button class="btn btn-primary" @click="onSubmit" type="button">Create new Declaration</button>
          </div>
          <div>
            <button type="button" class="btn btn-dark" @click="goback">Go Back</button>
          </div>
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

.declarations-card {
  width: calc(100vw - 60px); /* Subtracting padding from both sides */
  padding: 20px;
  margin: 0; /* Remove default margin */
  border: 1px solid #dee2e6; /* Set your desired border color */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.btn-primary {
  width: 100%;
}

@media (min-width: 500px) {
  .declarations-card {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>