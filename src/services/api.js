import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

// Interceptor para agregar token en cada petición
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globalmente
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== USUARIOS ==========
export const usuariosAPI = {
  registro: (datos) => API.post('/usuarios/registro', datos),
  login: (email, contrasena) => API.post('/usuarios/login', { email, contrasena }),
  obtenerTodos: () => API.get('/usuarios'),
  obtenerPorId: (id) => API.get(`/usuarios/${id}`),
  actualizar: (id, datos) => API.put(`/usuarios/${id}`, datos),
  cambiarEstado: (id, estado) => API.patch(`/usuarios/${id}/estado`, { estado }),
};

// ========== PRODUCTOS ==========
export const productosAPI = {
  obtenerTodos: () => API.get('/productos'),
  obtenerPorId: (id) => API.get(`/productos/${id}`),
  crear: (datos) => API.post('/productos', datos),
  actualizar: (id, datos) => API.put(`/productos/${id}`, datos),
  eliminar: (id) => API.delete(`/productos/${id}`),
};

// ========== COMPRAS ==========
export const comprasAPI = {
  crear: (datos) => API.post('/compras', datos),
  obtenerTodas: () => API.get('/compras'),
  obtenerMisCompras: () => API.get('/compras/mis-compras/usuario'),
  obtenerPorId: (id) => API.get(`/compras/${id}`),
};

// ========== VENTAS ==========
export const ventasAPI = {
  crear: (datos) => API.post('/ventas', datos),
  obtenerTodas: () => API.get('/ventas'),
  obtenerMisVentas: () => API.get('/ventas/mis-ventas/usuario'),
  obtenerPorId: (id) => API.get(`/ventas/${id}`),
};

export default API;
