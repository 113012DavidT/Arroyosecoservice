import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GastronomiaService, EstablecimientoDto, MenuDto } from '../../services/gastronomia.service';
import { ReservasGastronomiaService } from '../../services/reservas-gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-gastronomia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detalle-gastronomia.component.html',
  styleUrl: './detalle-gastronomia.component.scss'
})
export class DetalleGastronomiaComponent implements OnInit {
  establecimiento: EstablecimientoDto | null = null;
  menus: MenuDto[] = [];
  loading = false;
  error: string | null = null;
  
  // Formulario de reserva
  showReservaForm = false;
  fecha = '';
  numeroPersonas = 2;
  mesaId: number | null = null;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gastronomiaService: GastronomiaService,
    private reservasService: ReservasGastronomiaService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEstablecimiento(id);
      this.loadMenus(id);
    }
  }

  private loadEstablecimiento(id: number) {
    this.loading = true;
    this.gastronomiaService.getById(id).pipe(first()).subscribe({
      next: (data) => {
        console.log('Establecimiento cargado:', data);
        console.log('Mesas disponibles:', data?.mesas);
        this.establecimiento = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el restaurante';
        this.loading = false;
      }
    });
  }

  private loadMenus(id: number) {
    this.gastronomiaService.getMenus(id).pipe(first()).subscribe({
      next: (data) => {
        this.menus = data || [];
      },
      error: () => {
        console.error('Error al cargar menús');
      }
    });
  }

  toggleReservaForm() {
    if (!this.auth.isAuthenticated()) {
      this.toast.error('Debes iniciar sesión para hacer una reserva');
      this.router.navigate(['/cliente/login']);
      return;
    }
    this.showReservaForm = !this.showReservaForm;
  }

  crearReserva() {
    if (!this.establecimiento?.id) return;
    
    if (!this.fecha || !this.numeroPersonas) {
      this.toast.error('Completa todos los campos');
      return;
    }

    this.submitting = true;
    const payload = {
      establecimientoId: this.establecimiento.id,
      fecha: new Date(this.fecha).toISOString(),
      numeroPersonas: this.numeroPersonas,
      mesaId: this.mesaId || null
    };

    console.log('Enviando reserva con payload:', payload);
    this.reservasService.crear(payload)
      .pipe(first())
      .subscribe({
        next: (result) => {
          console.log('Reserva de gastronomía creada exitosamente:', result);
          this.toast.success('¡Reserva creada exitosamente!');
          this.showReservaForm = false;
          this.resetForm();
          this.submitting = false;
          // Redirigir a la página de reserva creada
          if (result?.id) {
            this.router.navigate(['/cliente/gastronomia/reserva', result.id]);
          }
        },
        error: (err) => {
          console.error('Error al crear reserva de gastronomía:', err);
          this.toast.error(err?.error?.message || 'Error al crear la reserva');
          this.submitting = false;
        }
      });
  }

  private resetForm() {
    this.fecha = '';
    this.numeroPersonas = 2;
    this.mesaId = null;
  }

  abrirComoLlegar() {
    if (!this.establecimiento?.latitud || !this.establecimiento?.longitud) {
      this.toast.error('No hay coordenadas disponibles para este restaurante');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.establecimiento.latitud},${this.establecimiento.longitud}`;
    window.open(url, '_blank');
  }
}
