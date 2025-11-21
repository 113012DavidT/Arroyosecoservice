import { Routes } from '@angular/router';
import { AdminLoginComponent } from './alojamiento/components/admin-login/admin-login.component';
import { AdminLayoutComponent } from './alojamiento/components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './alojamiento/components/admin-dashboard/admin-dashboard.component';
import { AdminOferentesComponent } from './alojamiento/components/admin-oferentes/admin-oferentes.component';
import { AdminNotificacionesComponent } from './alojamiento/components/admin-notificaciones/admin-notificaciones.component';
import { OferenteLoginComponent } from './alojamiento/components/oferente-login/oferente-login.component';
import { OferenteLayoutComponent } from './alojamiento/components/oferente-layout/oferente-layout.component';
import { OferenteDashboardComponent } from './alojamiento/components/oferente-dashboard/oferente-dashboard.component';
import { GestionHospedajesComponent } from './alojamiento/components/gestion-hospedajes/gestion-hospedajes.component';
import { GestionReservasComponent } from './alojamiento/components/gestion-reservas/gestion-reservas.component';
import { OferenteNotificacionesComponent } from './alojamiento/components/oferente-notificaciones/oferente-notificaciones.component';
import { OferenteConfiguracionComponent } from './alojamiento/components/oferente-configuracion/oferente-configuracion.component';
import { LoginSelectorComponent } from './alojamiento/components/login-selector/login-selector.component';
import { FormRegistroAlojamientoComponent } from './alojamiento/components/form-registro-alojamiento/form-registro-alojamiento.component';
import { OferenteSolicitudComponent } from './alojamiento/components/oferente-solicitud/oferente-solicitud.component';
import { ClienteLoginComponent } from './alojamiento/components/cliente-login/cliente-login.component';
import { ClienteRegisterComponent } from './alojamiento/components/cliente-register/cliente-register.component';
import { ClienteLayoutComponent } from './alojamiento/components/cliente-layout/cliente-layout.component';
import { ListaAlojamientosComponent } from './alojamiento/components/lista-alojamientos/lista-alojamientos.component';
import { DetalleAlojamientoComponent } from './alojamiento/components/detalle-alojamiento/detalle-alojamiento.component';
import { ClienteReservasComponent } from './alojamiento/components/cliente-reservas/cliente-reservas.component';
import { ClienteNotificacionesComponent } from './alojamiento/components/cliente-notificaciones/cliente-notificaciones.component';
import { ClientePerfilComponent } from './alojamiento/components/cliente-perfil/cliente-perfil.component';
import { ClienteFavoritosComponent } from './alojamiento/components/cliente-favoritos/cliente-favoritos.component';
// duplicate import removed

export const routes: Routes = [
  { path: 'login', component: LoginSelectorComponent },
  {
    path: 'admin',
    children: [
      { path: 'login', component: AdminLoginComponent },
      {
        path: '',
        component: AdminLayoutComponent,
        // canActivate: [adminGuard],
        children: [
          {
            path: 'dashboard',
            component: AdminDashboardComponent,
            data: {
              heroTitle: '¡Bienvenido Administrador!',
              heroSubtitle: 'Gestiona la actividad turística de Arroyo Seco.',
              heroImage: 'assets/images/hero-dashboard.svg'
            }
          },
          {
            path: 'oferentes',
            component: AdminOferentesComponent,
            data: {
              heroTitle: '¡Gestión de oferentes!',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          {
            path: 'notificaciones',
            component: AdminNotificacionesComponent,
            data: {
              heroTitle: '¡Gestión de notificaciones!',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  {
    path: 'oferente',
    children: [
      { path: 'login', component: OferenteLoginComponent },
  { path: 'solicitud', component: OferenteSolicitudComponent },
      {
        path: '',
        component: OferenteLayoutComponent,
        // canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            component: OferenteDashboardComponent,
            data: {
              heroTitle: '¡Bienvenido Oferente!',
              heroSubtitle: 'Gestiona tus hospedajes y reservas.',
              heroImage: 'assets/images/hero-dashboard.svg'
            }
          },
          {
            path: 'hospedajes',
            component: GestionHospedajesComponent,
            data: {
              heroTitle: 'Gestión de hospedajes',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          {
            path: 'hospedajes/agregar',
            component: FormRegistroAlojamientoComponent,
            data: {
              heroTitle: 'Agregar alojamiento',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          {
            path: 'hospedajes/:id/editar',
            component: FormRegistroAlojamientoComponent,
            data: {
              heroTitle: 'Editar alojamiento',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          {
            path: 'hospedajes/:id',
            component: GestionReservasComponent,
            data: {
              heroTitle: 'Reservas del alojamiento',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          {
            path: 'reservas',
            component: GestionReservasComponent,
            data: {
              heroTitle: 'Gestión de reservas',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          {
            path: 'notificaciones',
            component: OferenteNotificacionesComponent,
            data: {
              heroTitle: 'Notificaciones',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          {
            path: 'configuracion',
            component: OferenteConfiguracionComponent,
            data: {
              heroTitle: 'Configuración',
              heroImage: 'assets/images/hero-dashboard.svg'
            }
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  {
    path: 'cliente',
    children: [
      { path: 'login', component: ClienteLoginComponent },
  { path: 'registrar', component: ClienteRegisterComponent },
      {
        path: '',
        component: ClienteLayoutComponent,
        children: [
          {
            path: 'alojamientos',
            component: ListaAlojamientosComponent,
            data: {
              heroTitle: 'Encuentra tu hospedaje ideal',
              heroSubtitle: 'Explora opciones en Arroyo Seco y sus alrededores.',
              heroImage: 'assets/images/hero-dashboard.svg'
            }
          },
          {
            path: 'alojamientos/:id',
            component: DetalleAlojamientoComponent,
            data: {
              heroTitle: 'Detalles del alojamiento',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          {
            path: 'reservas',
            component: ClienteReservasComponent,
            // canActivate: [authGuard],
            data: {
              heroTitle: 'Mis Reservas',
              heroSubtitle: 'Gestiona tus hospedajes reservados.',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          {
            path: 'notificaciones',
            component: ClienteNotificacionesComponent,
            // canActivate: [authGuard],
            data: {
              heroTitle: 'Notificaciones',
              heroSubtitle: 'Mantente al día con nuestras novedades.',
              heroImage: 'assets/images/hero-notificaciones.svg'
            }
          },
          {
            path: 'perfil',
            component: ClientePerfilComponent,
            // canActivate: [authGuard],
            data: {
              heroTitle: 'Mi Perfil',
              heroSubtitle: 'Administra tu información personal.',
              heroImage: 'assets/images/hero-dashboard.svg'
            }
          },
          {
            path: 'favoritos',
            component: ClienteFavoritosComponent,
            // canActivate: [authGuard],
            data: {
              heroTitle: 'Mis Favoritos',
              heroSubtitle: 'Alojamientos guardados para más tarde.',
              heroImage: 'assets/images/hero-oferentes.svg'
            }
          },
          { path: '', redirectTo: 'alojamientos', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
