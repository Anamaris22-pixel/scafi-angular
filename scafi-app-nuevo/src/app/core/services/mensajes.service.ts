import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  API = 'http://localhost/scafi-angular/scafi-api/mensajes.php';

  constructor(private http: HttpClient) {}

  obtenerMensajes() {
    return this.http.get<any[]>(this.API);
  }

  enviarMensaje(data: any) {
    return this.http.post(this.API, data);
  }

  subirArchivo(formData: FormData) {
    return this.http.post(this.API, formData);
  }
}