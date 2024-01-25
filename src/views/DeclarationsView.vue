<script setup>

import {computed, onMounted, ref} from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import {useRoute, useRouter} from "vue-router";
import {useApplicationStore} from "@/stores/application.js";

const router = useRouter();
const route = useRoute();
const authRef = ref(true);

const userIdRef = ref(null);

onMounted(() => {
  userIdRef.value = route.params.id;
  performRequest();
});


const urlRef = computed(() => {
  return 'http://localhost:9090/api/declaration/' + userIdRef.value;
});
const {data, loading, performRequest} = useRemoteData(urlRef, authRef);



const applicationStore = useApplicationStore();
const loggedInUserId = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.id : null);
const loggedInRoles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);

const goback = () => {
  router.push('/users');
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
          <table class="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Submission Date</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody v-if="loading" class="loading-spinner">
            <tr>
              <td colspan="5">Loading...</td>
            </tr>
            </tbody>
            <tbody v-if="data">

            <template v-if="Array.isArray(data)  && data.length > 0">
              <tr v-for="declaration in data" :key="declaration.id">
                <td>{{ declaration.id }}</td>
                <td>{{ declaration.description }}</td>
                <td>{{ declaration.submissionDate}}</td>
                <td class="d-flex align-items-center"><button type="button" class="btn btn-outline-dark btn-sm" v-text="declaration.status" disabled></button></td>

                <td>
                  <RouterLink :to="{name: 'declaration-details', params: { userId: declaration.userId, declarationId: declaration.id}}" class="btn btn-primary">Report</RouterLink>
                </td>

                <td v-if="(loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_ADMIN')) && (!(declaration.status === 'Rejected' || declaration.status === 'Accepted' || declaration.status === 'Check on site'))">
                  <RouterLink :to="{name: 'checkOnSite-report', params: { userId: declaration.userId, declarationId: declaration.id}}" type="submit" class="btn btn-info narrow-button btn-sm" role="button"><span >Check on Site</span></RouterLink>
                </td>

                <td v-if="(loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_ADMIN')) && (!(declaration.status === 'Rejected' || declaration.status === 'Accepted'))">
                  <RouterLink :to="{name: 'reject-report', params: { userId: declaration.userId, declarationId: declaration.id}}" type="submit" class="btn btn-info narrow-button btn-sm" role="button"><span >Reject</span></RouterLink>
                </td>

<!--                  <label th:unless="${declaration.status} == 'Rejected' or ${declaration.status} == 'Accepted'">Refund Amount:</label>-->
<!--                  <input type="text" id="amount" name="amount" onkeyup="EnableDisable(this)" th:unless="${declaration.status} == 'Rejected' or ${declaration.status} == 'Accepted' "/>-->
<!--                  <button id="acceptButton" type="submit" value="Submit" role="button" class="btn btn-info" th:unless="${declaration.status} == 'Rejected' or ${declaration.status} == 'Accepted'" onclick="submitForm()" disabled="disabled">Accept</button>-->
<!--                </form>-->

              </tr>
            </template>
            <template v-else>
                <tr>
                  <td colspan="4">No Declarations found!</td>

                </tr>
            </template>
            </tbody>
          </table>
          <div v-if="loggedInRoles.includes('ROLE_INSPECTOR') || loggedInRoles.includes('ROLE_FARMER')">
            <RouterLink v-if="route.params.id == loggedInUserId" :to="{name: 'add-declaration'}" class="btn btn-primary">Add Declaration!</RouterLink>
          </div>
          <div v-if="loggedInRoles.includes('ROLE_ADMIN')">
            <RouterLink :to="{name: 'add-declaration'}" class="btn btn-primary btn-sm">Add Declaration!</RouterLink>
          </div>
          <div class="spacer"></div>
          <div>
            <button type="button" class="btn btn-dark btn-sm" @click="goback">Go Back</button>
          </div>
        </div>
      </div></div></div></div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

}
.users-card {
  width: 90vw; /* Dynamic width based on viewport width */
  max-width: 900px;
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
.spacer{
  height: 10px;
}

@media (min-width: 768px) {
  .users-card {
    width: 50vw; /* Adjust the width based on your preference */
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.btn {
  cursor: pointer;
}

.narrow-button {
  display: inline-block;
  width: 80px;
  padding: 8px 10px;
}

.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

</style>