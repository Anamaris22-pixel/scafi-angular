import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PermisosService {

  api =
  'http://localhost/scafi-angular/scafi-api/permisos.php';

  constructor(
    private http: HttpClient
  ) {}

  obtenerPorRol(idRol: number) {

    return this.http.get(

      `${this.api}?idRol=${idRol}`

    );

  }

}