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
    path: '',
    loadComponent: () => import('../../layout/default-layout/default-layout.component').then(m => m.DefaultLayoutComponent),
    children: [
      {
        path: 'aboutus',
        loadComponent: () => import('./aboutus/aboutus.component').then(m => m.AboutUsComponent),
        data: {
          title: 'About Us Page'
        }
      }
    ]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  }
];
