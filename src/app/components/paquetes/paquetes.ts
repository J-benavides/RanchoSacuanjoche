import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css'
})
export class PaquetesComponent {
  paquetes = [
    {
      name: 'Económico',
      price: '₡21.000',
      slogan: '¡Un evento completo y elegante a un excelente precio!',
      minCapacity: 'Mínimo 100 personas',
      featured: false,
      isPremium: false,
      features: [
        'Alquiler de salón (hasta 5 horas de evento)',
        'Mobiliario completo (mesas y sillas para todos)',
        'Mantelería: mantel negro o blanco',
        'Sobremantel en color a elegir',
        'Sillas decoradas: forros negro o blanco con lazos decorativos',
        'Decoración del salón según temática',
        'Telas áreas decorativas',
        'Centros de mesa',
        'Decoración de entrada',
        'Carroza para fotos',
        'Alimentación, DJ, luces y humo',
        'Servicio de saleneros',
      ],
      premiumExtras: []
    },
    {
      name: 'Básico',
      price: '₡27.000',
      slogan: 'Disfrutá de una celebración completa con todo lo necesario para una noche inolvidable.',
      minCapacity: 'Mínimo 60 personas',
      featured: true,
      isPremium: false,
      features: [
        'Alquiler de salón (máximo 5 horas de evento)',
        'Mobiliario completo',
        'Mantelería: mantel negro o blanco',
        'Sobremantel en color a elegir',
        'Forros de silla (negro o blanco) con lazo decorativo',
        'Decoración del salón según temática',
        'Telas áreas decorativas',
        'Alquiler de centros de mesa',
        'Decoración de entrada principal',
        'Decoración de área para fotografías (staff)',
        'Carroza decorativa para fotos',
        'Mesa dulce: queque mediano (para 25 personas)',
        '80 bocadillos de repostería fina',
        'DJ profesional',
        'Rotafolio de bienvenida',
        'Alimentación completa',
        'Plataforma de video 360°',
      ],
      premiumExtras: []
    },
    {
      name: 'Premium',
      price: '₡35.000',
      slogan: '¡Tu logro, tu fiesta! Disfrutá de una celebración completa con todo lo necesario para una noche inolvidable.',
      minCapacity: 'Mínimo 60 personas',
      featured: false,
      isPremium: true,
      features: [
        'Todo lo incluido en el paquete Básico',
        'Alimentación completa con servicio de saloneros',
        'DJ profesional',
        'Maestro de ceremonia',
        'Rotafolio de bienvenida',
        'Plataforma de video 360°',
      ],
      premiumExtras: [
        'Cimarrona & Mascaradas',
        'Comparsa & Bailarinas',
        'Glitter & Pólvora',
      ]
    },
  ];

  scrollToBooking() {
    const element = document.getElementById('booking');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}