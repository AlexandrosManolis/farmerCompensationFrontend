<script setup >
import { RouterLink } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';
import {computed} from "vue";
const applicationStore = useApplicationStore();
const {userData}= useApplicationStore();

const username = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.username : null);
const roles = computed(() => applicationStore.isAuthenticated ? applicationStore.userData.roles : []);



</script>

<template xmlns:sec="http://www.w3.org/1999/xhtml">
  <header class="text-bg-dark">
    <div class="container-fluid">
      <div class="d-flex flex-wrap justify-content-between align-items-center py-2 px-3" >

        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 link-body-emphasis text-decoration-none">
          <span class="fs-3 fw-bolder text-white">ELGA</span>
        </a>

        <ul class="nav nav-pills">
          <li class="nav-item" v-if="applicationStore.isAuthenticated">
            <router-link :to="{ name: 'home' }" class="nav-link text-white">Home</router-link>
          </li>

          <li class="nav-item" v-if="applicationStore.isAuthenticated">
            <router-link :to="{ name: 'users' }" class="nav-link text-white">Users</router-link>
          </li>

          <li class="nav-item" v-if="applicationStore.isAuthenticated">
            <b-nav-item-dropdown text="Logged in as">
              <b-dropdown-item disabled>{{ username }}</b-dropdown-item>
              <b-dropdown-item v-for="role in roles" :key="role" disabled>{{ role }}</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <router-link :to="{ name: 'logout' }" class="nav-link text-white">Logout</router-link>
            </b-nav-item-dropdown>

          </li>

          <li class="nav-item" v-if="!applicationStore.isAuthenticated">
            <router-link :to="{ name: 'login' }" class="nav-link text-white">Login</router-link>
          </li>

        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: #333;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.container-fluid {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

span.fs-3 {
  font-size: 2em;
  margin-right: 20px;
}

ul.nav {
  margin-left: auto;
}

.nav-link {
  margin-left: 10px;
}

</style>
