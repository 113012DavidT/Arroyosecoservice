import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ModuleType {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-oferente-home-selector',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './oferente-home-selector.component.html',
  styleUrl: './oferente-home-selector.component.scss'
})
export class OferenteHomeSelectorComponent {
  constructor(private router: Router) {}

  readonly modules: ModuleType[] = [
    {
      title: 'Alojamiento',
      description: 'Gestiona tus hospedajes y reservas',
      route: '/oferente/dashboard',
      icon: 'alojamiento',
      color: '#0891b2'
    },
    {
      title: 'Gastronomía',
      description: 'Gestiona tus restaurantes y reservas',
      route: '/oferente/gastronomia/dashboard',
      icon: 'gastronomia',
      color: '#c73619'
    }
  ];
}
