import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})

export class ClientesService {

  API =
  'http://localhost/scafi-angular/scafi-api/clientes.php';

  constructor(

    private http: HttpClient

  ) {}

  // =========================
  // LISTAR
  // =========================

  getClientes() {

    return this.http.get(this.API);

  }

  // =========================
  // GUARDAR
  // =========================

  addCliente(data: any) {

    return this.http.post(

      this.API,

      data

    );

  }

  // =========================
  // ACTUALIZAR
  // =========================

  updateCliente(data: any) {

    return this.http.put(

      this.API,

      data

    );

  }

  // =========================
  // ELIMINAR
  // =========================

  deleteCliente(id: number) {

    return this.http.delete(

      `${this.API}?id=${id}`

    );

  }

}