import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

interface Perfil {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.scss']
})
export class ClientePerfilComponent implements OnInit {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  perfil = signal<Perfil>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  });

  ngOnInit() {
    // Obtener datos del token JWT
    const token = this.authService.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      this.perfil.set({
        nombre: payload['name'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuario',
        email: payload['email'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        telefono: payload['phone'] || '',
        direccion: '',
        ciudad: ''
      });
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }

  guardarPerfil() {
    // Aquí se integraría con el servicio de API
    this.toastService.show('Perfil actualizado exitosamente', 'success');
  }
}
