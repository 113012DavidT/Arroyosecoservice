import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

interface Reserva {
  id: string;
  hospedaje: string;
  huesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  total: number;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  selector: 'app-gestion-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-reservas.component.html',
  styleUrl: './gestion-reservas.component.scss'
})
export class GestionReservasComponent {
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  searchTerm = '';
  hospedajeFiltro: string | null = null;
  detalleAbierto = false;
  reservaSeleccionada: Reserva | null = null;

  reservas: Reserva[] = [
    {
      id: 'R-001',
      hospedaje: '1',
      huesped: 'Manuel Puig',
      fechaEntrada: '24-12-2025',
      fechaSalida: '28-12-2025',
      total: 5400,
      estado: 'Confirmada'
    },
    {
      id: 'R-002',
      hospedaje: '2',
      huesped: 'Ana García',
      fechaEntrada: '30-12-2025',
      fechaSalida: '02-01-2026',
      total: 4050,
      estado: 'Pendiente'
    }
  ];

  constructor() {
    this.hospedajeFiltro = this.route.snapshot.paramMap.get('id');
  }

  get filteredReservas(): Reserva[] {
    let list = this.reservas;

    if (this.hospedajeFiltro) {
      list = list.filter(r => r.hospedaje === this.hospedajeFiltro);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return list;
    }

    return list.filter((r) =>
      [r.id, r.huesped, r.estado]
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  abrirDetalle(reserva: Reserva) {
    this.reservaSeleccionada = { ...reserva };
    this.detalleAbierto = true;
  }

  cerrarDetalle() {
    this.detalleAbierto = false;
    this.reservaSeleccionada = null;
  }

  confirmar(reserva: Reserva) {
    reserva.estado = 'Confirmada';
    this.toastService.success(`Reserva ${reserva.id} confirmada exitosamente`);
  }

  rechazar(reserva: Reserva) {
    reserva.estado = 'Cancelada';
    this.toastService.error(`Reserva ${reserva.id} rechazada`);
  }
}
