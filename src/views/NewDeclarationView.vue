<script setup>
import {computed, onMounted, ref} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute, useRouter} from "vue-router";

const formDataRef = ref({
  "fieldAddress": "",
  "description": "",
  "plant_production": "",
  "annualStartProduction": "",
  "fieldSize": "",
  "damageDate": ""

});

const route = useRoute();
const router = useRouter();
const userIdRef = ref(null);
const errorRef = ref(null);


const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+userIdRef.value+'/new';
});

const authRef = ref(true);
const methodRef = ref("POST");

onMounted(() => {
  userIdRef.value = route.params.id;
});

const onSubmit = () => {


  if (!formDataRef.value.fieldAddress || !formDataRef.value.description || !formDataRef.value.plant_production || !formDataRef.value.annualStartProduction || !formDataRef.value.fieldSize || !formDataRef.value.damageDate) {
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

  performRequest();
  window.location.href = '/users/'+userIdRef.value+'/user-declarations';
};

const { data, performRequest } = useRemoteData(urlRef, authRef, methodRef, formDataRef);

const goback = () => {
  router.push('/users/'+userIdRef.value+'/user-declarations');

};

</script>

<template>
  <div class="container">
    <div class="declarations-card">
      <div class="col-md-8">
        <div class="fs-3 text-center mb-4">
          <h1>New Declaration</h1>
        </div>
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
      <label for="annualStartProduction">Annual Start Production</label>
      <input class="form-control" id="annualStartProduction" v-model="formDataRef.annualStartProduction" type="date"/>
    </div>
    <div class="mb-2">
      <label for="fieldSize">Field Size</label>
      <input class="form-control" id="fieldSize" v-model="formDataRef.fieldSize" type="text"  />
    </div>
    <div class="mb-2">
      <label for="damageDate">Damage Date</label>
      <input class="form-control" id="damageDate" v-model="formDataRef.damageDate" type="date" />
    </div>
        <div v-if="errorRef" class="text-danger mb-2">{{ errorRef }}</div>
        <div class="">
      <button class="btn btn-primary" @click="onSubmit" type="button">Create new Declaration</button>
    </div>
        <div>
          <button type="button" class="btn btn-dark btn-sm" @click="goback">Go Back</button>
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


.declarations-card {
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
  .declarations-card {
    width: 50vw; /* Adjust the width based on your preference */
  }
}
</style>