<template>
  <div class="contenedor">
    <h1>📦 Gestión de Inventario</h1>

    <div class="tarjeta form-producto">
      <h3>Agregar Nuevo Producto</h3>
      <form @submit.prevent="guardarProducto">
        <input v-model="nuevoProducto.nombre" type="text" placeholder="Nombre del producto" required>
        <input v-model="nuevoProducto.descripcion" type="text" placeholder="Descripción">
        <input v-model.number="nuevoProducto.precio_compra" type="number" step="0.01" placeholder="Precio Compra ($)" required>
        <input v-model.number="nuevoProducto.precio_venta" type="number" step="0.01" placeholder="Precio Venta ($)" required>
        <button type="submit" class="btn-guardar" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar Producto' }}
        </button>
      </form>
    </div>

    <div class="tarjeta">
      <h3>Productos en Stock</h3>
      <table v-if="productos.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.id }}</td>
            <td><strong>{{ producto.nombre }}</strong></td>
            <td>{{ producto.descripcion }}</td>
            <td>${{ producto.precio_compra }}</td>
            <td>${{ producto.precio_venta }}</td>
            <td :class="{'bajo-stock': producto.cantidad < 5}">{{ producto.cantidad }} und.</td>
            <td>
              <button @click="editarProducto(producto)" class="btn-editar">✏️</button>
              <button @click="eliminarProducto(producto.id)" class="btn-eliminar">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="sin-datos">No hay productos registrados aún.</p>
    </div>

    <div v-if="error" class="alert alert-error">❌ {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productosAPI } from '../../services/api';

const productos = ref([]);
const cargando = ref(false);
const error = ref(null);

const nuevoProducto = ref({
  nombre: '',
  descripcion: '',
  precio_compra: null,
  precio_venta: null,
});

const cargarProductos = async () => {
  try {
    const respuesta = await productosAPI.obtenerTodos();
    productos.value = respuesta.data;
  } catch (err) {
    error.value = 'Error al cargar productos';
    console.error(err);
  }
};

const guardarProducto = async () => {
  try {
    await productosAPI.crear(nuevoProducto.value);
    alert('✅ Producto guardado exitosamente!');
    nuevoProducto.value = { nombre: '', descripcion: '', precio_compra: null, precio_venta: null };
    cargarProductos();
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al guardar el producto';
  } finally {
    cargando.value = false;
  }
};

const editarProducto = (producto) => {
  alert('Edición en desarrollo');
};

const eliminarProducto = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      await productosAPI.eliminar(id);
      alert('✅ Producto eliminado');
      cargarProductos();
    } catch (err) {
      error.value = 'Error al eliminar';
    }
  }
};

onMounted(() => {
  cargarProductos();
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

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.3);
}

.btn-guardar {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  grid-column: span 2;
  font-weight: bold;
}

.btn-guardar:hover:not(:disabled) {
  background: #3aa876;
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
}

.bajo-stock {
  color: red;
  font-weight: bold;
}

.btn-editar {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.btn-editar:hover {
  background: #2980b9;
}

.btn-eliminar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-eliminar:hover {
  background: #c0392b;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-top: 20px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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

  th, td {
    padding: 8px;
  }
}
</style>