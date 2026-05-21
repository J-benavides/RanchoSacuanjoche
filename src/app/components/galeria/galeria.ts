import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css'
})
export class GaleriaComponent {
  selectedImage = signal<number | null>(null);

  images = [
    { url: 'images/Boda.jpg', alt: 'Boda en Rancho Sacuanjoche' },
    { url: 'images/Boda2.jpg', alt: 'Boda elegante en Rancho Sacuanjoche' },
    { url: 'images/Graduacion.png', alt: 'Graduación en Rancho Sacuanjoche' },
    { url: 'images/quince.jpg', alt: 'Quinceañera en Rancho Sacuanjoche' },
    { url: 'images/Decoracion3.jpg', alt: 'Decoración elegante' },
    { url: 'images/Entrada.jpg', alt: 'Entrada del salón' },
    { url: 'images/comida.jpg', alt: 'Menú especial' },
    { url: 'images/Led1.jpg', alt: 'Luces LED del salón' },
    { url: 'images/jardin.jpg', alt: 'Área natural y jardín' },
    { url: 'images/zonaverde.jpg', alt: 'Zona verde del rancho' },
    { url: 'images/babyShowers.jpg', alt: 'Baby Shower en Rancho Sacuanjoche' },
    { url: 'images/eventoCorporativo.jpg', alt: 'Evento corporativo' },
    { url: 'images/fiestaPrivada.png', alt: 'Fiesta privada' },
  ];

  openImage(index: number) {
    this.selectedImage.set(index);
  }

  closeImage() {
    this.selectedImage.set(null);
  }

  prevImage() {
    const current = this.selectedImage();
    if (current !== null) {
      this.selectedImage.set(current === 0 ? this.images.length - 1 : current - 1);
    }
  }

  nextImage() {
    const current = this.selectedImage();
    if (current !== null) {
      this.selectedImage.set(current === this.images.length - 1 ? 0 : current + 1);
    }
  }
}