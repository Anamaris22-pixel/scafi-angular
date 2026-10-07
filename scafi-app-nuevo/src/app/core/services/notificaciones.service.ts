import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  api =
    'http://localhost/scafi-angular/scafi-api/notificaciones.php';

  private cache = new Map<number, Observable<any>>();

  constructor(
    private http: HttpClient
  ) {}

  obtener(usuario_id: number): Observable<any> {

    const usuario = Number(usuario_id);

    if (!usuario) {
      return of({
        ok: false,
        total: 0,
        notificaciones: []
      });
    }

    const existente = this.cache.get(usuario);

    if (existente) {
      return existente;
    }

    return this.cargarDesdeServidor(usuario);
  }

  refrescar(usuario_id: number): Observable<any> {
    const usuario = Number(usuario_id);

    if (!usuario) {
      return of({
        ok: false,
        total: 0,
        notificaciones: []
      });
    }

    this.cache.delete(usuario);

    return this.cargarDesdeServidor(usuario);
  }

  private cargarDesdeServidor(usuario: number): Observable<any> {

    const solicitud = this.http.get<any>(
      `${this.api}?usuario_id=${encodeURIComponent(usuario)}`
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.cache.set(usuario, solicitud);

    return solicitud;
  }

  marcarLeida(id: number, usuario_id: number): Observable<any> {

    const usuario = Number(usuario_id);

    return this.http.post<any>(
      this.api,
      {
        id: Number(id),
        usuario_id: usuario
      }
    ).pipe(
      tap((res: any) => {
        if (res?.ok) {
          // Invalidamos la caché para que la próxima consulta
          // confirme el estado real guardado en MySQL.
          this.cache.delete(usuario);
        }
      })
    );
  }

  limpiarCache(usuario_id?: number): void {

    if (usuario_id === undefined) {
      this.cache.clear();
      return;
    }

    this.cache.delete(Number(usuario_id));
  }
}
