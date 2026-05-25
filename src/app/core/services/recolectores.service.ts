import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecolectoresService {

  API = 'http://localhost/scafi-angular/scafi-api/recolectores.php';

  constructor(private http: HttpClient) {}

  // =========================
  // GET
  // =========================
  getAll() {

    return this.http.get(this.API);
  }

  // =========================
  // CREATE
  // =========================
  create(data: any) {

    return this.http.post(
      this.API,
      data
    );
  }

  // =========================
  // UPDATE
  // =========================
  update(id: number, data: any) {

    return this.http.put(
      `${this.API}?id=${id}`,
      data
    );
  }

  // =========================
  // DELETE
  // =========================
  delete(id: number) {

    return this.http.delete(
      `${this.API}?id=${id}`
    );
  }
}