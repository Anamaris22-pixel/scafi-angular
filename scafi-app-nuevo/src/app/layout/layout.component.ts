import {
  ChangeDetectorRef
} from '@angular/core';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule,
  Router
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../core/services/auth.service';

import {
  NotificacionesService
} from '../core/services/notificaciones.service';

import {
  PermisosService
} from '../core/services/permisos.service';

@Component({
  selector: 'app-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl: './layout.component.html'
})

export class LayoutComponent
implements OnInit, OnDestroy {

  openMenu = '';

  searchTerm = '';

  showNoti = false;

  showMsg = false;

  notificaciones: any[] = [];

  totalNoLeidas = 0;

  permisos: any[] = [];

  permisosCargados = false;

  intervalo: any;
  escuchandoVentana = false;

  user: any = null;

  constructor(

  private auth: AuthService,

  private router: Router,

  private notiService: NotificacionesService,

  private permisosService: PermisosService,

  private cdr: ChangeDetectorRef

) {}

  ngOnInit(): void {

    // ======================
    // USUARIO
    // ======================

    const usuarioGuardado =
      localStorage.getItem('usuario');

    console.log(
      'USUARIO STORAGE =>',
      usuarioGuardado
    );

    if (usuarioGuardado) {

      this.user =
        JSON.parse(usuarioGuardado);

      console.log(
        'USUARIO PARSEADO =>',
        this.user
      );

    }

    if (!this.user) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }

    // ======================
    // PERMISOS
    // ======================

    const rol =
      Number(this.user.idRol);

    this.permisosService
      .obtenerPorRol(rol)
      .subscribe({

        next: (res: any) => {

  console.log('PERMISOS =>', res);

  if (res.ok) {

    this.permisos =
      res.permisos || [];

  }

  setTimeout(() => {

    this.permisosCargados = true;

  });

},        error: (err: any) => {

          console.log(
            'ERROR PERMISOS =>',
            err
          );

          this.permisos = [];

          setTimeout(() => {

  this.permisosCargados = true;

});
        }

      });

    // ======================
    // NOTIFICACIONES
    // ======================

    this.cargarNotificaciones();

    // Actualización ligera: no recargar si la pestaña está oculta.
    this.intervalo =
      setInterval(() => {

        if (!document.hidden) {
          this.actualizarNotificaciones();

        }

      }, 30000);

    // Cuando el usuario vuelve a la pestaña, actualizar de inmediato.
    this.escuchandoVentana = true;
    window.addEventListener('focus', this.actualizarAlVolver.bind(this));

  }

  ngOnDestroy(): void {

    if (this.intervalo) {

      clearInterval(
        this.intervalo
      );

    }

    if (this.escuchandoVentana) {
      window.removeEventListener('focus', this.actualizarAlVolver);
      this.escuchandoVentana = false;
    }

  }

  private actualizarAlVolver = (): void => {
    if (!document.hidden) {
      this.actualizarNotificaciones();
    }
  };

  private actualizarNotificaciones(): void {
    if (!this.user) {
      return;
    }

    this.notiService
      .refrescar(Number(this.user.id))
      .subscribe({
        next: (res: any) => {
          if (res?.ok) {
            this.notificaciones = res.notificaciones || [];
            this.totalNoLeidas = Number(
              res.total ??
              this.notificaciones.filter(
                (n: any) => n.visto_por == null
              ).length
            );
            this.cdr.markForCheck();
          }
        },
        error: () => {
          // No borrar las notificaciones actuales por un fallo temporal.
        }
      });
  }

  marcarLeida(id: number) {

  this.notiService
    .marcarLeida(id, Number(this.user?.id))
    .subscribe({

      next: (res: any) => {

        if (res?.ok) {

          const notificacion =
            this.notificaciones.find(
              (n: any) => Number(n.id) === Number(id)
            );

          if (notificacion) {
            notificacion.visto_por =
              Number(this.user?.id);
          }

          // Actualizar inmediatamente el contador.
          this.totalNoLeidas =
            this.notificaciones.filter(
              (n: any) => n.visto_por == null
            ).length;

          // Confirmar el estado real sin borrar la vista durante la petición.
          this.actualizarNotificaciones();

        } else {

          console.log(
            'No se pudo marcar la notificación:',
            res
          );

        }

      },

      error: (err: any) => {

        console.log(err);

      }

    });

}
  // ======================
  // ROL
  // ======================

  getRolNombre(): string {

    const rol =
      Number(this.user?.idRol);

    switch (rol) {

      case 1:
        return 'Propietario';

      case 2:
        return 'Administrador';

      case 3:
        return 'Recolector';

      default:
        return 'Usuario';

    }

  }

  // ======================
  // PERMISOS
  // ======================

  tienePermiso(
    modulo: string
  ): boolean {

    return this.permisos.some(

      (p: any) =>

        p.modulo?.toLowerCase()
        ===
        modulo.toLowerCase()

        &&

        Number(p.verModulo) === 1

    );

  }

  // ======================
  // TOGGLE
  // ======================

  toggle(menu: string) {

    this.openMenu =

      this.openMenu === menu

        ? ''

        : menu;

  }

  toggleNoti() {

    this.showNoti =
      !this.showNoti;

  }

  toggleMsg() {

    this.showMsg =
      !this.showMsg;

  }

  // ======================
  // DESTINO DE NOTIFICACIÓN
  // ======================

  obtenerDestinoNotificacion(n: any): {
    ruta: string;
    queryParams?: any;
  } {

    const titulo =
      String(n?.titulo || '').toLowerCase();

    const mensaje =
      String(n?.mensaje || '');

    // Stock: buscar exactamente el insumo mencionado.
    if (
      titulo.includes('stock') ||
      mensaje.toLowerCase().includes('insumo ')
    ) {

      const coincidencia =
        mensaje.match(
          /insumo\s+(.+?)\s+(?:tiene|ha vuelto|presenta)/i
        );

      const nombreInsumo =
        coincidencia?.[1]?.trim() || '';

      return {
        ruta: '/insumos',
        queryParams: nombreInsumo
          ? { buscar: nombreInsumo }
          : undefined
      };

    }

    // Mensajes.
    if (
      titulo.includes('mensaje') ||
      mensaje.toLowerCase().includes('mensaje nuevo')
    ) {
      return {
        ruta: '/mensajes'
      };
    }

    // Ventas.
    if (titulo.includes('venta')) {
      return {
        ruta: '/ventas'
      };
    }

    // Clientes.
    if (titulo.includes('cliente')) {
      return {
        ruta: '/clientes'
      };
    }

    // Proveedores.
    if (titulo.includes('proveedor')) {
      return {
        ruta: '/proveedores'
      };
    }

    // Movimientos.
    if (
      titulo.includes('movimiento') ||
      mensaje.toLowerCase().includes('movimiento')
    ) {
      return {
        ruta: '/movimientos'
      };
    }

    // Por defecto, abrir el centro de notificaciones.
    return {
      ruta: '/notificaciones'
    };
  }

  abrirNotificacion(n: any): void {

    if (!n) {
      return;
    }

    // Primero la marcamos como leída.
    if (n.visto_por == null) {
      this.marcarLeida(n.id);
    }

    const destino =
      this.obtenerDestinoNotificacion(n);

    this.showNoti = false;

    this.router.navigate(
      [destino.ruta],
      destino.queryParams
        ? { queryParams: destino.queryParams }
        : undefined
    );
  }

  // ======================
  // NOTIFICACIONES
  // ======================

  cargarNotificaciones() {

    if (!this.user) {

      this.notificaciones = [];

      return;

    }

    this.notiService
      .obtener(this.user.id)
      .subscribe({

        next: (res: any) => {

          console.log(
            'NOTIFICACIONES =>',
            res
          );

          if (res && res.ok) {

            this.notificaciones =
              res.notificaciones || [];

            // El contador debe mostrar SOLO las no leídas.
            this.totalNoLeidas =
              Number(res.total ?? this.notificaciones.filter(
                (n: any) => n.visto_por == null
              ).length);

          } else {

            this.notificaciones = [];

          }

        },

        error: (err: any) => {

          console.log(
            'ERROR NOTI =>',
            err
          );

          this.notificaciones = [];

        }

      });

  }

  // ======================
  // SEARCH
  // ======================

  search() {

    const term =

      this.searchTerm
        .toLowerCase()
        .trim();

    const routes: any = {

      dashboard:
        '/dashboard',

      recolectores:
        '/recolectores',

      cultivos:
        '/cultivos',

      recoleccion:
        '/recoleccion',

      inventario:
        '/inventario',

      ventas:
        '/ventas',

      reportes:
        '/reportes',

      mensajes:
        '/mensajes',

      configuracion:
        '/configuracion',

      produccion:
        '/produccion'

    };

    for (const key in routes) {

      if (
        key.includes(term)
      ) {

        this.router.navigate([
          routes[key]
        ]);

        return;

      }

    }

  }

  // ======================
  // LOGOUT
  // ======================

  logout() {

    if (this.intervalo) {

      clearInterval(
        this.intervalo
      );

    }

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);

  }

}