import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminSidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-reserva-detalle',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './reserva-detalle.html',
  styleUrl: './reserva-detalle.css'
})
export class ReservaDetalleComponent implements OnInit {

  reserva = signal<any>(null);
  cargando = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarReserva(id);
  }

  cargarReserva(id: string) {
    this.http.get<any>(`http://localhost:8080/api/reservas/${id}`).subscribe({
      next: (data) => {
        this.reserva.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  volver() {
    this.router.navigate(['/admin/reservas']);
  }

  confirmar() {
    const r = this.reserva();
    this.http.put(`http://localhost:8080/api/reservas/${r.id}/confirmar`, {}).subscribe({
      next: () => this.cargarReserva(r.id)
    });
  }

  cancelar() {
    if (!confirm('¿Estás segura de cancelar esta reserva?')) return;
    const r = this.reserva();
    this.http.put(`http://localhost:8080/api/reservas/${r.id}/cancelar`, {}).subscribe({
      next: () => this.cargarReserva(r.id)
    });
  }

  enviarWhatsApp() {
    const r = this.reserva();
    const telefono = r.telefono.replace(/\D/g, '');
    const mensaje = `Hola ${r.nombreCliente}, le escribo de Rancho Sacuanjoche con respecto a su reserva para ${r.tipoEvento} el ${this.formatFecha(r.fechaEvento)}.`;
    window.open(`https://wa.me/506${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  enviarCorreo() {
    const r = this.reserva();
    window.location.href = `mailto:${r.correo}?subject=Confirmación de Reserva - Rancho Sacuanjoche`;
  }

  totalEstimado = computed(() => this.reserva()?.totalEstimado || 0);
  deposito = computed(() => this.reserva()?.deposito || 0);
  restante = computed(() => this.reserva()?.restante || 0);

  entradasArray = computed(() =>
    this.reserva()?.entradas?.split(',').map((e: string) => e.trim()) || []
  );

  carnesArray = computed(() =>
    this.reserva()?.carnes?.split(',').map((c: string) => c.trim()) || []
  );

  acompArray = computed(() =>
    this.reserva()?.acompanamientos?.split(',').map((a: string) => a.trim()) || []
  );

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const partes = fecha.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(partes[2])} de ${meses[parseInt(partes[1])-1]} de ${partes[0]}`;
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