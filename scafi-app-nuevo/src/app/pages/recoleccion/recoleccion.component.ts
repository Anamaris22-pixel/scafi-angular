import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


// ======================================================
// INTERFACES
// ======================================================

export interface Recoleccion {
  idRecoleccion: number;
  idRecolector: string | number;
  idLote: string | number;

  recolector?: string;
  nombreLote?: string;
  ubicacion?: string;

  variedad: string;
  estado: string;
  fecha: string;
  kg: string | number;
}


// ======================================================
// RECOLECTOR
// ======================================================

export interface Recolector {
  idRecolector: string | number;
  nombre: string;
}


// ======================================================
// LOTE
// ======================================================

export interface Lote {
  idLote: number;
  nombreLote: string;
  ubicacion: string;
  hectareas: number;
  estado: string;
}


// ======================================================
// FORMULARIO
// ======================================================

export interface PesajePayload {
  idRecolector: string;
  idLote: string;
  variedad: string;
  estado: string;
  fecha: string;
  kg: string;
}


// ======================================================
// USUARIO
// ======================================================

export interface User {
  idRol: number;
  [key: string]: unknown;
}


// ======================================================
// FORMULARIO VACÍO
// ======================================================

const FORMULARIO_VACIO: PesajePayload = {

  idRecolector: '',
  idLote: '',
  variedad: '',
  estado: '',
  fecha: '',
  kg: ''

};


// ======================================================
// COMPONENTE
// ======================================================

@Component({

  selector: 'app-recoleccion',

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './recoleccion.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush

})
export class RecoleccionComponent implements OnInit {


  // ====================================================
  // SERVICIOS
  // ====================================================

  private readonly http = inject(HttpClient);


  private readonly api =
    'http://localhost/scafi-angular/scafi-api/recoleccion.php';


  private readonly apiRecolectores =
    'http://localhost/scafi-angular/scafi-api/recolectores.php';


  // ====================================================
  // DATOS
  // ====================================================

  readonly recolecciones =
    signal<Recoleccion[]>([]);


  readonly recolectores =
    signal<Recolector[]>([]);


  // ====================================================
  // LOTES REALES DE LA BASE DE DATOS
  // ====================================================

  readonly lotes =
    signal<Lote[]>([]);


  // ====================================================
  // BUSCADOR
  // ====================================================

  readonly buscar =
    signal<string>('');


  // ====================================================
  // FILTRO FECHA
  // ====================================================

  readonly filtroFecha =
    signal<string>('');


  // ====================================================
  // FILTRO LOTE
  // ====================================================

  readonly filtroLote =
    signal<string>('');


  // ====================================================
  // FORMULARIO
  // ====================================================

  readonly mostrarFormulario =
    signal<boolean>(false);


  readonly editando =
    signal<boolean>(false);


  readonly idEditar =
    signal<number>(0);


  // ====================================================
  // USUARIO
  // ====================================================

  readonly user =
    signal<User | null>(null);


  // ====================================================
  // DATOS DEL FORMULARIO
  // ====================================================

  readonly formulario =
    signal<PesajePayload>({
      ...FORMULARIO_VACIO
    });


  // ====================================================
  // REGISTRO SELECCIONADO
  // ====================================================

  readonly registroSeleccionado =
    signal<Recoleccion | null>(null);


  // ====================================================
  // FILTRAR RECOLECCIONES
  // ====================================================

  readonly recoleccionesFiltradas = computed(() => {

    const termino =
      this.buscar()
        .toLowerCase()
        .trim();


    const fecha =
      this.filtroFecha();


    const lote =
      this.filtroLote();


    return this.recolecciones().filter(r => {


      // ----------------------------------------------
      // BUSCAR RECOLECTOR
      // ----------------------------------------------

      const recolector =
        (r.recolector || '')
          .toLowerCase();


      // ----------------------------------------------
      // BUSCAR VARIEDAD
      // ----------------------------------------------

      const variedad =
        (r.variedad || '')
          .toLowerCase();


      // ----------------------------------------------
      // CONDICIÓN BUSCADOR
      // ----------------------------------------------

      const coincideBusqueda =

        !termino ||

        recolector.includes(termino) ||

        variedad.includes(termino);


      // ----------------------------------------------
      // CONDICIÓN FECHA
      // ----------------------------------------------

      const coincideFecha =

        !fecha ||

        r.fecha === fecha;


      // ----------------------------------------------
      // CONDICIÓN LOTE
      // ----------------------------------------------

      const coincideLote =

        !lote ||

        String(r.idLote) === String(lote);


      // ----------------------------------------------
      // RESULTADO FINAL
      // ----------------------------------------------

      return (

        coincideBusqueda &&

        coincideFecha &&

        coincideLote

      );

    });

  });


