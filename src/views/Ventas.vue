<template>
  <div class="contenedor">
    <h1>💰 Gestión de Ventas</h1>

    <div class="tarjeta form-venta">
      <h3>Registrar Nueva Venta</h3>
      <form @submit.prevent="guardarVenta">
        <input v-model="nuevaVenta.cliente" type="text" placeholder="Nombre del Cliente" required>
        
        <div class="seccion-detalles">
          <h4>Agregar Productos</h4>
          <div class="detalle-form">
            <select v-model.number="nuevoDetalle.producto_id" @change="actualizarPrecio">
              <option value="">-- Seleccionar Producto --</option>
              <option v-for="p in productos" :key="p.id" :value="p.id">
                {{ p.nombre }} (Stock: {{ p.cantidad }}, Precio: ${{ p.precio_venta }})
              </option>
            </select>
            <input v-model.number="nuevoDetalle.cantidad" type="number" placeholder="Cantidad" min="1">
            <input v-model.number="nuevoDetalle.precio_unitario" type="number" placeholder="Precio Unitario" step="0.01">
            <button type="button" @click="agregarDetalle" class="btn-agregar">Agregar</button>
          </div>

          <table v-if="nuevaVenta.detalles.length > 0" class="detalles-tabla">
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
              <tr v-for="(detalle, idx) in nuevaVenta.detalles" :key="idx">
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

        <button type="submit" class="btn-guardar" :disabled="cargando || nuevaVenta.detalles.length === 0">
          {{ cargando ? 'Guardando...' : 'Guardar Venta' }}
        </button>
      </form>
    </div>

    <div class="tarjeta">
      <h3>Ventas Registradas</h3>
      <table v-if="ventas.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in ventas" :key="venta.id">
            <td>{{ venta.id }}</td>
            <td>{{ venta.cliente }}</td>
            <td>{{ venta.usuario }}</td>
            <td>${{ venta.total }}</td>
            <td>{{ formatearFecha(venta.fecha_venta) }}</td>
            <td><button @click="verDetalles(venta.id)" class="btn-ver">Ver</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="sin-datos">No hay ventas registradas aún.</p>
    </div>

    <div v-if="error" class="alert alert-error">❌ {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ventasAPI, productosAPI } from '../services/api';

const ventas = ref([]);
const productos = ref([]);
const cargando = ref(false);
const error = ref(null);

const nuevaVenta = ref({
  cliente: '',
  detalles: [],
});

const nuevoDetalle = ref({
  producto_id: '',
  cantidad: 1,
  precio_unitario: 0,
});

const cargarVentas = async () => {
  try {
    const resp = await ventasAPI.obtenerTodas();
    ventas.value = resp.data;
  } catch (err) {
    error.value = 'Error al cargar ventas';
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

const actualizarPrecio = () => {
  const producto = productos.value.find(p => p.id === nuevoDetalle.value.producto_id);
  if (producto) {
    nuevoDetalle.value.precio_unitario = producto.precio_venta;
  }
};

const agregarDetalle = () => {
  if (!nuevoDetalle.value.producto_id) {
    error.value = 'Selecciona un producto antes de agregar';
    return;
  }
  if (nuevoDetalle.value.cantidad <= 0) {
    error.value = 'La cantidad debe ser mayor a 0';
    return;
  }
  error.value = null;
  nuevaVenta.value.detalles.push({ ...nuevoDetalle.value });
  nuevoDetalle.value = { producto_id: '', cantidad: 1, precio_unitario: 0 };
};

const eliminarDetalle = (idx) => {
  nuevaVenta.value.detalles.splice(idx, 1);
};

const calcularTotal = () => {
  return nuevaVenta.value.detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
};

const obtenerNombreProducto = (id) => {
  return productos.value.find(p => p.id === id)?.nombre || 'Desconocido';
};

const guardarVenta = async () => {
  if (!nuevaVenta.value.cliente || nuevaVenta.value.detalles.length === 0) {
    error.value = 'Completa todos los campos';
    return;
  }

  cargando.value = true;
  try {
    await ventasAPI.crear(nuevaVenta.value);
    alert('✅ Venta registrada exitosamente');
    nuevaVenta.value = { cliente: '', detalles: [] };
    cargarVentas();
    cargarProductos(); // Recargar para actualizar stock
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al guardar';
  } finally {
    cargando.value = false;
  }
};

  // Recargar datos
  await cargarVentas();
  await cargarProductos();

} catch (err) {
  error.value = err.response?.data?.error || 'Error al guardar';
  console.error(err); // 👈 útil para depurar
} finally {
  cargando.value = false;
  }
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

const verDetalles = async (id) => {
  try {
    const resp = await ventasAPI.obtenerPorId(id);
    console.log(resp.data);
    alert(`Detalles de la venta: ${JSON.stringify(resp.data.detalles, null, 2)}`);
  } catch (err) {
    error.value = 'Error al obtener detalles';
  }
};

onMounted(() => {
  cargarVentas();
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
