import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaRequest {
  nombreCliente: string;
  telefono: string;
  correo: string;
  fechaEvento: string;
  tipoEvento: string;
  cantidadPersonas: number;
  paquete: string;
  precioPorPersona: number;
  entradas: string;
  carnes: string;
  acompanamientos: string;
  postre: string;
}

export interface ReservaResponse {
  id: number;
  nombreCliente: string;
  telefono: string;
  correo: string;
  fechaEvento: string;
  tipoEvento: string;
  cantidadPersonas: number;
  paquete: string;
  totalEstimado: number;
  deposito: number;
  restante: number;
  estado: string;
  numeroCotizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  crearReserva(reserva: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, reserva);
  }

  getFechasReservadas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fechas-reservadas`);
  }

  verificarDisponibilidad(fecha: string): Observable<{disponible: boolean}> {
    return this.http.get<{disponible: boolean}>(
      `${this.apiUrl}/disponibilidad?fecha=${fecha}`
    );
  }
}