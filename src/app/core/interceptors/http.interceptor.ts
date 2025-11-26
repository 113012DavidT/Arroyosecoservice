import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = /\/Auth\/(login|register)$/i.test(req.url);
  const token = auth.getToken();

  const reqToSend = !isAuthEndpoint && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error.status, error.url, error.error);
      
      // If unauthorized on a protected call, clear token and redirect to appropriate login
      // BUT: No hacer logout en POST de creación de reservas (podría ser error del backend, no de auth)
      if (error.status === 401 && !isAuthEndpoint && token) {
        const isReservationEndpoint = /\/(reservas|reservasGastronomia)/i.test(req.url) && req.method === 'POST';
        
        // Si NO es un endpoint de reserva, hacer logout
        if (!isReservationEndpoint) {
          console.warn('Logout automático por 401');
          auth.logout();
          const url = req.url.toLowerCase();
          if (url.includes('/admin/')) {
            router.navigateByUrl('/admin/login');
          } else if (url.includes('/oferente/')) {
            router.navigateByUrl('/oferente/login');
          } else {
            router.navigateByUrl('/cliente/login');
          }
        } else {
          console.warn('401 en endpoint de reserva - no hacer logout automático');
        }
      }
      return throwError(() => error);
    })
  );
};
