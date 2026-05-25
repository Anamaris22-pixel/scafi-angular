import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private API = 'http://localhost/scafi/';

  constructor(private http: HttpClient) {}

  getProveedores() {
    return this.http.get(this.API + 'proveedores.php');
  }

  addProveedor(data: any) {
    return this.http.post(this.API + 'insert_proveedor.php', data);
  }

  deleteProveedor(id: number) {
    return this.http.get(this.API + 'delete_proveedor.php?id=' + id);
  }
}