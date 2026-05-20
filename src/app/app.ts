import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { EventosComponent } from './components/eventos/eventos';
import { GaleriaComponent } from './components/galeria/galeria';
import { PorqueComponent } from './components/porque/porque';
import { PaquetesComponent } from './components/paquetes/paquetes';
import { MenuComponent } from './components/menu/menu';
import { ReservasComponent } from './components/reservas/reservas';
import { ContactoComponent } from './components/contacto/contacto';
import { FooterComponent } from './components/footer/footer';
import { WhatsappBtnComponent } from './components/whatsapp-btn/whatsapp-btn';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    EventosComponent,
    GaleriaComponent,
    PorqueComponent,
    PaquetesComponent,
    MenuComponent,
    ReservasComponent,
    ContactoComponent,
    FooterComponent,
    WhatsappBtnComponent,
  ],
  template: `
    <app-navbar />
    <app-hero />
    <app-eventos />
    <app-galeria />
    <app-porque />
    <app-paquetes />
    <app-menu />
    <app-reservas />
    <app-contacto />
    <app-footer />
    <app-whatsapp-btn />
  `
})
export class App {}