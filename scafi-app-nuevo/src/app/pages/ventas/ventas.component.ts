import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VentasService } from '../../core/services/ventas.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './ventas.component.html'
})
export class VentasComponent {

  buscar = '';

  ventas: any[] = [];

  productos: any[] = [];

  // =====================================================
  // FILTROS DEL HISTORIAL
  // =====================================================

  mostrarFiltros = false;

  filtroCliente = '';

  filtroProducto = '';

  filtroEstado = '';

  fechaDesde = '';

  fechaHasta = '';

  // =====================================================
  // SELECTORES RESUMEN
  // =====================================================

  mesSeleccionado = 5;

  anioSeleccionado = 2026;

  // =====================================================
  // NUEVA VENTA
  // =====================================================

  nueva: any = {

    idVenta: null,

    fecha: '',

    cliente: '',

    producto: '',

    estado: 'Pagado',

    cantidad: 0,

    precio: 0,

    total: 0

  };

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private service: VentasService
  ) {

    this.cargar();

    this.cargarProductos();

  }

  // =====================================================
  // CARGAR VENTAS
  // =====================================================

  cargar() {

    this.service
      .getVentas()
      .subscribe((data: any) => {

        console.log(data);

        this.ventas = data.ventas || [];

      });

  }

  // =====================================================
  // PRODUCTOS
  // =====================================================

  cargarProductos() {

    this.productos = [

      { tipoCafe: 'Arábico' },

      { tipoCafe: 'Robusta' },

      { tipoCafe: 'Geisha' },

      { tipoCafe: 'Castillo' },

      { tipoCafe: 'Caturra' }

    ];

  }

  // =====================================================
  // CALCULAR TOTAL
  // =====================================================

  calcularTotal() {

    this.nueva.total =
      Number(this.nueva.cantidad) *
      Number(this.nueva.precio);

  }

  // =====================================================
  // GUARDAR VENTA
  // =====================================================

  guardar() {

  // ==========================================
  // VALIDAR CANTIDAD
  // ==========================================

  const cantidad = Number(this.nueva.cantidad);

  if (
    this.nueva.cantidad === '' ||
    this.nueva.cantidad === null ||
    this.nueva.cantidad === undefined ||
    !Number.isFinite(cantidad) ||
    cantidad <= 0
  ) {

    alert('La cantidad debe ser mayor que cero.');

    return;
  }


  // ==========================================
  // VALIDAR PRECIO
  // ==========================================

  const precio = Number(this.nueva.precio);

  if (
    this.nueva.precio === '' ||
    this.nueva.precio === null ||
    this.nueva.precio === undefined ||
    !Number.isFinite(precio) ||
    precio <= 0
  ) {

    alert('El precio debe ser mayor que cero.');

    return;
  }


  // ==========================================
  // VALIDAR CLIENTE
  // ==========================================

  if (
    !this.nueva.cliente ||
    this.nueva.cliente.trim() === ''
  ) {

    alert('Debe ingresar un cliente para registrar la venta.');

    return;
  }


  // ==========================================
  // VALIDAR PRODUCTO
  // ==========================================

  if (
    !this.nueva.producto ||
    this.nueva.producto.trim() === ''
  ) {

    alert('Debe seleccionar un producto.');

    return;
  }


  // ==========================================
  // CALCULAR TOTAL
  // ==========================================

  this.calcularTotal();


  // ==========================================
  // GUARDAR
  // ==========================================

  const esEdicion = this.nueva.idVenta !== null && this.nueva.idVenta !== undefined;

  const operacion = esEdicion
    ? this.service.updateVenta(this.nueva.idVenta, this.nueva)
    : this.service.addVenta(this.nueva);

  operacion.subscribe({

    next: (respuesta: any) => {

      console.log(
        esEdicion
          ? 'Venta actualizada:'
          : 'Venta registrada:',
        respuesta
      );

      alert(
        esEdicion
          ? 'Venta actualizada correctamente.'
          : 'Venta registrada correctamente.'
      );

      this.nueva = {

        idVenta: null,

        fecha: '',

        cliente: '',

        producto: '',

        estado: 'Pagado',

        cantidad: 0,

        precio: 0,

        total: 0

      };

      this.cargar();

    },

    error: (error) => {

      console.error(
        esEdicion
          ? 'Error al actualizar venta:'
          : 'Error al registrar venta:',
        error
      );

      const mensaje =
        error?.error?.error ||
        error?.error?.mensaje ||
        'No fue posible guardar la venta.';

      alert(mensaje);

    }

  });

}
  // =====================================================
  // EDITAR
  // =====================================================

  /**
   * Carga la venta existente en el formulario.
   * Importante: conservar idVenta hace que guardar() use PUT
   * y actualice el registro, en lugar de crear una nueva venta.
   */
  editar(v: any) {

    this.nueva = {

      idVenta: Number(v.idVenta),

      fecha: v.fecha,

      cliente: v.cliente,

      producto: v.producto,

      estado: v.estado,

      cantidad: v.cantidad,

      precio: v.precio,

      total: v.total

    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  cancelarEdicion() {

    this.nueva = {

      idVenta: null,

      fecha: '',

      cliente: '',

      producto: '',

      estado: 'Pagado',

      cantidad: 0,

      precio: 0,

      total: 0

    };

  }

  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(id: number) {

    if (!confirm('¿Eliminar venta?')) {

      return;

    }

    this.service
      .deleteVenta(id)
      .subscribe(() => {

        this.cargar();

      });

  }

  // =====================================================
  // MOSTRAR / OCULTAR FILTROS
  // =====================================================

  abrirFiltros() {

    this.mostrarFiltros = !this.mostrarFiltros;

  }

  // =====================================================
  // FILTRAR VENTAS
  // =====================================================

  ventasFiltradas() {

    const texto = this.buscar
      .toLowerCase()
      .trim();

    const cliente = this.filtroCliente
      .toLowerCase()
      .trim();

    const producto = this.filtroProducto
      .toLowerCase()
      .trim();

    const estado = this.filtroEstado
      .toLowerCase()
      .trim();

    return this.ventas.filter((v: any) => {

      // -----------------------------------------
      // BUSQUEDA GENERAL
      // -----------------------------------------

      const coincideBusqueda =

        !texto ||

        String(v.idVenta)
          .toLowerCase()
          .includes(texto) ||

        String(v.cliente || '')
          .toLowerCase()
          .includes(texto) ||

        String(v.producto || '')
          .toLowerCase()
          .includes(texto) ||

        String(v.estado || '')
          .toLowerCase()
          .includes(texto);

      // -----------------------------------------
      // FILTRO CLIENTE
      // -----------------------------------------

      const coincideCliente =

        !cliente ||

        String(v.cliente || '')
          .toLowerCase()
          .includes(cliente);

      // -----------------------------------------
      // FILTRO PRODUCTO
      // -----------------------------------------

      const coincideProducto =

        !producto ||

        String(v.producto || '')
          .toLowerCase()
          .includes(producto);

      // -----------------------------------------
      // FILTRO ESTADO
      // -----------------------------------------

      const coincideEstado =

        !estado ||

        String(v.estado || '')
          .toLowerCase() === estado;

      // -----------------------------------------
      // FECHA DE LA VENTA
      // -----------------------------------------

      const fechaVenta = String(v.fecha || '')
        .substring(0, 10);

      // -----------------------------------------
      // FECHA DESDE
      // -----------------------------------------

      const coincideFechaDesde =

        !this.fechaDesde ||

        fechaVenta >= this.fechaDesde;

      // -----------------------------------------
      // FECHA HASTA
      // -----------------------------------------

      const coincideFechaHasta =

        !this.fechaHasta ||

        fechaVenta <= this.fechaHasta;

      // -----------------------------------------
      // RESULTADO FINAL
      // -----------------------------------------

      return (

        coincideBusqueda &&

        coincideCliente &&

        coincideProducto &&

        coincideEstado &&

        coincideFechaDesde &&

        coincideFechaHasta

      );

    });

  }

  // =====================================================
  // TOTAL DE VENTAS FILTRADAS
  // Suma únicamente las ventas que cumplen los filtros actuales.
  // Esto permite ver el total exacto del rango de fechas seleccionado.
  // =====================================================

  totalVentasFiltradas(): number {

    return this.ventasFiltradas()
      .reduce(
        (sum: number, v: any) =>
          sum + Number(v.total || 0),
        0
      );

  }

  // =====================================================
  // LIMPIAR FILTROS
  // =====================================================

  limpiarFiltros() {

    this.buscar = '';

    this.filtroCliente = '';

    this.filtroProducto = '';

    this.filtroEstado = '';

    this.fechaDesde = '';

    this.fechaHasta = '';

  }

  // =====================================================
  // VENTAS HOY
  // =====================================================

  totalHoy() {

    const hoy = new Date();

    const fechaHoy =

      hoy.getFullYear() + '-' +

      String(hoy.getMonth() + 1)
        .padStart(2, '0') + '-' +

      String(hoy.getDate())
        .padStart(2, '0');

    return this.ventas

      .filter((v: any) => {

        return String(v.fecha)
          .substring(0, 10)

          === fechaHoy;

      })

      .reduce(

        (sum: number, v: any) =>

          sum + Number(v.total),

        0

      );

  }

  // =====================================================
  // FECHA LOCAL DE HOY
  // =====================================================

  private fechaHoyLocal(): string {

    const hoy = new Date();

    return hoy.getFullYear() + '-' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoy.getDate()).padStart(2, '0');

  }

  // =====================================================
  // VENTAS DEL MES ACTUAL
  // =====================================================

  ventasDelMesActual() {

    const hoy = new Date();

    const mesActual = hoy.getMonth() + 1;

    const anioActual = hoy.getFullYear();

    return this.ventas

      .filter(v => {

        if (!v.fecha) {

          return false;

        }

        const fecha =
          String(v.fecha).substring(0, 10);

        const partes =
          fecha.split('-');

        const anio =
          Number(partes[0]);

        const mes =
          Number(partes[1]);

        return (

          mes === mesActual &&

          anio === anioActual &&

          fecha <= this.fechaHoyLocal()

        );

      })

      .reduce(

        (sum, v) =>
          sum + Number(v.total),

        0

      );

  }

  // =====================================================
  // TOTAL POR MES
  // =====================================================

  totalPorMes(
    mes: number,
    anio: number
  ) {

    return this.ventas

      .filter((v: any) => {

        if (!v.fecha) {

          return false;

        }

        const fecha =
          String(v.fecha).substring(0, 10);

        const partes =
          fecha.split('-');

        const anioVenta =
          Number(partes[0]);

        const mesVenta =
          Number(partes[1]);

        const mismoMes =
          mesVenta === Number(mes) &&
          anioVenta === Number(anio);

        if (!mismoMes) {
          return false;
        }

        // Para el mes y año actuales, nunca contar ventas con fecha futura.
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anioActual = hoy.getFullYear();

        if (
          Number(mes) === mesActual &&
          Number(anio) === anioActual
        ) {
          return fecha <= this.fechaHoyLocal();
        }

        return true;

      })

      .reduce(

        (sum: number, v: any) =>

          sum + Number(v.total),

        0

      );

  }

  // =====================================================
  // RESUMEN MES SELECCIONADO
  // =====================================================

  resumenMesSeleccionado() {

    return this.totalPorMes(

      this.mesSeleccionado,

      this.anioSeleccionado

    );

  }

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.ventasFiltradas()().length / this.registrosPorPagina));
  }

  get ventasPagina(): any[] {
    const datos = this.ventasFiltradas()();
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return datos.slice(inicio, inicio + this.registrosPorPagina);
  }

  irPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginaAnterior(): void { this.irPagina(this.paginaActual - 1); }
  paginaSiguiente(): void { this.irPagina(this.paginaActual + 1); }

  reiniciarPaginacion(): void { this.paginaActual = 1; }

  // PAGINACIÓN DEL HISTORIAL
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.ventasFiltradas().length / this.registrosPorPagina));
  }

  get ventasPagina(): any[] {
    const datos = this.ventasFiltradas();
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return datos.slice(inicio, inicio + this.registrosPorPagina);
  }

  irPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginaAnterior(): void { this.irPagina(this.paginaActual - 1); }
  paginaSiguiente(): void { this.irPagina(this.paginaActual + 1); }
  reiniciarPaginacion(): void { this.paginaActual = 1; }

}