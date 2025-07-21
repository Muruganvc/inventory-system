import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🔒 Check login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 🔐 Check roles if provided
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  const isAuthorized = !requiredRoles || authService.hasRole(requiredRoles);

  if (!isAuthorized) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
