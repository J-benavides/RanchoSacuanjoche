import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  templateUrl: './whatsapp-btn.html',
  styleUrl: './whatsapp-btn.css'
})
export class WhatsappBtnComponent {
  openWhatsApp() {
    const msg = encodeURIComponent(
      'Hola Rancho Sacuanjoche, me gustaría obtener más información sobre sus eventos y paquetes.'
    );
    window.open(`https://wa.me/50672409272?text=${msg}`, '_blank');
  }
}