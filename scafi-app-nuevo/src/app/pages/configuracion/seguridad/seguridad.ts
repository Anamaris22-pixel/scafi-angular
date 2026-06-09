import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './seguridad.html'
})

export class SeguridadComponent {

  configuracion = {
    expiracionToken: 60,
    longitudPassword: 8,
    intentosMaximos: 5,
    dobleAutenticacion: false,
    sesionesActivas: 3
  };

}