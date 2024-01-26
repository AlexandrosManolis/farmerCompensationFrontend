<script setup>
import { useApplicationStore } from '@/stores/application.js';

const applicationStore = useApplicationStore();
const { userData } = useApplicationStore();
</script>

<template>
  <div class="container">
    <div class="d-flex align-items-center justify-content-center flex-column vh-100">
      <div class="mb-4 text-center">
        <h1 class="fs-3">WELCOME TO ELGA!</h1>
        <h2>For more information, press the Users category!</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  padding: 20px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
