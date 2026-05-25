import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ClientesService }
from '../../core/services/clientes.service';

@Component({

  selector: 'app-clientes',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './clientes.component.html'

})

export class ClientesComponent {

  buscar = '';

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;

  clientes: any[] = [];

  nuevo: any = {

    nit: '',

    nombre: '',

    telefono: '',

    correo: '',

    ciudad: '',

    direccion: '',

    tipo: 'Cooperativa'

  };

  constructor(

    private service: ClientesService

  ) {

    this.cargar();

  }

  // =========================
  // CARGAR
  // =========================

  cargar() {

    this.service

      .getClientes()

      .subscribe((data: any) => {

        this.clientes = data;

      });

  }

  // =========================
  // GUARDAR
  // =========================

  guardar() {

    this.service

      .addCliente(this.nuevo)

      .subscribe((res: any) => {

        if (res.ok) {

          alert('Cliente guardado');

          this.reset();

          this.cargar();

          this.mostrarFormulario = false;

        }

      });

  }

  // =========================
  // EDITAR
  // =========================

  editar(c: any) {

    this.editando = true;

    this.mostrarFormulario = true;

    this.idEditar = c.id;

    this.nuevo = {

      nit: c.nit,

      nombre: c.nombre,

      telefono: c.telefono,

      correo: c.correo,

      ciudad: c.ciudad,

      direccion: c.direccion,

      tipo: c.tipo

    };

  }

  // =========================
  // ACTUALIZAR
  // =========================

  actualizar() {

    const datos = {

      id: this.idEditar,

      nit: this.nuevo.nit,

      nombre: this.nuevo.nombre,

      telefono: this.nuevo.telefono,

      correo: this.nuevo.correo,

      ciudad: this.nuevo.ciudad,

      direccion: this.nuevo.direccion,

      tipo: this.nuevo.tipo

    };

    this.service

      .updateCliente(datos)

      .subscribe((res: any) => {

        if (res.ok) {

          alert('Cliente actualizado');

          this.reset();

          this.cargar();

          this.editando = false;

          this.mostrarFormulario = false;

        }

      });

  }

  // =========================
  // ELIMINAR
  // =========================

  eliminar(id: number) {

    if (!confirm('¿Eliminar cliente?')) {

      return;

    }

    this.service

      .deleteCliente(id)

      .subscribe((res: any) => {

        if (res.ok) {

          this.cargar();

        }

      });

  }

  // =========================
  // FILTRAR
  // =========================

  clientesFiltrados() {

    return this.clientes.filter(c =>

      c.nombre
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      c.nit
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      c.telefono
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      c.tipo
        ?.toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

    );

  }

  // =========================
  // RESET
  // =========================

  reset() {

    this.nuevo = {

      nit: '',

      nombre: '',

      telefono: '',

      correo: '',

      ciudad: '',

      direccion: '',

      tipo: 'Cooperativa'

    };

  }

  // =========================
  // CANCELAR
  // =========================

  cancelar() {

    this.mostrarFormulario = false;

    this.editando = false;

    this.reset();

  }

}