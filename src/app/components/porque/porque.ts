import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-porque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './porque.html',
  styleUrl: './porque.css'
})
export class PorqueComponent {
  features = [
    {
      title: 'Amplio Espacio',
      description: 'Instalaciones espaciosas para eventos de 30 hasta 300 personas',
      icon: 'space'
    },
    {
      title: 'Decoración Personalizada',
      description: 'Creamos la ambientación perfecta según tu visión y estilo',
      icon: 'palette'
    },
    {
      title: 'Catering Opcional',
      description: 'Menús diversos y deliciosos preparados por chefs profesionales',
      icon: 'food'
    },
    {
      title: 'DJ y Luces',
      description: 'Sistema de sonido profesional e iluminación ambiental incluida',
      icon: 'music'
    },
    {
      title: 'Amplio Parqueo',
      description: 'Estacionamiento seguro y espacioso para todos tus invitados',
      icon: 'car'
    },
    {
      title: 'Área Natural',
      description: 'Hermosos jardines tropicales para fotografías y ceremonias',
      icon: 'nature'
    },
    {
      title: 'Atención Personalizada',
      description: 'Te acompañamos en cada detalle para hacer tu evento perfecto',
      icon: 'heart'
    },
    {
      title: 'Todo Incluido',
      description: 'Paquetes completos para que solo te preocupes por disfrutar',
      icon: 'check'
    },
  ];

  scrollToBooking() {
    const element = document.getElementById('booking');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
}