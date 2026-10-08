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

export class MovimientosComponent
  implements OnInit {

  // =====================================================
  // API
  // =====================================================

  API =
    'http://localhost/scafi-angular/scafi-api/movimientos.php';

  API_INSUMOS =
    'http://localhost/scafi-angular/scafi-api/insumos.php';


  // =====================================================
  // VARIABLES
  // =====================================================

  movimientos: any[] = [];

  insumos: any[] = [];

  buscar = '';

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;


  // =====================================================
  // NUEVO MOVIMIENTO
  // =====================================================

  nuevo: any = {

    idInsumo: '',

    tipo: 'Entrada',

    cantidad: '',

    observacion: ''

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.cargar();

    this.cargarInsumos();

  }


  // =====================================================
  // CARGAR MOVIMIENTOS
  // =====================================================

  cargar(): void {

    this.http
      .get<any[]>(
        this.API
      )

      .subscribe({

        next: (res) => {

          this.movimientos = res;

        },

        error: (err) => {

          console.error(
            'Error cargando movimientos:',
            err
          );

          alert(
            'No fue posible cargar los movimientos.'
          );

        }

      });

  }


  // =====================================================
  // CARGAR INSUMOS
  // =====================================================

  cargarInsumos(): void {

    this.http
      .get<any[]>(
        this.API_INSUMOS
      )

      .subscribe({

        next: (res) => {

          this.insumos = res;

        },

        error: (err) => {

          console.error(
            'Error cargando insumos:',
            err
          );

          alert(
            'No fue posible cargar los insumos.'
          );

        }

      });

  }


  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    if (
      !this.nuevo.idInsumo ||
      !this.nuevo.tipo ||
      !this.nuevo.cantidad ||
      Number(this.nuevo.cantidad) <= 0
    ) {

      alert(
        'Complete correctamente los campos del movimiento.'
      );

      return;

    }


    this.http
      .post<any>(
        this.API,
        this.nuevo
      )

      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              res.mensaje ||
              'Movimiento guardado correctamente.'
            );


            this.reset();

            this.cargar();

            this.cargarInsumos();

            this.mostrarFormulario =
              false;

          } else {

            alert(
              res.mensaje ||
              'No fue posible guardar el movimiento.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error guardando movimiento:',
            err
          );


          alert(

            err?.error?.mensaje ||

            'No fue posible registrar el movimiento.'

          );

        }

      });

  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(mov: any): void {

    this.editando = true;

    this.mostrarFormulario = true;


    // IMPORTANTE:
    // Guardamos correctamente el ID
    // del movimiento.

    this.idEditar =
      Number(mov.id);


    this.nuevo = {

      idInsumo:
        Number(mov.idInsumo),

      tipo:
        mov.tipo,

      cantidad:
        Number(mov.cantidad),

      observacion:
        mov.observacion || ''

    };

  }


  // =====================================================
  // ACTUALIZAR
  // =====================================================

  actualizar(): void {

    if (
      !this.idEditar ||
      !this.nuevo.idInsumo ||
      !this.nuevo.tipo ||
      !this.nuevo.cantidad ||
      Number(this.nuevo.cantidad) <= 0
    ) {

      alert(
        'Complete correctamente los campos del movimiento.'
      );

      return;

    }


    const datos = {

      id:
        this.idEditar,

      idInsumo:
        Number(this.nuevo.idInsumo),

      tipo:
        this.nuevo.tipo,

      cantidad:
        Number(this.nuevo.cantidad),

      observacion:
        this.nuevo.observacion || ''

    };


    this.http
      .put<any>(
        this.API,
        datos
      )

      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              res.mensaje ||
              'Movimiento actualizado correctamente.'
            );


            this.editando = false;

            this.reset();

            this.cargar();

            this.cargarInsumos();

            this.mostrarFormulario =
              false;

          } else {

            alert(
              res.mensaje ||
              'No fue posible actualizar el movimiento.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error actualizando movimiento:',
            err
          );


          alert(

            err?.error?.mensaje ||

            'No fue posible actualizar el movimiento.'

          );

        }

      });

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(id: number): void {

    const confirmar =
      confirm(
        '¿Está seguro de eliminar este movimiento? El stock será ajustado automáticamente.'
      );


    if (!confirmar) {

      return;

    }


    this.http
      .delete<any>(
        `${this.API}?id=${id}`
      )

      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              res.mensaje ||
              'Movimiento eliminado correctamente.'
            );


            this.cargar();

            this.cargarInsumos();

          } else {

            alert(
              res.mensaje ||
              'No fue posible eliminar el movimiento.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error eliminando movimiento:',
            err
          );


          alert(

            err?.error?.mensaje ||

            'No fue posible eliminar el movimiento.'

          );

        }

      });

  }


  // =====================================================
  // FILTRAR
  // =====================================================

  movimientosFiltrados(): any[] {

    const texto =
      this.buscar
        .toLowerCase()
        .trim();


    if (!texto) {

      return this.movimientos;

    }


    return this.movimientos.filter(
      m =>

        String(m.insumo || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(m.tipo || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(m.observacion || '')
          .toLowerCase()
          .includes(texto)

    );

  }


  // =====================================================
  // RESET
  // =====================================================

  reset(): void {

    this.nuevo = {

      idInsumo: '',

      tipo: 'Entrada',

      cantidad: '',

      observacion: ''

    };


    this.idEditar = 0;

  }


  // =====================================================
  // CANCELAR
  // =====================================================

  cancelarEditar(): void {

    this.editando = false;

    this.mostrarFormulario = false;

    this.reset();

  }


  // =====================================================
  // TOTAL ENTRADAS
  // =====================================================

  totalEntradas(): number {

    return this.movimientos

      .filter(
        m => m.tipo === 'Entrada'
      )

      .reduce(

        (total, m) =>
          total + Number(m.cantidad),

        0

      );

  }


  // =====================================================
  // TOTAL SALIDAS
  // =====================================================

  totalSalidas(): number {

    return this.movimientos

      .filter(
        m => m.tipo === 'Salida'
      )

      .reduce(

        (total, m) =>
          total + Number(m.cantidad),

        0

      );

  }


  // =====================================================
  // CANCELAR
  // =====================================================

  cancelar(): void {

    this.cancelarEditar();

  }

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.movimientosFiltrados().length / this.registrosPorPagina));
  }

  get movimientosPagina(): any[] {
    const datos = this.movimientosFiltrados();
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