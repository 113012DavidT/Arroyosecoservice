import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent {
  readonly links: NavLink[] = [
    { label: 'Inicio', route: '/admin/dashboard' },
    { label: 'Oferentes', route: '/admin/oferentes' },
    { label: 'Notificaciones', route: '/admin/notificaciones' }
  ];
}
