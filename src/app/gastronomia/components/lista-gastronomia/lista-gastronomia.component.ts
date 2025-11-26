import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { GastronomiaService, EstablecimientoDto } from '../../services/gastronomia.service';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

interface Establecimiento {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-lista-gastronomia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-gastronomia.component.html',
  styleUrl: './lista-gastronomia.component.scss'
})
export class ListaGastronomiaComponent implements OnInit {
  search = '';
  sortMode: 'nombre' | 'ubicacion' = 'nombre';
  establecimientos: Establecimiento[] = [];
  loading = false;
  error: string | null = null;
  isPublic = false;

  constructor(
    private toast: ToastService,
    private gastronomiaService: GastronomiaService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Detectar si estamos en ruta pública
    this.isPublic = this.router.url.includes('/publica/');
    this.fetchEstablecimientos();
  }

  private fetchEstablecimientos() {
    this.loading = true;
    this.error = null;
    this.gastronomiaService.listAll().pipe(first()).subscribe({
      next: (data: EstablecimientoDto[]) => {
        this.establecimientos = (data || []).map(d => ({
          id: d.id!,
          nombre: d.nombre,
          ubicacion: d.ubicacion,
          descripcion: d.descripcion,
          imagen: d.fotoPrincipal || 'assets/images/hero-oferentes.svg'
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar restaurantes';
        this.loading = false;
      }
    });
  }

  get filtered(): Establecimiento[] {
    if (this.loading || this.error) return this.establecimientos;
    let result = this.establecimientos.filter(e =>
      e.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
      e.ubicacion.toLowerCase().includes(this.search.toLowerCase())
    );
    switch (this.sortMode) {
      case 'nombre':
        result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'ubicacion':
        result = [...result].sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
        break;
    }
    return result;
  }

  navigateToDetail(id: number) {
    if (this.isPublic && !this.auth.isAuthenticated()) {
      this.toast.error('Debes iniciar sesión para ver detalles');
      this.router.navigate(['/login']);
      return;
    }
    
    const route = this.isPublic ? '/publica/gastronomia' : '/cliente/gastronomia';
    this.router.navigate([route, id]);
  }
}
