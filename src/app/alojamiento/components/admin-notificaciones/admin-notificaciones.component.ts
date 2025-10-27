import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notificacion {
  nombre: string;
  telefono: string;
  negocio: string;
  estatus: 'Abierta' | 'Atendida';
}

@Component({
  selector: 'app-admin-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-notificaciones.component.html',
  styleUrl: './admin-notificaciones.component.scss'
})
export class AdminNotificacionesComponent {
  searchTerm = '';

  readonly notificaciones: Notificacion[] = [
    { nombre: 'Sofia Arredondo Ortiz', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' },
    { nombre: 'Emmanuel Zuñiga', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' },
    { nombre: 'Bryan Axel Cortes Cortes', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' },
    { nombre: 'Diego Ivan Prieto Puga', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' },
    { nombre: 'Giovanni Jair Jaimes Herrera', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' },
    { nombre: 'Manuel Salvador Mendoza Chavez', telefono: '4424735521', negocio: 'Airbnb', estatus: 'Abierta' }
  ];

  get filteredNotificaciones(): Notificacion[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.notificaciones;
    }
    return this.notificaciones.filter((item) =>
      [item.nombre, item.telefono, item.negocio]
        .some((value) => value.toLowerCase().includes(term))
    );
  }
}
