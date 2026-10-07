import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {

  // API
  api = 'http://localhost/scafi-angular/scafi-api/proveedores.php';

  // LISTA
  proveedores: any[] = [];

  // BUSCADOR
  buscar = '';

  // FORMULARIO
  mostrarFormulario = false;
  formularioEnviado = false;

  // EDITAR
  editando = false;

  // ERRORES DE VALIDACIÓN
  errores: any = {};

  // OBJETO
  nuevo: any = this.crearProveedorVacio();

  constructor(
    private http: HttpClient
  ) {}

  // ======================================
  // INICIO
  // ======================================
  ngOnInit(): void {
    this.cargar();
  }

  // ======================================
  // CREAR OBJETO VACÍO
  // ======================================
  crearProveedorVacio(): any {
    return {
      idProveedor: '',
      nombre: '',
      empresa: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'Activo'
    };
  }

  // ======================================
  // ABRIR NUEVO PROVEEDOR
  // ======================================
  abrirNuevo(): void {
    this.editando = false;
    this.mostrarFormulario = true;
    this.formularioEnviado = false;
    this.errores = {};
    this.nuevo = this.crearProveedorVacio();
  }

  // ======================================
  // CARGAR
  // ======================================
  cargar(): void {
    this.http.get<any[]>(this.api)
      .subscribe({
        next: (res) => {
          this.proveedores = res;
        },
        error: (err) => {
          console.log('ERROR AL CARGAR PROVEEDORES:', err);
          alert('No se pudieron cargar los proveedores.');
        }
      });
  }

  // ======================================
  // VALIDAR FORMULARIO
  // ======================================
  validarFormulario(): boolean {

    this.formularioEnviado = true;
    this.errores = {};

    const nombre = String(this.nuevo.nombre ?? '').trim();
    const empresa = String(this.nuevo.empresa ?? '').trim();
    const telefono = String(this.nuevo.telefono ?? '').trim();
    const correo = String(this.nuevo.correo ?? '').trim();
    const direccion = String(this.nuevo.direccion ?? '').trim();
    const estado = String(this.nuevo.estado ?? '').trim();

    if (!nombre) {
      this.errores.nombre = 'El nombre del proveedor es obligatorio.';
    }

    if (!empresa) {
      this.errores.empresa = 'La empresa es obligatoria.';
    }

    if (!telefono) {
      this.errores.telefono = 'El teléfono es obligatorio.';
    }

    if (!correo) {
      this.errores.correo = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.errores.correo = 'Ingrese un correo electrónico válido.';
    }

    if (!direccion) {
      this.errores.direccion = 'La dirección es obligatoria.';
    }

    if (!estado) {
      this.errores.estado = 'El estado es obligatorio.';
    }

    return Object.keys(this.errores).length === 0;
  }

  // ======================================
  // LIMPIAR ERRORES
  // ======================================
  limpiarErrores(): void {
    this.errores = {};
    this.formularioEnviado = false;
  }

  // ======================================
  // LIMPIAR ERROR DE UN CAMPO
  // ======================================
  limpiarError(campo: string): void {
    if (this.errores[campo]) {
      delete this.errores[campo];
    }
  }

  // ======================================
  // GUARDAR
  // ======================================
  guardar(): void {

    if (!this.validarFormulario()) {
      return;
    }

    const datos = {
      nombre: String(this.nuevo.nombre).trim(),
      empresa: String(this.nuevo.empresa).trim(),
      telefono: String(this.nuevo.telefono).trim(),
      correo: String(this.nuevo.correo).trim(),
      direccion: String(this.nuevo.direccion).trim(),
      estado: String(this.nuevo.estado).trim()
    };

    this.http.post<any>(this.api, datos)
      .subscribe({
        next: (res) => {

          console.log('RESPUESTA GUARDAR:', res);

          if (res.ok) {
            alert('Proveedor registrado correctamente.');
            this.cancelar();
            this.cargar();
          } else {
            alert(
              'Error al guardar: ' +
              (res.error || 'Error desconocido')
            );
          }
        },

        error: (err) => {
          console.log('ERROR AL GUARDAR:', err);

          const mensaje =
            err?.error?.error ||
            'No fue posible guardar el proveedor.';

          alert(mensaje);
        }
      });
  }

  // ======================================
  // EDITAR
  // ======================================
  editar(p: any): void {

    this.editando = true;
    this.mostrarFormulario = true;
    this.formularioEnviado = false;
    this.errores = {};

    this.nuevo = {
      idProveedor: p.idProveedor,
      nombre: p.nombre ?? '',
      empresa: p.empresa ?? '',
      telefono: p.telefono ?? '',
      correo: p.correo ?? '',
      direccion: p.direccion ?? '',
      estado: p.estado ?? 'Activo'
    };
  }

  // ======================================
  // ACTUALIZAR
  // ======================================
  actualizar(): void {

    if (!this.validarFormulario()) {
      return;
    }

    const datos = {
      idProveedor: this.nuevo.idProveedor,
      nombre: String(this.nuevo.nombre).trim(),
      empresa: String(this.nuevo.empresa).trim(),
      telefono: String(this.nuevo.telefono).trim(),
      correo: String(this.nuevo.correo).trim(),
      direccion: String(this.nuevo.direccion).trim(),
      estado: String(this.nuevo.estado).trim()
    };

    this.http.put<any>(this.api, datos)
      .subscribe({
        next: (res) => {

          console.log('RESPUESTA ACTUALIZAR:', res);

          if (res.ok) {
            alert('Proveedor actualizado correctamente.');
            this.cancelar();
            this.cargar();
          } else {
            alert(
              'Error al actualizar: ' +
              (res.error || 'Error desconocido')
            );
          }
        },

        error: (err) => {
          console.log('ERROR AL ACTUALIZAR:', err);

          const mensaje =
            err?.error?.error ||
            'No fue posible actualizar el proveedor.';

          alert(mensaje);
        }
      });
  }

  // ======================================
  // ELIMINAR
  // ======================================
  eliminar(id: number): void {

    if (!confirm('¿Eliminar proveedor?')) {
      return;
    }

    this.http.delete<any>(`${this.api}?id=${id}`)
      .subscribe({
        next: (res) => {

          console.log(res);

          if (res.ok) {
            alert('Proveedor eliminado correctamente.');
            this.cargar();
          } else {
            alert(
              'No fue posible eliminar el proveedor: ' +
              (res.error || 'Error desconocido')
            );
          }
        },

        error: (err) => {
          console.log('ERROR AL ELIMINAR:', err);
          alert('Error al eliminar el proveedor.');
        }
      });
  }

  // ======================================
  // FILTRAR
  // ======================================
  proveedoresFiltrados(): any[] {

    const texto = this.buscar.toLowerCase().trim();

    return this.proveedores.filter((p: any) =>
      String(p.nombre ?? '').toLowerCase().includes(texto) ||
      String(p.empresa ?? '').toLowerCase().includes(texto) ||
      String(p.telefono ?? '').toLowerCase().includes(texto) ||
      String(p.correo ?? '').toLowerCase().includes(texto)
    );
  }

  // ======================================
  // CANCELAR
  // ======================================
  cancelar(): void {

    this.editando = false;
    this.mostrarFormulario = false;
    this.formularioEnviado = false;
    this.errores = {};
    this.nuevo = this.crearProveedorVacio();
  }
}
