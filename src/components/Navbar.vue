<template>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="logo">📊 Sistema ERP</h1>
      
      <ul class="nav-menu" v-if="authStore.estaAutenticado">
        <li><router-link to="/productos" class="nav-link">📦 Productos</router-link></li>
        <li v-if="authStore.esAdmin"><router-link to="/compras" class="nav-link">🛒 Compras</router-link></li>
        <li><router-link to="/ventas" class="nav-link">💰 Ventas</router-link></li>
        <li v-if="authStore.esAdmin"><router-link to="/usuarios" class="nav-link">👥 Usuarios</router-link></li>
      </ul>

      <div class="nav-user" v-if="authStore.estaAutenticado">
        <span class="usuario-info">
          {{ authStore.usuario.nombre }}
          <span class="rol" :class="authStore.usuario.rol.toLowerCase()">
            ({{ authStore.usuario.rol }})
          </span>
        </span>
        <button @click="logout" class="btn-logout">Salir</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #42b983;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usuario-info {
  font-size: 0.9em;
}

.rol {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin-left: 0.5rem;
}

.rol.administrador {
  background-color: #e74c3c;
}

.rol.vendedor {
  background-color: #3498db;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .nav-menu {
    gap: 1rem;
    font-size: 0.9em;
  }

  .logo {
    font-size: 1.2em;
  }

  .usuario-info {
    display: none;
  }
}
</style>
