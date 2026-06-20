import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminSidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-calendario',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class CalendarioComponent implements OnInit {

  reservas = signal<any[]>([]);
  cargando = signal(true);
  mesActual = signal(new Date());

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.http.get<any[]>('http://localhost:8080/api/reservas').subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  diasDelMes = computed(() => {
    const fecha = this.mesActual();
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const dias = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: dias }, (_, i) => i + 1);
  });

  primerDiaMes = computed(() => {
    const fecha = this.mesActual();
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay();
  });

  diasVacios = computed(() =>
    Array.from({ length: this.primerDiaMes() }, (_, i) => i)
  );

  reservasDelMes = computed(() => {
    const fecha = this.mesActual();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    const mapa = new Map<number, any[]>();

    this.reservas().forEach(r => {
      const partes = r.fechaEvento.split('-');
      const rAnio = parseInt(partes[0]);
      const rMes = parseInt(partes[1]) - 1;
      const rDia = parseInt(partes[2]);

      if (rAnio === anio && rMes === mes) {
        if (!mapa.has(rDia)) mapa.set(rDia, []);
        mapa.get(rDia)!.push(r);
      }
    });
    return mapa;
  });

  getDiaEstado(dia: number): string {
    const reservasDia = this.reservasDelMes().get(dia);
    if (!reservasDia || reservasDia.length === 0) return '';

    if (reservasDia.some(r => r.estado === 'CONFIRMADO')) return 'CONFIRMADO';
    if (reservasDia.some(r => r.estado === 'PENDIENTE')) return 'PENDIENTE';
    if (reservasDia.every(r => r.estado === 'CANCELADO')) return 'CANCELADO';
    return '';
  }

  getDiaStyle(dia: number) {
    const estado = this.getDiaEstado(dia);
    const esHoy = this.esHoy(dia);

    if (estado === 'CONFIRMADO') {
      return { background: '#c9a84c', color: '#0a1628', fontWeight: '700' };
    }
    if (estado === 'PENDIENTE') {
      return { background: '#eab308', color: '#0a1628', fontWeight: '700' };
    }
    if (estado === 'CANCELADO') {
      return { background: '#ef4444', color: 'white', fontWeight: '700' };
    }
    if (esHoy) {
      return { background: 'rgba(255,255,255,0.1)', color: 'white',
               border: '2px solid #c9a84c', fontWeight: '600' };
    }
    return { color: '#9ca3af' };
  }

  esHoy(dia: number): boolean {
    const hoy = new Date();
    const fecha = this.mesActual();
    return dia === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
  }

  proximosEventos = computed(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return this.reservas()
      .filter(r => r.estado !== 'CANCELADO')
      .filter(r => {
        const partes = r.fechaEvento.split('-');
        const fechaEvento = new Date(
          parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2])
        );
        return fechaEvento >= hoy;
      })
      .sort((a, b) => a.fechaEvento.localeCompare(b.fechaEvento))
      .slice(0, 6);
  });

  mesAnterior() {
    const fecha = this.mesActual();
    this.mesActual.set(new Date(fecha.getFullYear(), fecha.getMonth() - 1, 1));
  }

  mesSiguiente() {
    const fecha = this.mesActual();
    this.mesActual.set(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1));
  }

  getNombreMes(): string {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const fecha = this.mesActual();
    return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    const meses = ['ene','feb','mar','abr','may','jun',
                   'jul','ago','sep','oct','nov','dic'];
    return `${parseInt(partes[2])} ${meses[parseInt(partes[1])-1]} ${partes[0]}`;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'CONFIRMADO': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'PENDIENTE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'CANCELADO': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'CONFIRMADO': return 'Confirmado';
      case 'PENDIENTE': return 'Pendiente';
      case 'CANCELADO': return 'Cancelado';
      default: return estado;
    }
  }

  verReserva(id: number) {
    this.router.navigate(['/admin/reservas', id]);
  }
}