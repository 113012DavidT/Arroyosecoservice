import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private readonly router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.router.navigateByUrl('/admin/dashboard');
  }
}
