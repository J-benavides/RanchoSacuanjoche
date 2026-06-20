import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class ResenasComponent implements OnInit {
  currentIndex = signal(0);
  cargando = signal(true);
  ratingPromedio = signal(0);
  totalResenas = signal(0);
  testimonios = signal<any[]>([]);

  resenasManuales = [
    {
      author_name: 'Ana Mora',
      rating: 5,
      relative_time_description: 'hace 2 semanas',
      text: 'El lugar es espectacular, mi quinceañera quedó como un sueño. La decoración, la comida y el servicio fueron absolutamente perfectos.',
      initials: 'AM'
    },
    {
      author_name: 'José Hernández',
      rating: 5,
      relative_time_description: 'hace 1 mes',
      text: 'Hicimos la graduación de mi hija acá y fue increíble. El DJ, las luces y la atención del personal son de primer nivel.',
      initials: 'JH'
    },
    {
      author_name: 'Valeria Quesada',
      rating: 5,
      relative_time_description: 'hace 3 semanas',
      text: 'El paquete premium valió cada colón. La cimarrona y las bailarinas sorprendieron a todos los invitados.',
      initials: 'VQ'
    },
    {
      author_name: 'Luis Calderón',
      rating: 5,
      relative_time_description: 'hace 2 meses',
      text: 'Nuestra boda fue mágica. El lugar se transforma completamente en la noche, es otro ambiente totalmente diferente.',
      initials: 'LC'
    },
    {
      author_name: 'María Fernanda Solís',
      rating: 5,
      relative_time_description: 'hace 1 semana',
      text: 'Excelente atención desde el primer contacto. Todo salió perfecto en nuestro evento corporativo.',
      initials: 'MF'
    },
    {
      author_name: 'Carlos Ramírez',
      rating: 5,
      relative_time_description: 'hace 3 meses',
      text: 'El mejor lugar para celebrar. La comida estuvo deliciosa y el servicio impecable.',
      initials: 'CR'
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.http.get<any>('http://localhost:8080/api/places/resenas').subscribe({
      next: (data) => {
        if (data.result?.reviews) {
          const resenas = data.result.reviews.map((r: any) => ({
            ...r,
            initials: r.author_name.split(' ')
              .map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          }));
          this.testimonios.set(resenas);
          this.ratingPromedio.set(data.result.rating || 4.9);
          this.totalResenas.set(data.result.user_ratings_total || 0);
        } else {
          this.usarResenasManuales();
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
    this.testimonios.set(this.resenasManuales);
    this.ratingPromedio.set(4.9);
    this.totalResenas.set(87);
  }

  get visibles() {
    const list = this.testimonios();
    if (list.length === 0) return [];
    const i = this.currentIndex();
    return [
      list[i % list.length],
      list[(i + 1) % list.length],
      list[(i + 2) % list.length],
    ];
  }

  next() {
    const len = this.testimonios().length;
    this.currentIndex.update(i => (i + 1) % len);
  }

  prev() {
    const len = this.testimonios().length;
    this.currentIndex.update(i => i === 0 ? len - 1 : i - 1);
  }

  stars(n: number): number[] {
    return Array(n).fill(0);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
}