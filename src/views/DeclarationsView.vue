<script setup>

import {computed, onMounted, reactive, ref} from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useRoute, useRouter} from "vue-router";
import {useApplicationStore} from "@/stores/application.js";
import {sharedState} from "@/stores/sharedState.js";
const backendEnvVar = import.meta.env.VITE_BACKEND;

// Initializing router and route
const router = useRouter();
const route = useRoute();
const authRef = ref(true);

// Creating ref for userId
const userIdRef = ref(null);

onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest();
});


// API URL with userId
const urlRef = computed(() => {
  return backendEnvVar + '/api/declaration/' + userIdRef.value;
});
const {data, loading, performRequest} = useRemoteData(urlRef, authRef);


const applicationStore = useApplicationStore();
// Computed for loggedInUserId and loggedInRoles
const loggedInUserId = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.id : null);
const loggedInRoles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);

// Navigation back to the users route
const goback = () => {
  router.push('/users');
};

// Creating a ref to see if the amount input is empty
const isAmountEmpty = ref(true);
const isDamageEmpty = ref(true);
const isRejectEmpty = ref(true);

// Function to enable/disable the accept button based on the amount input
function EnableDisable(event) {
  // Assuming event is always defined (from @keyup)
  const amount = event.target.value.trim();
  isAmountEmpty.value = amount === "";
  sharedState.amount = amount;
}

// Function to navigate to the accept report route
const navigateToAcceptReport = (declaration) => {
  router.push({
    name: 'accept-report',
    params: { userId: declaration.userId, declarationId: declaration.id }
  });
};


function EnableReject(event) {
  // Assuming event is always defined (from @keyup)
  const rejectCause = event.target.value.trim();
  isRejectEmpty.value = rejectCause === "";
  sharedState.rejectCause = rejectCause;
}

function EnableDamage(event) {
  // Assuming event is always defined (from @keyup)
  const damagePercentage = event.target.value.trim();
  isDamageEmpty.value = damagePercentage === "";
  sharedState.damagePercentage = damagePercentage;

}

const navigateToRejectReport = (declaration) => {
  router.push({
    name: 'reject-report',
    params: { userId: declaration.userId, declarationId: declaration.id }
  });
};

const navigateToDamageReport = (declaration) => {
  router.push({
    name: 'damage-report',
    params: { userId: declaration.userId, declarationId: declaration.id }
  });
};


</script>

