import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface CrearReservaDto {
  alojamientoId: number;
  fechaEntrada: string; // ISO string
  fechaSalida: string;  // ISO string
}

export interface ReservaDto {
  id?: number | string;
  folio?: string;
  estado?: string;
  alojamientoId?: number;
  alojamientoNombre?: string;
  hospedaje?: string;
  huesped?: string;
  clienteNombre?: string;
  usuarioEmail?: string;
  fechaEntrada?: string;
  fechaSalida?: string;
  total?: number;
  [key: string]: any;
}

export interface ReservaRangoDto {
  inicio: string; // ISO o 'yyyy-MM-ddTHH:mm:ss'
  fin: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly api = inject(ApiService);

  crear(payload: CrearReservaDto): Observable<any> {
    return this.api.post('/reservas', payload);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.api.patch(`/reservas/${id}/estado`, { estado });
  }

  getByFolio(folio: string): Observable<ReservaDto> {
    return this.api.get<ReservaDto>(`/reservas/folio/${folio}`);
  }

  // Lista de reservas del oferente autenticado. Admite filtro por alojamientoId.
  listForOferente(params?: { alojamientoId?: number; estado?: string }): Observable<ReservaDto[]> {
    // Mantener por compatibilidad si se usa en algún lugar; si no existe en backend, preferir listByAlojamiento
    return this.api.get<ReservaDto[]>('/reservas', params as any);
  }

  // Lista de reservas de un alojamiento específico
  listByAlojamiento(alojamientoId: number, estado?: string): Observable<ReservaDto[]> {
    const params: any = {};
    if (estado) params.estado = estado;
    return this.api.get<ReservaDto[]>(`/reservas/alojamiento/${alojamientoId}`, params);
  }

  // Lista de reservas de un cliente específico
  listByCliente(clienteId: string): Observable<ReservaDto[]> {
    return this.api.get<ReservaDto[]>(`/reservas/cliente/${clienteId}`);
  }

  // Historial completo de reservas de un cliente (ordenadas de más reciente a más antigua)
  // Backend: GET /reservas/cliente/{clienteId}/historial
  historialByCliente(clienteId: string): Observable<ReservaDto[]> {
    return this.api.get<ReservaDto[]>(`/reservas/cliente/${clienteId}/historial`);
  }

  // Rango de fechas ocupadas (estado Confirmada) para pintar calendario
  getCalendario(alojamientoId: number): Observable<ReservaRangoDto[]> {
    return this.api.get<ReservaRangoDto[]>(`/alojamientos/${alojamientoId}/calendario`);
  }

  // Reservas activas para el rol autenticado (Admin/Oferente/Cliente)
  // Ahora acepta opcionalmente `clienteId` para filtrar por cliente específico.
  activas(params?: { alojamientoId?: number; clienteId?: string }): Observable<any[]> {
    const q: any = {};
    if (params?.alojamientoId) q.alojamientoId = params.alojamientoId;
    if (params?.clienteId) q.clienteId = params.clienteId;
    return this.api.get<any[]>(`/reservas/activas`, q);
  }

  // Historial de reservas para el rol autenticado (Admin/Oferente/Cliente)
  // Ahora acepta opcionalmente `clienteId` para filtrar por cliente específico.
  historial(params?: { alojamientoId?: number; clienteId?: string }): Observable<any[]> {
    const q: any = {};
    if (params?.alojamientoId) q.alojamientoId = params.alojamientoId;
    if (params?.clienteId) q.clienteId = params.clienteId;
    return this.api.get<any[]>(`/reservas/historial`, q);
  }

  // Subir comprobante de pago (multipart/form-data con campo 'archivo')
  subirComprobante(reservaId: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.api.post(`/reservas/${reservaId}/comprobante`, form);
  }

  crearConComprobante(payload: CrearReservaDto, archivo: File): Observable<any> {
    const form = new FormData();

    // Enviar cada campo por separado (más compatible con ASP.NET)
    form.append('AlojamientoId', payload.alojamientoId.toString());
    form.append('FechaEntrada', payload.fechaEntrada);
    form.append('FechaSalida', payload.fechaSalida);
    form.append('Comprobante', archivo, archivo.name);

    // Importante: NO agregues headers manualmente → deja que el navegador genere el boundary
    return this.api.post('/reservas/crear-con-comprobante', form);
  }

  aceptar(id: number): Observable<any> {
    // Usa el endpoint genérico de cambio de estado a 'Confirmada'
    return this.cambiarEstado(id, 'Confirmada');
  }

  rechazar(id: number): Observable<any> {
    // Usa el endpoint genérico de cambio de estado a 'Rechazada'
    return this.cambiarEstado(id, 'Rechazada');
  }
}
