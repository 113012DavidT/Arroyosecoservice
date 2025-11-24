import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oferente-navbar-gastronomia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './oferente-navbar-gastronomia.component.html',
  styleUrls: ['./oferente-navbar-gastronomia.component.scss']
})
export class OferenteNavbarGastronomiaComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
