import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'cadastroUsuario',
    loadComponent: () => import('./cadastroUsuario/cadastroUsuario.component').then(m => m.cadastroUsuarioComponent),
    data: {
      title: 'Crie sua conta'
    }
  }
];
