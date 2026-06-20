import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminSidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-reservas-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './reservas-lista.html',
  styleUrl: './reservas-lista.css'
})
export class ReservasListaComponent implements OnInit {

  reservas = signal<any[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroEstado = signal('Todos');
  paginaActual = signal(1);
  Math = Math;
  porPagina = 10;

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

  reservasFiltradas = computed(() => {
    return this.reservas().filter(r => {
      const matchBusqueda = r.nombreCliente?.toLowerCase()
        .includes(this.busqueda().toLowerCase()) ||
        r.correo?.toLowerCase().includes(this.busqueda().toLowerCase());
      const matchEstado = this.filtroEstado() === 'Todos' ||
        r.estado === this.filtroEstado();
      return matchBusqueda && matchEstado;
    });
  });

  totalPaginas = computed(() =>
    Math.ceil(this.reservasFiltradas().length / this.porPagina)
  );

  reservasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.reservasFiltradas().slice(inicio, inicio + this.porPagina);
  });

  verDetalle(id: number) {
    this.router.navigate(['/admin/reservas', id]);
  }

  confirmar(id: number, event: Event) {
    event.stopPropagation();
    this.http.put(`http://localhost:8080/api/reservas/${id}/confirmar`, {}).subscribe({
      next: () => this.cargarReservas()
    });
  }

  cancelar(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Cancelar esta reserva?')) {
      this.http.put(`http://localhost:8080/api/reservas/${id}/cancelar`, {}).subscribe({
        next: () => this.cargarReservas()
      });
    }
  }

  paginaAnterior() {
    if (this.paginaActual() > 1)
      this.paginaActual.update(p => p - 1);
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas())
      this.paginaActual.update(p => p + 1);
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    const meses = ['ene','feb','mar','abr','may','jun',
                   'jul','ago','sep','oct','nov','dic'];
    return `${parseInt(partes[2])} ${meses[parseInt(partes[1])-1]} ${partes[0]}`;
  }

  formatNumber(n: number): string {
    return n?.toLocaleString('es-CR') || '0';
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
}