import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class EventosComponent {
  eventos = [
    {
      title: 'Bodas',
      description: 'El día más especial de tu vida merece un escenario mágico',
      capacity: '60-300 personas',
      image: 'images/Boda.jpg',
    },
    {
      title: 'Graduaciones',
      description: 'Celebrá tus logros en grande con tu familia y amigos',
      capacity: '60-300 personas',
      image: 'images/Graduacion.png',
    },
    {
      title: '15 Años',
      description: 'Una quinceañera de ensueño que recordarás para siempre',
      capacity: '60-300 personas',
      image: 'images/quince.jpg',
    },
    {
      title: 'Eventos Corporativos',
      description: 'El espacio ideal para conferencias, seminarios y celebraciones empresariales',
      capacity: '60-300 personas',
      image: 'images/eventoCorporativo.jpg',
    },
    {
      title: 'Fiestas Privadas',
      description: 'Celebraciones exclusivas diseñadas a tu medida como Convivencias, Aniversarios, Reuniones Familiares y más',
      capacity: '60-300 personas',
      image: 'images/fiestaPrivada.png',
    },
    {
      title: 'Baby Showers',
      description: 'Dale la bienvenida a tu bebé en un ambiente cálido y especial',
      capacity: '60-300 personas',
      image: 'images/babyShowers.jpg',
    },
    {
      title: 'Cumpleaños',
      description: 'Celebrá otro año de vida con estilo y alegría',
      capacity: '60-300 personas',
      image: 'images/Cumple.jpg',
    },
  ];

  scrollToBooking() {
    const element = document.getElementById('booking');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}