import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminSidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-resenas-admin',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './resenas-admin.html',
  styleUrl: './resenas-admin.css'
})
export class ResenasAdminComponent implements OnInit {

  cargando = signal(true);
  ratingPromedio = signal(0);
  totalResenas = signal(0);
  resenas = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.http.get<any>('http://localhost:8080/api/places/resenas').subscribe({
      next: (data) => {
        if (data.result?.reviews) {
          const resenasConVisible = data.result.reviews.map((r: any) => ({
            ...r,
            initials: r.author_name.split(' ')
              .map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            visible: true
          }));
          this.resenas.set(resenasConVisible);
          this.ratingPromedio.set(data.result.rating || 4.9);
          this.totalResenas.set(data.result.user_ratings_total || 0);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.usarResenasManuales();
        this.cargando.set(false);
      }
    });
  }

  usarResenasManuales() {
    this.resenas.set([
      {
        author_name: 'Ana Mora',
        initials: 'AM',
        rating: 5,
        text: 'El lugar es espectacular, mi quinceañera quedó como un sueño.',
        relative_time_description: 'hace 2 semanas',
        visible: true
      },
      {
        author_name: 'José Hernández',
        initials: 'JH',
        rating: 5,
        text: 'Hicimos la graduación de mi hija acá y fue increíble.',
        relative_time_description: 'hace 1 mes',
        visible: true
      },
    ]);
    this.ratingPromedio.set(4.9);
    this.totalResenas.set(87);
  }

  toggleVisibilidad(index: number) {
    this.resenas.update(list =>
      list.map((r, i) => i === index ? { ...r, visible: !r.visible } : r)
    );
  }

  stars(n: number): number[] {
    return Array(Math.round(n)).fill(0);
  }
}