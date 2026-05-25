import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class VentasService {

  api = 'http://localhost/scafi-angular/scafi-api/ventas.php';

  constructor(
    private http: HttpClient
  ) {}

  getVentas() {

    return this.http.get(this.api);

  }

  addVenta(data: any) {

    return this.http.post(
      this.api,
      data
    );

  }

  deleteVenta(id: number) {

    return this.http.delete(
      `${this.api}?id=${id}`
    );

  }

}