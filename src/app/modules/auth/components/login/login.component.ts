import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Credentials } from './interfaces/credentials.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  credentials = new Credentials();

  constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
  }

  fnLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        Swal.fire('✅ Login exitoso', '', 'success');
        localStorage.setItem('username', this.credentials.usuario);
        this.router.navigate(['/inventory/list']);
      },
      error: (err) => {
        Swal.fire('❌ Credenciales inválidas', '', 'error');
        console.error(err);
      }
    });
  }

  irACrearCuenta() {
    this.router.navigate(['/auth/registro']);
  }

}
