import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacionesService, NotificacionDto } from '../../services/notificaciones.service';
import { first } from 'rxjs/operators';

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
export class AdminNotificacionesComponent implements OnInit {
  searchTerm = '';
  notificaciones: Notificacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(private notiService: NotificacionesService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.notiService.list(false).pipe(first()).subscribe({
      next: (data: NotificacionDto[]) => {
        this.notificaciones = (data || []).map(d => ({
          nombre: d.titulo || 'Solicitud',
          telefono: '',
          negocio: '',
          estatus: d.leida ? 'Atendida' : 'Abierta'
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar notificaciones';
        this.loading = false;
      }
    });
  }

  get filteredNotificaciones(): Notificacion[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.notificaciones;
    return this.notificaciones.filter(item => [item.nombre, item.telefono, item.negocio].some(v => v.toLowerCase().includes(term)));
  }
}