<template>
  <div class="container">
    <div class="users-card">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="mb-4">
            <h1 class="fs-3 text-center">Declarations</h1>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                <tr style="text-align: center;vertical-align: middle;" >
                  <th>ID</th>
                  <th>Description</th>
                  <th>Natural Disaster</th>
                  <th>Submission Date</th>
                  <th>Current Status</th>
                  <th colspan="3" style="text-align: center;">Actions</th>
                </tr>
                </thead>
                <tbody v-if="loading" class="loading-spinner">
                <tr>
                  <td colspan="5">Loading...</td>
                </tr>
                </tbody>
                <!-- Display declarations -->
                <tbody v-if="data" style="color: lightgray">

                <template v-if="Array.isArray(data)  && data.length > 0">
                  <tr v-for="declaration in data" :key="declaration.id" style="text-align: center; vertical-align: middle;">

                    <!-- Declaration details -->
                    <td>{{ declaration.id }}</td>
                    <td>{{ declaration.description }}</td>
                    <td>{{declaration.naturalDisaster}}</td>
                    <td>{{ declaration.submissionDate}}</td>
                    <td>
                      <div class="btn btn-outline-dark btn-sm" >
                        <label>Status:</label>
                        <button type="button" v-text="declaration.status" disabled></button>
                      </div>

                      <div v-if="declaration.status === 'Rejected'" class="btn btn-outline-dark btn-sm button-spacing">
                        <label>Reason:</label>
                        <button type="button" v-text="declaration.rejectCause" disabled></button>
                      </div>

                      <div v-if="declaration.status === 'Check on site'" class="btn btn-outline-dark btn-sm button-spacing">
                        <label>Appointement date:</label>
                        <button type="button" v-text="declaration.appointementDate" disabled></button>
                      </div>

                    </td>

                    <td class="d-flex align-items-center" v-if="declaration.status === 'Accepted'"><span>Total amount:</span><button type="button" class="btn btn-outline-dark btn-sm" v-text="declaration.amount" disabled></button></td>

                    <td>
                      <RouterLink :to="{name: 'declaration-details', params: { userId: declaration.userId, declarationId: declaration.id}}" class="btn btn-primary">Report</RouterLink>
                    </td>

                    <!-- Check on Site button -->
                    <td v-if="((loggedInRoles.includes('ROLE_INSPECTOR') && loggedInUserId != declaration.userId) || loggedInRoles.includes('ROLE_ADMIN')) && (!(declaration.status === 'Rejected' || declaration.status === 'Accepted' || declaration.status === 'Check on site'))">
                      <RouterLink :to="{name: 'checkOnSite-report', params: { userId: declaration.userId, declarationId: declaration.id}}" type="submit" class="btn btn-info narrow-button btn-sm" role="button"><span >Check on Site</span></RouterLink>
                    </td>

                    <!-- Reject button -->
                    <td v-if="((loggedInRoles.includes('ROLE_INSPECTOR') && loggedInUserId != declaration.userId)  || loggedInRoles.includes('ROLE_ADMIN')) && (!(declaration.status === 'Rejected' || declaration.status === 'Accepted'))">

                      <label>Cause of reject: </label>
                      <input type="text" id="description" name="description" @input="EnableReject" />
                      <div class="spacer"></div>
                      <button @click.prevent="()=> navigateToRejectReport(declaration)" id="rejectButton" type="submit" value="Submit" role="button" class="btn btn-danger narrow-button btn-sm button-spacing" :disabled="isRejectEmpty"><span >Reject</span></button>
                      <div class="spacer"></div>

                    </td>

                    <!-- Damage percentage -->
                    <td v-if="((loggedInRoles.includes('ROLE_INSPECTOR') && loggedInUserId != declaration.userId) || loggedInRoles.includes('ROLE_ADMIN')) && (declaration.status === 'Check on site' && declaration.damagePercentage == null)">

                        <label for="damage">Damage percentage:(%)</label>
                        <input type="text" id="damage" name="damage" @input="EnableDamage" />
                      <button @click.prevent="()=> navigateToDamageReport(declaration)" id="damageButton" type="submit" value="Submit" role="button" class="btn narrow-button btn-sm button-spacing" :disabled="isDamageEmpty"><span >Submit</span></button>


                    </td>

                    <td v-if="((loggedInRoles.includes('ROLE_INSPECTOR') && loggedInUserId != declaration.userId)  || loggedInRoles.includes('ROLE_ADMIN')) && (declaration.status === 'Check on site' && declaration.damagePercentage != null)">
                      <!-- Amount for accepting -->
                      <label>Refund Amount: (Estimated refund is -> {{declaration.estimatedRefund}})</label>
                      <input type="text" id="amount" name="amount" @input="EnableDisable" />
                      <button @click.prevent="()=> navigateToAcceptReport(declaration)" id="acceptButton" type="submit" value="Submit" role="button" class="btn btn-success narrow-button btn-sm button-spacing" :disabled="isAmountEmpty"><span >Accept</span></button>

                    </td>

                    <!-- Delete declaration button for farmers and inspectors -->
                    <td v-if="(loggedInRoles.includes('ROLE_FARMER') || loggedInRoles.includes('ROLE_INSPECTOR')) && loggedInUserId === declaration.userId ">

                      <RouterLink :to="{name: 'delete-declaration', params: { userId: declaration.userId, declarationId: declaration.id}}" type="submit" class="btn btn-danger narrow-button btn-sm" role="button"><span >Delete Declaration!</span></RouterLink>
                    </td>
                    <!-- Delete declaration button for admins -->
                    <td v-if="loggedInRoles.includes('ROLE_ADMIN')">

                      <RouterLink :to="{name: 'delete-declaration', params: { userId: declaration.userId, declarationId: declaration.id}}" type="submit" class="btn btn-danger narrow-button btn-sm" role="button"><span >Delete Declaration!</span></RouterLink>
                    </td>

                  </tr>
                </template>
                <template v-else>
                  <tr style="text-align: center; vertical-align: middle;">
                    <td colspan="4">No Declarations found!</td>

                  </tr>
                </template>
                </tbody>
            </table>

            <!-- Add Declaration button -->
            <div v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')" style="text-align: center; vertical-align: middle;">
              <RouterLink v-if="route.params.id == loggedInUserId" :to="{name: 'add-declaration'}" class="btn btn-primary"><i class="fas fa-plus"></i> Add Declaration</RouterLink>
            </div>

            <div v-if="loggedInRoles.includes('ROLE_ADMIN')" style="text-align: center; vertical-align: middle;">
              <RouterLink :to="{name: 'add-declaration'}" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add Declaration</RouterLink>
            </div>

            <!-- Go back button -->
            <div class="mt-3">
              <button type="button" class="btn btn-dark btn-sm" @click="goback">Go Back</button>
            </div>
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

.users-card {
  width: 90vw;
  max-width: 900px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* Add horizontal scroll if content overflows */
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: auto; /* Allow table to expand beyond its container */
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary {
  width: 100%;
  transition: all 0.3s ease-in-out; /* Add transition */
  border-radius: 25px; /* Make buttons round */
  background-color: #007bff; /* Change button color */
  border: none; /* Remove border */
  color: white; /* Change text color */
}

.btn-primary:hover {
  transform: scale(1.05); /* Add scale effect on hover */
  box-shadow: 0px 0px 15px rgba(0,0,0,0.2); /* Add shadow on hover */
  background-color: #0056b3; /* Change button color on hover */
}

/* Additional styling for buttons and icons */
.btn {
  margin-right: 8px;
  padding: 10px 24px; /* Increase padding */
  font-size: 16px; /* Increase font size */
}

.button-spacing {
  margin-top: 10px;
}

@media (min-width: 768px) {
  .users-card {
    width: 50vw;
  }
}
</style>
