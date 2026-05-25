import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService }
from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const auth =
    inject(AuthService);

  const router =
    inject(Router);

  const user =
    auth.getUser();

  if (!user) {

    router.navigate([
      '/login'
    ]);

    return false;

  }

  const idRol =
    Number(user.idRol);

  let rol = '';

  switch (idRol) {

    case 1:
      rol = 'Propietario';
      break;

    case 2:
      rol = 'Administrador';
      break;

    case 3:
      rol = 'Recolector';
      break;

    default:
      rol = 'Usuario';

  }

  const rolesPermitidos =
    route.data?.['roles'] || [];

  if (
    rolesPermitidos.includes(rol)
  ) {

    return true;

  }

  router.navigate([
    '/dashboard'
  ]);

  return false;

};