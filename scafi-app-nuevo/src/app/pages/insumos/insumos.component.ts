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
  RouterModule,
  ActivatedRoute
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

  templateUrl:
    './insumos.component.html'

})


export class InsumosComponent
  implements OnInit {


  // =====================================================
  // API
  // =====================================================

  API =
    'http://localhost/scafi-angular/scafi-api/insumos.php';


  API_PROVEEDORES =
    'http://localhost/scafi-angular/scafi-api/proveedores.php';


  // =====================================================
  // VARIABLES
  // =====================================================

  insumos: any[] = [];

  proveedores: any[] = [];

  buscar = '';

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;


  // =====================================================
  // NUEVO INSUMO
  // =====================================================

  nuevo: any = {

    nombre: '',

    idProveedor: '',

    tipo: '',

    descripcion: '',

    unidad: '',

    precio: '',

    stock: 0,

    stockMinimo: ''

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // Permite que una notificación abra directamente
    // el inventario filtrado por el insumo afectado.
    this.route.queryParams.subscribe(params => {

      const buscar =
        String(params['buscar'] || '').trim();

      if (buscar) {
        this.buscar = buscar;
      }

    });

    this.cargar();

    this.cargarProveedores();

  }


  // =====================================================
  // CARGAR INSUMOS
  // =====================================================

  cargar(): void {

    this.http
      .get<any[]>(
        this.API
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
  // CARGAR PROVEEDORES
  // =====================================================

  cargarProveedores(): void {

    this.http
      .get<any[]>(
        this.API_PROVEEDORES
      )

      .subscribe({

        next: (res) => {

          this.proveedores = res;

        },

        error: (err) => {

          console.error(
            'Error cargando proveedores:',
            err
          );


          alert(
            'No fue posible cargar los proveedores.'
          );

        }

      });

  }


  // =====================================================
  // GUARDAR INSUMO
  // =====================================================

  guardar(): void {

    if (

      !this.nuevo.nombre ||

      !this.nuevo.idProveedor ||

      !this.nuevo.tipo ||

      !this.nuevo.unidad ||

      this.nuevo.precio === '' ||

      this.nuevo.stockMinimo === ''

    ) {

      alert(
        'Complete todos los campos obligatorios.'
      );

      return;

    }


    const datos = {

      nombre:
        this.nuevo.nombre,

      idProveedor:
        Number(this.nuevo.idProveedor),

      tipo:
        this.nuevo.tipo,

      descripcion:
        this.nuevo.descripcion || '',

      unidad:
        this.nuevo.unidad,

      precio:
        Number(this.nuevo.precio),

      // El stock inicial siempre será 0.
      // El inventario se controla desde Movimientos.

      stock:
        0,

      stockMinimo:
        Number(this.nuevo.stockMinimo)

    };


    this.http
      .post<any>(
        this.API,
        datos
      )

      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(
              'Insumo registrado correctamente.'
            );


            this.reset();

            this.cargar();

            this.mostrarFormulario =
              false;

          } else {

            alert(
              res.mensaje ||
              res.error ||
              'No fue posible registrar el insumo.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error registrando insumo:',
            err
          );


          alert(
            err?.error?.mensaje ||
            'No fue posible registrar el insumo.'
          );

        }

      });

  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(insumo: any): void {

    this.editando = true;

    this.mostrarFormulario = true;


    this.idEditar =
      Number(insumo.idInsumo);


    this.nuevo = {

      idInsumo:
        Number(insumo.idInsumo),

      nombre:
        insumo.nombre || '',

      idProveedor:
        insumo.idProveedor || '',

      tipo:
        insumo.tipo || '',

      descripcion:
        insumo.descripcion || '',

      unidad:
        insumo.unidad || '',

      precio:
        Number(insumo.precio) || 0,

      // Solo se muestra.
      // No se modifica desde aquí.

      stock:
        Number(insumo.stock) || 0,

      stockMinimo:
        Number(
          insumo.stockMinimo
        ) || 0

    };

  }


  // =====================================================
  // ACTUALIZAR INSUMO
  // =====================================================

  actualizar(): void {

    if (!this.idEditar) {

      alert(
        'No se encontró el ID del insumo.'
      );

      return;

    }


    if (

      !this.nuevo.nombre ||

      !this.nuevo.idProveedor ||

      !this.nuevo.tipo ||

      !this.nuevo.unidad ||

      this.nuevo.precio === '' ||

      this.nuevo.stockMinimo === ''

    ) {

      alert(
        'Complete todos los campos obligatorios.'
      );

      return;

    }


    const datos = {

      idInsumo:
        this.idEditar,

      nombre:
        this.nuevo.nombre,

      idProveedor:
        Number(this.nuevo.idProveedor),

      tipo:
        this.nuevo.tipo,

      descripcion:
        this.nuevo.descripcion || '',

      unidad:
        this.nuevo.unidad,

      precio:
        Number(this.nuevo.precio),

      // IMPORTANTE:
      // No enviamos el stock para modificarlo.

      stockMinimo:
        Number(this.nuevo.stockMinimo)

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
              'Insumo actualizado correctamente.'
            );


            this.editando = false;

            this.reset();

            this.cargar();

            this.mostrarFormulario =
              false;

          } else {

            alert(
              res.mensaje ||
              res.error ||
              'No fue posible actualizar el insumo.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error actualizando insumo:',
            err
          );


          alert(
            err?.error?.mensaje ||
            'No fue posible actualizar el insumo.'
          );

        }

      });

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(id: number): void {

    if (

      !confirm(
        '¿Está seguro de eliminar este insumo?'
      )

    ) {

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
              'Insumo eliminado correctamente.'
            );

            this.cargar();

          } else {

            alert(
              res.mensaje ||
              'No fue posible eliminar el insumo.'
            );

          }

        },

        error: (err) => {

          console.error(
            'Error eliminando insumo:',
            err
          );


          alert(
            err?.error?.mensaje ||
            'No fue posible eliminar el insumo.'
          );

        }

      });

  }


  // =====================================================
  // FILTRAR
  // =====================================================

  insumosFiltrados(): any[] {

    const texto =
      this.buscar
        .toLowerCase()
        .trim();


    if (!texto) {

      return this.insumos;

    }


    return this.insumos.filter(

      i =>

        String(i.nombre || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(i.tipo || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(i.descripcion || '')
          .toLowerCase()
          .includes(texto)

    );

  }


  // =====================================================
  // RESET
  // =====================================================

  reset(): void {

    this.nuevo = {

      nombre: '',

      idProveedor: '',

      tipo: '',

      descripcion: '',

      unidad: '',

      precio: '',

      stock: 0,

      stockMinimo: ''

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

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.insumosFiltrados().length / this.registrosPorPagina));
  }

  get insumosPagina(): any[] {
    const datos = this.insumosFiltrados();
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