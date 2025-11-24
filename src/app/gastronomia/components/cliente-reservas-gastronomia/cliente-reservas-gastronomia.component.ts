import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasGastronomiaService, ReservaGastronomiaDto } from '../../services/reservas-gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cliente-reservas-gastronomia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-reservas-gastronomia.component.html',
  styleUrl: './cliente-reservas-gastronomia.component.scss'
})
export class ClienteReservasGastronomiaComponent implements OnInit {
  reservasActivas: ReservaGastronomiaDto[] = [];
  reservasHistorial: ReservaGastronomiaDto[] = [];
  loading = false;
  activeTab: 'activas' | 'historial' = 'activas';

  constructor(
    private reservasService: ReservasGastronomiaService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  private loadReservas() {
    this.loading = true;
    
    // Cargar reservas activas
    this.reservasService.activas().pipe(first()).subscribe({
      next: (data) => {
        this.reservasActivas = data || [];
      },
      error: () => {
        this.toast.error('Error al cargar reservas activas');
      }
    });

    // Cargar historial
    this.reservasService.historial().pipe(first()).subscribe({
      next: (data) => {
        this.reservasHistorial = data || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Error al cargar historial');
        this.loading = false;
      }
    });
  }

  cancelarReserva(reserva: ReservaGastronomiaDto) {
    if (!reserva.id || !confirm('¿Estás seguro de cancelar esta reserva?')) return;

    this.reservasService.cancelar(reserva.id).pipe(first()).subscribe({
      next: () => {
        this.toast.success('Reserva cancelada');
        this.loadReservas();
      },
      error: () => {
        this.toast.error('Error al cancelar la reserva');
      }
    });
  }

  getEstadoClass(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'confirmada': return 'estado-confirmada';
      case 'pendiente': return 'estado-pendiente';
      case 'cancelada': return 'estado-cancelada';
      default: return '';
    }
  }
}
