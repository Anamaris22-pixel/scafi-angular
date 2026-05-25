import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({

  selector: 'app-notificaciones',

  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  templateUrl:
  './notificaciones.component.html'

})

export class NotificacionesComponent
implements OnInit {

  // =========================
  // VARIABLES
  // =========================

  total = 0;

  cargando = true;

  mostrar = false;

  notificaciones: any[] = [];

  // =========================
  // API
  // =========================

  api =
'http://localhost/scafi-angular/scafi-api/notificaciones.php';

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.cargarNotificaciones();

  }

  // =========================
  // CARGAR
  // =========================

  cargarNotificaciones() {

    this.http.get<any>(this.api)

    .subscribe({

      next: (resp) => {

        console.log(resp);

        if(resp.ok){

          this.notificaciones =
          resp.notificaciones || [];

          this.total =
          resp.total || 0;

        }

        this.cargando = false;

      },

      error: (error) => {

        console.log(error);

        this.cargando = false;

      }

    });

  }

}