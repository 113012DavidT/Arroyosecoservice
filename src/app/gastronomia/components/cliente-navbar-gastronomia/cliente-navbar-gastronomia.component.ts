import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-navbar-gastronomia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-navbar-gastronomia.component.html',
  styleUrls: ['./cliente-navbar-gastronomia.component.scss']
})
export class ClienteNavbarGastronomiaComponent {
  menuOpen = false;

  constructor() {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
