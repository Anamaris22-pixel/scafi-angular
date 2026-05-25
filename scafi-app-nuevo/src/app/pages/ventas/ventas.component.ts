import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { VentasService }
from '../../core/services/ventas.service';

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

  // =========================
  // SELECTORES RESUMEN
  // =========================

  mesSeleccionado = 5;

  anioSeleccionado = 2026;

  // =========================
  // NUEVA VENTA
  // =========================

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

  constructor(

    private service: VentasService

  ) {

    this.cargar();

    this.cargarProductos();

  }

  // =========================
  // CARGAR VENTAS
  // =========================

  cargar() {

    this.service

      .getVentas()

      .subscribe((data: any) => {

        console.log(data);

        this.ventas = data.ventas || [];

      });

  }

  // =========================
  // PRODUCTOS
  // =========================

  cargarProductos() {

    this.productos = [

      { tipoCafe: 'Arábico' },

      { tipoCafe: 'Robusta' },

      { tipoCafe: 'Geisha' },

      { tipoCafe: 'Castillo' },

      { tipoCafe: 'Caturra' }

    ];

  }

  // =========================
  // CALCULAR TOTAL
  // =========================

  calcularTotal() {

    this.nueva.total =

      Number(this.nueva.cantidad) *

      Number(this.nueva.precio);

  }

  // =========================
  // GUARDAR
  // =========================

  guardar() {

    this.calcularTotal();

    this.service

      .addVenta(this.nueva)

      .subscribe(() => {

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

      });

  }

  // =========================
  // EDITAR
  // =========================

  editar(v: any) {

    this.nueva = {

      idVenta: v.idVenta,

      fecha: v.fecha,

      cliente: v.cliente,

      producto: v.producto,

      estado: v.estado,

      cantidad: v.cantidad,

      precio: v.precio,

      total: v.total

    };

  }

  // =========================
  // ELIMINAR
  // =========================

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

  // =========================
  // FILTRAR
  // =========================

  ventasFiltradas() {

    return this.ventas.filter(v =>

      v.cliente
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      v.producto
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      v.estado
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      String(v.idVenta)
        .includes(this.buscar)

    );

  }

  // =========================
  // VENTAS HOY
  // =========================

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

  // =========================
  // VENTAS MES ACTUAL
  // =========================

  ventasDelMesActual() {

    const hoy = new Date();

    const mesActual =
      hoy.getMonth();

    const anioActual =
      hoy.getFullYear();

    return this.ventas

      .filter(v => {

        const fecha =
          new Date(v.fecha);

        return (

          fecha.getMonth() === mesActual &&

          fecha.getFullYear() === anioActual

        );

      })

      .reduce(

        (sum, v) =>

          sum + Number(v.total),

        0

      );

  }

  // =========================
  // TOTAL POR MES
  // =========================

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
          new Date(v.fecha);

        return (

          fecha.getMonth() + 1 === Number(mes)

          &&

          fecha.getFullYear() === Number(anio)

        );

      })

      .reduce(

        (sum: number, v: any) =>

          sum + Number(v.total),

        0

      );

  }

  // =========================
  // RESUMEN MES SELECCIONADO
  // =========================

  resumenMesSeleccionado() {

    return this.totalPorMes(

      this.mesSeleccionado,

      this.anioSeleccionado

    );

  }

}