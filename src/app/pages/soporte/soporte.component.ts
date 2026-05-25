import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.component.html'
})
export class SoporteComponent {

  tickets: any[] = [];

  nuevo = {
    id: 0,
    titulo: '',
    descripcion: '',
    estado: 'Abierto',
    fecha: ''
  };

  estados = ['Abierto', 'En proceso', 'Cerrado'];

  constructor() {
    this.cargar();
  }

  crear() {
    this.nuevo.id = Date.now();
    this.nuevo.fecha = new Date().toLocaleDateString();

    this.tickets.push({ ...this.nuevo });

    this.reset();
    this.guardar();
  }

  cambiarEstado(ticket: any, estado: string) {
    ticket.estado = estado;
    this.guardar();
  }

  eliminar(id: number) {
    this.tickets = this.tickets.filter(t => t.id !== id);
    this.guardar();
  }

  reset() {
    this.nuevo = {
      id: 0,
      titulo: '',
      descripcion: '',
      estado: 'Abierto',
      fecha: ''
    };
  }

  guardar() {
    localStorage.setItem('tickets', JSON.stringify(this.tickets));
  }

  cargar() {
    const data = localStorage.getItem('tickets');
    if (data) {
      this.tickets = JSON.parse(data);
    }
  }
}