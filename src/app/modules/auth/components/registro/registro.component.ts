import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credentials } from '../login/interfaces/credentials.interface'; // ajusta la ruta si cambia

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  credentials = new Credentials();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  fnRegistro() {
    this.authService.registro(this.credentials).subscribe({
      next: (data) => {
        Swal.fire('✅ Registro exitoso', '', 'success');
        localStorage.setItem('username', this.credentials.usuario);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        Swal.fire('❌ Error en el registro', '', 'error');
        console.error(err);
      }
    });
  }
}
