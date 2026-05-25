import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './recuperar-password.component.html'
})
export class RecuperarPasswordComponent implements OnInit {

  correo = '';
  nuevaPassword = '';

  usuarioEncontrado = false;

  cargando = false;
  cargandoBusqueda = false;
  cargandoToken = false;

  mensaje = '';
  error = '';

  usuario: any = null;

  token = '';
  tokenValido = false;

  api = 'http://localhost/scafi-angular/scafi-api/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      if (params['token']) {

        this.token = params['token'];

        this.verificarToken();
      }
    });
  }

  verificarToken() {

    this.http.get<any>(
      this.api + 'verificar_token.php?token=' + this.token
    ).subscribe({

      next: (res) => {

        console.log(res);

        if (res.ok) {

          this.tokenValido = true;

          this.usuarioEncontrado = true;

          this.usuario = res.usuario;

          this.correo = res.usuario.correo;

        } else {

          this.error = 'Token inválido o expirado';
        }
      },

      error: (err) => {

        console.log(err);

        this.error = 'Error verificando token';
      }
    });
  }

  buscarUsuario() {

    this.error = '';
    this.mensaje = '';

    if (!this.correo) {

      this.error = 'Ingrese un correo';

      return;
    }

    this.cargandoBusqueda = true;

    this.http.get<any>(
      this.api + 'buscar_usuario.php?correo=' + this.correo
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.cargandoBusqueda = false;

        if (res.ok) {

          this.usuarioEncontrado = true;

          this.usuario = res.usuario;

        } else {

          this.usuarioEncontrado = false;

          this.error = 'Usuario no encontrado';
        }
      },

      error: (err) => {

        console.log(err);

        this.cargandoBusqueda = false;

        this.error = 'Error del servidor';
      }
    });
  }

  enviarToken() {

    this.error = '';
    this.mensaje = '';

    if (!this.correo) {

      this.error = 'Ingrese un correo';

      return;
    }

    this.cargandoToken = true;

    this.http.post<any>(
      this.api + 'enviar_token.php',
      {
        correo: this.correo
      }
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.cargandoToken = false;

        if (res.ok) {

          alert('Correo enviado');

          this.mensaje = 'Correo enviado';

        } else {

          this.error = res.mensaje;
        }
      },

      error: (err) => {

        console.log(err);

        this.cargandoToken = false;

        this.error = 'Error del servidor';
      }
    });
  }

  guardarPassword() {

    this.error = '';
    this.mensaje = '';

    if (!this.nuevaPassword) {

      this.error = 'Ingrese una nueva contraseña';

      return;
    }

    this.cargando = true;

    this.http.post<any>(
      this.api + 'cambiar_password.php',
      {
        token: this.token,
        nuevaPassword: this.nuevaPassword
      }
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.cargando = false;

        if (res.ok) {

          alert('Contraseña cambiada');

          this.mensaje = 'Contraseña cambiada';

          this.router.navigate(['/login']);

        } else {

          this.error = res.mensaje;
        }
      },

      error: (err) => {

        console.log(err);

        this.cargando = false;

        this.error = 'Error del servidor';
      }
    });
  }

}