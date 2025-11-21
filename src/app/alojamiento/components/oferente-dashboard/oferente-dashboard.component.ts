import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgIf } from '@angular/common';
import { AlojamientoService } from '../../services/alojamiento.service';
import { ReservasService } from '../../services/reservas.service';
import { first, switchMap, map, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-oferente-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgIf],
  templateUrl: './oferente-dashboard.component.html',
  styleUrl: './oferente-dashboard.component.scss'
})
export class OferenteDashboardComponent implements OnInit {
  private alojamientosService = inject(AlojamientoService);
  private reservasService = inject(ReservasService);

  alojamientosActivos = 0;
  reservasPendientes: number | null = null; // null: desconocido (no endpoint)

  readonly cards: DashboardCard[] = [
    {
      title: 'Gestión de Hospedajes',
      description: 'Administra tus propiedades y alojamientos.',
      icon: 'home',
      route: '/oferente/hospedajes'
    },
    {
      title: 'Gestión de Reservas',
      description: 'Consulta y gestiona las reservas de tus hospedajes.',
      icon: 'calendar',
      route: '/oferente/reservas'
    },
    {
      title: 'Notificaciones',
      description: 'Revisa tus avisos y mensajes importantes.',
      icon: 'notifications',
      route: '/oferente/notificaciones'
    },
    {
      title: 'Configuración',
      description: 'Ajusta tu perfil y preferencias.',
      icon: 'settings',
      route: '/oferente/configuracion'
    }
  ];

  ngOnInit(): void {
    this.cargarStats();
  }

  private cargarStats() {
    // Alojamientos activos: contamos los alojamientos del usuario
    this.alojamientosService.listMine().pipe(first()).subscribe({
      next: (list) => this.alojamientosActivos = list?.length ?? 0,
      error: () => this.alojamientosActivos = 0
    });
    // Reservas pendientes: agregamos por alojamiento del oferente para evitar 404 en /oferente/reservas
    this.alojamientosService.listMine().pipe(
      switchMap(list => {
        const ids = (list || []).map(a => a.id).filter(Boolean) as number[];
        if (!ids.length) return of([]);
        return forkJoin(ids.map(id => this.reservasService.listByAlojamiento(id, 'Pendiente'))).pipe(
          map(arrays => arrays.flat())
        );
      }),
      first(),
      catchError(() => {
        this.reservasPendientes = 0;
        return of([]);
      })
    ).subscribe(all => {
      this.reservasPendientes = (all || []).length;
    });
  }
}
