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
      image: 'https://images.unsplash.com/photo-1759054710581-c7745b02cb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: 'Graduaciones',
      description: 'Celebrá tus logros en grande con tu familia y amigos',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1775476793931-cb484f197760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: '15 Años',
      description: 'Una quinceañera de ensueño que recordarás para siempre',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1766393195987-912865cbb81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: 'Eventos Corporativos',
      description: 'El espacio ideal para conferencias, seminarios y celebraciones empresariales',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1768851142332-75f3d1b47452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: 'Fiestas Privadas',
      description: 'Celebraciones exclusivas diseñadas a tu medida',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1766393524464-e5eb1b05e4c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: 'Baby Showers',
      description: 'Dale la bienvenida a tu bebé en un ambiente cálido y especial',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1660740220701-3612091dd6db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      title: 'Cumpleaños',
      description: 'Celebrá otro año de vida con estilo y alegría',
      capacity: '60-300 personas',
      image: 'https://images.unsplash.com/photo-1769812344081-92b3e2ac39c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
  ];

  scrollToBooking() {
    const element = document.getElementById('booking');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}