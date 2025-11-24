import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-oferente-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './oferente-login.component.html',
  styleUrl: './oferente-login.component.scss'
})
export class OferenteLoginComponent {
  loginModel: LoginModel = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    this.auth.login({ email: this.loginModel.email, password: this.loginModel.password }).pipe(first()).subscribe({
      next: () => {
        // Detectar rol y redirigir
        const roles = this.auth.getRoles();
        
        if (roles.some(r => /admin/i.test(r))) {
          this.router.navigate(['/admin/home']);
        } else if (roles.some(r => /oferente/i.test(r))) {
          // Siempre redirigir al selector de módulos para oferentes
          this.router.navigate(['/oferente/home']);
        } else {
          this.router.navigate(['/cliente/home']);
        }
      },
      error: () => alert('No se pudo iniciar sesión como oferente')
    });
  }
}
