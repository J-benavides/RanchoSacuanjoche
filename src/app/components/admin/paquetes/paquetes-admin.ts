import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../sidebar/sidebar';

interface Paquete {
  id: string;
  name: string;
  price: number;
  minPersonas: number;
  badge: string;
  features: string[];
}

@Component({
  selector: 'app-paquetes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './paquetes-admin.html',
  styleUrl: './paquetes-admin.css'
})
export class PaquetesAdminComponent {

  tabActiva = signal<'paquetes' | 'menu'>('paquetes');

  paquetes = signal<Paquete[]>([
    {
      id: 'economico',
      name: 'Económico',
      price: 21000,
      minPersonas: 100,
      badge: '',
      features: [
        'Alquiler de salón (hasta 5 horas)',
        'Mobiliario completo',
        'Mantelería negra o blanca',
        'Sillas decoradas con forros y lazos',
        'Decoración del salón según temática',
        'Alimentación, DJ, luces y humo',
      ],
    },
    {
      id: 'basico',
      name: 'Básico',
      price: 27000,
      minPersonas: 60,
      badge: '⭐ Más Popular',
      features: [
        'Todo lo del Económico más:',
        'Alquiler de centros de mesa',
        'Decoración de entrada principal',
        'Mesa dulce: queque + 80 bocadillos',
        'DJ profesional',
        'Plataforma de video 360°',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 35000,
      minPersonas: 60,
      badge: '',
      features: [
        'Todo lo del Básico más:',
        'Maestro de ceremonia',
        'Cimarrona & Mascaradas',
        'Comparsa & Bailarinas',
        'Glitter & Pólvora',
      ],
    },
  ]);

  paqueteEditando = signal<Paquete | null>(null);
  nuevaFeature = signal('');
  mostrarFormNuevo = signal(false);

  nuevoPaquete = signal<Paquete>({
    id: '',
    name: '',
    price: 0,
    minPersonas: 30,
    badge: '',
    features: []
  });

  // ── MENÚ ──────────────────────────────
  categoriaMenuActiva = signal<'entradas' | 'carnes' | 'acompanamientos' | 'postres'>('entradas');
  nuevoPlato = signal('');

  menu = signal({
    entradas: [
      'Chifrijo artesanal con toque especial de la casa',
      'Frijoles blancos cremosos con cerdo sazonado',
      'Cremas variadas: ayote, zanahoria, espárragos, cebolla',
      'Crema de papa al estilo tradicional',
      'Ceviche fresco de pescado con notas cítricas',
      'Consomé de pollo casero',
    ],
    carnes: [
      'Pechuga de pollo a la plancha con finas hierbas',
      'Lomo de cerdo a la plancha jugoso',
      'Costilla a la BBQ tierna y glaseada',
      'Res mechada en su salsa con vegetales frescos',
    ],
    acompanamientos: [
      'Arroz especial (blanco, maíz dulce, jardinera o almendrado)',
      'Puré artesanal de papa o yuca',
      'Ensalada verde fresca multicolor',
      'Papas salteadas con toque dorado',
      'Vegetales al vapor',
      'Yuca al mojo',
      'Frijoles picantes al estilo criollo',
      'Ensalada fría de papa',
      'Ensalada rusa tradicional',
      'Ensalada tica de repollo',
    ],
    postres: [
      'Carlota de Fresa',
      'Carlota de Melocotón',
      'Cheesecake de Fresa o Melocotón',
      'Cheesecake de Limón o Maracuyá',
      'Flan de Caramelo',
      'Flan de Coco',
      'Pie Limón',
      'Pie Melocotón',
      'Tres Leches',
    ],
  });

  // ── MÉTODOS PAQUETES ──────────────────
  editarPaquete(pkg: Paquete) {
    this.paqueteEditando.set({ ...pkg, features: [...pkg.features] });
  }

  cancelarEdicion() {
    this.paqueteEditando.set(null);
  }

  guardarPaquete() {
    const editado = this.paqueteEditando();
    if (!editado) return;

    this.paquetes.update(list =>
      list.map(p => p.id === editado.id ? editado : p)
    );
    this.paqueteEditando.set(null);
  }

  agregarFeatureEditando() {
    const editado = this.paqueteEditando();
    if (!editado || !this.nuevaFeature().trim()) return;

    this.paqueteEditando.set({
      ...editado,
      features: [...editado.features, this.nuevaFeature().trim()]
    });
    this.nuevaFeature.set('');
  }

  quitarFeatureEditando(index: number) {
    const editado = this.paqueteEditando();
    if (!editado) return;

    this.paqueteEditando.set({
      ...editado,
      features: editado.features.filter((_, i) => i !== index)
    });
  }

  eliminarPaquete(id: string) {
    if (confirm('¿Eliminar este paquete?')) {
      this.paquetes.update(list => list.filter(p => p.id !== id));
    }
  }

  abrirFormNuevo() {
    this.nuevoPaquete.set({
      id: '', name: '', price: 0, minPersonas: 30, badge: '', features: []
    });
    this.mostrarFormNuevo.set(true);
  }

  agregarFeatureNuevo() {
    if (!this.nuevaFeature().trim()) return;
    this.nuevoPaquete.update(p => ({
      ...p,
      features: [...p.features, this.nuevaFeature().trim()]
    }));
    this.nuevaFeature.set('');
  }

  quitarFeatureNuevo(index: number) {
    this.nuevoPaquete.update(p => ({
      ...p,
      features: p.features.filter((_, i) => i !== index)
    }));
  }

  guardarNuevoPaquete() {
    const nuevo = this.nuevoPaquete();
    if (!nuevo.name || nuevo.price <= 0) {
      alert('Completá al menos el nombre y precio del paquete.');
      return;
    }
    const id = nuevo.name.toLowerCase().replace(/\s+/g, '-');
    this.paquetes.update(list => [...list, { ...nuevo, id }]);
    this.mostrarFormNuevo.set(false);
  }

  // ── MÉTODOS MENÚ ──────────────────────
  cambiarCategoriaMenu(cat: 'entradas' | 'carnes' | 'acompanamientos' | 'postres') {
    this.categoriaMenuActiva.set(cat);
  }

  agregarPlato() {
    if (!this.nuevoPlato().trim()) return;
    const cat = this.categoriaMenuActiva();
    this.menu.update(m => ({
      ...m,
      [cat]: [...m[cat], this.nuevoPlato().trim()]
    }));
    this.nuevoPlato.set('');
  }

  eliminarPlato(index: number) {
    const cat = this.categoriaMenuActiva();
    this.menu.update(m => ({
      ...m,
      [cat]: m[cat].filter((_, i) => i !== index)
    }));
  }

  getPlatosCategoria(): string[] {
    return this.menu()[this.categoriaMenuActiva()];
  }

  formatNumber(n: number): string {
    return n.toLocaleString('es-CR');
  }
}