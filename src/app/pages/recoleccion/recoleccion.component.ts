import {
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

@Component({
  selector: 'app-recoleccion',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl: './recoleccion.component.html'
})

export class RecoleccionComponent
implements OnInit {

  api =
    'http://localhost/scafi-angular/scafi-api/recoleccion.php';

  apiRecolectores =
    'http://localhost/scafi-angular/scafi-api/recolectores.php';

  recolecciones: any[] = [];

  recolectores: any[] = [];

  buscar = '';

  mostrarFormulario = false;

  idRecolector = '';

  variedad = '';

  estado = '';

  fecha = '';

  kg = '';

  editando = false;

  idEditar = 0;

  user: any = null;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const data =
      localStorage.getItem('user');

    if (data) {

      this.user =
        JSON.parse(data);

    }

    this.cargar();

    this.cargarRecolectores();

  }

  // ======================
  // CARGAR
  // ======================

  cargar(): void {

    this.http
      .get<any[]>(this.api)
      .subscribe({

        next: (res) => {

          this.recolecciones =
            res || [];

        },

        error: (err) => {

          console.error(
            'Error al cargar:',
            err
          );

        }

      });

  }

  // ======================
  // RECOLECTORES
  // ======================

  cargarRecolectores(): void {

    this.http
      .get<any[]>(this.apiRecolectores)
      .subscribe({

        next: (res) => {

          this.recolectores =
            res || [];

        },

        error: (err) => {

          console.error(
            'Error recolectores:',
            err
          );

        }

      });

  }

  // ======================
  // GUARDAR
  // ======================

  guardarPesaje(): void {

    const formData =
      new FormData();

    formData.append(
      'idRecolector',
      this.idRecolector
    );

    formData.append(
      'variedad',
      this.variedad
    );

    formData.append(
      'estado',
      this.estado
    );

    formData.append(
      'fecha',
      this.fecha
    );

    formData.append(
      'kg',
      this.kg
    );

    this.http
      .post<any>(
        this.api,
        formData
      )
      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              'Pesaje guardado'
            );

            this.cargar();

            this.limpiar();

            this.mostrarFormulario =
              false;

          }

        }

      });

  }

  // ======================
  // ELIMINAR
  // ======================

  eliminar(id: number): void {

    if (
      !confirm(
        '¿Eliminar registro?'
      )
    ) {
      return;
    }

    this.http
      .delete<any>(
        `${this.api}?id=${id}`
      )
      .subscribe({

        next: (res) => {

          if (res.ok) {

            this.cargar();

          }

        }

      });

  }

  // ======================
  // EDITAR
  // ======================

  editar(r: any): void {

    this.editando = true;

    this.mostrarFormulario = true;

    this.idEditar =
      r.idRecoleccion;

    this.idRecolector =
      r.idRecolector;

    this.variedad =
      r.variedad;

    this.estado =
      r.estado;

    this.fecha =
      r.fecha;

    this.kg =
      r.kg;

  }

  // ======================
  // ACTUALIZAR
  // ======================

  actualizar(): void {

    const datos = {

      id:
        this.idEditar,

      idRecolector:
        this.idRecolector,

      variedad:
        this.variedad,

      estado:
        this.estado,

      fecha:
        this.fecha,

      kg:
        this.kg

    };

    this.http
      .put<any>(
        this.api,
        datos
      )
      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              'Pesaje actualizado'
            );

            this.cargar();

            this.cancelarEditar();

          }

        }

      });

  }

  // ======================
  // CANCELAR
  // ======================

  cancelarEditar(): void {

    this.editando = false;

    this.idEditar = 0;

    this.limpiar();

    this.mostrarFormulario =
      false;

  }

  // ======================
  // LIMPIAR
  // ======================

  limpiar(): void {

    this.idRecolector = '';

    this.variedad = '';

    this.estado = '';

    this.fecha = '';

    this.kg = '';

  }

  // ======================
  // FILTRAR
  // ======================

  recoleccionesFiltradas() {

    return this.recolecciones.filter(
      (r: any) => {

        const recolector =
          (r.recolector || '')
          .toLowerCase();

        const variedad =
          (r.variedad || '')
          .toLowerCase();

        const buscar =
          this.buscar.toLowerCase();

        return (

          recolector.includes(
            buscar
          )

          ||

          variedad.includes(
            buscar
          )

        );

      }
    );

  }

  // ======================
  // TOTAL
  // ======================

  totalKg(): number {

    return this.recolecciones.reduce(

      (total, r) =>

        total +
        Number(r.kg),

      0

    );

  }

}