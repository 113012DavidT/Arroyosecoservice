import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GastronomiaService, EstablecimientoDto } from '../../services/gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-gestion-establecimientos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestion-establecimientos.component.html',
  styleUrl: './gestion-establecimientos.component.scss'
})
export class GestionEstablecimientosComponent implements OnInit {
  establecimientos: EstablecimientoDto[] = [];
  loading = false;

  constructor(
    private gastronomiaService: GastronomiaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEstablecimientos();
  }

  private loadEstablecimientos() {
    this.loading = true;
    this.gastronomiaService.listMine().pipe(first()).subscribe({
      next: (data) => {
        this.establecimientos = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar establecimientos:', err);
        this.toast.error('Error al cargar establecimientos. Por favor verifica que el backend esté funcionando.');
        this.establecimientos = [];
        this.loading = false;
      }
    });
  }

  eliminar(id?: number) {
    if (!id || !confirm('¿Estás seguro de eliminar este establecimiento?')) return;

    this.gastronomiaService.delete(id).pipe(first()).subscribe({
      next: () => {
        this.toast.success('Establecimiento eliminado');
        this.loadEstablecimientos();
      },
      error: () => {
        this.toast.error('Error al eliminar');
      }
    });
  }
}
