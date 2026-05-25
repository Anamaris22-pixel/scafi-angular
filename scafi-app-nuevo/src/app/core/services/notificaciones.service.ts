import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class NotificacionesService {

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
  // OBTENER NOTIFICACIONES
  // =========================

  obtener(usuario_id: number) {

    return this.http.get<any>(
      `${this.api}?usuario_id=${usuario_id}`
    );

  }

}