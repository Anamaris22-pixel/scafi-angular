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

  api =
    'http://localhost/scafi-angular/scafi-api/';

  constructor(

    private http: HttpClient,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {}

  entrar() {

    this.error = '';

    this.cargando = true;

    this.http.post<any>(

      this.api + 'login.php',

      {
        correo: this.correo,
        password: this.password
      }

    ).subscribe({

      next: (res: any) => {

        console.log(
          'RESPUESTA LOGIN =>',
          res
        );

        if (res.ok) {

          // ======================
          // GUARDAR USUARIO
          // ======================

          localStorage.setItem(
            'usuario',
            JSON.stringify(res.usuario)
          );

          // ======================
          // TOKEN
          // ======================

          localStorage.setItem(
            'token',
            'ok'
          );

          // ======================
          // ROL
          // ======================

          localStorage.setItem(
            'rol',
            String(res.usuario.idRol)
          );

          // ======================
          // ID USUARIO
          // ======================

          localStorage.setItem(
            'idUsuario',
            String(res.usuario.id)
          );

          console.log(
            'USUARIO GUARDADO =>',
            res.usuario
          );

          // ======================
          // REDIRECT
          // ======================

          this.router.navigate([
            '/dashboard'
          ]);

        } else {

          this.error =
            res.mensaje;

          alert(
            res.mensaje
          );

        }

        this.cargando = false;

        this.cd.detectChanges();

      },

      error: (err: any) => {

        console.error(err);

        this.error =
          'Error del servidor';

        alert(
          'Error del servidor'
        );

        this.cargando = false;

        this.cd.detectChanges();

      },

      complete: () => {

        console.log(
          'Login finalizado'
        );

      }

    });

  }

}
