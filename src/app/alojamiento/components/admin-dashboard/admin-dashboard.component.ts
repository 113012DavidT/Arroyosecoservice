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
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  readonly cards: DashboardCard[] = [
    {
      title: 'Gestión de Oferentes',
      description: 'Administra la información de los oferentes registrados.',
      icon: 'person',
      route: '/admin/oferentes'
    },
    {
      title: 'Notificaciones',
      description: 'Consulta y gestiona los avisos enviados a los oferentes.',
      icon: 'notifications',
      route: '/admin/notificaciones'
    }
  ];
}
