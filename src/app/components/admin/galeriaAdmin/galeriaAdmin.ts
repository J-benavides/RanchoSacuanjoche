import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-galeria-admin',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './galeriaAdmin.html',
  styleUrl: './galeriaAdmin.css'
})
export class GaleriaAdminComponent {

  categorias = ['Todas', 'Bodas', 'Graduaciones', 'Quinceañeras', 'Cumpleaños', 'Baby Showers', 'Corporativos'];
  categoriaSeleccionada = signal('Todas');
  dragActive = signal(false);
  subiendo = signal(false);

  imagenes = signal([
    { id: 1, url: 'images/Boda.jpg', categoria: 'Bodas', nombre: 'Boda.jpg' },
    { id: 2, url: 'images/Boda2.jpg', categoria: 'Bodas', nombre: 'Boda2.jpg' },
    { id: 3, url: 'images/quince.jpg', categoria: 'Quinceañeras', nombre: 'quince.jpg' },
    { id: 4, url: 'images/Graduacion.png', categoria: 'Graduaciones', nombre: 'Graduacion.png' },
    { id: 5, url: 'images/Cumple.jpg', categoria: 'Cumpleaños', nombre: 'Cumple.jpg' },
    { id: 6, url: 'images/babyShowers.jpg', categoria: 'Baby Showers', nombre: 'babyShowers.jpg' },
    { id: 7, url: 'images/eventoCorporativo.jpg', categoria: 'Corporativos', nombre: 'eventoCorporativo.jpg' },
    { id: 8, url: 'images/fiestaPrivada.png', categoria: 'Corporativos', nombre: 'fiestaPrivada.png' },
  ]);

  imagenesFiltradas = computed(() => {
    if (this.categoriaSeleccionada() === 'Todas') return this.imagenes();
    return this.imagenes().filter(img => img.categoria === this.categoriaSeleccionada());
  });

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada.set(cat);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.dragActive.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragActive.set(false);
    if (e.dataTransfer?.files) {
      this.procesarArchivos(e.dataTransfer.files);
    }
  }

  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.procesarArchivos(input.files);
    }
  }

  procesarArchivos(files: FileList) {
    this.subiendo.set(true);
    // Aquí se subirían los archivos al backend
    setTimeout(() => {
      alert(`${files.length} imagen(es) lista(s) para subir. Conectá el backend para guardarlas.`);
      this.subiendo.set(false);
    }, 800);
  }

  eliminar(id: number, nombre: string) {
    if (confirm(`¿Eliminar ${nombre}?`)) {
      this.imagenes.update(list => list.filter(img => img.id !== id));
    }
  }
}