<template>
  <div class="login-container">
    <div class="login-box">
      <h1>🔐 Sistema ERP - Login</h1>

      <div v-if="mostrarRegistro" class="form-section">
        <h2>Crear Nueva Cuenta</h2>
        <form @submit.prevent="handleRegistro">
          <input v-model="formularioRegistro.nombre" type="text" placeholder="Nombre completo" required>
          <input v-model="formularioRegistro.email" type="email" placeholder="Email" required>
          <input v-model="formularioRegistro.contrasena" type="password" placeholder="Contraseña" required>
          <button type="submit" class="btn-primary">Registrarse</button>
          <p class="toggle-form">
            ¿Ya tienes cuenta? 
            <a href="#" @click.prevent="mostrarRegistro = false">Inicia sesión</a>
          </p>
        </form>
      </div>

      <div v-else class="form-section">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <input v-model="formularioLogin.email" type="email" placeholder="Email" required>
          <input v-model="formularioLogin.contrasena" type="password" placeholder="Contraseña" required>
          <button type="submit" class="btn-primary" :disabled="authStore.cargando">
            {{ authStore.cargando ? 'Cargando...' : 'Iniciar Sesión' }}
          </button>
          <p class="toggle-form">
            ¿No tienes cuenta? 
            <a href="#" @click.prevent="mostrarRegistro = true">Regístrate</a>
          </p>
        </form>
      </div>

      <div v-if="authStore.error" class="alert alert-error">
        ❌ {{ authStore.error }}
      </div>

      <div class="credenciales-demo">
        <h3>📝 Credenciales de Prueba:</h3>
        <p><strong>Admin:</strong> admin@example.com / admin123</p>
        <p><strong>Vendedor:</strong> vendedor@example.com / vendedor123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const mostrarRegistro = ref(false);
const formularioLogin = ref({
  email: '',
  contrasena: '',
});
const formularioRegistro = ref({
  nombre: '',
  email: '',
  contrasena: '',
});

const handleLogin = async () => {
  const { email, contrasena } = formularioLogin.value;
  const exito = await authStore.login(email, contrasena);
  if (exito) {
    router.push('/productos');
  }
};

const handleRegistro = async () => {
  const { nombre, email, contrasena } = formularioRegistro.value;
  const exito = await authStore.registro(nombre, email, contrasena);
  if (exito) {
    // Después de registrarse, mostrar login
    mostrarRegistro.value = false;
    formularioLogin.value.email = email;
    alert('✅ Registro exitoso. Ahora inicia sesión.');
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.8em;
}

h2 {
  text-align: center;
  color: #34495e;
  margin-bottom: 20px;
  font-size: 1.3em;
}

.form-section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.btn-primary {
  background-color: #667eea;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #764ba2;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-form {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.toggle-form a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.toggle-form a:hover {
  text-decoration: underline;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.credenciales-demo {
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  border-left: 4px solid #667eea;
}

.credenciales-demo h3 {
  margin-top: 0;
  color: #2c3e50;
}

.credenciales-demo p {
  margin: 8px 0;
  font-size: 13px;
  color: #555;
}
</style>
