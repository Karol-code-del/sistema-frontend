<template>
  <div id="app">
    <Navbar v-if="authStore.estaAutenticado" />
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/authStore';
import Navbar from './components/Navbar.vue';

const authStore = useAuthStore();
</script>

<style>
/* Estilos básicos de reseteo */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f4f6f9;
}

#app {
  min-height: 100vh;
}
</style>