import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService, ReservaRequest } from '../../services/reserva';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class ReservasComponent implements OnInit {
  currentStep = signal(1);
  totalSteps = 4;

  fullName = signal('');
  phone = signal('');
  email = signal('');
  eventDate = signal('');
  eventType = signal('');
  guestCount = signal('');

  fechasReservadas = signal<string[]>([]);
  fechaNoDisponible = signal(false);

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

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.cargarFechasReservadas();
  }

  cargarFechasReservadas() {
    this.reservaService.getFechasReservadas().subscribe({
      next: (fechas) => this.fechasReservadas.set(fechas),
      error: (err) => console.error('Error cargando fechas:', err)
    });
  }

  esFechaReservada(fecha: string): boolean {
    return this.fechasReservadas().includes(fecha);
  }

  stepTitle(step: number): string {
    const titles: Record<number, string> = {
      1: 'Información del Evento',
      2: 'Elegí tu Paquete',
      3: 'Menú y Bebidas',
      4: 'Resumen',
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

  submitForm() {
    const pkg = this.selectedPackageData();

    const reservaRequest: ReservaRequest = {
      nombreCliente: this.fullName(),
      telefono: this.phone(),
      correo: this.email(),
      fechaEvento: this.eventDate(),
      tipoEvento: this.eventType(),
      cantidadPersonas: parseInt(this.guestCount()) || 0,
      paquete: pkg?.name || '',
      precioPorPersona: pkg?.pricePerPerson || 0,
      entradas: this.selectedEntradas().join(', '),
      carnes: this.selectedCarnes().join(', '),
      acompanamientos: this.selectedAcompanamientos().join(', '),
      postre: this.selectedPostre(),
    };

    this.reservaService.crearReserva(reservaRequest).subscribe({
      next: (reserva) => {
        console.log('Reserva guardada:', reserva);
        this.enviarWhatsApp(reserva.numeroCotizacion);
      },
      error: (err) => {
        if (err.error?.error?.includes('ya está reservada')) {
          alert('Lo sentimos, esa fecha ya está reservada. Por favor elegí otra fecha.');
        } else {
          this.enviarWhatsApp('');
        }
      }
    });
  }

  enviarWhatsApp(numeroCotizacion: string) {
    const pkg = this.selectedPackageData();
    const linea = '──────────────────────';

    const listaEntradas = this.selectedEntradas().length > 0
      ? this.selectedEntradas().map(e => `   • ${this.safe(e)}`).join('\n')
      : '   • No seleccionadas';

    const listaCarnes = this.selectedCarnes().length > 0
      ? this.selectedCarnes().map(c => `   • ${this.safe(c)}`).join('\n')
      : '   • No seleccionadas';

    const listaAcomps = this.selectedAcompanamientos().length > 0
      ? this.selectedAcompanamientos().map(a => `   • ${this.safe(a)}`).join('\n')
      : '   • No seleccionados';

    const postre = this.selectedPostre() || 'No seleccionado';

    const lineas = [
      '*RANCHO SACUANJOCHE*',
      numeroCotizacion
        ? `_Cotizacion N: ${numeroCotizacion}_`
        : '_Solicitud de Cotizacion_',
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
      `• Total estimado: CRC ${this.formatNumber(this.totalEstimado())}`,
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
      `• Para apartar (50%): CRC ${this.formatNumber(this.deposito())}`,
      `• Dia del evento (50%): CRC ${this.formatNumber(this.restante())}`,
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

      const fmt = (n: number) => n.toLocaleString('es-CR');

      const checkPage = (espacioNecesario: number) => {
        if (y + espacioNecesario > pageH - 30) {
          doc.addPage();
          y = 20;
        }
      };

      doc.setFillColor(...navy);
      doc.rect(0, 0, pageW, 42, 'F');
      doc.setFillColor(...gold);
      doc.rect(0, 0, 4, 42, 'F');
      doc.setFillColor(...gold);
      doc.rect(0, 42, pageW, 1.5, 'F');

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

      y = 52;

      doc.setFillColor(...grayLight);
      doc.roundedRect(margin, y - 4, contentW, 12, 2, 2, 'F');
      const numCot = `COT-${Date.now().toString().slice(-6)}`;
      const hoy = new Date().toLocaleDateString('es-CR');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.setFont('helvetica', 'bold');
      doc.text(`No. ${numCot}`, margin + 4, y + 3);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${hoy}`, pageW - margin - 4, y + 3, { align: 'right' });
      y += 16;

      const titulo = (texto: string) => {
        checkPage(20);
        doc.setFillColor(...navy);
        doc.rect(margin, y, contentW, 8, 'F');
        doc.setFillColor(...gold);
        doc.rect(margin, y, 3, 8, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(texto.toUpperCase(), margin + 8, y + 5.5);
        y += 13;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
      };

      const fila = (label: string, valor: string) => {
        checkPage(10);
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

      const subcat = (nombre: string) => {
        checkPage(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...navy);
        doc.text(`${nombre}:`, margin + 4, y);
        y += 6;
      };

      const itemLista = (texto: string) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...dark);
        doc.setFontSize(8.5);
        const lines = doc.splitTextToSize(texto, contentW - 18);
        lines.forEach((line: string, i: number) => {
          checkPage(6);
          doc.text(i === 0 ? `• ${line}` : `  ${line}`, margin + 8, y);
          y += 5;
        });
      };

      titulo('Datos del Cliente');
      fila('Nombre', this.safe(this.fullName()));
      fila('Telefono', this.safe(this.phone()));
      fila('Correo', this.safe(this.email()));
      y += 5;

      titulo('Detalles del Evento');
      fila('Tipo', this.safe(this.eventType()));
      fila('Fecha', this.formatFecha(this.eventDate()));
      fila('Personas', `${this.safe(this.guestCount())} personas`);
      y += 5;

      titulo('Paquete Elegido');
      if (pkg) {
        checkPage(30);
        doc.setFillColor(...grayLight);
        doc.roundedRect(margin, y, contentW, 24, 3, 3, 'F');
        doc.setFillColor(...gold);
        doc.roundedRect(margin, y, 3, 24, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...navy);
        doc.text(`Paquete ${pkg.name}`, margin + 8, y + 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...grayText);
        doc.text(
          `${pkg.price} por persona  x  ${this.guestCount()} personas`,
          margin + 8, y + 17
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...gold);
        doc.text(
          `CRC ${fmt(this.totalEstimado())}`,
          pageW - margin - 5, y + 9,
          { align: 'right' }
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...grayText);
        doc.text('Total estimado', pageW - margin - 5, y + 17, { align: 'right' });

        y += 30;
      }

      titulo('Menu Seleccionado');

      if (this.selectedEntradas().length > 0) {
        subcat('Entradas');
        this.selectedEntradas().forEach(e => itemLista(e));
        y += 3;
      }
      if (this.selectedCarnes().length > 0) {
        subcat('Carnes');
        this.selectedCarnes().forEach(c => itemLista(c));
        y += 3;
      }
      if (this.selectedAcompanamientos().length > 0) {
        subcat('Acompañamientos');
        this.selectedAcompanamientos().forEach(a => itemLista(a));
        y += 3;
      }
      if (this.selectedPostre()) {
        subcat('Postre');
        itemLista(this.selectedPostre());
        y += 3;
      }
      y += 5;

      checkPage(60);
      titulo('Forma de Pago');

      const mitad = (contentW / 2) - 3;

      doc.setFillColor(...navy);
      doc.roundedRect(margin, y, mitad, 24, 3, 3, 'F');
      doc.setFillColor(...gold);
      doc.roundedRect(margin, y, mitad, 2.5, 3, 3, 'F');
      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Para apartar (50%)', margin + mitad / 2, y + 10, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(
        `CRC ${fmt(this.deposito())}`,
        margin + mitad / 2, y + 19,
        { align: 'center' }
      );

      doc.setFillColor(...navyMid);
      doc.roundedRect(margin + mitad + 6, y, mitad, 24, 3, 3, 'F');
      doc.setFillColor(...gold);
      doc.roundedRect(margin + mitad + 6, y, mitad, 2.5, 3, 3, 'F');
      doc.setTextColor(...white);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Dia del evento (50%)', margin + mitad + 6 + mitad / 2, y + 10, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...gold);
      doc.text(
        `CRC ${fmt(this.restante())}`,
        margin + mitad + 6 + mitad / 2, y + 19,
        { align: 'center' }
      );

      y += 30;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...grayText);
      doc.text(
        'Metodo: SINPE Movil - El numero se enviara al confirmar la reserva.',
        margin + 4, y
      );

      y += 12;

      doc.setFillColor(...gold);
      doc.rect(0, y, pageW, 1, 'F');
      y += 1;

      doc.setFillColor(...navy);
      doc.rect(0, y, pageW, 20, 'F');
      doc.setFillColor(...gold);
      doc.rect(0, y, 4, 20, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...white);
      doc.text('Rancho Sacuanjoche', pageW / 2, y + 7, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 180, 180);
      doc.text(
        'Santa Cruz, Guanacaste, Costa Rica  |  ranchosacuanjoche.com',
        pageW / 2, y + 13,
        { align: 'center' }
      );

      doc.setFontSize(6.5);
      doc.setTextColor(...gold);
      doc.text(
        'Esta cotizacion es valida por 15 dias. Precios sujetos a cambios.',
        pageW / 2, y + 19,
        { align: 'center' }
      );

      doc.save(`cotizacion-rancho-sacuanjoche-${numCot}.pdf`);

    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      this.generandoPdf.set(false);
    }
  }
}