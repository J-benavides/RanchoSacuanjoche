import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/admin/login/login';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { ReservasListaComponent } from './components/admin/reservas/reservas-lista/reservas-lista';
import { ReservaDetalleComponent } from './components/admin/reservas/reserva-detalle/reserva-detalle';
import { CalendarioComponent } from './components/admin/calendario/calendario';
import { GaleriaAdminComponent } from './components/admin/galeriaAdmin/galeriaAdmin';
import { PaquetesAdminComponent } from './components/admin/paquetes/paquetes-admin';
import { ResenasAdminComponent } from './components/admin/resenas/resenas-admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/reservas', component: ReservasListaComponent },
  { path: 'admin/reservas/:id', component: ReservaDetalleComponent },
  { path: 'admin/calendario', component: CalendarioComponent },
  { path: 'admin/galeria', component: GaleriaAdminComponent },
  { path: 'admin/paquetes', component: PaquetesAdminComponent },
  { path: 'admin/resenas',  component: ResenasAdminComponent },
];