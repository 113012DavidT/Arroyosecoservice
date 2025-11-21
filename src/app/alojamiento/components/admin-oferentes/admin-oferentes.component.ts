import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminOferentesService, OferenteDto } from '../../services/admin-oferentes.service';
import { first } from 'rxjs/operators';

interface Oferente {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  alojamientos: number;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
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
    this.adminService.list().pipe(first()).subscribe({
      next: (data) => {
        this.oferentes = (data || []).map((d: OferenteDto) => ({
          id: d.id,
          nombre: d.nombre,
          correo: d.correo || '',
          telefono: d.telefono || '',
          alojamientos: d.alojamientos ?? 0,
          estado: (d.estado as any) || 'Pendiente'
        }));
      },
      error: (err) => this.toastService.error('Error al cargar oferentes')
    });
  }

  cerrarDetalles() {
    this.modalDetallesAbierto = false;
    this.seleccionado = null;
  }

  toggleEstado(o: Oferente) {
    const estadoAnterior = o.estado;
    o.estado = o.estado === 'Activo' ? 'Inactivo' : 'Activo';

    if (o.estado === 'Activo') {
      this.toastService.success(`Oferente ${o.nombre} activado`);
    } else {
      this.toastService.warning(`Oferente ${o.nombre} desactivado`);
    }
  }

  abrirRegistro() {
    this.nuevo = { nombre: '', correo: '', telefono: '', alojamientos: 0, estado: 'Pendiente' };
    this.modalRegistroAbierto = true;
  }

  cerrarRegistro() {
    this.modalRegistroAbierto = false;
  }

  registrar(form: NgForm) {
    if (form.invalid) return;
    // create as admin: this endpoint expects an email/password/nombre
    const payload = {
      email: this.nuevo.correo,
      password: 'Hola.123',
      nombre: this.nuevo.nombre
    };
    this.adminService.createUsuarioOferente(payload as any).pipe(first()).subscribe({
      next: () => {
        this.toastService.success(`Oferente ${this.nuevo.nombre} registrado exitosamente`);
        this.cerrarRegistro();
        this.loadOferentes();
      },
      error: () => this.toastService.error('Error al registrar oferente')
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
      const payload = { nombre: this.editar!.nombre };
      this.adminService.update(id, payload).pipe(first()).subscribe({
        next: () => {
          this.oferentes[idx] = {
            ...this.oferentes[idx],
            nombre: this.editar!.nombre!,
            correo: this.editar!.correo!,
            telefono: this.editar!.telefono!
          };
          this.toastService.success(`Oferente ${this.editar!.nombre} actualizado`);
        },
        error: () => this.toastService.error('Error al actualizar oferente')
      });
    }
    this.cerrarEditar();
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
