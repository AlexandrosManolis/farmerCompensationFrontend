<script setup>
import {computed, ref} from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import {useRoute} from "vue-router";

const formDataRef = ref({
  "fieldAddress": "",
  "description": "",
  "plant_production": "",
  "annualStartProduction": "",
  "fieldSize": "",
  "damageDate": ""

});

const route = useRoute();
const userIdRef = ref(null);

const onSubmit = () => {
  userIdRef.value = route.params.id;
  performRequest();
  window.location.href = '/users/'+userIdRef.value+'/user-declarations';
};

const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/'+userIdRef.value+'/new';
});

const authRef = ref(true);
const methodRef = ref("POST");

const { data, performRequest } = useRemoteData(urlRef, authRef, methodRef, formDataRef);


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
    <div class="">
      <button class="btn btn-primary" @click="onSubmit" type="button">Create new Declaration</button>
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