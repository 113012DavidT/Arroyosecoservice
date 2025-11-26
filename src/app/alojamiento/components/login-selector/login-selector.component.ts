import { Component } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
  returnUrl: string | null = null;
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
      color: '#0891b2'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    const ru = this.route.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl = ru && ru.trim().length > 0 ? ru : null;
  }
}
