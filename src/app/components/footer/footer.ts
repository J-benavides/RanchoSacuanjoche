import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  year = new Date().getFullYear();

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}