import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ContainerAuthComponent } from './components/container-auth/container-auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';

const routes: Routes = [
  {
    path: "",
    component: ContainerAuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
        data: {
          route: "auth/login"
        }
      },
      {
        path: "registro",
        component: RegistroComponent,
        data: {
          route: "auth/registro"
        }
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
