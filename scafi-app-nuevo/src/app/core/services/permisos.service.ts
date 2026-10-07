import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  api =
    'http://localhost/scafi-angular/scafi-api/permisos.php';

  private cache = new Map<number, Observable<any>>();

  constructor(
    private http: HttpClient
  ) {}

  obtenerPorRol(idRol: number): Observable<any> {

    const rol = Number(idRol);

    if (!rol) {
      return of({ ok: false, permisos: [] });
    }

    const existente = this.cache.get(rol);

    if (existente) {
      return existente;
    }

    const solicitud = this.http.get<any>(
      `${this.api}?idRol=${rol}`
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.cache.set(rol, solicitud);

    return solicitud;
  }

  refrescarPorRol(idRol: number): Observable<any> {

    const rol = Number(idRol);

    if (!rol) {
      return of({ ok: false, permisos: [] });
    }

    const solicitud = this.http.get<any>(
      `${this.api}?idRol=${rol}`
    ).pipe(
      tap(() => this.cache.delete(rol)),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.cache.set(rol, solicitud);

    return solicitud;
  }

  limpiarCache(): void {
    this.cache.clear();
  }
}
