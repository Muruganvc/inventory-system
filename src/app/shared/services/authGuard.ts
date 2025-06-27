// auth.guard.ts (functional guard)
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
 
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Role-based check (if roles are defined in route)
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && !auth.hasRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
