import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GastronomiaService, EstablecimientoDto } from '../../services/gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-form-establecimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form-establecimiento.component.html',
  styleUrl: './form-establecimiento.component.scss'
})
export class FormEstablecimientoComponent implements OnInit {
  establecimiento: EstablecimientoDto = {
    nombre: '',
    ubicacion: '',
    descripcion: '',
    fotoPrincipal: ''
  };
  
  isEdit = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gastronomiaService: GastronomiaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadEstablecimiento(Number(id));
    }
  }

  private loadEstablecimiento(id: number) {
    this.gastronomiaService.getById(id).pipe(first()).subscribe({
      next: (data) => {
        this.establecimiento = data;
      },
      error: () => {
        this.toast.error('Error al cargar establecimiento');
        this.router.navigate(['/oferente/gastronomia/establecimientos']);
      }
    });
  }

  submit() {
    if (!this.establecimiento.nombre || !this.establecimiento.ubicacion) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    this.submitting = true;
    const request = this.isEdit && this.establecimiento.id
      ? this.gastronomiaService.update(this.establecimiento.id, this.establecimiento)
      : this.gastronomiaService.create(this.establecimiento);

    request.pipe(first()).subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Establecimiento actualizado' : 'Establecimiento creado');
        this.router.navigate(['/oferente/gastronomia/establecimientos']);
      },
      error: () => {
        this.toast.error('Error al guardar');
        this.submitting = false;
      }
    });
  }
}
