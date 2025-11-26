import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalService } from '../../../shared/services/confirm-modal.service';
import { ReservasService, ReservaDto } from '../../services/reservas.service';
import { first } from 'rxjs/operators';
import { AlojamientoService } from '../../services/alojamiento.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { ApiService } from '../../../core/services/api.service';

interface ReservaUI {
  id: number;
  folio?: string;
  hospedaje: string;
  huesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  total: number;
  estado: 'Confirmada' | 'Pendiente' | 'PagoEnRevision' | 'Cancelada' | 'Rechazada';
  alojamientoId?: number;
  comprobanteUrl?: string;
}

@Component({
  selector: 'app-gestion-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-reservas.component.html',
  styleUrl: './gestion-reservas.component.scss'
})
export class GestionReservasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private modalService = inject(ConfirmModalService);
  private reservasService = inject(ReservasService);
  private alojamientosService = inject(AlojamientoService);
  private userService = inject(UserService);
  private api = inject(ApiService);

  searchTerm = '';
  hospedajeFiltro: string | null = null;
  estadoFiltro: string = '';
  readonly estadosPosibles: string[] = ['Pendiente','PagoEnRevision','Confirmada','Rechazada','Cancelada'];
  detalleAbierto = false;
  reservaSeleccionada: ReservaUI | null = null;

  reservas: ReservaUI[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    this.hospedajeFiltro = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.error = null;
    const alojamientoId = this.hospedajeFiltro ? parseInt(this.hospedajeFiltro, 10) : undefined;
    if (alojamientoId) {
      this.reservasService.listByAlojamiento(alojamientoId).pipe(first()).subscribe({
        next: (items: ReservaDto[]) => {
          this.reservas = (items || []).map(this.mapDtoToUI);
          this.loading = false;
          this.cargarClientes();
        },
        error: () => {
          this.error = 'No se pudieron cargar las reservas';
          this.loading = false;
        }
      });
    } else {
      // Agrega todas las reservas de todos los alojamientos del oferente
      this.alojamientosService.listMine().pipe(
        switchMap(list => {
          const ids = (list || []).map(a => a.id).filter(Boolean) as number[];
          if (!ids.length) return of([] as ReservaDto[]);
          return forkJoin(ids.map(id => this.reservasService.listByAlojamiento(id))).pipe(
            map(arrays => arrays.flat())
          );
        }),
        first(),
        catchError(() => {
          this.error = 'No se pudieron cargar las reservas';
          this.loading = false;
          return of([] as ReservaDto[]);
        })
      ).subscribe((items: ReservaDto[]) => {
        this.reservas = (items || []).map(this.mapDtoToUI);
        this.loading = false;
        this.cargarClientes();
      });
    }
  }

  private cargarClientes() {
    const ids = Array.from(new Set(this.reservas.map(r => (r as any)['clienteId']).filter(Boolean)));
    if (!ids.length) return;
    forkJoin(ids.map(id => this.userService.getCliente(id))).pipe(first()).subscribe({
      next: clientes => {
        const mapa = new Map<string, string>();
        clientes.forEach(c => {
          const nombre = c.nombre || c.nombreCompleto || c.email || '(Sin nombre)';
          if (c.id) mapa.set(c.id, nombre);
        });
        this.reservas = this.reservas.map(r => {
          const clienteId = (r as any)['clienteId'];
          return clienteId && mapa.has(clienteId) ? { ...r, huesped: mapa.get(clienteId)! } : r;
        });
      },
      error: () => {
        // Silencioso: si falla mantenemos email o placeholder
      }
    });
  }

  private mapDtoToUI = (r: ReservaDto): ReservaUI => {
    const id = (typeof r.id === 'string') ? parseInt(r.id as string, 10) : (r.id as number) || 0;
    const hospedaje = (r.hospedaje || r.alojamientoNombre || r['alojamiento'] || '');
    const huesped = (r.huesped || r.clienteNombre || r.usuarioEmail || '');
    const total = (typeof r.total === 'number') ? r.total : Number(r['montoTotal'] || 0);
    const estadoRaw = (r.estado || '').toLowerCase();
    // Normaliza estados más comunes provenientes del backend, incluyendo PagoEnRevision
    const estado: ReservaUI['estado'] = estadoRaw.includes('pago') ? 'PagoEnRevision'
      : estadoRaw.includes('pend') ? 'Pendiente'
      : estadoRaw.includes('confirm') || estadoRaw.includes('acept') ? 'Confirmada'
      : estadoRaw.includes('rechaz') ? 'Rechazada'
      : 'Cancelada';
    let comprobanteUrl = (r as any).comprobanteUrl || (r as any).ComprobanteUrl || '';
    // Si el backend devuelve una ruta relativa como "/comprobantes/xxx",
    // convertirla a una URL absoluta usando la raíz del API (quitando '/api').
    if (comprobanteUrl && !/^https?:\/\//i.test(comprobanteUrl)) {
      if (!comprobanteUrl.startsWith('/')) comprobanteUrl = '/' + comprobanteUrl;
      const apiRoot = this.api.baseUrl.replace(/\/api$/i, '');
      comprobanteUrl = `${apiRoot}${comprobanteUrl}`;
    }
    return {
      id,
      folio: r.folio,
      hospedaje,
      huesped,
      fechaEntrada: r.fechaEntrada || r['checkIn'] || '',
      fechaSalida: r.fechaSalida || r['checkOut'] || '',
      total,
      estado,
      alojamientoId: r.alojamientoId,
      comprobanteUrl: comprobanteUrl || undefined
    };
  }

  get filteredReservas(): ReservaUI[] {
    let list = this.reservas;

    if (this.hospedajeFiltro) {
      const id = parseInt(this.hospedajeFiltro, 10);
      list = list.filter(r => r.alojamientoId === id || `${r.hospedaje}` === this.hospedajeFiltro);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      // Aplica filtro por estado si se seleccionó
      if (this.estadoFiltro) {
        list = list.filter(r => r.estado === this.estadoFiltro);
      }
      return list;
    }

    list = list.filter((r) =>
      [r.folio || r.id, r.huesped, r.estado]
        .some((value) => String(value).toLowerCase().includes(term))
    );

    if (this.estadoFiltro) {
      list = list.filter(r => r.estado === this.estadoFiltro);
    }
    return list;
  }

  abrirDetalle(reserva: ReservaUI) {
    this.reservaSeleccionada = { ...reserva };
    this.detalleAbierto = true;
  }

  cerrarDetalle() {
    this.detalleAbierto = false;
    this.reservaSeleccionada = null;
  }

  confirmar(reserva: ReservaUI) {
    this.reservasService.aceptar(reserva.id).pipe(first()).subscribe({
      next: () => {
        this.toastService.success(`Reserva ${reserva.folio || reserva.id} confirmada exitosamente`);
        this.actualizarEstadoLocal(reserva.id, 'Confirmada');
        this.cerrarDetalle();
      },
      error: () => this.toastService.error('No se pudo confirmar la reserva')
    });
  }

  rechazar(reserva: ReservaUI) {
    this.modalService.confirm({
      title: '¿Rechazar reserva?',
      message: `¿Estás seguro de que deseas rechazar la reserva ${reserva.folio || reserva.id}?`,
      confirmText: 'Sí, rechazar',
      cancelText: 'Cancelar',
      isDangerous: true
    }).then(result => {
      if (result) {
        this.reservasService.rechazar(reserva.id).pipe(first()).subscribe({
          next: () => {
            this.toastService.info(`Reserva ${reserva.folio || reserva.id} rechazada`);
            this.actualizarEstadoLocal(reserva.id, 'Rechazada');
            this.cerrarDetalle();
          },
          error: () => this.toastService.error('No se pudo rechazar la reserva')
        });
      }
    });
  }

  private actualizarEstadoLocal(id: number, estado: ReservaUI['estado']) {
    const idx = this.reservas.findIndex(r => r.id === id);
    if (idx >= 0) this.reservas[idx] = { ...this.reservas[idx], estado };
  }
}
