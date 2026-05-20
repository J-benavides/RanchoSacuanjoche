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
    { url: 'https://images.unsplash.com/photo-1773745060497-4cc1df774c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Elegant wedding setup' },
    { url: 'https://images.unsplash.com/photo-1775476793931-cb484f197760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Outdoor wedding reception' },
    { url: 'https://images.unsplash.com/photo-1738669469338-801b4e9dbccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Formal dinner table' },
    { url: 'https://images.unsplash.com/photo-1766393195987-912865cbb81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Outdoor lounge area' },
    { url: 'https://images.unsplash.com/photo-1768851142332-75f3d1b47452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Elegant banquet hall' },
    { url: 'https://images.unsplash.com/photo-1769812344081-92b3e2ac39c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Wedding ceremony setup' },
    { url: 'https://images.unsplash.com/photo-1768851142314-c4ebf49ad45b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Elegant table setting' },
    { url: 'https://images.unsplash.com/photo-1766393524464-e5eb1b05e4c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Wedding with palm trees' },
    { url: 'https://images.unsplash.com/photo-1775918427144-51f0bf53f8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Elegant banquet' },
    { url: 'https://images.unsplash.com/photo-1660740220701-3612091dd6db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Garden party' },
    { url: 'https://images.unsplash.com/photo-1769812344191-91994886e4a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Floral arch' },
    { url: 'https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', alt: 'Dining room chandeliers' },
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