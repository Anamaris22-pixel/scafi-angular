import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl: './proveedores.component.html'
})

export class ProveedoresComponent implements OnInit {

  // =====================================================
  // API
  // =====================================================

  api =
    'http://localhost/scafi-angular/scafi-api/proveedores.php';


  // =====================================================
  // LISTA
  // =====================================================

  proveedores: any[] = [];


  // =====================================================
  // BUSCADOR
  // =====================================================

  buscar = '';


  // =====================================================
  // FORMULARIO
  // =====================================================

  mostrarFormulario = false;

  editando = false;

  idEditar = 0;


  // =====================================================
  // CONTROL DE VALIDACIÓN
  // =====================================================

  formularioEnviado = false;


  errores: any = {

    nombre: '',

    empresa: '',

    telefono: '',

    correo: '',

    direccion: '',

    estado: ''

  };


  // =====================================================
  // OBJETO NUEVO PROVEEDOR
  // =====================================================

  nuevo: any = {

    idProveedor: '',

    nombre: '',

    empresa: '',

    telefono: '',

    correo: '',

    direccion: '',

    estado: 'Activo'

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.cargar();

  }


  // =====================================================
  // CARGAR PROVEEDORES
  // =====================================================

  cargar(): void {

    this.http
      .get<any[]>(this.api)
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
  // ABRIR FORMULARIO
  // =====================================================

  abrirNuevo(): void {

    this.editando = false;

    this.mostrarFormulario = true;

    this.formularioEnviado = false;

    this.limpiarErrores();

    this.nuevo = {

      idProveedor: '',

      nombre: '',

      empresa: '',

      telefono: '',

      correo: '',

      direccion: '',

      estado: 'Activo'

    };

  }


  // =====================================================
  // VALIDAR FORMULARIO
  // =====================================================

  validarFormulario(): boolean {

    this.formularioEnviado = true;

    this.limpiarErrores();

    let valido = true;


    // -----------------------------------------------------
    // NOMBRE
    // -----------------------------------------------------

    if (
      !this.nuevo.nombre ||
      !this.nuevo.nombre.trim()
    ) {

      this.errores.nombre =
        'El nombre del proveedor es obligatorio.';

      valido = false;

    }


    // -----------------------------------------------------
    // EMPRESA
    // -----------------------------------------------------

    if (
      !this.nuevo.empresa ||
      !this.nuevo.empresa.trim()
    ) {

      this.errores.empresa =
        'La empresa es obligatoria.';

      valido = false;

    }


    // -----------------------------------------------------
    // TELÉFONO
    // -----------------------------------------------------

    if (
      !this.nuevo.telefono ||
      !this.nuevo.telefono.toString().trim()
    ) {

      this.errores.telefono =
        'El teléfono es obligatorio.';

      valido = false;

    }


    // -----------------------------------------------------
    // CORREO
    // -----------------------------------------------------

    if (
      !this.nuevo.correo ||
      !this.nuevo.correo.trim()
    ) {

      this.errores.correo =
        'El correo electrónico es obligatorio.';

      valido = false;

    } else {

      const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(
            this.nuevo.correo.trim()
          );

      if (!correoValido) {

        this.errores.correo =
          'Ingrese un correo electrónico válido.';

        valido = false;

      }

    }


    // -----------------------------------------------------
    // DIRECCIÓN
    // -----------------------------------------------------

    if (
      !this.nuevo.direccion ||
      !this.nuevo.direccion.trim()
    ) {

      this.errores.direccion =
        'La dirección es obligatoria.';

      valido = false;

    }


    // -----------------------------------------------------
    // ESTADO
    // -----------------------------------------------------

    if (
      !this.nuevo.estado
    ) {

      this.errores.estado =
        'Debe seleccionar un estado.';

      valido = false;

    }


    // -----------------------------------------------------
    // MENSAJE GENERAL
    // -----------------------------------------------------

    if (!valido) {

      setTimeout(() => {

        const elemento =
          document.getElementById(
            'mensaje-validacion-proveedor'
          );

        elemento?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

      }, 50);

    }


    return valido;

  }


  // =====================================================
  // LIMPIAR ERRORES
  // =====================================================

  limpiarErrores(): void {

    this.errores = {

      nombre: '',

      empresa: '',

      telefono: '',

      correo: '',

      direccion: '',

      estado: ''

    };

  }


  // =====================================================
  // LIMPIAR ERROR DE UN CAMPO
  // =====================================================

  limpiarError(campo: string): void {

    if (
      this.errores[campo]
    ) {

      this.errores[campo] = '';

    }

  }


  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    // PRIMERO VALIDAMOS
    if (
      !this.validarFormulario()
    ) {

      alert(
        'Por favor complete correctamente todos los campos obligatorios.'
      );

      return;

    }


    const datos = {

      nombre:
        this.nuevo.nombre.trim(),

      empresa:
        this.nuevo.empresa.trim(),

      telefono:
        this.nuevo.telefono.toString().trim(),

      correo:
        this.nuevo.correo.trim(),

      direccion:
        this.nuevo.direccion.trim(),

      estado:
        this.nuevo.estado

    };


    this.http
      .post<any>(
        this.api,
        datos
      )
      .subscribe({

        next: (res) => {

          console.log(
            'RESPUESTA GUARDAR:',
            res
          );


          if (res.ok) {

            alert(
              res.mensaje ||
              'Proveedor registrado correctamente.'
            );

            this.cancelar();

            this.cargar();

          } else {

            alert(
              res.mensaje ||
              res.error ||
              'No fue posible guardar el proveedor.'
            );

          }

        },

        error: (err) => {

          console.error(
            'ERROR AL GUARDAR:',
            err
          );

          alert(
            err?.error?.mensaje ||
            'No fue posible guardar el proveedor.'
          );

        }

      });

  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(p: any): void {

    this.editando = true;

    this.mostrarFormulario = true;

    this.formularioEnviado = false;

    this.limpiarErrores();


    this.nuevo = {

      idProveedor:
        p.idProveedor,

      nombre:
        p.nombre || '',

      empresa:
        p.empresa || '',

      telefono:
        p.telefono || '',

      correo:
        p.correo || '',

      direccion:
        p.direccion || '',

      estado:
        p.estado || 'Activo'

    };

  }


  // =====================================================
  // ACTUALIZAR
  // =====================================================

  actualizar(): void {

    // VALIDAR ANTES DE ACTUALIZAR
    if (
      !this.validarFormulario()
    ) {

      alert(
        'Por favor complete correctamente todos los campos obligatorios.'
      );

      return;

    }


    const datos = {

      idProveedor:
        this.nuevo.idProveedor,

      nombre:
        this.nuevo.nombre.trim(),

      empresa:
        this.nuevo.empresa.trim(),

      telefono:
        this.nuevo.telefono.toString().trim(),

      correo:
        this.nuevo.correo.trim(),

      direccion:
        this.nuevo.direccion.trim(),

      estado:
        this.nuevo.estado

    };


    this.http
      .put<any>(
        this.api,
        datos
      )
      .subscribe({

        next: (res) => {

          console.log(
            'RESPUESTA ACTUALIZAR:',
            res
          );


          if (res.ok) {

            alert(
              res.mensaje ||
              'Proveedor actualizado correctamente.'
            );

            this.cancelar();

            this.cargar();

          } else {

            alert(
              res.mensaje ||
              res.error ||
              'No fue posible actualizar el proveedor.'
            );

          }

        },

        error: (err) => {

          console.error(
            'ERROR AL ACTUALIZAR:',
            err
          );

          alert(
            err?.error?.mensaje ||
            'No fue posible actualizar el proveedor.'
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
        '¿Está seguro de eliminar este proveedor?'
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

            alert(
              res.mensaje ||
              'Proveedor eliminado correctamente.'
            );

            this.cargar();

          } else {

            alert(
              res.mensaje ||
              res.error ||
              'No fue posible eliminar el proveedor.'
            );

          }

        },

        error: (err) => {

          console.error(
            'ERROR AL ELIMINAR:',
            err
          );

          alert(
            err?.error?.mensaje ||
            'No fue posible eliminar el proveedor.'
          );

        }

      });

  }


  // =====================================================
  // FILTRAR
  // =====================================================

  proveedoresFiltrados(): any[] {

    const texto =
      this.buscar
        .toLowerCase()
        .trim();


    if (!texto) {

      return this.proveedores;

    }


    return this.proveedores.filter(
      (p: any) =>

        String(p.nombre || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(p.empresa || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(p.telefono || '')
          .toLowerCase()
          .includes(texto)

        ||

        String(p.correo || '')
          .toLowerCase()
          .includes(texto)

    );

  }


  // =====================================================
  // CANCELAR
  // =====================================================

  cancelar(): void {

    this.editando = false;

    this.mostrarFormulario = false;

    this.formularioEnviado = false;

    this.limpiarErrores();


    this.nuevo = {

      idProveedor: '',

      nombre: '',

      empresa: '',

      telefono: '',

      correo: '',

      direccion: '',

      estado: 'Activo'

    };

  }

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.proveedoresFiltrados().length / this.registrosPorPagina));
  }

  get proveedoresPagina(): any[] {
    const datos = this.proveedoresFiltrados();
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