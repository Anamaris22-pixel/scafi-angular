import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  API = 'http://localhost/scafi/';

  constructor(private http: HttpClient) {}

  getReportes(tipo: string) {
    return this.http.get(this.API + 'reportes.php?tipo=' + tipo);
  }
}