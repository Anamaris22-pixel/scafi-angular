import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost/scafi/login.php'; // tu PHP

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string) {
    const formData = new FormData();
    formData.append('usuario', usuario);
    formData.append('contrasena', contrasena);

    return this.http.post<any>(this.api, formData);
  }
}