import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  correo = '';

  password = '';

  error = '';

  verPassword = false;

  cargando = false;

  api = 'http://localhost/scafi-angular/scafi-api/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  entrar() {

    // =========================
    // LIMPIAR MENSAJE ANTERIOR
    // =========================
    this.error = '';

    // =========================
    // VALIDAR CAMPOS VACÍOS
    // =========================
    if (!this.correo.trim() || !this.password.trim()) {

      this.error = 'Por favor, complete todos los campos.';

      return;
    }

    // =========================
    // ACTIVAR CARGANDO
    // =========================
    this.cargando = true;

    // =========================
    // ENVIAR DATOS AL SERVIDOR
    // =========================
    this.http.post<any>(
      this.api + 'login.php',
      {
        correo: this.correo.trim(),
        password: this.password
      }
    ).subscribe({

      // =========================
      // RESPUESTA EXITOSA
      // =========================
      next: (res: any) => {

        console.log('RESPUESTA LOGIN =>', res);

        // =========================
        // LOGIN CORRECTO
        // =========================
        if (res.ok) {

          // GUARDAR USUARIO
          localStorage.setItem(
            'usuario',
            JSON.stringify(res.usuario)
          );

          // TOKEN
          localStorage.setItem(
            'token',
            'ok'
          );

          // ROL
          localStorage.setItem(
            'rol',
            String(res.usuario.idRol)
          );

          // ID USUARIO
          localStorage.setItem(
            'idUsuario',
            String(res.usuario.id)
          );

          console.log(
            'USUARIO GUARDADO =>',
            res.usuario
          );

          // =========================
          // IR AL DASHBOARD
          // =========================
          this.router.navigate([
            '/dashboard'
          ]);

        } else {

          // =========================
          // LOGIN INCORRECTO
          // =========================
          this.error =
            res.mensaje ||
            'Usuario o contraseña incorrectos.';

        }

        this.cargando = false;

        this.cd.detectChanges();
      },

      // =========================
      // ERROR DEL SERVIDOR
      // =========================
      error: (err: any) => {

        console.error(
          'ERROR LOGIN =>',
          err
        );

        this.error =
          'No fue posible conectar con el servidor.';

        this.cargando = false;

        this.cd.detectChanges();
      },

      // =========================
      // FINALIZÓ
      // =========================
      complete: () => {

        console.log(
          'Login finalizado'
        );

      }

    });

  }

}
