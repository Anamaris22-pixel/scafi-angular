import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  user: any = {};

  fotoError = false;

  ngOnInit(): void {

    const usuarioGuardado =
      localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.user = JSON.parse(usuarioGuardado);
    }

  }

  getRolNombre(): string {

    const rol = Number(this.user?.idRol);

    switch (rol) {
      case 1: return 'Propietario';
      case 2: return 'Administrador';
      case 3: return 'Recolector';
      default: return this.user?.rol || 'Usuario';
    }

  }

  getFotoUrl(foto: string): string {

    if (!foto) {
      return '';
    }

    if (
      foto.startsWith('http://') ||
      foto.startsWith('https://')
    ) {
      return foto;
    }

    return 'http://localhost/scafi-angular/scafi-api/' +
      foto.replace(/^\/+/, '');

  }

}
