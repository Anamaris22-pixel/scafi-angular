import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
export class ConfiguracionComponent implements OnInit {

  constructor(private http: HttpClient) {}

  mostrarModalUsuario = false;
  textoBusqueda = '';

  editando = false;
  idUsuarioEditar = 0;

  usuarios: any[] = [];

  nuevoUsuario: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    idRol: null,
    estado: 'Activo',
    documento: '',
    telefono: '',
    direccion: ''
  };

  fotoSeleccionada: any = null;

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http
      .get<any>('http://localhost/scafi-angular/scafi-api/obtener_usuarios.php')
      .subscribe({
        next: (resp) => {
          console.log('USUARIOS =>', resp);
          this.usuarios = resp.usuarios || resp.data || resp || [];
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  usuariosFiltrados() {
    if (!this.textoBusqueda) {
      return this.usuarios;
    }

    const texto = this.textoBusqueda.toLowerCase();

    return this.usuarios.filter((u: any) =>
      (u.nombre && u.nombre.toLowerCase().includes(texto)) ||
      (u.correo && u.correo.toLowerCase().includes(texto)) ||
      (this.obtenerNombreRol(u.idRol).toLowerCase().includes(texto))
    );
  }

  obtenerNombreRol(idRol: number): string {
    switch (Number(idRol)) {
      case 1: return 'Propietario';
      case 2: return 'Administrador';
      case 3: return 'Recolector';
      default: return 'Sin rol';
    }
  }

  seleccionarFoto(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.fotoSeleccionada = event.target.files[0];
    }
  }

  abrirModalNuevo() {
    this.editando = false;
    this.idUsuarioEditar = 0;
    this.resetFormulario();
    this.mostrarModalUsuario = true;
  }

  editarUsuario(usuario: any) {
    this.editando = true;
    this.idUsuarioEditar = usuario.id;

    this.nuevoUsuario = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      idRol: Number(usuario.idRol),
      estado: usuario.estado,
      contrasena: '',
      confirmarContrasena: '',
      documento: usuario.documento,
      telefono: usuario.telefono,
      direccion: usuario.direccion
    };

    this.mostrarModalUsuario = true;
  }

  guardarUsuario() {
    if (this.nuevoUsuario.contrasena !== this.nuevoUsuario.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevoUsuario.nombre);
    formData.append('correo', this.nuevoUsuario.correo);
    formData.append('contrasena', this.nuevoUsuario.contrasena);
    formData.append('rol', String(this.nuevoUsuario.idRol));
    formData.append('estado', this.nuevoUsuario.estado);
    formData.append('documento', this.nuevoUsuario.documento);
    formData.append('telefono', this.nuevoUsuario.telefono);
    formData.append('direccion', this.nuevoUsuario.direccion);

    if (this.fotoSeleccionada) {
      formData.append('foto', this.fotoSeleccionada);
    }

    const url = this.editando
      ? 'http://localhost/scafi-angular/scafi-api/editar_usuario.php'
      : 'http://localhost/scafi-angular/scafi-api/crear_usuario.php';

    if (this.editando) {
      formData.append('id', String(this.idUsuarioEditar));
    }

    this.http.post<any>(url, formData).subscribe({
      next: (resp) => {
        console.log(resp);
        this.mostrarModalUsuario = false;
        this.resetFormulario();
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) {
      return;
    }

    this.http.post<any>('http://localhost/scafi-angular/scafi-api/eliminar_usuario.php', { id })
      .subscribe({
        next: (resp) => {
          console.log('Usuario eliminado =>', resp);
          this.obtenerUsuarios();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  resetFormulario() {
    this.nuevoUsuario = {
      nombre: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: '',
      idRol: null,
      estado: 'Activo',
      documento: '',
      telefono: '',
      direccion: ''
    };
    this.fotoSeleccionada = null;
  }
}
