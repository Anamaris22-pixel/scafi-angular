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
  'http://localhost:8080/notificaciones.php';

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
  // =========================
  // MARCAR LEIDA
  // =========================

  marcarLeida(id: number) {

    const formData = new FormData();

    formData.append(
      'id',
      id.toString()
    );

    return this.http.post(

      'http://localhost:8080/marcar_notificacion.php',

      formData

    );

  }

}