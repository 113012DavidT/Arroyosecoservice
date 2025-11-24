import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GastronomiaService, EstablecimientoDto } from '../../services/gastronomia.service';
import { ToastService } from '../../../shared/services/toast.service';
import { first } from 'rxjs/operators';

declare const google: any;

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
    this.loadGoogleMapsScript();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadEstablecimiento(Number(id));
    }
  }

  private loadGoogleMapsScript() {
    if (typeof google !== 'undefined' && google.maps) {
      this.initAutocomplete();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA-bZ8_5tI3fv7nS77icjrpQrQiWPnMf8k&libraries=places&language=es';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initAutocomplete();
    script.onerror = () => {
      console.warn('Google Maps no se pudo cargar, continuando sin autocompletado');
      this.toast.error('Autocompletado no disponible, ingresa la ubicación manualmente');
    };
    document.head.appendChild(script);
  }

  private initAutocomplete() {
    setTimeout(() => {
      const input = document.getElementById('autocomplete-input-gastro') as HTMLInputElement;
      if (!input) return;
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: 'mx' }
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        this.establecimiento.latitud = place.geometry.location.lat();
        this.establecimiento.longitud = place.geometry.location.lng();
        this.establecimiento.direccion = place.formatted_address || '';
        this.toast.success('✓ Coordenadas capturadas automáticamente');
      });
    }, 500);
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

    // Las coordenadas son opcionales ahora
    if (!this.establecimiento.latitud || !this.establecimiento.longitud) {
      console.warn('Sin coordenadas, guardando solo con ubicación de texto');
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
