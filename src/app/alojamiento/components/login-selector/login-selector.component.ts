import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface UserType {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-login-selector',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-selector.component.html',
  styleUrl: './login-selector.component.scss'
})
export class LoginSelectorComponent {
  readonly userTypes: UserType[] = [
    {
      title: 'Administrador',
      description: 'Gestiona la plataforma y supervisa toda la actividad turística',
      route: '/admin/login',
      icon: 'admin',
      color: '#1c66d6'
    },
    {
      title: 'Oferente',
      description: 'Administra tus hospedajes y gestiona las reservas',
      route: '/oferente/login',
      icon: 'oferente',
      color: '#c73619'
    },
    {
      title: 'Cliente',
      description: 'Busca y reserva alojamientos en Arroyo Seco',
      route: '/cliente/login',
      icon: 'cliente',
      color: '#10b981'
    }
  ];
}
