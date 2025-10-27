import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

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

  searchTerm = '';

  oferentes: Oferente[] = [
    { id: '1', nombre: 'Juan Pérez', correo: 'juan@example.com', telefono: '442-123-4567', alojamientos: 3, estado: 'Activo' },
    { id: '2', nombre: 'María González', correo: 'maria@example.com', telefono: '442-234-5678', alojamientos: 2, estado: 'Activo' },
    { id: '3', nombre: 'Carlos Ramírez', correo: 'carlos@example.com', telefono: '442-345-6789', alojamientos: 1, estado: 'Pendiente' },
    { id: '4', nombre: 'Ana López', correo: 'ana@example.com', telefono: '442-456-7890', alojamientos: 5, estado: 'Activo' },
    { id: '5', nombre: 'Luis Torres', correo: 'luis@example.com', telefono: '442-567-8901', alojamientos: 0, estado: 'Inactivo' }
  ];

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
    const id = String(this.oferentes.length + 1);
    this.oferentes.unshift({
      id,
      nombre: this.nuevo.nombre!,
      correo: this.nuevo.correo!,
      telefono: this.nuevo.telefono!,
      alojamientos: 0,
      estado: 'Pendiente'
    });
    this.toastService.success(`Oferente ${this.nuevo.nombre} registrado exitosamente`);
    this.cerrarRegistro();
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
      this.oferentes[idx] = {
        ...this.oferentes[idx],
        nombre: this.editar!.nombre!,
        correo: this.editar!.correo!,
        telefono: this.editar!.telefono!
      };
      this.toastService.success(`Oferente ${this.editar!.nombre} actualizado`);
    }
    this.cerrarEditar();
  }

  eliminar(o: Oferente) {
    const ok = confirm(`¿Eliminar al oferente "${o.nombre}"?`);
    if (!ok) return;
    this.oferentes = this.oferentes.filter(x => x.id !== o.id);
    this.toastService.success(`Oferente ${o.nombre} eliminado`);
  }
}
