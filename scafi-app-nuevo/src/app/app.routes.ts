import { Routes } from '@angular/router';

import { LayoutComponent }
from './layout/layout.component';

import { roleGuard }
from './core/guards/role.guard';

import { authGuard }
from './core/guards/auth.guard';


export const routes: Routes = [

// =========================
// LOGIN
// =========================
{
  path: 'login',

  loadComponent: () =>
    import('./pages/login/login.component')
      .then(m => m.LoginComponent)
},

// =========================
// RECUPERAR PASSWORD
// =========================
{
path: 'recuperar-password',
loadComponent: () =>
  import('./pages/recuperar-password/recuperar-password.component')
  .then(m => m.RecuperarPasswordComponent)
},

// =========================
// APP PROTEGIDA
// =========================
{
  path: '',

  component: LayoutComponent,

  canActivate: [
    authGuard
  ],

  children: [

    // =========================
    // DASHBOARD
    // =========================
    {
      path: 'dashboard',

      loadComponent: () =>
        import('./pages/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
    },

    // =========================
    // RECOLECTORES
    // =========================
    {
      path: 'recolectores',

      loadComponent: () =>
        import('./pages/recolectores/recolectores.component')
          .then(m => m.RecolectoresComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // CULTIVOS
    // =========================
    {
      path: 'cultivos',

      loadComponent: () =>
        import('./pages/cultivos/cultivos.component')
          .then(m => m.CultivosComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // LOTES
    // =========================
    {
      path: 'lotes',

      loadComponent: () =>
        import('./pages/lotes/lotes.component')
          .then(m => m.LotesComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // RECOLECCION
    // =========================
    {
      path: 'recoleccion',

      loadComponent: () =>
        import('./pages/recoleccion/recoleccion.component')
          .then(m => m.RecoleccionComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador',
          'Recolector'
        ]
      }
    },

    // =========================
    // INSUMOS
    // =========================
    {
      path: 'insumos',

      loadComponent: () =>
        import('./pages/insumos/insumos.component')
          .then(m => m.InsumosComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // PROVEEDORES
    // =========================
    {
      path: 'proveedores',

      loadComponent: () =>
        import('./pages/proveedores/proveedores.component')
          .then(m => m.ProveedoresComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // MOVIMIENTOS
    // =========================
    {
      path: 'movimientos',

      loadComponent: () =>
        import('./pages/movimientos/movimientos.component')
          .then(m => m.MovimientosComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // VENTAS
    // =========================
    {
      path: 'ventas',

      loadComponent: () =>
        import('./pages/ventas/ventas.component')
          .then(m => m.VentasComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // CLIENTES
    // =========================
    {
      path: 'clientes',

      loadComponent: () =>
        import('./pages/clientes/clientes.component')
          .then(m => m.ClientesComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador'
        ]
      }
    },

    // =========================
    // MENSAJES
    // =========================
    {
      path: 'mensajes',

      loadComponent: () =>
        import('./pages/mensajes/mensajes.component')
          .then(m => m.MensajesComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          'Administrador',
          'Recolector'
        ]
      }
    },

    // =========================
    // NOTIFICACIONES
    // =========================
    {
      path: 'notificaciones',

      loadComponent: () =>
        import('./pages/notificaciones/notificaciones.component')
          .then(m => m.NotificacionesComponent)
    },

    // =========================
    // USUARIOS
    // =========================
    {
      path: 'usuarios',

      loadComponent: () =>
        import('./pages/usuarios/usuarios.component')
          .then(m => m.UsuariosComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario'
        ]
      }
    },
          // =========================
// REPORTES
// =========================

{
path: 'reporte-ventas',

loadComponent: () =>
  import('./pages/reporte-ventas/reporte-ventas.component')
    .then(m => m.ReporteVentasComponent),

canActivate: [
  roleGuard
],

data: {
  roles: [
    'Propietario',
    'Administrador'
  ]
}
},

{
path: 'reporte-inventario',

loadComponent: () =>
  import('./pages/reporte-inventario/reporte-inventario.component')
    .then(m => m.ReporteInventarioComponent),

canActivate: [
  roleGuard
],

data: {
  roles: [
    'Propietario',
    'Administrador'
  ]
}
},

{
path: 'reporte-produccion',

loadComponent: () =>
  import('./pages/reporte-produccion/reporte-produccion.component')
    .then(m => m.ReporteProduccionComponent),

canActivate: [
  roleGuard
],

data: {
  roles: [
    'Propietario',
    'Administrador'
  ]
}
},
    // =========================
    // CONFIGURACION
    // =========================
    {
      path: 'configuracion',

      loadComponent: () =>
        import('./pages/configuracion/configuracion.component')
          .then(m => m.ConfiguracionComponent),

      canActivate: [
        roleGuard
      ],

      data: {
        roles: [
          'Propietario',
          
        ]
      }
    },

// =========================
// SEGURIDAD
// =========================

{
  path: 'seguridad',

  loadComponent: () =>
    import('./pages/configuracion/seguridad/seguridad')
      .then(m => m.SeguridadComponent),

  canActivate: [
    roleGuard
  ],

  data: {
    roles: [
      'Propietario'
    ]
  }
},
    // =========================
    // SOPORTE
    // =========================
    {
      path: 'soporte',

      loadComponent: () =>
        import('./pages/soporte/soporte.component')
          .then(m => m.SoporteComponent)
    },

    // =========================
    // REDIRECCION INTERNA
    // =========================
    {
      path: '',

      redirectTo: 'dashboard',

      pathMatch: 'full'
    }

  ]
},

// =========================
// RUTA NO ENCONTRADA
// =========================
{
  path: '**',

  redirectTo: 'login'
}

];