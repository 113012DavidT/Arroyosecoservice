import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-oferente-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './oferente-navbar.component.html',
  styleUrl: './oferente-navbar.component.scss'
})
export class OferenteNavbarComponent {
  readonly links: NavLink[] = [
    { label: 'Inicio', route: '/oferente/dashboard' },
    { label: 'Mis Hospedajes', route: '/oferente/hospedajes' },
    { label: 'Gestión de Reservas', route: '/oferente/reservas' },
    { label: 'Notificaciones', route: '/oferente/notificaciones' },
    { label: 'Configuración', route: '/oferente/configuracion' }
  ];
}
