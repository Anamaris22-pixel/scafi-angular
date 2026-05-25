import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movimientos',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl: './movimientos.component.html'
})

export class MovimientosComponent implements OnInit {

  API =
  'http://localhost/scafi-angular/scafi-api/movimientos.php';

  movimientos: any[] = [];

  insumos: any[] = [];

  buscar = '';

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;

  nuevo: any = {

    idInsumo: '',

    tipo: 'Entrada',

    cantidad: '',

    observacion: ''

  };

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.cargar();

    this.cargarInsumos();

  }

  // =========================
  // CARGAR MOVIMIENTOS
  // =========================

  cargar(): void {

    this.http
      .get<any[]>(
        this.API
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          this.movimientos = res;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // =========================
  // CARGAR INSUMOS
  // =========================

  cargarInsumos(): void {

    this.http
      .get<any[]>(
        'http://localhost/scafi-angular/scafi-api/insumos.php'
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          this.insumos = res;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // =========================
  // GUARDAR
  // =========================

  guardar(): void {

    this.http
      .post<any>(
        this.API,
        this.nuevo
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          if (res.ok) {

            alert('Movimiento guardado');

            this.reset();

            this.cargar();

            this.mostrarFormulario = false;

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // =========================
  // EDITAR
  // =========================

  editar(mov: any): void {

    this.editando = true;

    this.mostrarFormulario = true;

    this.idEditar = mov.id;

    this.nuevo = {

      idInsumo: mov.idInsumo,

      tipo: mov.tipo,

      cantidad: mov.cantidad,

      observacion: mov.observacion

    };

  }

  // =========================
  // ACTUALIZAR
  // =========================

  actualizar(): void {

    const datos = {

      id: this.idEditar,

      idInsumo: this.nuevo.idInsumo,

      tipo: this.nuevo.tipo,

      cantidad: this.nuevo.cantidad,

      observacion: this.nuevo.observacion

    };

    this.http
      .put<any>(
        this.API,
        datos
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          if (res.ok) {

            alert('Movimiento actualizado');

            this.editando = false;

            this.reset();

            this.cargar();

            this.mostrarFormulario = false;

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // =========================
  // ELIMINAR
  // =========================

  eliminar(id: number): void {

    if (!confirm('¿Eliminar movimiento?')) {

      return;

    }

    this.http
      .delete<any>(
        `${this.API}?id=${id}`
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          this.cargar();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // =========================
  // FILTRAR
  // =========================

  movimientosFiltrados() {

    return this.movimientos.filter(m =>

      m.insumo
        .toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      m.tipo
        .toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

    );

  }

// =========================
// RESET
// =========================

reset(): void {

  this.nuevo = {

    idInsumo: '',

    tipo: 'Entrada',

    cantidad: '',

    observacion: ''

  };

}

// =========================
// CANCELAR EDITAR
// =========================

cancelarEditar(): void {

  this.editando = false;

  this.mostrarFormulario = false;

  this.reset();

}

// =========================
// TOTAL ENTRADAS
// =========================

totalEntradas(): number {

  return this.movimientos
    .filter(m => m.tipo === 'Entrada')
    .reduce(
      (total, m) => total + Number(m.cantidad),
      0
    );

}

// =========================
// TOTAL SALIDAS
// =========================

totalSalidas(): number {

  return this.movimientos
    .filter(m => m.tipo === 'Salida')
    .reduce(
      (total, m) => total + Number(m.cantidad),
      0
    );

}

// =========================
// CANCELAR
// =========================

cancelar(): void {

  this.cancelarEditar();

}

}