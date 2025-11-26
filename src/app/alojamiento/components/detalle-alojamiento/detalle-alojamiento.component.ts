import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlojamientoService, AlojamientoDto } from '../../services/alojamiento.service';
import { ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../../core/services/auth.service';
import { first, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-detalle-alojamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './detalle-alojamiento.component.html',
  styleUrl: './detalle-alojamiento.component.scss'
})
export class DetalleAlojamientoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private alojamientosService = inject(AlojamientoService);
  private reservasService = inject(ReservasService);

  alojamientoId!: number;
  alojamiento?: AlojamientoDto;
  gallery: string[] = [];
  // Cambiamos fechas a Date para usar datepicker
  booking = { entrada: null as Date | null, salida: null as Date | null, huespedes: 1 };
  loading = false;
  error: string | null = null;
  // Calendario
  reservedDateSet = new Set<string>();
  // Pago por transferencia
  showPagoModal = false;
  comprobanteFile: File | null = null;
  creando = false;
  isPublic = false;

  ngOnInit(): void {
    this.isPublic = this.router.url.includes('/publica/');
    const idParam = this.route.snapshot.paramMap.get('id');
    this.alojamientoId = idParam ? parseInt(idParam, 10) : 0;
    if (this.alojamientoId) {
      this.cargar();
      this.cargarCalendario();
    }
  }

  private cargar() {
    this.loading = true;
    this.alojamientosService.getById(this.alojamientoId).pipe(first()).subscribe({
      next: (a) => {
        this.alojamiento = a;
        const fotos = a.fotosUrls || [];
        this.gallery = [a.fotoPrincipal, ...fotos].filter(Boolean) as string[];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el alojamiento';
        this.loading = false;
      }
    });
  }

  private cargarCalendario() {
    this.reservasService.getCalendario(this.alojamientoId).pipe(first()).subscribe({
      next: rangos => {
        const days: string[] = [];
        for (const r of rangos) {
          const start = new Date(r.inicio);
          const end = new Date(r.fin);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            days.push(this.key(d));
          }
        }
        this.reservedDateSet = new Set(days);
      },
      error: () => {}
    });
  }

  dateClass = (d: Date) => this.reservedDateSet.has(this.key(d)) ? 'reserved-date' : '';

  get total(): number {
    if (!this.booking.entrada || !this.booking.salida || !this.alojamiento) return 0;
    const ms = this.booking.salida.getTime() - this.booking.entrada.getTime();
    const nights = ms > 0 ? Math.ceil(ms / 86400000) : 0;
    return nights * this.alojamiento.precioPorNoche;
  }

  abrirModalPago(form: NgForm) {
    if (this.isPublic) {
      if (this.auth.isAuthenticated()) {
        this.router.navigate(['/cliente/alojamientos', this.alojamientoId]);
      } else {
        this.toast.error('Debes iniciar sesión para hacer una reserva');
        this.router.navigate(['/login']);
      }
      return;
    }
    if (!this.auth.isAuthenticated()) {
      this.toast.error('Debes iniciar sesión para hacer una reserva');
      this.router.navigate(['/login']);
      return;
    }
    if (form.invalid || !this.total) return;
    this.showPagoModal = true;
  }

  cerrarModalPago() {
    if (this.creando) return;
    this.showPagoModal = false;
    this.comprobanteFile = null;
  }

  // Exponer estado de autenticación al template
  get autenticado(): boolean {
    return this.auth.isAuthenticated();
  }

  onComprobanteChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.comprobanteFile = input.files?.[0] || null;
    if (this.comprobanteFile) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowed.includes(this.comprobanteFile.type)) {
        this.toast.error('Formato no permitido. Use PDF/JPG/PNG.');
        this.comprobanteFile = null;
      } else if (this.comprobanteFile.size > 18 * 1024 * 1024) { // < 20MB backend limit
        this.toast.error('El archivo supera el límite (18MB).');
        this.comprobanteFile = null;
      }
    }
  }

  confirmarReservaYComprobante() {
    if (!this.booking.entrada || !this.booking.salida || !this.comprobanteFile) {
      this.toast.error('Fechas y comprobante requeridos');
      return;
    }
    this.creando = true;
    const payload = {
      alojamientoId: this.alojamientoId,
      fechaEntrada: this.formatDateLocal(this.booking.entrada),
      fechaSalida: this.formatDateLocal(this.booking.salida)
    };
    this.reservasService.crearConComprobante(payload, this.comprobanteFile!).pipe(
      catchError(err => {
        // Fallback: crear primero y luego subir comprobante
        console.error('crear-con-comprobante falló, aplicando fallback:', err);
        return this.reservasService.crear(payload).pipe(
          switchMap((r: any) => this.reservasService.subirComprobante(Number(r.id || r.Id), this.comprobanteFile!))
        );
      }),
      first()
    ).subscribe({
      next: () => {
        console.log('Reserva creada exitosamente');
        this.toast.success('Reserva enviada. Pago en revisión.');
        this.creando = false;
        this.cerrarModalPago();
        this.booking = { entrada: null, salida: null, huespedes: 1 };
        this.cargarCalendario();
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
        this.toast.error('No se pudo procesar la reserva');
        this.creando = false;
      }
    });
  }

  private key(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  private formatDateLocal(d: Date): string {
    // Return YYYY-MM-DD (backend expects string, not DateTime)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  abrirComoLlegar() {
    if (!this.alojamiento?.latitud || !this.alojamiento?.longitud) {
      this.toast.error('No hay coordenadas disponibles para este alojamiento');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.alojamiento.latitud},${this.alojamiento.longitud}`;
    window.open(url, '_blank');
  }
}
