import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

@Component({
  selector: 'app-oferente-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="notificaciones">
      <h2>Notificaciones</h2>

      <div class="lista" *ngIf="notificaciones.length; else empty">
        <article *ngFor="let n of notificaciones" class="item" [class.leida]="n.leida">
          <div class="item__main">
            <h3>{{ n.titulo }}</h3>
            <p>{{ n.mensaje }}</p>
          </div>
          <div class="item__side">
            <span class="fecha">{{ n.fecha }}</span>
            <button class="btn" (click)="toggleLeida(n)">{{ n.leida ? 'Marcar como no leída' : 'Marcar como leída' }}</button>
          </div>
        </article>
      </div>

      <ng-template #empty>
        <div class="placeholder">
          <p>No tienes notificaciones nuevas.</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    .notificaciones { display: grid; gap: 1rem; }
    .lista { display: grid; gap: .75rem; }
    .item { background: #fff; border-radius: 12px; padding: 1rem; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 1rem; }
    .item.leida { opacity: .6; }
    .item h3 { margin: 0 0 .25rem; font-size: 1rem; }
    .item p { margin: 0; color: #4b5563; }
    .item__side { display: grid; gap: .5rem; justify-items: end; }
    .fecha { font-size: .85rem; color: #6b7280; }
    .btn { padding: .4rem .75rem; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; }
    .placeholder { background: #fff; padding: 3rem; border-radius: 12px; text-align: center; color: #6b7280; }
  `]
})
export class OferenteNotificacionesComponent {
  notificaciones: Notificacion[] = [
    { id: 'n1', titulo: 'Nueva reserva', mensaje: 'Has recibido una nueva solicitud de reserva.', fecha: '27/10/2025', leida: false },
    { id: 'n2', titulo: 'Pago confirmado', mensaje: 'Se confirmó el pago de la reserva R-001.', fecha: '25/10/2025', leida: true }
  ];

  toggleLeida(n: Notificacion) {
    n.leida = !n.leida;
  }
}
