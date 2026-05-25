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

  // EDITAR
  editando = false;

  // OBJETO
  nuevo: any = {

    idProveedor: '',

    nombre: '',
    empresa: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: 'Activo'
  };

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
  // CARGAR
  // ======================================
  cargar(): void {

    this.http.get<any[]>(this.api)
      .subscribe({

        next: (res) => {

          this.proveedores = res;
        },

        error: (err) => {

          console.log(err);
        }

      });
  }

  // ======================================
  // GUARDAR
  // ======================================
  guardar(): void {

    const formData = new FormData();

    formData.append('nombre', this.nuevo.nombre);
    formData.append('empresa', this.nuevo.empresa);
    formData.append('telefono', this.nuevo.telefono);
    formData.append('correo', this.nuevo.correo);
    formData.append('direccion', this.nuevo.direccion);
    formData.append('estado', this.nuevo.estado);

    this.http.post<any>(this.api, formData)
      .subscribe({

        next: (res) => {

          console.log(res);

          alert('Proveedor registrado');

          this.cancelar();

          this.cargar();
        },

        error: (err) => {

          console.log(err);

          alert('Error al guardar');
        }

      });
  }

  // ======================================
  // EDITAR
  // ======================================
  editar(p: any): void {

    this.editando = true;

    this.mostrarFormulario = true;

    this.nuevo = {

      idProveedor: p.idProveedor,

      nombre: p.nombre,
      empresa: p.empresa,
      telefono: p.telefono,
      correo: p.correo,
      direccion: p.direccion,
      estado: p.estado
    };
  }

  // ======================================
  // ACTUALIZAR
  // ======================================
  actualizar(): void {

    const formData = new FormData();

    formData.append('idProveedor', this.nuevo.idProveedor);

    formData.append('nombre', this.nuevo.nombre);
    formData.append('empresa', this.nuevo.empresa);
    formData.append('telefono', this.nuevo.telefono);
    formData.append('correo', this.nuevo.correo);
    formData.append('direccion', this.nuevo.direccion);
    formData.append('estado', this.nuevo.estado);

    formData.append('_method', 'PUT');

    this.http.post<any>(this.api, formData)
      .subscribe({

        next: (res) => {

          console.log(res);

          alert('Proveedor actualizado');

          this.cancelar();

          this.cargar();
        },

        error: (err) => {

          console.log(err);

          alert('Error al actualizar');
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

          alert('Proveedor eliminado');

          this.cargar();
        },

        error: (err) => {

          console.log(err);

          alert('Error al eliminar');
        }

      });
  }

  // ======================================
  // FILTRAR
  // ======================================
  proveedoresFiltrados() {

    return this.proveedores.filter((p: any) =>

      p.nombre
        .toLowerCase()
        .includes(this.buscar.toLowerCase())

      ||

      p.empresa
        .toLowerCase()
        .includes(this.buscar.toLowerCase())

    );
  }

  // ======================================
  // CANCELAR
  // ======================================
  cancelar(): void {

    this.editando = false;

    this.mostrarFormulario = false;

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

}