import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './notificaciones.component.html'
})
export class NotificacionesComponent implements OnInit {

  total = 0;
  cargando = true;

  // Panel pequeño de la campana
  mostrar = false;

  // Ventana completa de notificaciones
  mostrarTodas = false;

  notificaciones: any[] = [];

  notificacionSeleccionada: any = null;

  // Usuario actualmente autenticado
  usuarioId = 0;

  api = 'http://localhost/scafi-angular/scafi-api/notificaciones.php';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioId();

    // Cargar automáticamente al entrar a la página.
    // El detectChanges() evita que la vista quede mostrando
    // el spinner hasta que el usuario pulse Actualizar.
    this.cargarNotificaciones();
  }

  // ==================================================
  // OBTENER USUARIO ACTUAL
  // ==================================================

  obtenerUsuarioId(): void {

    const claves = [
      'usuario_id',
      'idUsuario',
      'usuarioId',
      'user_id',
      'userId',
      'id_usuario'
    ];

    for (const clave of claves) {

      const valor = localStorage.getItem(clave);

      if (valor && !isNaN(Number(valor))) {
        this.usuarioId = Number(valor);
        console.log('ID usuario para notificaciones:', this.usuarioId);
        return;
      }
    }

    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {

      try {

        const usuario = JSON.parse(usuarioGuardado);

        const id =
          usuario?.id ??
          usuario?.usuario_id ??
          usuario?.idUsuario;

        if (
          id !== undefined &&
          id !== null &&
          !isNaN(Number(id))
        ) {
          this.usuarioId = Number(id);
          console.log('ID usuario para notificaciones:', this.usuarioId);
          return;
        }

      } catch (error) {
        console.error('No se pudo leer el usuario guardado:', error);
      }
    }

    console.warn(
      'No se encontró el ID del usuario en localStorage.'
    );
  }

  // ==================================================
  // CARGAR NOTIFICACIONES DEL USUARIO ACTUAL
  // ==================================================

  cargarNotificaciones(): void {

    this.cargando = true;

    if (!this.usuarioId) {

      this.notificaciones = [];
      this.total = 0;
      this.cargando = false;

      return;
    }

    const url =
      `${this.api}?usuario_id=${encodeURIComponent(this.usuarioId)}`;

    this.http.get<any>(url).subscribe({

      next: (resp) => {

        console.log('Respuesta notificaciones:', resp);

        if (resp?.ok) {

          this.notificaciones =
            resp.notificaciones || [];

          this.actualizarContador();

          if (this.notificacionSeleccionada) {

            const actualizada =
              this.notificaciones.find(
                n =>
                  Number(n.id) ===
                  Number(this.notificacionSeleccionada.id)
              );

            if (actualizada) {
              this.notificacionSeleccionada = actualizada;
            }
          }

        } else {

          this.notificaciones = [];
          this.total = 0;
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error cargando notificaciones:',
          error
        );

        this.notificaciones = [];
        this.total = 0;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==================================================
  // CONTADOR SOLO NO LEÍDAS
  // ==================================================

  actualizarContador(): void {

    this.total =
      this.notificaciones.filter(
        n => n.visto_por == null
      ).length;
  }

  // ==================================================
  // SELECCIONAR NOTIFICACIÓN
  // ==================================================

  seleccionarNotificacion(
    notificacion: any
  ): void {

    this.notificacionSeleccionada =
      notificacion;

    // Al abrir/clickear una notificación,
    // se marca como leída SOLO para este usuario.
    if (notificacion.visto_por == null) {
      this.marcarComoLeida(notificacion);
    }
  }

  // ==================================================
  // MARCAR COMO LEÍDA
  // ==================================================

  marcarComoLeida(
    notificacion: any
  ): void {

    if (!notificacion || !this.usuarioId) {
      return;
    }

    if (notificacion.visto_por != null) {
      return;
    }

    const datos = {
      id: Number(notificacion.id),
      usuario_id: Number(this.usuarioId)
    };

    this.http.post<any>(
      this.api,
      datos
    ).subscribe({

      next: (resp) => {

        console.log(
          'Respuesta marcar leída:',
          resp
        );

        if (resp?.ok) {

          // Actualización inmediata de la pantalla
          notificacion.visto_por =
            this.usuarioId;

          this.actualizarContador();
        }
      },

      error: (error) => {

        console.error(
          'Error marcando notificación como leída:',
          error
        );
      }
    });
  }

  // ==================================================
  // ESTADO
  // ==================================================

  estaLeida(
    notificacion: any
  ): boolean {

    return notificacion?.visto_por != null;
  }

  estaNoLeida(
    notificacion: any
  ): boolean {

    return notificacion?.visto_por == null;
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
