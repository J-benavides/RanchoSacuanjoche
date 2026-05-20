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

  formatFechaDisplay(fecha: string): string {
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

      const navy: [number,number,number] = [10, 22, 40];
      const navyMid: [number,number,number] = [21, 42, 82];
      const gold: [number,number,number] = [201, 168, 76];
      const white: [number,number,number] = [255, 255, 255];
      const grayLight: [number,number,number] = [245, 245, 245];
      const grayText: [number,number,number] = [120, 120, 120];
      const dark: [number,number,number] = [40, 40, 40];

      const pageW = 210;
      const pageH = 297;
      const margin = 14;
      const contentW = pageW - margin * 2;
      let y = 0;

      // ── HEADER ──────────────────────────────────────────
      doc.setFillColor(...navy);
      doc.rect(0, 0, pageW, 42, 'F');

      // Barra dorada izquierda decorativa
      doc.setFillColor(...gold);
      doc.rect(0, 0, 4, 42, 'F');

      doc.setTextColor(...white);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RANCHO SACUANJOCHE', pageW / 2, 16, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Sala de Eventos  |  Santa Cruz, Guanacaste, Costa Rica', pageW / 2, 24, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(...gold);
      doc.setFont('helvetica', 'bold');
      doc.text('COTIZACION DE EVENTO', pageW / 2, 33, { align: 'center' });

      // Línea dorada inferior del header
      doc.setFillColor(...gold);
      doc.rect(0, 42, pageW, 1.5, 'F');

      y = 52;

      // Número y fecha en fondo gris suave
      doc.setFillColor(...grayLight);
      doc.roundedRect(margin, y - 4, contentW, 12, 2, 2, 'F');
      const numCot = `COT-${Date.now().toString().slice(-6)}`;
      const hoy = new Date().toLocaleDateString('es-CR');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.setFont('helvetica', 'bold');
      doc.text(`N. ${numCot}`, margin + 4, y + 3);
      doc.setFont('helvetica', 'normal');
      doc.text(`Emitido: ${hoy}`, pageW - margin - 4, y + 3, { align: 'right' });

      y += 16;

      // ── HELPER: título de sección ────────────────────────
      const titulo = (texto: string, icono?: string) => {
        // Barra lateral dorada
        doc.setFillColor(...gold);
        doc.rect(margin, y, 2, 8, 'F');
        // Fondo navy
        doc.setFillColor(...navy);
        doc.rect(margin + 2, y, contentW - 2, 8, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(texto.toUpperCase(), margin + 8, y + 5.5);
        y += 13;
        doc.setTextColor(...dark);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
      };

      // ── HELPER: fila ─────────────────────────────────────
      const fila = (label: string, valor: string) => {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y - 3, contentW, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...navy);
        doc.setFontSize(8.5);
        doc.text(`${label}:`, margin + 4, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...dark);
        doc.text(valor, margin + 42, y + 1);
        y += 8;
      };

      // ── HELPER: ítem de lista ────────────────────────────
      const item = (texto: string) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...dark);
        doc.setFontSize(8.5);
        const lines = doc.splitTextToSize(texto, contentW - 16);
        doc.text('-', margin + 6, y);
        lines.forEach((line: string, i: number) => {
          doc.text(line, margin + 10, y);
          y += 5;
        });
      };

      // ── HELPER: subcategoría menú ─────────────────────────
      const subcat = (nombre: string) => {
        doc.setFillColor(...gold);
        doc.setTextColor(...navy);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(`${nombre}:`, margin + 4, y);
        y += 6;
      };

      // ── SECCIÓN: Datos del cliente ───────────────────────
      titulo('Datos del Cliente');
      fila('Nombre', this.safe(this.fullName()));
      fila('Telefono', this.safe(this.phone()));
      fila('Correo', this.safe(this.email()));
      y += 4;

      // ── SECCIÓN: Detalles del evento ─────────────────────
      titulo('Detalles del Evento');
      fila('Tipo de evento', this.safe(this.eventType()));
      fila('Fecha', this.formatFechaDisplay(this.eventDate()));
      fila('Personas', `${this.safe(this.guestCount())} personas`);
      y += 4;

      // ── SECCIÓN: Paquete ─────────────────────────────────
      titulo('Paquete Elegido');
      if (pkg) {
        // Tarjeta del paquete
        doc.setFillColor(...grayLight);
        doc.roundedRect(margin, y, contentW, 26, 3, 3, 'F');
        doc.setFillColor(...gold);
        doc.roundedRect(margin, y, 3, 26, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...navy);
        doc.text(`Paquete ${pkg.name}`, margin + 8, y + 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...grayText);
        doc.text(
          `${pkg.price} por persona  x  ${this.guestCount()} personas`,
          margin + 8, y + 17
        );

        // Total destacado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...gold);
        doc.text(
          `CRC ${this.formatNumber(this.totalEstimado())}`,
          pageW - margin - 5, y + 10,
          { align: 'right' }
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...grayText);
        doc.text('Total estimado', pageW - margin - 5, y + 17, { align: 'right' });

        y += 32;
      }

      // ── SECCIÓN: Menú ────────────────────────────────────
      titulo('Menu Seleccionado');

      if (this.selectedEntradas().length > 0) {
        subcat('Entradas');
        this.selectedEntradas().forEach(e => item(e));
        y += 2;
      }
      if (this.selectedCarnes().length > 0) {
        subcat('Carnes');
        this.selectedCarnes().forEach(c => item(c));
        y += 2;
      }
      if (this.selectedAcompanamientos().length > 0) {
        subcat('Acompañamientos');
        this.selectedAcompanamientos().forEach(a => item(a));
        y += 2;
      }
      if (this.selectedPostre()) {
        subcat('Postre');
        item(this.selectedPostre());
        y += 2;
      }
      y += 4;

      // ── SECCIÓN: Forma de pago ───────────────────────────
      titulo('Forma de Pago');

      const mitad = (contentW / 2) - 3;

      // Tarjeta izquierda
      doc.setFillColor(...navy);
      doc.roundedRect(margin, y, mitad, 26, 3, 3, 'F');
      doc.setFillColor(...gold);
      doc.roundedRect(margin, y, mitad, 2, 3, 3, 'F');
      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Para apartar (50%)', margin + mitad / 2, y + 10, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(
        `CRC ${this.formatNumber(this.deposito())}`,
        margin + mitad / 2, y + 20,
        { align: 'center' }
      );

      // Tarjeta derecha
      doc.setFillColor(...navyMid);
      doc.roundedRect(margin + mitad + 6, y, mitad, 26, 3, 3, 'F');
      doc.setFillColor(...gold);
      doc.roundedRect(margin + mitad + 6, y, mitad, 2, 3, 3, 'F');
      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Dia del evento (50%)', margin + mitad + 6 + mitad / 2, y + 10, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(
        `CRC ${this.formatNumber(this.restante())}`,
        margin + mitad + 6 + mitad / 2, y + 20,
        { align: 'center' }
      );

      y += 32;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.text(
        'Metodo: SINPE Movil  -  El numero se enviara al confirmar la reserva.',
        margin + 4, y
      );

      // ── FOOTER ──────────────────────────────────────────
      // Siempre al fondo de la página
      const footerY = pageH - 22;

      doc.setFillColor(...gold);
      doc.rect(0, footerY, pageW, 0.8, 'F');

      doc.setFillColor(...navy);
      doc.rect(0, footerY + 0.8, pageW, 21.2, 'F');

      doc.setFillColor(...gold);
      doc.rect(0, footerY + 0.8, 4, 21.2, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...white);
      doc.text('Rancho Sacuanjoche', pageW / 2, footerY + 8, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 180, 180);
      doc.text(
        'Santa Cruz, Guanacaste, Costa Rica  |  ranchosacuanjoche.com',
        pageW / 2, footerY + 14,
        { align: 'center' }
      );

      doc.setFontSize(6.5);
      doc.setTextColor(...gold);
      doc.text(
        'Esta cotizacion es valida por 15 dias. Precios sujetos a cambios sin previo aviso.',
        pageW / 2, footerY + 20,
        { align: 'center' }
      );

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