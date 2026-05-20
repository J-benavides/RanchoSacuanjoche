import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {
  entradas = [
    'Chifrijo artesanal con toque especial de la casa',
    'Frijoles blancos cremosos con cerdo sazonado',
    'Selección de cremas: ayote, zanahoria, espárragos, cebolla',
    'Delicada crema de papa al estilo tradicional',
    'Ceviche fresco de pescado con notas cítricas',
    'Consomé de pollo casero',
  ];

  carnes = [
    'Pechuga de pollo a la plancha con finas hierbas',
    'Lomo de cerdo a la plancha jugoso',
    'Costilla a la BBQ tierna y glaseada',
    'Res mechada en su salsa con vegetales frescos',
  ];

  acompanamientos = [
    'Arroz especial: blanco, con maíz dulce, jardinera o almendrado',
    'Puré artesanal de papa o yuca',
    'Ensalada verde fresca multicolor',
    'Papas salteadas con toque dorado',
    'Vegetales al vapor',
    'Yuca al mojo',
    'Frijoles picantes al estilo criollo',
    'Ensalada fría de papa',
    'Ensalada rusa tradicional',
    'Ensalada tica de repollo',
  ];

  postres = [
    'Carlota de Fresa',
    'Carlota de Melocotón',
    'Cheesecake de Fresa o Melocotón',
    'Cheesecake de Limón o Maracuyá',
    'Flan de Caramelo',
    'Flan de Coco',
    'Pie Limón',
    'Pie Melocotón',
    'Tres Leches',
  ];
}