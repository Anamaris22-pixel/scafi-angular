import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent {

  usuarios: any[] = [];

  nuevo = {
    id: 0,
    nombre: '',
    email: '',
    password: '',
    rol: 'Vendedor'
  };

  editando = false;

  roles = ['Admin', 'Vendedor', 'Consulta'];

  constructor() {
    this.cargar();
  }

  guardar() {
    if (this.editando) {
      const index = this.usuarios.findIndex(u => u.id === this.nuevo.id);
      this.usuarios[index] = { ...this.nuevo };
      this.editando = false;
    } else {
      this.nuevo.id = Date.now();
      this.usuarios.push({ ...this.nuevo });
    }

    this.reset();
    this.persistir();
  }

  editar(usuario: any) {
    this.nuevo = { ...usuario };
    this.editando = true;
  }

  eliminar(id: number) {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
    this.persistir();
  }

  reset() {
    this.nuevo = {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      rol: 'Vendedor'
    };
  }

  persistir() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  cargar() {
    const data = localStorage.getItem('usuarios');
    if (data) {
      this.usuarios = JSON.parse(data);
    }
  }
  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.usuarios.length / this.registrosPorPagina));
  }

  get usuariosPagina(): any[] {
    const datos = this.usuarios;
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return datos.slice(inicio, inicio + this.registrosPorPagina);
  }

  irPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginaAnterior(): void { this.irPagina(this.paginaActual - 1); }
  paginaSiguiente(): void { this.irPagina(this.paginaActual + 1); }
  reiniciarPaginacion(): void { this.paginaActual = 1; }

}