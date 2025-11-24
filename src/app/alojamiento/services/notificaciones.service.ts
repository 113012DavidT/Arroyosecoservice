import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

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
    return this.api.get<NotificacionDto[]>(`/notificaciones`);
  }

  marcarLeida(id: number | string): Observable<any> {
    return this.api.put(`/notificaciones/${id}/leer`, {});
  }

  eliminar(id: number | string): Observable<any> {
    return this.api.delete(`/notificaciones/${id}`);
  }
}
