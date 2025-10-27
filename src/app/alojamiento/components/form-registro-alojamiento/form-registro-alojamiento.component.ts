import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

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
export class FormRegistroAlojamientoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

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

    if (this.idEdicion) {
      // Pre-cargar datos simulados para edición
      this.formModel = {
        nombre: 'CABAÑA LUXURY WOOD',
        ubicacion: 'Zona Barranca de la Virgen, Arroyo Seco, Querétaro',
        huespedes: 4,
        habitaciones: 2,
        banos: 2,
        precio: 1350,
        fotos: ['assets/images/hero-oferentes.svg']
      };
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

    const accion = this.idEdicion ? 'actualizado' : 'registrado';
    this.toastService.success(`Alojamiento ${accion} exitosamente`);

    // Simular guardado y regresar a lista
    setTimeout(() => {
      this.router.navigateByUrl('/oferente/hospedajes');
    }, 1000);
  }
}
