import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

interface Perfil {
  nombre: string;
  correo: string;
  telefono: string;
  notificarEmail: boolean;
  notificarSms: boolean;
}

@Component({
  selector: 'app-oferente-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="configuracion">
      <h2>Configuración</h2>
      <form #f="ngForm" (ngSubmit)="guardar(f)" class="card">
        <label>
          Nombre completo
          <input type="text" name="nombre" [(ngModel)]="perfil.nombre" required />
        </label>

        <label>
          Correo
          <input type="email" name="correo" [(ngModel)]="perfil.correo" required />
        </label>

        <label>
          Teléfono
          <input type="tel" name="telefono" [(ngModel)]="perfil.telefono" required />
        </label>

        <fieldset class="prefs">
          <legend>Preferencias de notificación</legend>
          <label class="inline"><input type="checkbox" name="notificarEmail" [(ngModel)]="perfil.notificarEmail" /> Email</label>
          <label class="inline"><input type="checkbox" name="notificarSms" [(ngModel)]="perfil.notificarSms" /> SMS</label>
        </fieldset>

        <div class="actions">
          <button class="btn primary" [disabled]="f.invalid">Guardar cambios</button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .configuracion { display: grid; gap: 1rem; }
    .card { background: #fff; border-radius: 12px; padding: 1rem; display: grid; gap: .75rem; }
    label { display: grid; gap: .5rem; font-weight: 600; color: #374151; }
    input { border: 1px solid #d1d5db; border-radius: 10px; padding: .75rem 1rem; }
    .prefs { border: 1px solid #e5e7eb; border-radius: 10px; padding: .75rem 1rem; display: grid; gap: .5rem; }
    .inline { font-weight: 500; display: inline-flex; align-items: center; gap: .5rem; }
    .actions { display: flex; justify-content: flex-end; }
    .btn.primary { background: #1c66d6; color: #fff; border: none; border-radius: 10px; padding: .6rem 1rem; cursor: pointer; }
  `]
})
export class OferenteConfiguracionComponent {
  private toastService = inject(ToastService);

  perfil: Perfil = {
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    telefono: '4421234567',
    notificarEmail: true,
    notificarSms: false,
  };

  guardar(form: NgForm) {
    if (form.invalid) return;
    // Simular guardado
    this.toastService.success('Configuración guardada exitosamente');
  }
}
