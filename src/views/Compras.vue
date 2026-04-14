<template>
  <div class="contenedor">
    <h1>🛒 Gestión de Compras</h1>

    <div class="tarjeta form-compra">
      <h3>Registrar Nueva Compra</h3>
      <form @submit.prevent="guardarCompra">
        <input v-model="nuevaCompra.proveedor" type="text" placeholder="Nombre del Proveedor" required>
        
        <div class="seccion-detalles">
          <h4>Agregar Productos</h4>
          <div class="detalle-form">
            <select v-model.number="nuevoDetalle.producto_id" required>
              <option value="">-- Seleccionar Producto --</option>
              <option v-for="p in productos" :key="p.id" :value="p.id">
                {{ p.nombre }} (Precio: ${{ p.precio_compra }})
              </option>
            </select>
            <input v-model.number="nuevoDetalle.cantidad" type="number" placeholder="Cantidad" required min="1">
            <input v-model.number="nuevoDetalle.precio_unitario" type="number" placeholder="Precio Unitario" step="0.01" required>
            <button type="button" @click="agregarDetalle" class="btn-agregar">Agregar</button>
          </div>

          <table v-if="nuevaCompra.detalles.length > 0" class="detalles-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, idx) in nuevaCompra.detalles" :key="idx">
                <td>{{ obtenerNombreProducto(detalle.producto_id) }}</td>
                <td>{{ detalle.cantidad }}</td>
                <td>${{ detalle.precio_unitario }}</td>
                <td>${{ (detalle.cantidad * detalle.precio_unitario).toFixed(2) }}</td>
                <td><button type="button" @click="eliminarDetalle(idx)" class="btn-eliminar-pequeño">✕</button></td>
              </tr>
              <tr class="total-row">
                <td colspan="3"><strong>Total:</strong></td>
                <td><strong>${{ calcularTotal().toFixed(2) }}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <button type="submit" class="btn-guardar" :disabled="cargando || nuevaCompra.detalles.length === 0">
          {{ cargando ? 'Guardando...' : 'Guardar Compra' }}
        </button>
      </form>
    </div>

    <div class="tarjeta">
      <h3>Compras Registradas</h3>
      <table v-if="compras.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="compra in compras" :key="compra.id">
            <td>{{ compra.id }}</td>
            <td>{{ compra.proveedor }}</td>
            <td>{{ compra.usuario }}</td>
            <td>${{ compra.total }}</td>
            <td>{{ formatearFecha(compra.fecha_compra) }}</td>
            <td><button @click="verDetalles(compra.id)" class="btn-ver">Ver</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="sin-datos">No hay compras registradas aún.</p>
    </div>

    <div v-if="error" class="alert alert-error">❌ {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { comprasAPI, productosAPI } from '../services/api';

const compras = ref([]);
const productos = ref([]);
const cargando = ref(false);
const error = ref(null);

const nuevaCompra = ref({
  proveedor: '',
  detalles: [],
});

const nuevoDetalle = ref({
  producto_id: '',
  cantidad: 1,
  precio_unitario: 0,
});

const cargarCompras = async () => {
  try {
    const resp = await comprasAPI.obtenerTodas();
    compras.value = resp.data;
  } catch (err) {
    error.value = 'Error al cargar compras';
    console.error(err);
  }
};

const cargarProductos = async () => {
  try {
    const resp = await productosAPI.obtenerTodos();
    productos.value = resp.data;
  } catch (err) {
    console.error('Error al cargar productos');
  }
};

const agregarDetalle = () => {
  if (nuevoDetalle.value.producto_id && nuevoDetalle.value.cantidad > 0) {
    nuevaCompra.value.detalles.push({ ...nuevoDetalle.value });
    nuevoDetalle.value = { producto_id: '', cantidad: 1, precio_unitario: 0 };
  }
};

const eliminarDetalle = (idx) => {
  nuevaCompra.value.detalles.splice(idx, 1);
};

const calcularTotal = () => {
  return nuevaCompra.value.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
};

const obtenerNombreProducto = (id) => {
  return productos.value.find(p => p.id === id)?.nombre || 'Desconocido';
};

const guardarCompra = async () => {
  if (!nuevaCompra.value.proveedor || nuevaCompra.value.detalles.length === 0) {
    error.value = 'Completa todos los campos';
    return;
  }

  cargando.value = true;
  try {
    await comprasAPI.crear(nuevaCompra.value);
    alert('✅ Compra registrada exitosamente');
    nuevaCompra.value = { proveedor: '', detalles: [] };
    cargarCompras();
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al guardar';
  } finally {
    cargando.value = false;
  }
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

const verDetalles = async (id) => {
  try {
    const resp = await comprasAPI.obtenerPorId(id);
    console.log(resp.data);
    alert(`Detalles de la compra: ${JSON.stringify(resp.data.detalles, null, 2)}`);
  } catch (err) {
    error.value = 'Error al obtener detalles';
  }
};

onMounted(() => {
  cargarCompras();
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

h3, h4 {
  color: #34495e;
}

.seccion-detalles {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.detalle-form {
  display: grid;
  grid-template-columns: 1fr 100px 120px 100px;
  gap: 10px;
  margin-bottom: 15px;
}

select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-agregar {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-agregar:hover {
  background-color: #2980b9;
}

.detalles-tabla {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.detalles-tabla th, .detalles-tabla td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.detalles-tabla th {
  background-color: #ecf0f1;
}

.total-row {
  background-color: #e8f5e9;
  font-weight: bold;
}

.btn-eliminar-pequeño {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 2px;
  cursor: pointer;
}

.btn-eliminar-pequeño:hover {
  background-color: #c0392b;
}

.btn-guardar {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
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

.btn-ver {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-ver:hover {
  background-color: #2980b9;
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
  .detalle-form {
    grid-template-columns: 1fr;
  }
}
</style>
