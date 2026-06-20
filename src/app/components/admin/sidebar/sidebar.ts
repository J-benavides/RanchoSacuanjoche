import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class AdminSidebarComponent {
  isOpen = signal(false);

  constructor(private router: Router) {}

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid', path: '/admin/dashboard' },
    { id: 'reservas', label: 'Reservas', icon: 'calendar', path: '/admin/reservas' },
    { id: 'calendario', label: 'Calendario', icon: 'calendar-days', path: '/admin/calendario' },
    { id: 'galeria', label: 'Galería', icon: 'image', path: '/admin/galeria' },
    { id: 'paquetes', label: 'Paquetes', icon: 'package', path: '/admin/paquetes' },
    { id: 'resenas', label: 'Reseñas', icon: 'star', path: '/admin/resenas' },
    { id: 'configuracion', label: 'Configuración', icon: 'settings', path: '/admin/configuracion' },
  ];

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.isOpen.set(false);
  }

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  logout() {
    localStorage.removeItem('adminToken');
    this.router.navigate(['/admin']);
    this.isOpen.set(false);
  }
}