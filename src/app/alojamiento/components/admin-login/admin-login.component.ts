import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  loginModel: LoginModel = {
    email: '',
    password: ''
  };

  constructor(private readonly router: Router, private auth: AuthService) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.auth.login({ email: this.loginModel.email, password: this.loginModel.password }).pipe(first()).subscribe({
      next: () => this.router.navigateByUrl('/admin/dashboard'),
      error: () => alert('No se pudo iniciar sesión como administrador')
    });
  }
}
