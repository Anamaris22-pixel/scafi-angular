import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  API = 'http://localhost/scafi/';

  constructor(private http: HttpClient) {}

  getMovimientos() {
    return this.http.get(this.API + 'movimientos.php');
  }

  addMovimiento(data: any) {
    return this.http.post(this.API + 'insert_movimiento.php', data);
  }
}