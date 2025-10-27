import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-oferente-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './oferente-login.component.html',
  styleUrl: './oferente-login.component.scss'
})
export class OferenteLoginComponent {
  loginModel: LoginModel = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // TODO: integrar con servicio de autenticación
      console.log('Oferente login:', this.loginModel);
      this.router.navigate(['/oferente/dashboard']);
    }
  }
}
