import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface OferenteDto {
  id: string;
  nombre: string;
  correo?: string;
  telefono?: string;
  alojamientos?: number;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminOferentesService {
  private readonly api = inject(ApiService);

  list(): Observable<OferenteDto[]> {
    return this.api.get<OferenteDto[]>('/admin/oferentes');
  }

  getById(id: string): Observable<OferenteDto> {
    return this.api.get<OferenteDto>(`/admin/oferentes/${id}`);
  }

  createUsuarioOferente(payload: { email: string; password: string; nombre?: string }): Observable<any> {
    return this.api.post('/admin/oferentes/usuarios', payload);
  }

  update(id: string, payload: Partial<OferenteDto>): Observable<any> {
    return this.api.put(`/admin/oferentes/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`/admin/oferentes/${id}`);
  }

  listSolicitudes(): Observable<any[]> {
    return this.api.get<any[]>('/admin/oferentes/solicitudes');
  }

  aprobarSolicitud(id: number): Observable<any> {
    return this.api.post(`/admin/oferentes/solicitudes/${id}/aprobar`, {});
  }

  rechazarSolicitud(id: number): Observable<any> {
    return this.api.post(`/admin/oferentes/solicitudes/${id}/rechazar`, {});
  }
}
