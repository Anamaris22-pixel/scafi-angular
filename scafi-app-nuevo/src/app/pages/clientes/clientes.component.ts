import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientesService } from '../../core/services/clientes.service';

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

  formularioEnviado = false;

  errores: any = {};

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

  // =====================================
  // CARGAR CLIENTES
  // =====================================

  cargar(): void {

    this.service.getClientes()
      .subscribe({
        next: (data: any) => {

          this.clientes = Array.isArray(data)
            ? data
            : [];

        },

        error: (err) => {

          console.log('ERROR AL CARGAR CLIENTES:', err);

          alert('No fue posible cargar los clientes.');

        }
      });
  }

  // =====================================
  // ABRIR NUEVO
  // =====================================

  nuevoCliente(): void {

    this.editando = false;

    this.mostrarFormulario = true;

    this.formularioEnviado = false;

    this.errores = {};

    this.idEditar = 0;

    this.reset();

  }

  // =====================================
  // VALIDAR FORMULARIO
  // =====================================

  validarFormulario(): boolean {

  this.formularioEnviado = true;

  this.errores = {};

  const nit =
    String(this.nuevo.nit ?? '').trim();

  const nombre =
    String(this.nuevo.nombre ?? '').trim();

  const telefono =
    String(this.nuevo.telefono ?? '').trim();

  const correo =
    String(this.nuevo.correo ?? '').trim();

  const ciudad =
    String(this.nuevo.ciudad ?? '').trim();

  const direccion =
    String(this.nuevo.direccion ?? '').trim();

  const tipo =
    String(this.nuevo.tipo ?? '').trim();


  if (!nit) {
    this.errores.nit =
      'El NIT es obligatorio.';
  }

  if (!nombre) {
    this.errores.nombre =
      'El nombre del cliente es obligatorio.';
  }

  if (!telefono) {
    this.errores.telefono =
      'El teléfono es obligatorio.';
  }

  if (!correo) {

    this.errores.correo =
      'El correo es obligatorio.';

  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  ) {

    this.errores.correo =
      'Ingrese un correo electrónico válido.';

  }

  if (!ciudad) {
    this.errores.ciudad =
      'La ciudad es obligatoria.';
  }

  if (!direccion) {
    this.errores.direccion =
      'La dirección es obligatoria.';
  }

  if (!tipo) {
    this.errores.tipo =
      'El tipo de cliente es obligatorio.';
  }

  return Object.keys(this.errores).length === 0;
}


// =====================================
// COMPROBAR SI HAY ERRORES
// =====================================

get hayErrores(): boolean {

  return Object.keys(this.errores).length > 0;

}
  // =====================================
  // LIMPIAR ERROR
  // =====================================

  limpiarError(campo: string): void {

    if (this.errores[campo]) {

      delete this.errores[campo];

    }
  }

  // =====================================
  // GUARDAR
  // =====================================

  guardar(): void {

    if (!this.validarFormulario()) {

      return;

    }

    const datos = {

      nit:
        String(this.nuevo.nit).trim(),

      nombre:
        String(this.nuevo.nombre).trim(),

      telefono:
        String(this.nuevo.telefono).trim(),

      correo:
        String(this.nuevo.correo).trim(),

      ciudad:
        String(this.nuevo.ciudad).trim(),

      direccion:
        String(this.nuevo.direccion).trim(),

      tipo:
        String(this.nuevo.tipo).trim()

    };

    this.service.addCliente(datos)
      .subscribe({

        next: (res: any) => {

          if (res.ok) {

            alert(
              'Cliente guardado correctamente.'
            );

            this.cancelar();

            this.cargar();

          } else {

            alert(
              res.error ||
              'No fue posible guardar el cliente.'
            );

          }

        },

        error: (err) => {

          console.log(
            'ERROR AL GUARDAR CLIENTE:',
            err
          );

          alert(
            err?.error?.error ||
            'Error al guardar el cliente.'
          );

        }

      });
  }

  // =====================================
  // EDITAR
  // =====================================

  editar(c: any): void {

    this.editando = true;

    this.mostrarFormulario = true;

    this.formularioEnviado = false;

    this.errores = {};

    this.idEditar = Number(c.id);

    this.nuevo = {

      nit: c.nit ?? '',

      nombre: c.nombre ?? '',

      telefono: c.telefono ?? '',

      correo: c.correo ?? '',

      ciudad: c.ciudad ?? '',

      direccion: c.direccion ?? '',

      tipo: c.tipo ?? 'Cooperativa'

    };
  }

  // =====================================
  // ACTUALIZAR
  // =====================================

  actualizar(): void {

    if (!this.validarFormulario()) {

      return;

    }

    const datos = {

      id: this.idEditar,

      nit:
        String(this.nuevo.nit).trim(),

      nombre:
        String(this.nuevo.nombre).trim(),

      telefono:
        String(this.nuevo.telefono).trim(),

      correo:
        String(this.nuevo.correo).trim(),

      ciudad:
        String(this.nuevo.ciudad).trim(),

      direccion:
        String(this.nuevo.direccion).trim(),

      tipo:
        String(this.nuevo.tipo).trim()

    };

    this.service.updateCliente(datos)
      .subscribe({

        next: (res: any) => {

          if (res.ok) {

            alert(
              'Cliente actualizado correctamente.'
            );

            this.cancelar();

            this.cargar();

          } else {

            alert(
              res.error ||
              'No fue posible actualizar el cliente.'
            );

          }

        },

        error: (err) => {

          console.log(
            'ERROR AL ACTUALIZAR:',
            err
          );

          alert(
            err?.error?.error ||
            'Error al actualizar el cliente.'
          );

        }

      });
  }

  // =====================================
  // ELIMINAR
  // =====================================

  eliminar(id: number): void {

    if (!confirm('¿Eliminar cliente?')) {

      return;

    }

    this.service.deleteCliente(id)
      .subscribe({

        next: (res: any) => {

          if (res.ok) {

            alert(
              'Cliente eliminado correctamente.'
            );

            this.cargar();

          }

        },

        error: (err) => {

          console.log(err);

          alert(
            'Error al eliminar el cliente.'
          );

        }

      });
  }

  // =====================================
  // FILTRAR
  // =====================================

  clientesFiltrados(): any[] {

    const texto =
      this.buscar.toLowerCase().trim();

    return this.clientes.filter((c: any) =>

      String(c.nombre ?? '')
        .toLowerCase()
        .includes(texto)

      ||

      String(c.nit ?? '')
        .toLowerCase()
        .includes(texto)

      ||

      String(c.telefono ?? '')
        .toLowerCase()
        .includes(texto)

      ||

      String(c.tipo ?? '')
        .toLowerCase()
        .includes(texto)

    );
  }

  // =====================================
  // RESET
  // =====================================

  reset(): void {

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

  // =====================================
  // CANCELAR
  // =====================================

  cancelar(): void {

    this.mostrarFormulario = false;

    this.editando = false;

    this.formularioEnviado = false;

    this.errores = {};

    this.reset();

  }

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.clientesFiltrados().length / this.registrosPorPagina));
  }

  get clientesPagina(): any[] {
    const datos = this.clientesFiltrados();
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