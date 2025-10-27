import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

interface Hospedaje {
  id: string;
  nombre: string;
  ubicacion: string;
  huespedes: number;
  habitaciones: number;
  banos: number;
  precio: number;
  estado: 'Reservado' | 'Pendiente de pago' | 'Confirmado';
  imagen: string;
}

@Component({
  selector: 'app-gestion-hospedajes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestion-hospedajes.component.html',
  styleUrl: './gestion-hospedajes.component.scss'
})
export class GestionHospedajesComponent {
  private toastService = inject(ToastService);

  searchTerm = '';

  hospedajes: Hospedaje[] = [
    {
      id: '1',
      nombre: 'CABAÑA LUXURY WOOD',
      ubicacion: 'Zona Barranca de la Virgen, Arroyo Seco, Querétaro',
      huespedes: 4,
      habitaciones: 2,
      banos: 2,
      precio: 1350,
      estado: 'Reservado',
      imagen: 'assets/images/hero-oferentes.svg'
    },
    {
      id: '2',
      nombre: 'CABAÑA LUXURY WOOD',
      ubicacion: 'Zona Barranca de la Virgen, Arroyo Seco, Querétaro',
      huespedes: 4,
      habitaciones: 2,
      banos: 2,
      precio: 1350,
      estado: 'Pendiente de pago',
      imagen: 'assets/images/hero-oferentes.svg'
    }
  ];

  get filteredHospedajes(): Hospedaje[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.hospedajes;
    }

    return this.hospedajes.filter((h) =>
      [h.nombre, h.ubicacion, h.estado]
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  eliminar(hospedaje: Hospedaje) {
    const confirmacion = confirm(`¿Estás seguro de eliminar "${hospedaje.nombre}"?`);
    if (confirmacion) {
      const index = this.hospedajes.findIndex(h => h.id === hospedaje.id);
      if (index > -1) {
        this.hospedajes.splice(index, 1);
        this.toastService.success(`Hospedaje "${hospedaje.nombre}" eliminado`);
      }
    }
  }
}
