import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminOferentesService, OferenteDto } from '../../services/admin-oferentes.service';
import { first } from 'rxjs/operators';

enum TipoOferente {
  Alojamiento = 1,
  Gastronomia = 2,
  Ambos = 3
}

interface Oferente {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  alojamientos: number;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  tipo?: TipoOferente;
}

@Component({
  selector: 'app-admin-oferentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-oferentes.component.html',
  styleUrl: './admin-oferentes.component.scss'
})
export class AdminOferentesComponent {
  private toastService = inject(ToastService);
  private adminService = inject(AdminOferentesService);

  searchTerm = '';

  oferentes: Oferente[] = [];

  modalDetallesAbierto = false;
  modalRegistroAbierto = false;
  modalEditarAbierto = false;
  seleccionado: Oferente | null = null;

  nuevo: Partial<Oferente> = { nombre: '', correo: '', telefono: '', alojamientos: 0, estado: 'Pendiente' };
  editar: Partial<Oferente> | null = null;

  get filteredOferentes(): Oferente[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.oferentes;
    }

    return this.oferentes.filter((o) =>
      [o.nombre, o.correo, o.telefono, o.estado]
        .some((value) => value.toLowerCase().includes(term))
    );
  }

  abrirDetalles(o: Oferente) {
    this.seleccionado = o;
    this.modalDetallesAbierto = true;
  }

  ngOnInit(): void {
    this.loadOferentes();
  }

  private loadOferentes() {
    this.adminService.listAlojamiento().pipe(first()).subscribe({
      next: (data) => {
        this.oferentes = (data || []).map((d: OferenteDto) => ({
          id: d.id,
          nombre: d.nombre,
          correo: d.email || '',
          telefono: d.telefono || '',
          alojamientos: d.numeroAlojamientos ?? d.alojamientos ?? 0,
          estado: (d.estado as any) || 'Pendiente',
          tipo: d.tipo ?? TipoOferente.Alojamiento
        }));
      },
      error: (err) => this.toastService.error('Error al cargar oferentes de alojamiento')
    });
  }

  cerrarDetalles() {
    this.modalDetallesAbierto = false;
    this.seleccionado = null;
  }

  toggleEstado(o: Oferente) {
    const nuevoEstado = o.estado === 'Activo' ? 'Inactivo' : 'Activo';
    
    this.adminService.cambiarEstado(o.id, nuevoEstado).pipe(first()).subscribe({
      next: () => {
        o.estado = nuevoEstado as any;
        if (nuevoEstado === 'Activo') {
          this.toastService.success(`Oferente ${o.nombre} activado`);
        } else {
          this.toastService.warning(`Oferente ${o.nombre} desactivado`);
        }
        this.loadOferentes();
      },
      error: (err) => {
        this.toastService.error('Error al cambiar estado del oferente');
        console.error('Error toggleEstado:', err);
      }
    });
  }

  abrirRegistro() {
    this.nuevo = { nombre: '', correo: '', telefono: '', alojamientos: 0, estado: 'Pendiente', tipo: TipoOferente.Alojamiento };
    this.modalRegistroAbierto = true;
  }

  cerrarRegistro() {
    this.modalRegistroAbierto = false;
  }

  registrar(form: NgForm) {
    if (form.invalid) return;
    const payload = {
      email: this.nuevo.correo!,
      password: 'Temporal.123',
      nombre: this.nuevo.nombre!,
      telefono: this.nuevo.telefono!,
      role: 'Oferente',
      tipoOferente: TipoOferente.Alojamiento
    };
    this.adminService.createUsuarioOferente(payload).pipe(first()).subscribe({
      next: () => {
        this.toastService.success(`Oferente de alojamiento ${this.nuevo.nombre} registrado exitosamente`);
        this.cerrarRegistro();
        this.loadOferentes();
      },
      error: (err) => {
        console.error('Error al registrar oferente:', err);
        if (err.status === 409) {
          this.toastService.error('El correo electrónico ya está registrado');
        } else {
          this.toastService.error('Error al registrar oferente: ' + (err.error?.message || err.message));
        }
      }
    });
  }

  abrirEditar(o: Oferente) {
    this.editar = { ...o };
    this.modalEditarAbierto = true;
  }

  cerrarEditar() {
    this.modalEditarAbierto = false;
    this.editar = null;
  }

  guardarEditar(form: NgForm) {
    if (form.invalid || !this.editar?.id) return;
    const idx = this.oferentes.findIndex(x => x.id === this.editar!.id);
    if (idx > -1) {
      const id = this.editar!.id;
      const payload = { 
        nombre: this.editar!.nombre,
        email: this.editar!.correo,
        telefono: this.editar!.telefono,
        tipo: this.editar!.tipo
      };
      this.adminService.update(id, payload).pipe(first()).subscribe({
        next: () => {
          this.toastService.success(`Oferente ${this.editar!.nombre} actualizado`);
          this.loadOferentes();
          this.cerrarEditar();
        },
        error: (err) => {
          console.error('Error al actualizar oferente:', err);
          this.toastService.error('Error al actualizar oferente');
          this.cerrarEditar();
        }
      });
    } else {
      this.cerrarEditar();
    }
  }

  eliminar(o: Oferente) {
    const ok = confirm(`¿Eliminar al oferente "${o.nombre}"?`);
    if (!ok) return;
    this.adminService.delete(o.id).pipe(first()).subscribe({
      next: () => {
        this.oferentes = this.oferentes.filter(x => x.id !== o.id);
        this.toastService.success(`Oferente ${o.nombre} eliminado`);
      },
      error: () => this.toastService.error('Error al eliminar oferente')
    });
  }
}