  // ====================================================
  // TOTAL KG
  // ====================================================

  readonly totalKg =
    computed(() => {

      return this.recolecciones()
        .reduce(

          (total, r) =>

            total +
            Number(r.kg || 0),

          0

        );

    });


  // ====================================================
  // INICIO
  // ====================================================

  ngOnInit(): void {


    // ----------------------------------------------
    // RECUPERAR USUARIO
    // ----------------------------------------------

    const data =
      localStorage.getItem('usuario') ||
      localStorage.getItem('user');


    if (data) {

      try {

        this.user.set(
          JSON.parse(data)
        );

      } catch (error) {

        console.error(
          'Error leyendo usuario:',
          error
        );

      }

    }


    // ----------------------------------------------
    // CARGAR INFORMACIÓN
    // ----------------------------------------------

    this.cargar();

    this.cargarRecolectores();

    this.cargarLotes();

  }


  // ====================================================
  // CARGAR RECOLECCIONES
  // ====================================================

  cargar(): void {


    this.http

      .get<Recoleccion[]>(
        this.api
      )

      .subscribe({

        next: (res) => {

          this.recolecciones.set(
            res || []
          );

        },


        error: (err) => {

          console.error(
            'Error al cargar recolecciones:',
            err
          );

        }

      });

  }


  // ====================================================
  // CARGAR RECOLECTORES
  // ====================================================

  cargarRecolectores(): void {


    this.http

      .get<Recolector[]>(
        this.apiRecolectores
      )

      .subscribe({

        next: (res) => {

          this.recolectores.set(
            res || []
          );

        },


        error: (err) => {

          console.error(
            'Error al cargar recolectores:',
            err
          );

        }

      });

  }


  // ====================================================
  // CARGAR LOTES
  // ====================================================

  cargarLotes(): void {


    this.http

      .get<Lote[]>(
        `${this.api}?accion=lotes`
      )

      .subscribe({

        next: (res) => {

          console.log(
            'Lotes cargados:',
            res
          );


          this.lotes.set(
            res || []
          );

        },


        error: (err) => {

          console.error(
            'Error al cargar lotes:',
            err
          );

        }

      });

  }


  // ====================================================
  // PERMISOS
  // ====================================================

  esRecolector(): boolean {
    return Number(this.user()?.idRol) === 3;
  }

  mostrarAvisoSoloLectura(): void {
    alert(
      'Los recolectores tienen acceso de solo lectura. No pueden registrar, editar ni eliminar pesajes.'
    );
  }

  // ====================================================
  // GUARDAR PESAJE
  // ====================================================

  guardarPesaje(): void {


    const payload =
      this.formulario();


    // ----------------------------------------------
    // VALIDACIÓN
    // ----------------------------------------------

    if (

      !payload.idRecolector ||

      !payload.idLote ||

      !payload.variedad ||

      !payload.estado ||

      !payload.fecha ||

      !payload.kg

    ) {

      alert(
        'Todos los campos son obligatorios.'
      );

      return;

    }


    // ----------------------------------------------
    // FORM DATA
    // ----------------------------------------------

    const formData =
      new FormData();


    formData.append(
      'idRecolector',
      payload.idRecolector
    );


    formData.append(
      'idLote',
      payload.idLote
    );


    formData.append(
      'variedad',
      payload.variedad
    );


    formData.append(
      'estado',
      payload.estado
    );


    formData.append(
      'fecha',
      payload.fecha
    );


    formData.append(
      'kg',
      payload.kg
    );

    formData.append(
      'usuario_id',
      String(this.user()?.['id'] ?? '')
    );


    // ----------------------------------------------
    // ENVIAR
    // ----------------------------------------------

    this.http

      .post<{
        ok: boolean;
        mensaje?: string;
      }>(

        this.api,

        formData

      )

      .subscribe({

        next: (res) => {


          if (res.ok) {


            alert(
              'Pesaje guardado correctamente.'
            );


            this.cargar();


            this.limpiar();


            this.mostrarFormulario
              .set(false);


          } else {


            alert(

              'Error del servidor: ' +

              (

                res.mensaje ||

                'No se pudo registrar.'

              )

            );

          }

        },


        error: (err) => {

          console.error(
            'Error POST:',
            err
          );


          alert(
            'No se pudo conectar con el servidor.'
          );

        }

      });

  }


