import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { AlojamientoService, AlojamientoDto } from '../../services/alojamiento.service';
import { first } from 'rxjs/operators';

interface AlojamientoForm {
  nombre: string;
  ubicacion: string;
  huespedes: number;
  habitaciones: number;
  banos: number;
  precio: number;
  fotos: string[];
}

@Component({
  selector: 'app-form-registro-alojamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form-registro-alojamiento.component.html',
  styleUrl: './form-registro-alojamiento.component.scss'
})
export class FormRegistroAlojamientoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private alojamientosService = inject(AlojamientoService);

  idEdicion: string | null = null;
  formModel: AlojamientoForm = {
    nombre: '',
    ubicacion: '',
    huespedes: 1,
    habitaciones: 1,
    banos: 1,
    precio: 0,
    fotos: []
  };

  constructor() {
    this.idEdicion = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.idEdicion) {
      const id = parseInt(this.idEdicion, 10);
      if (id) {
        this.alojamientosService.getById(id).pipe(first()).subscribe({
          next: (a: AlojamientoDto) => {
            this.formModel = {
              nombre: a.nombre,
              ubicacion: a.ubicacion,
              huespedes: a.maxHuespedes,
              habitaciones: a.habitaciones,
              banos: a.banos,
              precio: a.precioPorNoche,
              fotos: [a.fotoPrincipal, ...(a.fotosUrls || [])].filter(Boolean) as string[]
            };
          },
          error: () => this.toastService.error('No se pudo cargar el alojamiento')
        });
      }
    }
  }

  get modoTitulo(): string {
    return this.idEdicion ? 'Editar Alojamiento' : 'Agregar Alojamiento';
  }

  agregarFoto(url: string) {
    if (!url) return;
    this.formModel.fotos.push(url);
  }

  eliminarFoto(idx: number) {
    this.formModel.fotos.splice(idx, 1);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const payload: AlojamientoDto = {
      nombre: this.formModel.nombre,
      ubicacion: this.formModel.ubicacion,
      maxHuespedes: this.formModel.huespedes,
      habitaciones: this.formModel.habitaciones,
      banos: this.formModel.banos,
      precioPorNoche: this.formModel.precio,
      fotoPrincipal: this.formModel.fotos[0] || '',
      fotosUrls: this.formModel.fotos.slice(1)
    };
    const obs = this.idEdicion
      ? this.alojamientosService.update(parseInt(this.idEdicion!, 10), payload)
      : this.alojamientosService.create(payload);

    obs.pipe(first()).subscribe({
      next: () => {
        const accion = this.idEdicion ? 'actualizado' : 'registrado';
        this.toastService.success(`Alojamiento ${accion} exitosamente`);
        this.router.navigateByUrl('/oferente/hospedajes');
      },
      error: () => this.toastService.error('No se pudo guardar el alojamiento')
    });
  }
}
