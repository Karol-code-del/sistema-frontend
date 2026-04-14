<template>
  <div class="contenedor">
    <h1>👥 Gestión de Usuarios</h1>

    <div class="tarjeta form-usuario">
      <h3>Crear Nuevo Usuario</h3>
      <form @submit.prevent="guardarUsuario">
        <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" required>
        <input v-model="nuevoUsuario.email" type="email" placeholder="Email" required>
        <input v-model="nuevoUsuario.contrasena" type="password" placeholder="Contraseña" required>
        <select v-model="nuevoUsuario.rol" required>
          <option>-- Seleccionar Rol --</option>
          <option value="Administrador">Administrador</option>
          <option value="Vendedor">Vendedor</option>
        </select>
        <button type="submit" class="btn-guardar" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Crear Usuario' }}
        </button>
      </form>
    </div>

    <div class="tarjeta">
      <h3>Usuarios Registrados</h3>
      <table v-if="usuarios.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>
              <span class="rol" :class="usuario.rol.toLowerCase()">
                {{ usuario.rol }}
              </span>
            </td>
            <td>
              <span :class="usuario.estado === 'activo' ? 'activo' : 'inactivo'">
                {{ usuario.estado }}
              </span>
            </td>
            <td>
              <button 
                v-if="usuario.estado === 'activo'"
                @click="cambiarEstado(usuario.id, 'inactivo')"
                class="btn-desactivar"
              >
                Desactivar
              </button>
              <button 
                v-else
                @click="cambiarEstado(usuario.id, 'activo')"
                class="btn-activar"
              >
                Activar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="sin-datos">No hay usuarios registrados aún.</p>
    </div>

    <div v-if="error" class="alert alert-error">❌ {{ error }}</div>
    <div v-if="exito" class="alert alert-success">✅ {{ exito }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usuariosAPI } from '../services/api';

const usuarios = ref([]);
const cargando = ref(false);
const error = ref(null);
const exito = ref(null);

const nuevoUsuario = ref({
  nombre: '',
  email: '',
  contrasena: '',
  rol: 'Vendedor',
});

const cargarUsuarios = async () => {
  try {
    const resp = await usuariosAPI.obtenerTodos();
    usuarios.value = resp.data;
  } catch (err) {
    error.value = 'Error al cargar usuarios';
    console.error(err);
  }
};

const guardarUsuario = async () => {
  if (!nuevoUsuario.value.nombre || !nuevoUsuario.value.email || !nuevoUsuario.value.contrasena || !nuevoUsuario.value.rol) {
    error.value = 'Completa todos los campos';
    return;
  }

  cargando.value = true;
  try {
    await usuariosAPI.registro(nuevoUsuario.value);
    exito.value = '✅ Usuario creado exitosamente';
    nuevoUsuario.value = { nombre: '', email: '', contrasena: '', rol: 'Vendedor' };
    cargarUsuarios();
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => exito.value = null, 3000);
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al crear usuario';
  } finally {
    cargando.value = false;
  }
};

const cambiarEstado = async (id, estado) => {
  try {
    await usuariosAPI.cambiarEstado(id, estado);
    exito.value = `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'}`;
    cargarUsuarios();
    setTimeout(() => exito.value = null, 3000);
  } catch (err) {
    error.value = 'Error al cambiar estado';
  }
};

onMounted(() => {
  cargarUsuarios();
});
</script>

<style scoped>
.contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.tarjeta {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  color: #34495e;
  margin-bottom: 15px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.btn-guardar {
  background-color: #42b983;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  grid-column: span 2;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

table th {
  background-color: #f8f9fa;
}

.rol {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: bold;
  color: white;
}

.rol.administrador {
  background-color: #e74c3c;
}

.rol.vendedor {
  background-color: #3498db;
}

.activo {
  color: #27ae60;
  font-weight: bold;
}

.inactivo {
  color: #e74c3c;
  font-weight: bold;
}

.btn-desactivar {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-desactivar:hover {
  background-color: #c0392b;
}

.btn-activar {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-activar:hover {
  background-color: #229954;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.sin-datos {
  text-align: center;
  color: #999;
  padding: 20px;
}

@media (max-width: 768px) {
  form {
    grid-template-columns: 1fr;
  }

  .btn-guardar {
    grid-column: span 1;
  }

  table {
    font-size: 12px;
  }

  table th, table td {
    padding: 8px;
  }
}
</style>
