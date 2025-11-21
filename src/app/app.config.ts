import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { UserService } from './core/services/user.service';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    AuthService,
    ApiService,
    UserService,
    provideAnimations()
  ]
};
