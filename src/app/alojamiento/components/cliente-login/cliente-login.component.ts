import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cliente-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cliente-login.component.html',
  styleUrls: ['./cliente-login.component.scss']
})
export class ClienteLoginComponent {
  model = { email: '', password: '' };
  loading = false;

  constructor(private toast: ToastService, private router: Router, private auth: AuthService) {}

  submit(form: NgForm) {
    if (form.invalid || this.loading) return;
    this.loading = true;
    this.auth.login({ email: this.model.email, password: this.model.password }).pipe(first()).subscribe({
      next: () => {
        this.toast.show('Inicio de sesión exitoso', 'success');
        this.loading = false;
        this.router.navigate(['/cliente/alojamientos']);
      },
      error: () => {
        this.toast.show('Credenciales inválidas o error de servidor', 'error');
        this.loading = false;
      }
    });
  }
}
