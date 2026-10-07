import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  user: any = {};

  fotoError = false;
  editando = false;
  guardando = false;
  fotoSeleccionada: File | null = null;
  mensaje = '';
  error = '';

  constructor(private http: HttpClient) {}

  formulario: any = {
    nombre: '',
    correo: '',
    telefono: '',
    documento: '',
    direccion: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  ngOnInit(): void {

    const usuarioGuardado =
      localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.user = JSON.parse(usuarioGuardado);
    }

    this.cargarFormulario();

  }

  cargarFormulario(): void {
    this.formulario = {
      nombre: this.user?.nombre || '',
      correo: this.user?.correo || '',
      telefono: this.user?.telefono || '',
      documento: this.user?.documento || '',
      direccion: this.user?.direccion || '',
      contrasena: '',
      confirmarContrasena: ''
    };
  }

  esRecolector(): boolean {
    return Number(this.user?.idRol) === 3;
  }

  abrirEdicion(): void {
    this.mensaje = '';
    this.error = '';
    this.fotoSeleccionada = null;
    this.cargarFormulario();
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.mensaje = '';
    this.error = '';
    this.fotoSeleccionada = null;
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fotoSeleccionada = input.files[0];
      this.fotoError = false;
    }
  }

  guardarPerfil(): void {

    if (!this.formulario.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    if (!this.formulario.correo.trim()) {
      this.error = 'El correo es obligatorio.';
      return;
    }

    if (
      this.formulario.contrasena &&
      this.formulario.contrasena !== this.formulario.confirmarContrasena
    ) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.guardando = true;
    this.mensaje = '';
    this.error = '';

    const data = new FormData();

    data.append('id', String(this.user.id));
    data.append('nombre', this.formulario.nombre.trim());
    data.append('correo', this.formulario.correo.trim());
    data.append('telefono', this.formulario.telefono.trim());
    data.append('documento', this.formulario.documento.trim());
    data.append('direccion', this.formulario.direccion.trim());

    if (this.formulario.contrasena) {
      data.append('contrasena', this.formulario.contrasena);
    }

    if (this.fotoSeleccionada) {
      data.append('foto', this.fotoSeleccionada);
    }

    this.http.post<any>(
      'http://localhost/scafi-angular/scafi-api/actualizar_perfil.php',
      data
    ).subscribe({
      next: (resp: any) => {

        this.guardando = false;

        if (!resp?.ok) {
          this.error = resp?.error || 'No fue posible actualizar el perfil.';
          return;
        }

        this.user = resp.usuario || this.user;

        localStorage.setItem(
          'usuario',
          JSON.stringify(this.user)
        );

        this.fotoError = false;
        this.editando = false;
        this.fotoSeleccionada = null;
        this.formulario.contrasena = '';
        this.formulario.confirmarContrasena = '';

        this.mensaje = 'Perfil actualizado correctamente.';
      },
      error: (err: any) => {
        console.error(err);
        this.guardando = false;
        this.error = 'No fue posible conectar con el servidor.';
      }
    });

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
