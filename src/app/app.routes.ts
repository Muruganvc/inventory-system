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
import { SalesComponent } from './components/sales/sales.component';
import { SalesOrdersComponent } from './components/order-summary/sales-orders/sales-orders.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { SalesHistoryComponent } from './components/order-summary/sales-history/sales-history.component';
import { OrderReportsComponent } from './components/order-summary/order-reports/order-reports.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, {
        path: '', component: LayoutComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'product-list', component: ProductListComponent },
            { path: 'product', component: ProductComponent },
            {
                path: 'sales', component: SalesComponent
            },
            {
                path: 'settings', component: SettingsComponent,
                children: [
                    { path: '', redirectTo: 'change-password', pathMatch: 'full' },
                    { path: 'change-password', component: PasswordChangeComponent },
                    { path: 'user-permission', component: UserPermissionComponent },
                    { path: 'add-user', component: NewUserComponent }
                ]
            },
            {
                path: 'order-summary', component: OrderSummaryComponent,
                children: [
                    { path: '', redirectTo: 'sales-orders', pathMatch: 'full' },
                    { path: 'sales-orders', component: SalesOrdersComponent },
                    { path: 'sales-history', component: SalesHistoryComponent },
                    { path: 'order-reports', component: OrderReportsComponent }
                ]
            },

        ]
    }
];
