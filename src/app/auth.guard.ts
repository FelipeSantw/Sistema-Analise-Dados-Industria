import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('Verificando autenticação...')
    return new Observable<boolean>(observer => {
      const auth = getAuth();
      console.log('Verificando autenticação...');
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log('Verificando autenticação...');
          observer.next(true);
        } else {
          console.log('Usuário não autenticado');
          this.router.navigate(['/login']);
          observer.next(false); 
        }
        observer.complete();
      });
    });
  }
}