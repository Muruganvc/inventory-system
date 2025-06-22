import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordChangeComponent } from './components/settings/password-change/password-change.component';
import { UserPermissionComponent } from './components/settings/user-permission/user-permission.component';
import { NewUserComponent } from './components/settings/new-user/new-user.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, {
        path: '', component: LayoutComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'product-list', component: ProductListComponent },
            { path: 'product', component: ProductComponent },
            {
                path: 'settings', component: SettingsComponent,
                children: [
                    { path: '', redirectTo: 'change-password', pathMatch: 'full' },
                    { path: 'change-password', component: PasswordChangeComponent },
                    { path: 'user-permission', component: UserPermissionComponent },
                    { path: 'add-user', component: NewUserComponent }
                ]
            },
        ]
    }
];
