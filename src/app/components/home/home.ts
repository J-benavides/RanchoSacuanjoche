import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { HeroComponent } from '../hero/hero';
import { EventosComponent } from '../eventos/eventos';
import { GaleriaComponent } from '../galeria/galeria';
import { PorqueComponent } from '../porque/porque';
import { PaquetesComponent } from '../paquetes/paquetes';
import { MenuComponent } from '../menu/menu';
import { ReservasComponent } from '../reservas/reservas';
import { ResenasComponent } from '../resenas/resenas';
import { ContactoComponent } from '../contacto/contacto';
import { FooterComponent } from '../footer/footer';
import { WhatsappBtnComponent } from '../whatsapp-btn/whatsapp-btn';

@Component({
  selector: 'app-home',
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
    ResenasComponent,
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
    <app-resenas />
    <app-contacto />
    <app-footer />
    <app-whatsapp-btn />
  `
})
export class HomeComponent {}