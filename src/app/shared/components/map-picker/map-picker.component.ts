import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-picker">
      <div class="map-info">
        <p *ngIf="!latitud || !longitud">📍 Haz click en el mapa para marcar la ubicación</p>
        <p *ngIf="latitud && longitud" class="coords">
          ✅ Ubicación seleccionada: {{ latitud.toFixed(6) }}, {{ longitud.toFixed(6) }}
        </p>
      </div>
      <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
    </div>
  `,
  styles: [`
    .map-picker {
      margin: 1rem 0;
    }
    .map-info {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.9rem;
      
      &.coords {
        background: #d1fae5;
        color: #065f46;
      }
    }
    p.coords {
      background: #d1fae5;
      color: #065f46;
    }
  `]
})
export class MapPickerComponent implements AfterViewInit {
  @Input() latitud: number | null = null;
  @Input() longitud: number | null = null;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  private map!: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Centro predeterminado: Arroyo Seco, Querétaro
    const defaultLat = this.latitud || 21.2569;
    const defaultLng = this.longitud || -99.9897;

    this.map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Si ya hay coordenadas, agregar marcador
    if (this.latitud && this.longitud) {
      this.addMarker(this.latitud, this.longitud);
    }

    // Click en el mapa para agregar/mover marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.addMarker(lat, lng);
      this.locationSelected.emit({ lat, lng });
    });
  }

  private addMarker(lat: number, lng: number): void {
    // Remover marcador anterior si existe
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Agregar nuevo marcador
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.latitud = lat;
    this.longitud = lng;
  }
}
