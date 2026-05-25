import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({
  selector: 'app-configuracion',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],

  templateUrl: './configuracion.component.html'
})

export class ConfiguracionComponent {

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // SECCIÓN ACTIVA
  // =========================
  seccion = 'usuarios';

  // =========================
  // MODAL
  // =========================
  mostrarModalUsuario = false;

  // =========================
  // LISTA USUARIOS
  // =========================
  usuarios = [

    {
      nombre: 'Carlos Medina',
      correo: 'carlos@gmail.com',
      rol: 'Administrador',
      estado: 'Activo'
    },

    {
      nombre: 'Laura Ramírez',
      correo: 'laura@gmail.com',
      rol: 'Recolector',
      estado: 'Activo'
    }

  ];

  // =========================
  // NUEVO USUARIO
  // =========================
  nuevoUsuario: any = {

    nombre: '',

    correo: '',

    contrasena: '',

    idRol: '',

    estado: 'Activo'

  };

  // =========================
  // FOTO
  // =========================
  fotoSeleccionada: any;

  seleccionarFoto(event: any){

    this.fotoSeleccionada =
      event.target.files[0];

  }

  // =========================
  // GUARDAR USUARIO
  // =========================
  guardarUsuario(){

    const formData = new FormData();

    formData.append(
      'nombre',
      this.nuevoUsuario.nombre
    );

    formData.append(
      'correo',
      this.nuevoUsuario.correo
    );

    formData.append(
      'contrasena',
      this.nuevoUsuario.contrasena
    );

    formData.append(
  'rol',
  String(this.nuevoUsuario.idRol)
);

    formData.append(
      'estado',
      this.nuevoUsuario.estado
    );

    if(this.fotoSeleccionada){

      formData.append(
        'foto',
        this.fotoSeleccionada
      );

    }

    this.http.post(
  'http://localhost/scafi-angular/scafi-api/crear_usuario.php',
  formData
).subscribe({

  next: (resp: any) => {

    console.log(this.nuevoUsuario.idRol);
    if(resp.ok){

      alert('Usuario creado correctamente');

      this.mostrarModalUsuario = false;

    } else {

      alert(resp.error);
    }
  },

  error: (error: any) => {

    console.log(error);
  }

});

  }

}
