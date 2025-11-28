import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface NotificacionDto {
  id: number | string;
  mensaje: string;
  titulo?: string;
  fecha?: string;
  leida?: boolean;
  tipo?: string;
  urlAccion?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly api = inject(ApiService);

  list(soloNoLeidas = false): Observable<NotificacionDto[]> {
    // Intento principal en minúsculas; si falla, probar variante con mayúscula
    return this.api.get<NotificacionDto[]>(`/notificaciones`).pipe(
      catchError(err => this.api.get<NotificacionDto[]>(`/Notificaciones`))
    );
  }

  marcarLeida(id: number | string): Observable<any> {
    // Estrategia tolerante: probar PUT minúsculas → PATCH → PUT mayúscula → POST
    return this.api.put(`/notificaciones/${id}/leer`, {}).pipe(
      catchError(err1 => this.api.patch(`/notificaciones/${id}/leer`, {}).pipe(
        catchError(err2 => this.api.put(`/Notificaciones/${id}/leer`, {}).pipe(
          catchError(err3 => this.api.post(`/notificaciones/${id}/leer`, {}).pipe(
            catchError(() => throwError(() => err1))
          ))
        ))
      ))
    );
  }

  eliminar(id: number | string): Observable<any> {
    return this.api.delete(`/notificaciones/${id}`);
  }
}
