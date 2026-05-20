import { Component, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  fullName = signal('');
  phone = signal('');
  email = signal('');
  eventDate = signal('');
  eventType = signal('');
  guestCount = signal('');

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
  generandoPdf = signal(false);

  progressPercentage = computed(() =>
    (this.currentStep() / this.totalSteps) * 100
  );

  selectedPackageData = computed(() =>
    this.paquetes.find(p => p.id === this.selectedPackage())
  );

  maxEntradas = computed(() => {
    const guests = parseInt(this.guestCount()) || 0;
    return guests >= 100 ? 2 : 1;
  });

  totalEstimado = computed(() => {
    const pkg = this.selectedPackageData();
    const guests = parseInt(this.guestCount()) || 0;
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

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
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
    const max = this.maxEntradas();
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

  isEntradasDisabled(item: string): boolean {
    return !this.selectedEntradas().includes(item) &&
           this.selectedEntradas().length >= this.maxEntradas();
  }

  isCarnasDisabled(item: string): boolean {
    return !this.selectedCarnes().includes(item) &&
           this.selectedCarnes().length >= 2;
  }

  isAcompDisabled(item: string): boolean {
    return !this.selectedAcompanamientos().includes(item) &&
           this.selectedAcompanamientos().length >= 3;
  }

  formatNumber(n: number): string {
    return n.toLocaleString('es-CR');
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private safe(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  async descargarPDF() {
    this.generandoPdf.set(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const pkg = this.selectedPackageData();
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const navy = [10, 22, 40] as [number, number, number];
      const gold = [201, 168, 76] as [number, number, number];
      const white = [255, 255, 255] as [number, number, number];
      const grayLight = [248, 248, 248] as [number, number, number];
      const grayText = [100, 100, 100] as [number, number, number];

      const pageW = 210;
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = 0;

      // Header
      doc.setFillColor(...navy);
      doc.rect(0, 0, pageW, 35, 'F');
      doc.setFillColor(...gold);
      doc.rect(0, 35, pageW, 3, 'F');

      doc.setTextColor(...white);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RANCHO SACUANJOCHE', pageW / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Sala de Eventos | Santa Cruz, Costa Rica', pageW / 2, 23, { align: 'center' });
      doc.setFontSize(9);
      doc.text('COTIZACION DE EVENTO', pageW / 2, 31, { align: 'center' });

      y = 48;

      // Numero de cotizacion y fecha
      const numCot = `COT-${Date.now().toString().slice(-6)}`;
      const hoy = new Date().toLocaleDateString('es-CR');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.text(`No. ${numCot}`, margin, y);
      doc.text(`Fecha: ${hoy}`, pageW - margin, y, { align: 'right' });
      y += 8;

      // Seccion helper
      const seccion = (titulo: string) => {
        doc.setFillColor(...navy);
        doc.rect(margin, y, contentW, 7, 'F');
        doc.setTextColor(...gold);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo.toUpperCase(), margin + 3, y + 5);
        y += 12;
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
      };

      const fila = (label: string, valor: string, negrita = false) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...navy);
        doc.text(`${label}:`, margin + 3, y);
        doc.setFont('helvetica', negrita ? 'bold' : 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(valor, margin + 35, y);
        y += 6;
      };

      // Datos del cliente
      seccion('Datos del Cliente');
      fila('Nombre', this.safe(this.fullName()));
      fila('Telefono', this.safe(this.phone()));
      fila('Correo', this.safe(this.email()));
      y += 3;

      // Detalles del evento
      seccion('Detalles del Evento');
      fila('Tipo', this.safe(this.eventType()));
      fila('Fecha', this.formatFecha(this.eventDate()));
      fila('Personas', `${this.safe(this.guestCount())} personas`);
      y += 3;

      // Paquete
      seccion('Paquete Elegido');
      if (pkg) {
        doc.setFillColor(...grayLight);
        doc.rect(margin, y - 2, contentW, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...navy);
        doc.text(`Paquete ${pkg.name}`, margin + 3, y + 5);
        doc.setFontSize(9);
        doc.setTextColor(...grayText);
        doc.text(`${pkg.price} por persona x ${this.guestCount()} personas`, margin + 3, y + 11);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...gold);
        doc.text(`Total: (C)${this.formatNumber(this.totalEstimado())}`, pageW - margin - 3, y + 8, { align: 'right' });
        y += 25;
      }
      y += 3;

      // Menu
      seccion('Menu Seleccionado');

      const listaMenu = (categoria: string, items: string[]) => {
        if (items.length === 0) return;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...navy);
        doc.setFontSize(9);
        doc.text(`${categoria}:`, margin + 3, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        items.forEach(item => {
          doc.text(`• ${item}`, margin + 8, y);
          y += 5;
        });
        y += 2;
      };

      listaMenu('Entradas', this.selectedEntradas());
      listaMenu('Carnes', this.selectedCarnes());
      listaMenu('Acompañamientos', this.selectedAcompanamientos());
      if (this.selectedPostre()) {
        listaMenu('Postre', [this.selectedPostre()]);
      }
      y += 3;

      // Forma de pago
      seccion('Forma de Pago');
      doc.setFillColor(...navy);
      doc.rect(margin, y - 2, contentW / 2 - 2, 22, 'F');
      doc.setFillColor(21, 42, 82);
      doc.rect(margin + contentW / 2 + 2, y - 2, contentW / 2 - 2, 22, 'F');

      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Para apartar (50%)', margin + contentW / 4, y + 4, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(`(C)${this.formatNumber(this.deposito())}`, margin + contentW / 4, y + 13, { align: 'center' });

      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Dia del evento (50%)', margin + contentW * 3 / 4 + 2, y + 4, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(`(C)${this.formatNumber(this.restante())}`, margin + contentW * 3 / 4 + 2, y + 13, { align: 'center' });

      y += 27;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.text('Metodo de pago: SINPE Movil. El numero se enviara al confirmar la reserva.', margin + 3, y);

      // Footer
      y = 275;
      doc.setFillColor(...gold);
      doc.rect(0, y, pageW, 0.5, 'F');
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.text('Rancho Sacuanjoche | Santa Cruz, Guanacaste, Costa Rica', pageW / 2, y, { align: 'center' });
      doc.text('ranchosacuanjoche.com', pageW / 2, y + 5, { align: 'center' });
      doc.setFontSize(7);
      doc.text('Esta cotizacion es valida por 15 dias. Precios sujetos a cambios sin previo aviso.', pageW / 2, y + 10, { align: 'center' });

      doc.save(`cotizacion-rancho-sacuanjoche-${numCot}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      this.generandoPdf.set(false);
    }
  }

  submitForm() {
    const pkg = this.selectedPackageData();
    const linea = '──────────────────────';

    const listaEntradas = this.selectedEntradas().length > 0
      ? this.selectedEntradas().map(e => `   • ${e}`).join('\n')
      : '   • No seleccionadas';

    const listaCarnes = this.selectedCarnes().length > 0
      ? this.selectedCarnes().map(c => `   • ${c}`).join('\n')
      : '   • No seleccionadas';

    const listaAcomps = this.selectedAcompanamientos().length > 0
      ? this.selectedAcompanamientos().map(a => `   • ${a}`).join('\n')
      : '   • No seleccionados';

    const postre = this.selectedPostre() || 'No seleccionado';

    const lineas = [
      '*RANCHO SACUANJOCHE*',
      '_Solicitud de Cotizacion_',
      linea,
      '',
      '*DATOS DEL CLIENTE*',
      `• Nombre: ${this.safe(this.fullName())}`,
      `• Telefono: ${this.safe(this.phone())}`,
      `• Correo: ${this.safe(this.email())}`,
      '',
      linea,
      '',
      '*DETALLES DEL EVENTO*',
      `• Tipo: ${this.safe(this.eventType())}`,
      `• Fecha: ${this.formatFecha(this.eventDate())}`,
      `• Personas: ${this.safe(this.guestCount())}`,
      '',
      linea,
      '',
      '*PAQUETE ELEGIDO*',
      `• ${this.safe(pkg?.name)} - ${this.safe(pkg?.price)} por persona`,
      `• Total estimado: (C)${this.formatNumber(this.totalEstimado())}`,
      '',
      linea,
      '',
      '*MENU SELECCIONADO*',
      '',
      'Entradas:',
      listaEntradas,
      '',
      'Carnes:',
      listaCarnes,
      '',
      'Acompanamientos:',
      listaAcomps,
      '',
      'Postre:',
      `   • ${postre}`,
      '',
      linea,
      '',
      '*FORMA DE PAGO*',
      `• Para apartar (50%): (C)${this.formatNumber(this.deposito())}`,
      `• Dia del evento (50%): (C)${this.formatNumber(this.restante())}`,
      '• Metodo: SINPE Movil',
      '  _(El numero se enviara al confirmar)_',
      '',
      linea,
      '_Enviado desde ranchosacuanjoche.com_',
    ];

    const mensaje = lineas.join('\n');
    const numero = '50662969944';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}