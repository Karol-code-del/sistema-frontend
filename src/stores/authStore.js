import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usuariosAPI } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const cargando = ref(false);
  const error = ref(null);

  const estaAutenticado = computed(() => !!token.value);
  const esAdmin = computed(() => usuario.value?.rol === 'Administrador');

  const registro = async (nombre, email, contrasena) => {
    cargando.value = true;
    error.value = null;
    try {
      await usuariosAPI.registro({ nombre, email, contrasena });
      error.value = null;
      return true;
    } catch (err) {
      error.value = err.response?.data?.mensaje || 'Error en el registro';
      return false;
    } finally {
      cargando.value = false;
    }
  };

  const login = async (email, contrasena) => {
    cargando.value = true;
    error.value = null;
    try {
      const response = await usuariosAPI.login(email, contrasena);
      token.value = response.data.token;
      usuario.value = response.data.usuario;

      // Guardar en localStorage
      localStorage.setItem('token', token.value);
      localStorage.setItem('usuario', JSON.stringify(usuario.value));

      error.value = null;
      return true;
    } catch (err) {
      error.value = err.response?.data?.mensaje || 'Credenciales inválidas';
      return false;
    } finally {
      cargando.value = false;
    }
  };

  const logout = () => {
    usuario.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return {
    usuario,
    token,
    cargando,
    error,
    estaAutenticado,
    esAdmin,
    registro,
    login,
    logout,
  };
});