  // ====================================================
  // EDITAR
  // ====================================================

  editar(
    r: Recoleccion
  ): void {


    this.editando.set(
      true
    );


    this.mostrarFormulario.set(
      true
    );


    this.idEditar.set(
      r.idRecoleccion
    );


    this.formulario.set({

      idRecolector:
        String(r.idRecolector),

      idLote:
        String(r.idLote),

      variedad:
        r.variedad,

      estado:
        r.estado,

      fecha:
        r.fecha,

      kg:
        String(r.kg)

    });

  }


  // ====================================================
  // ACTUALIZAR
  // ====================================================

  actualizar(): void {


    const datos = {

      id:
        this.idEditar(),

      usuario_id:
        this.user()?.['id'] ?? '',

      ...this.formulario()

    };


    this.http

      .put<{
        ok: boolean;
        mensaje?: string;
      }>(

        this.api,

        datos

      )

      .subscribe({

        next: (res) => {


          if (res.ok) {


            alert(
              'Pesaje actualizado correctamente.'
            );


            this.cargar();


            this.cancelarEditar();


          } else {


            alert(

              res.mensaje ||

              'No se pudo actualizar.'

            );

          }

        },


        error: (err) => {

          console.error(
            'Error PUT:',
            err
          );


          alert(
            'No se pudo actualizar el registro.'
          );

        }

      });

  }


  // ====================================================
  // ELIMINAR
  // ====================================================

  eliminar(
    id: number
  ): void {


    if (

      !window.confirm(

        '¿Está seguro de eliminar este registro?'

      )

    ) {

      return;

    }


    this.http

      .delete<{
        ok: boolean;
        mensaje?: string;
      }>(

        `${this.api}?id=${id}&usuario_id=${this.user()?.['id'] ?? ''}`

      )

      .subscribe({

        next: (res) => {


          if (res.ok) {


            alert(
              'Registro eliminado correctamente.'
            );


            this.cargar();


          } else {


            alert(

              res.mensaje ||

              'No se pudo eliminar.'

            );

          }

        },


        error: (err) => {

          console.error(
            'Error DELETE:',
            err
          );


          alert(
            'No se pudo eliminar el registro.'
          );

        }

      });

  }


  // ====================================================
  // VER DETALLE
  // ====================================================

  verDetalle(
    r: Recoleccion
  ): void {


    this.registroSeleccionado.set(
      r
    );

  }


  // ====================================================
  // CERRAR DETALLE
  // ====================================================

  cerrarDetalle(): void {


    this.registroSeleccionado.set(
      null
    );

  }


  // ====================================================
  // CANCELAR
  // ====================================================

  cancelarEditar(): void {


    this.editando.set(
      false
    );


    this.idEditar.set(
      0
    );


    this.limpiar();


    this.mostrarFormulario.set(
      false
    );

  }


  // ====================================================
  // LIMPIAR FORMULARIO
  // ====================================================

  limpiar(): void {


    this.formulario.set({

      ...FORMULARIO_VACIO

    });

  }


  // ====================================================
  // LIMPIAR FILTROS
  // ====================================================

  limpiarFiltros(): void {


    this.buscar.set(
      ''
    );


    this.filtroFecha.set(
      ''
    );


    this.filtroLote.set(
      ''
    );

  }

  // ====================================================
  // PAGINACIÓN
  // ====================================================
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.recoleccionesFiltradas().length / this.registrosPorPagina));
  }

  get recoleccionesPagina(): Recoleccion[] {
    const datos = this.recoleccionesFiltradas();
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