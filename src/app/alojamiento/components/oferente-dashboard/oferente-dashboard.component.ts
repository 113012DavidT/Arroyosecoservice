import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-oferente-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './oferente-dashboard.component.html',
  styleUrl: './oferente-dashboard.component.scss'
})
export class OferenteDashboardComponent {
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
}
