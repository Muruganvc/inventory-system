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
import { authGuard } from './shared/services/authGuard';
import { InvoiceComponent } from './components/order-summary/invoice/invoice.component';
import { BackupComponent } from './components/backup/backup.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CompanyListComponent } from './components/inventory/company/company-list/company-list.component';
import { CategoryListComponent } from './components/inventory/category/category-list/category-list.component';
import { ProductCategoryListComponent } from './components/inventory/product-category/product-category-list/product-category-list.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { UserListComponent } from './components/settings/new-user/user-list/user-list.component';
import { UserMenuPermissionComponent } from './components/settings/user-menu-permission/user-menu-permission.component';
import { CompanyComponent } from './components/inventory/company/company.component';
import { CategoryComponent } from './components/inventory/category/category.component';
import { ProductCategoryComponent } from './components/inventory/product-category/product-category.component';
import { ProductAvailableQauntityComponent } from './components/dashboard/product-available-qauntity/product-available-qauntity.component';
import { BulkcreateCompanyCategoryProductComponent } from './components/inventory/bulkcreate-company-category-product/bulkcreate-company-category-product.component';
import { AuditTableViewComponent } from './components/dashboard/audit-table-view/audit-table-view.component';
import { InventoryCompanyInfoComponent } from './components/inventory-company-info/inventory-company-info.component';
import { RoleGuard } from './shared/services/RoleGuard';
import { UnauthorizedAccessComponent } from './components/unauthorized-access/unauthorized-access.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, {
        path: '', component: LayoutComponent, canActivate: [authGuard], children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'product-availability', component: ProductAvailableQauntityComponent },
            { path: 'product-list', component: ProductListComponent },
            { path: 'product', component: ProductComponent },
            {
                path: 'sales', component: SalesComponent
            },
            {
                path: 'inventory', component: InventoryComponent,
                children: [
                    { path: '', redirectTo: 'company-list', pathMatch: 'full' },
                    { path: 'company-list', component: CompanyListComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'company', component: CompanyComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'category-list', component: CategoryListComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'category', component: CategoryComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'product-category-list', component: ProductCategoryListComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'product-category', component: ProductCategoryComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } },
                    { path: 'bulk-product-category', component: BulkcreateCompanyCategoryProductComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin', 'Admin'] } }
                ]
            },
            {
                path: 'setting', component: SettingsComponent,
                children: [
                    { path: '', redirectTo: 'change-password', pathMatch: 'full' },
                    { path: 'change-password', component: PasswordChangeComponent },
                    { path: 'user-permission', component: UserPermissionComponent },
                    { path: 'user-list', component: UserListComponent },
                    { path: 'user', component: NewUserComponent },
                    { path: 'profile', component: ProfileComponent },
                    { path: 'user-menu-permission', component: UserMenuPermissionComponent },
                    { path: 'audit-table-view', component: AuditTableViewComponent },
                    { path: 'inventory-company-info', component: InventoryCompanyInfoComponent, canActivate: [RoleGuard], data: { roles: ['SuperAdmin'] } }
                ]
            },
            {
                path: 'order-summary', component: OrderSummaryComponent,
                children: [
                    { path: '', redirectTo: 'sales-orders', pathMatch: 'full' },
                    { path: 'sales-orders', component: SalesOrdersComponent },
                    { path: 'sales-history', component: SalesHistoryComponent },
                    { path: 'sales-reports', component: OrderReportsComponent }
                ]
            },
            { path: 'data-backup', component: BackupComponent },
        ]
    },
    { path: 'invoice-print', component: InvoiceComponent },
    { path: 'unauthorized', component: UnauthorizedAccessComponent },
    { path: '**', component: LoginComponent }
];
