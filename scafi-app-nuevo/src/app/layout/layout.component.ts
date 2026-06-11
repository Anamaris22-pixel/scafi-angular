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

  permisos: any[] = [];

  permisosCargados = false;

  intervalo: any;

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

    this.intervalo =
      setInterval(() => {

        this.cargarNotificaciones();

      }, 15000);

  }

  ngOnDestroy(): void {

    if (this.intervalo) {

      clearInterval(
        this.intervalo
      );

    }

  }
  marcarLeida(id: number) {

  this.notiService
    .marcarLeida(id)
    .subscribe({

      next: () => {

        this.cargarNotificaciones();

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