import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class ReservasComponent {
  currentStep = signal(1);
  totalSteps = 4;

  formData: FormData = {
    fullName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
  };

  eventTypes = [
    'Boda', 'Quinceañera', 'Graduación', 'Cumpleaños',
    'Baby Shower', 'Evento Corporativo', 'Fiesta Privada',
  ];

  paquetes = [
    {
      id: 'economico',
      name: 'Económico',
      price: '₡21.000',
      pricePerPerson: 21000,
      minPersonas: 100,
      badge: '',
      features: [
        'Alquiler de salón (hasta 5 horas)',
        'Mobiliario completo',
        'Mantelería negra o blanca',
        'Sobremantel en color a elegir',
        'Sillas decoradas con forros y lazos',
        'Decoración del salón según temática',
        'Telas áreas decorativas',
        'Centros de mesa, decoración de entrada, carroza para fotos',
        'Alimentación, DJ, luces y humo',
        'Servicio de saleneros',
      ],
    },
    {
      id: 'basico',
      name: 'Básico',
      price: '₡27.000',
      pricePerPerson: 27000,
      minPersonas: 60,
      badge: '⭐ Más Popular',
      features: [
        'Todo lo del Económico más:',
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
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₡35.000',
      pricePerPerson: 35000,
      minPersonas: 60,
      badge: '',
      features: [
        'Todo lo del Básico más:',
        'Alimentación completa con servicio de saloneros',
        'Maestro de ceremonia',
        'Cimarrona & Mascaradas',
        'Comparsa & Bailarinas',
        'Glitter & Pólvora',
      ],
    },
  ];

  entradas = [
    'Chifrijo artesanal con toque especial de la casa',
    'Frijoles blancos cremosos con cerdo sazonado',
    'Cremas variadas: ayote, zanahoria, espárragos, cebolla',
    'Crema de papa al estilo tradicional',
    'Ceviche fresco de pescado con notas cítricas',
    'Consomé de pollo casero',
  ];

  carnes = [
    'Pechuga de pollo a la plancha con finas hierbas',
    'Lomo de cerdo a la plancha jugoso',
    'Costilla a la BBQ tierna y glaseada',
    'Res mechada en su salsa con vegetales frescos',
  ];

  acompanamientos = [
    'Arroz especial (blanco, maíz dulce, jardinera o almendrado)',
    'Puré artesanal de papa o yuca',
    'Ensalada verde fresca multicolor',
    'Papas salteadas con toque dorado',
    'Vegetales al vapor',
    'Yuca al mojo',
    'Frijoles picantes al estilo criollo',
    'Ensalada fría de papa',
    'Ensalada rusa tradicional',
    'Ensalada tica de repollo',
  ];

  postres = [
    'Carlota de Fresa',
    'Carlota de Melocotón',
    'Cheesecake de Fresa o Melocotón',
    'Cheesecake de Limón o Maracuyá',
    'Flan de Caramelo',
    'Flan de Coco',
    'Pie Limón',
    'Pie Melocotón',
    'Tres Leches',
  ];

  selectedPackage = signal<string>('');
  selectedEntradas = signal<string[]>([]);
  selectedCarnes = signal<string[]>([]);
  selectedAcompanamientos = signal<string[]>([]);
  selectedPostre = signal<string>('');

  progressPercentage = computed(() =>
    (this.currentStep() / this.totalSteps) * 100
  );

  selectedPackageData = computed(() =>
    this.paquetes.find(p => p.id === this.selectedPackage())
  );

  totalEstimado = computed(() => {
    const pkg = this.selectedPackageData();
    const guests = parseInt(this.formData.guestCount) || 0;
    return pkg ? pkg.pricePerPerson * guests : 0;
  });

  deposito = computed(() => this.totalEstimado() * 0.5);
  restante = computed(() => this.totalEstimado() * 0.5);

  stepTitle(step: number): string {
    const titles: Record<number, string> = {
      1: 'Información del Evento',
      2: 'Elegí tu Paquete',
      3: 'Menú y Bebidas',
      4: 'Resumen de tu Cotización',
    };
    return titles[step] || '';
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  toggleEntrada(item: string) {
    const max = parseInt(this.formData.guestCount) >= 100 ? 2 : 1;
    this.selectedEntradas.update(list => {
      if (list.includes(item)) return list.filter(i => i !== item);
      if (list.length >= max) return list;
      return [...list, item];
    });
  }

  toggleCarne(item: string) {
    this.selectedCarnes.update(list => {
      if (list.includes(item)) return list.filter(i => i !== item);
      if (list.length >= 2) return list;
      return [...list, item];
    });
  }

  toggleAcompanamiento(item: string) {
    this.selectedAcompanamientos.update(list => {
      if (list.includes(item)) return list.filter(i => i !== item);
      if (list.length >= 3) return list;
      return [...list, item];
    });
  }

  formatNumber(n: number): string {
    return n.toLocaleString('es-CR');
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  submitForm() {
    const pkg = this.selectedPackageData();
    const mensaje = `¡Hola! Me gustaría solicitar una cotización para mi evento:

📅 *Información del Evento*
- Nombre: ${this.formData.fullName}
- Teléfono: ${this.formData.phone}
- Email: ${this.formData.email}
- Fecha: ${this.formData.eventDate}
- Tipo de evento: ${this.formData.eventType}
- Cantidad de personas: ${this.formData.guestCount}

📦 *Paquete Seleccionado*
- ${pkg?.name} - ${pkg?.price} por persona
- Total estimado: ₡${this.formatNumber(this.totalEstimado())}

🍽️ *Menú Seleccionado*
${this.selectedEntradas().length > 0 ? `Entradas: ${this.selectedEntradas().join(', ')}` : ''}
${this.selectedCarnes().length > 0 ? `Carnes: ${this.selectedCarnes().join(', ')}` : ''}
${this.selectedAcompanamientos().length > 0 ? `Acompañamientos: ${this.selectedAcompanamientos().join(', ')}` : ''}
${this.selectedPostre() ? `Postre: ${this.selectedPostre()}` : ''}

💰 *Forma de Pago*
- Para apartar (50%): ₡${this.formatNumber(this.deposito())}
- Pago restante (50%): ₡${this.formatNumber(this.restante())}
- Método: SINPE Móvil

¡Gracias!`;

    const numero = '50662969944'; // reemplazá con el número real de tu mamá
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}