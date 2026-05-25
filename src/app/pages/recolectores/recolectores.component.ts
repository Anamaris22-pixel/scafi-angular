import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecolectoresService } from '../../core/services/recolectores.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-recolectores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './recolectores.component.html'
})
export class RecolectoresComponent implements OnInit {

  // =========================
  // LISTA
  // =========================
  recolectores: any[] = [];

  // =========================
  // BUSCADOR
  // =========================
  buscarTexto: string = '';

  // =========================
  // MOSTRAR FORMULARIO
  // =========================
  mostrarFormulario: boolean = false;

  // =========================
  // NUEVO / EDITAR
  // =========================
  nuevo: any = {

    nombre: '',
    cedula: '',
    telefono: '',
    zonaTrabajo: '',
    foto: 'uploads/usuarios/default.jpg',

    idCultivo: 1,
    idUsuario: 1

  };

  // =========================
  // EDITANDO
  // =========================
  editando: boolean = false;

  idEditando: number | null = null;

  constructor(
    private api: RecolectoresService
  ) {}

  // =========================
// INIT
// =========================

ngOnInit(): void {

  // CARGA INICIAL

  this.api.getAll().subscribe({

    next: (res: any) => {

      this.recolectores = res;

    },

    error: (err) => {

      console.error(err);

    }

  });

  // AUTO RECARGA

  setInterval(() => {

    this.api.getAll().subscribe({

      next: (res: any) => {

        this.recolectores = res;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }, 10000);

}
  // =========================
  // GUARDAR / ACTUALIZAR
  // =========================
  guardar(): void {

    // VALIDACIONES
    if (
      !this.nuevo.nombre ||
      !this.nuevo.cedula ||
      !this.nuevo.telefono ||
      !this.nuevo.zonaTrabajo
    ) {

      alert('Complete todos los campos');

      return;

    }

    // FOTO DEFAULT
    if (!this.nuevo.foto) {

      this.nuevo.foto =
        'uploads/usuarios/default.jpg';

    }

    // =========================
    // ACTUALIZAR
    // =========================
    if (
      this.editando &&
      this.idEditando !== null
    ) {

      this.api.update(
        this.idEditando,
        this.nuevo
      ).subscribe({

        next: () => {

          this.api.getAll().subscribe({

  next: (res: any) => {

    this.recolectores = res;

  }

});
          this.reset();

          this.mostrarFormulario = false;

          alert('Recolector actualizado');

        },

        error: (err) => {

          console.error(err);

          alert('Error al actualizar');

        }

      });

      return;

    }

    // =========================
    // CREAR
    // =========================
    this.api.create(this.nuevo)
      .subscribe({

        next: () => {

          this.api.getAll().subscribe({

  next: (res: any) => {

    this.recolectores = res;

  }

});

          this.reset();

          this.mostrarFormulario = false;

          alert('Recolector creado');

        },

        error: (err) => {

          console.error(err);

          alert('Error al guardar');

        }

      });

  }

  // =========================
  // EDITAR
  // =========================
  editar(r: any): void {

    this.nuevo = {

      nombre: r.nombre,
      cedula: r.cedula,
      telefono: r.telefono,
      zonaTrabajo: r.zonaTrabajo,
      foto: r.foto,

      idCultivo: r.idCultivo,
      idUsuario: r.idUsuario

    };

    this.editando = true;

    this.idEditando = r.idRecolector;

    this.mostrarFormulario = true;

  }

  // =========================
  // ELIMINAR
  // =========================
  eliminar(id: number): void {

    if (
      !confirm('¿Eliminar recolector?')
    ) {

      return;

    }

    this.api.delete(id)
      .subscribe({

        next: () => {

          this.api.getAll().subscribe({

  next: (res: any) => {

    this.recolectores = res;

  }

});

          alert('Recolector eliminado');

        },

        error: (err) => {

          console.error(err);

          alert('Error al eliminar');

        }

      });

  }

  // =========================
  // SUBIR FOTO
  // =========================
  subirFoto(event: any): void {

    const file = event.target.files[0];

    if (!file) {

      return;

    }

    this.nuevo.foto =
      'uploads/usuarios/' + file.name;

  }

  // =========================
  // BUSCADOR
  // =========================
  recolectoresFiltrados(): any[] {

    return this.recolectores.filter(
      (r: any) =>

        r.nombre
          .toLowerCase()
          .includes(
            this.buscarTexto.toLowerCase()
          )

        ||

        r.cedula
          .toLowerCase()
          .includes(
            this.buscarTexto.toLowerCase()
          )

        ||

        r.zonaTrabajo
          .toLowerCase()
          .includes(
            this.buscarTexto.toLowerCase()
          )

    );

  }

  // =========================
  // RESET
  // =========================
  reset(): void {

    this.nuevo = {

      nombre: '',
      cedula: '',
      telefono: '',
      zonaTrabajo: '',
      foto: 'uploads/usuarios/default.jpg',

      idCultivo: 1,
      idUsuario: 1

    };

    this.editando = false;

    this.idEditando = null;

    this.mostrarFormulario = false;

  }

}