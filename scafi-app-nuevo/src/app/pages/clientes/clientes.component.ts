import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  constructor(private service: ClientesService) {
    this.cargar();
  }

  cargar(): void {
    this.service.getClientes().subscribe({
      next: (data: any) => {
        this.clientes = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('ERROR AL CARGAR CLIENTES:', err);
        alert('No fue posible cargar los clientes.');
      }
    });
  }

  nuevoCliente(): void {
    this.editando = false;
    this.idEditar = 0;
    this.mostrarFormulario = true;
    this.formularioEnviado = false;
    this.errores = {};
    this.reset();
  }

  validarFormulario(): boolean {
    this.formularioEnviado = true;
    this.errores = {};

    const nit = String(this.nuevo.nit ?? '').trim();
    const nombre = String(this.nuevo.nombre ?? '').trim();
    const telefono = String(this.nuevo.telefono ?? '').trim();
    const correo = String(this.nuevo.correo ?? '').trim();
    const ciudad = String(this.nuevo.ciudad ?? '').trim();
    const direccion = String(this.nuevo.direccion ?? '').trim();
    const tipo = String(this.nuevo.tipo ?? '').trim();

    if (!nit) {
      this.errores.nit = 'El NIT es obligatorio.';
    }

    if (!nombre) {
      this.errores.nombre = 'El nombre del cliente es obligatorio.';
    }

    if (!telefono) {
      this.errores.telefono = 'El teléfono es obligatorio.';
    }

    if (!correo) {
      this.errores.correo = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.errores.correo = 'Ingrese un correo electrónico válido.';
    }

    if (!ciudad) {
      this.errores.ciudad = 'La ciudad es obligatoria.';
    }

    if (!direccion) {
      this.errores.direccion = 'La dirección es obligatoria.';
    }

    if (!tipo) {
      this.errores.tipo = 'El tipo de cliente es obligatorio.';
    }

    return !this.hayErrores;
  }

  get hayErrores(): boolean {
    return Object.keys(this.errores).length > 0;
  }

  limpiarError(campo: string): void {
    if (this.errores[campo]) {
      delete this.errores[campo];
    }
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const datos = {
      nit: String(this.nuevo.nit).trim(),
      nombre: String(this.nuevo.nombre).trim(),
      telefono: String(this.nuevo.telefono).trim(),
      correo: String(this.nuevo.correo).trim(),
      ciudad: String(this.nuevo.ciudad).trim(),
      direccion: String(this.nuevo.direccion).trim(),
      tipo: String(this.nuevo.tipo).trim()
    };

    this.service.addCliente(datos).subscribe({
      next: (res: any) => {
        if (res.ok) {
          alert('Cliente guardado correctamente.');
          this.cancelar();
          this.cargar();
        } else {
          alert(res.error || 'No fue posible guardar el cliente.');
        }
      },
      error: (err) => {
        console.error('ERROR AL GUARDAR CLIENTE:', err);
        alert(err?.error?.error || 'Error al guardar el cliente.');
      }
    });
  }

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

  actualizar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const datos = {
      id: this.idEditar,
      nit: String(this.nuevo.nit).trim(),
      nombre: String(this.nuevo.nombre).trim(),
      telefono: String(this.nuevo.telefono).trim(),
      correo: String(this.nuevo.correo).trim(),
      ciudad: String(this.nuevo.ciudad).trim(),
      direccion: String(this.nuevo.direccion).trim(),
      tipo: String(this.nuevo.tipo).trim()
    };

    this.service.updateCliente(datos).subscribe({
      next: (res: any) => {
        if (res.ok) {
          alert('Cliente actualizado correctamente.');
          this.cancelar();
          this.cargar();
        } else {
          alert(res.error || 'No fue posible actualizar el cliente.');
        }
      },
      error: (err) => {
        console.error('ERROR AL ACTUALIZAR CLIENTE:', err);
        alert(err?.error?.error || 'Error al actualizar el cliente.');
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar cliente?')) {
      return;
    }

    this.service.deleteCliente(id).subscribe({
      next: (res: any) => {
        if (res.ok) {
          alert('Cliente eliminado correctamente.');
          this.cargar();
        } else {
          alert(res.error || 'No fue posible eliminar el cliente.');
        }
      },
      error: (err) => {
        console.error('ERROR AL ELIMINAR CLIENTE:', err);
        alert('Error al eliminar el cliente.');
      }
    });
  }

  clientesFiltrados(): any[] {
    const texto = this.buscar.toLowerCase().trim();

    return this.clientes.filter((c: any) =>
      String(c.nombre ?? '').toLowerCase().includes(texto) ||
      String(c.nit ?? '').toLowerCase().includes(texto) ||
      String(c.telefono ?? '').toLowerCase().includes(texto) ||
      String(c.correo ?? '').toLowerCase().includes(texto) ||
      String(c.tipo ?? '').toLowerCase().includes(texto)
    );
  }

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

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.formularioEnviado = false;
    this.errores = {};
    this.reset();
  }
}
