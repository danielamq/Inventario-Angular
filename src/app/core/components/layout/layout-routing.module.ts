import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
    {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
        {
        path: 'users',
        loadChildren: () => import('../../../modules/users/users.module').then(m => m.UsersModule)
        },
        {
        path: 'sales',
        loadChildren: () => import('../../../modules/sales/sales.module').then(m => m.SalesModule)
        },
        {
        path: 'inventory',
        loadChildren: () => import('../../../modules/inventory/inventory.module').then(m => m.InventoryModule)
        },
        {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
        }
    ]
    },
    {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full'
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
