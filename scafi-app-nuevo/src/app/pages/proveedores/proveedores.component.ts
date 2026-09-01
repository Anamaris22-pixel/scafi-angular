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

  const datos = {

    nombre: this.nuevo.nombre,
    empresa: this.nuevo.empresa,
    telefono: this.nuevo.telefono,
    correo: this.nuevo.correo,
    direccion: this.nuevo.direccion,
    estado: this.nuevo.estado

  };

  this.http.post<any>(this.api, datos)
    .subscribe({

      next: (res) => {

        console.log('RESPUESTA GUARDAR:', res);

        if (res.ok) {

          alert('Proveedor registrado');

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

  const datos = {

    idProveedor: this.nuevo.idProveedor,

    nombre: this.nuevo.nombre,
    empresa: this.nuevo.empresa,
    telefono: this.nuevo.telefono,
    correo: this.nuevo.correo,
    direccion: this.nuevo.direccion,
    estado: this.nuevo.estado

  };

  this.http.put<any>(this.api, datos)
    .subscribe({

      next: (res) => {

        console.log('RESPUESTA ACTUALIZAR:', res);

        if (res.ok) {

          alert('Proveedor actualizado');

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