import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  RouterModule
} from '@angular/router';

@Component({
  selector: 'app-insumos',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl: './insumos.component.html'
})

export class InsumosComponent
implements OnInit {

  API =
  'http://localhost/scafi-angular/scafi-api/insumos.php';

  API_PROVEEDORES =
  'http://localhost/scafi-angular/scafi-api/proveedores.php';

  insumos: any[] = [];

  proveedores: any[] = [];

  buscar = '';

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;

  nuevo: any = {

    nombre: '',

    idProveedor: '',

    tipo: '',

    descripcion: '',

    unidad: '',

    precio: '',

    stock: '',

    minimo: ''

  };

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.cargar();

    this.cargarProveedores();

  }

  // =========================
  // CARGAR INSUMOS
  // =========================

  cargar(): void {

    this.http
      .get<any[]>(
        this.API
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
  // CARGAR PROVEEDORES
  // =========================

  cargarProveedores(): void {

    this.http
      .get<any[]>(
        this.API_PROVEEDORES
      )

      .subscribe({

        next: (res) => {

          console.log(res);

          this.proveedores = res;

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

            alert(
              'Insumo guardado'
            );

            this.reset();

            this.cargar();

            this.mostrarFormulario =
            false;

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

  editar(insumo: any) {

  this.editando = true;

  this.mostrarFormulario = true;

  this.nuevo = {

    idInsumo: insumo.idInsumo,

    nombre: insumo.nombre || '',

    tipo: insumo.tipo || '',

    descripcion: insumo.descripcion || '',

    unidad: insumo.unidad || '',

    precio: insumo.precio || 0,

    stock: Number(insumo.stock) || 0,

    minimo:
      Number(insumo.stockMinimo)
      || Number(insumo.minimo)
      || 0,

    idProveedor:
      insumo.idProveedor || ''

  };

}

  // =========================
  // ACTUALIZAR
  // =========================

  actualizar(): void {

    const datos = {

      idInsumo:
      this.idEditar,

      nombre:
      this.nuevo.nombre,

      idProveedor:
      this.nuevo.idProveedor,

      tipo:
      this.nuevo.tipo,

      descripcion:
      this.nuevo.descripcion,

      unidad:
      this.nuevo.unidad,

      precio:
      this.nuevo.precio,

      stock:
      this.nuevo.stock,

      minimo:
      this.nuevo.minimo

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

            alert(
              'Insumo actualizado'
            );

            this.editando = false;

            this.reset();

            this.cargar();

            this.mostrarFormulario =
            false;

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

    if (
      !confirm(
        '¿Eliminar insumo?'
      )
    ) {

      return;

    }

    this.http
      .delete<any>(
        `${this.API}?id=${id}`
      )

      .subscribe({

        next: () => {

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

  insumosFiltrados() {

    return this.insumos.filter(i =>

      i.nombre
        .toLowerCase()
        .includes(
          this.buscar.toLowerCase()
        )

      ||

      i.tipo
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

      nombre: '',

      idProveedor: '',

      tipo: '',

      descripcion: '',

      unidad: '',

      precio: '',

      stock: '',

      minimo: ''

    };

  }

  // =========================
  // CANCELAR
  // =========================

  cancelarEditar(): void {

    this.editando = false;

    this.mostrarFormulario = false;

    this.reset();

  }

}