import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasGastronomiaService, ReservaGastronomiaDto } from '../../services/reservas-gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-oferente-reservas-gastronomia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oferente-reservas-gastronomia.component.html',
  styleUrl: './oferente-reservas-gastronomia.component.scss'
})
export class OferenteReservasGastronomiaComponent implements OnInit {
  reservas: ReservaGastronomiaDto[] = [];
  loading = false;
  tab: 'pendientes' | 'confirmadas' | 'todas' = 'pendientes';

  constructor(
    private reservasService: ReservasGastronomiaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  private loadReservas() {
    this.loading = true;
    this.reservasService.activas().pipe(first()).subscribe({
      next: (data) => {
        this.reservas = data || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Error al cargar reservas');
        this.loading = false;
      }
    });
  }

  get filteredReservas() {
    switch (this.tab) {
      case 'pendientes':
        return this.reservas.filter(r => r.estado === 'Pendiente');
      case 'confirmadas':
        return this.reservas.filter(r => r.estado === 'Confirmada');
      default:
        return this.reservas;
    }
  }

  confirmar(id?: number) {
    if (!id) return;
    this.reservasService.confirmar(id).pipe(first()).subscribe({
      next: () => {
        this.toast.success('Reserva confirmada');
        this.loadReservas();
      },
      error: () => this.toast.error('Error al confirmar')
    });
  }

  cancelar(id?: number) {
    if (!id || !confirm('¿Cancelar esta reserva?')) return;
    this.reservasService.cancelar(id).pipe(first()).subscribe({
      next: () => {
        this.toast.success('Reserva cancelada');
        this.loadReservas();
      },
      error: () => this.toast.error('Error al cancelar')
    });
  }

  getEstadoClass(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'confirmada': return 'confirmada';
      case 'pendiente': return 'pendiente';
      case 'cancelada': return 'cancelada';
      default: return '';
    }
  }
}
