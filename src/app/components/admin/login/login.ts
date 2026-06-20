import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  showPassword = signal(false);
  cargando = signal(false);
  error = signal('');

  constructor(private router: Router, private http: HttpClient) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  login() {
    if (!this.username() || !this.password()) {
      this.error.set('Por favor completá todos los campos.');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.http.post<any>('http://localhost:8080/api/auth/login', {
      username: this.username(),
      password: this.password()
    }).subscribe({
      next: (res) => {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('adminUser', this.username());
        this.router.navigate(['/admin/dashboard']);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Usuario o contraseña incorrectos.');
        this.cargando.set(false);
      }
    });
  }
}