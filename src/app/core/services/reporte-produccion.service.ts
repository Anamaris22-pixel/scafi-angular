import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteProduccionService {

  API = 'http://localhost/scafi/';

  constructor(private http: HttpClient) {}

  getProduccion() {
    return this.http.get(this.API + 'reporte_produccion.php');
  }
}