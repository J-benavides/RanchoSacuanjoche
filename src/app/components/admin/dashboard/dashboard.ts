import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminSidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  reservas = signal<any[]>([]);
  cargando = signal(true);

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
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  totalMes = computed(() => {
    const mes = new Date().getMonth();
    const anio = new Date().getFullYear();
    return this.reservas().filter(r => {
      const partes = r.fechaEvento.split('-');
      return parseInt(partes[1]) - 1 === mes && parseInt(partes[0]) === anio;
    }).length;
  });

  pendientes = computed(() =>
    this.reservas().filter(r => r.estado === 'PENDIENTE').length
  );

  confirmadas = computed(() =>
    this.reservas().filter(r => r.estado === 'CONFIRMADO').length
  );

  ingresoEstimado = computed(() =>
    this.reservas()
      .filter(r => r.estado !== 'CANCELADO')
      .reduce((acc, r) => acc + (r.totalEstimado || 0), 0)
  );

  ultimasReservas = computed(() =>
    this.reservas().slice(0, 5)
  );

  // Calendario
  mesActual = new Date();

  diasDelMes = computed(() => {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const dias = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: dias }, (_, i) => i + 1);
  });

  primerDiaMes = computed(() => {
    return new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1).getDay();
  });

  diasVacios = computed(() => {
    return Array.from({ length: this.primerDiaMes() }, (_, i) => i);
  });

  fechasReservadas = computed(() => {
    const mes = this.mesActual.getMonth();
    const anio = this.mesActual.getFullYear();
    return this.reservas()
      .filter(r => r.estado !== 'CANCELADO')
      .filter(r => {
        const partes = r.fechaEvento.split('-');
        const rAnio = parseInt(partes[0]);
        const rMes = parseInt(partes[1]) - 1;
        return rAnio === anio && rMes === mes;
      })
      .map(r => {
        const partes = r.fechaEvento.split('-');
        return parseInt(partes[2]);
      });
  });

  tieneEvento(dia: number): boolean {
    return this.fechasReservadas().includes(dia);
  }

  esHoy(dia: number): boolean {
    return dia === new Date().getDate() &&
           this.mesActual.getMonth() === new Date().getMonth() &&
           this.mesActual.getFullYear() === new Date().getFullYear();
  }

  getNombreMes(): string {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${meses[this.mesActual.getMonth()]} ${this.mesActual.getFullYear()}`;
  }

  getFechaHoy(): string {
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const hoy = new Date();
    return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;
  }

  formatNumber(n: number): string {
    return n.toLocaleString('es-CR');
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    const meses = ['ene','feb','mar','abr','may','jun',
                   'jul','ago','sep','oct','nov','dic'];
    const mes = parseInt(partes[1]) - 1;
    return `${parseInt(partes[2])} ${meses[mes]} ${partes[0]}`;
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

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  confirmarReserva(id: number, event: Event) {
    event.stopPropagation();
    this.http.put(`http://localhost:8080/api/reservas/${id}/confirmar`, {}).subscribe({
      next: () => this.cargarReservas(),
      error: (err) => console.error(err)
    });
  }

  cancelarReserva(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Estás segura de cancelar esta reserva?')) {
      this.http.put(`http://localhost:8080/api/reservas/${id}/cancelar`, {}).subscribe({
        next: () => this.cargarReservas(),
        error: (err) => console.error(err)
      });
    }
  }
}