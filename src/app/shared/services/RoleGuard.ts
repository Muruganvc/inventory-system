// role.guard.ts
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    Router,
    UrlTree
} from '@angular/router'; // your token/role service
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
        const requiredRoles = route.data['roles'] as string[];

        if (this.authService.hasRole(requiredRoles)) {
            return true;
        }

        // Redirect if not authorized
        return this.router.parseUrl('/unauthorized');  
    }
}
