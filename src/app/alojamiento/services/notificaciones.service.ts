import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface NotificacionDto {
  id: number | string;
  mensaje: string;
  titulo?: string;
  fecha?: string;
  leida?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly api = inject(ApiService);

  list(soloNoLeidas = false): Observable<NotificacionDto[]> {
    return this.api.get<NotificacionDto[]>(`/Notificaciones`, { soloNoLeidas });
  }

  marcarLeida(id: number | string, body: { mensaje?: string } = {}): Observable<any> {
    return this.api.patch(`/Notificaciones/${id}/leer`, body);
  }

  eliminar(id: number | string): Observable<any> {
    return this.api.delete(`/Notificaciones/${id}`);
  }
}
