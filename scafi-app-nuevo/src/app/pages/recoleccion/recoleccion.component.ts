import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  inject, 
  signal, 
  computed 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// 1. Interfaces estrictas
export interface Recoleccion {
  idRecoleccion: number;
  idRecolector: string | number;
  recolector?: string;
  variedad: string;
  estado: string;
  fecha: string;
  kg: string | number;
}

export interface Recolector {
  idRecolector: string | number;
  nombre: string;
}

export interface PesajePayload {
  idRecolector: string;
  variedad: string;
  estado: string;
  fecha: string;
  kg: string;
}

export interface User {
  idRol: number;
  [key: string]: unknown;
}

const FORMULARIO_VACIO: PesajePayload = { 
  idRecolector: '', variedad: '', estado: '', fecha: '', kg: '' 
};

@Component({
  selector: 'app-recoleccion',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recoleccion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoleccionComponent implements OnInit {
  
  // 2. Inyección moderna
  private readonly http = inject(HttpClient);
  
  private readonly api = 'http://localhost/scafi-angular/scafi-api/recoleccion.php';
  private readonly apiRecolectores = 'http://localhost/scafi-angular/scafi-api/recolectores.php';

  // 3. Estados con Signals
  readonly recolecciones = signal<Recoleccion[]>([]);
  readonly recolectores = signal<Recolector[]>([]);
  readonly buscar = signal<string>('');
  readonly mostrarFormulario = signal<boolean>(false);
  readonly editando = signal<boolean>(false);
  readonly idEditar = signal<number>(0);
  readonly user = signal<User | null>(null);

  // Agrupamos los campos del formulario en un solo Signal
  readonly formulario = signal<PesajePayload>({ ...FORMULARIO_VACIO });

  // 4. Estados Computados (Sustituyen a las funciones en el HTML)
  readonly recoleccionesFiltradas = computed(() => {
    const termino = this.buscar().toLowerCase().trim();
    const lista = this.recolecciones();
    
    if (!termino) return lista;

    return lista.filter(r => {
      const recolector = (r.recolector || '').toLowerCase();
      const variedad = (r.variedad || '').toLowerCase();
      return recolector.includes(termino) || variedad.includes(termino);
    });
  });

  readonly totalKg = computed(() => {
    return this.recolecciones().reduce((total, r) => total + Number(r.kg || 0), 0);
  });

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    if (data) {
      this.user.set(JSON.parse(data));
    }
    this.cargar();
    this.cargarRecolectores();
  }

  // ======================
  // CARGAR
  // ======================
  cargar(): void {
    this.http.get<Recoleccion[]>(this.api).subscribe({
      next: (res) => this.recolecciones.set(res || []),
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  cargarRecolectores(): void {
    this.http.get<Recolector[]>(this.apiRecolectores).subscribe({
      next: (res) => this.recolectores.set(res || []),
      error: (err) => console.error('Error recolectores:', err)
    });
  }

  // ======================
  // GUARDAR
  // ======================
  guardarPesaje(): void {
    const payload = this.formulario();
    const formData = new FormData();
    
    formData.append('idRecolector', payload.idRecolector);
    formData.append('variedad', payload.variedad);
    formData.append('estado', payload.estado);
    formData.append('fecha', payload.fecha);
    formData.append('kg', payload.kg);

    this.http.post<{ok: boolean}>(this.api, formData).subscribe({
      next: (res) => {
        if (res.ok) {
          alert('Pesaje guardado');
          this.cargar();
          this.limpiar();
          this.mostrarFormulario.set(false);
        }
      }
    });
  }

  // ======================
  // ELIMINAR
  // ======================
  eliminar(id: number): void {
    if (!window.confirm('¿Eliminar registro?')) return;

    this.http.delete<{ok: boolean}>(`${this.api}?id=${id}`).subscribe({
      next: (res) => {
        if (res.ok) this.cargar();
      }
    });
  }

  // ======================
  // EDITAR
  // ======================
  editar(r: Recoleccion): void {
    this.editando.set(true);
    this.mostrarFormulario.set(true);
    this.idEditar.set(r.idRecoleccion);
    
    this.formulario.set({
      idRecolector: String(r.idRecolector),
      variedad: r.variedad,
      estado: r.estado,
      fecha: r.fecha,
      kg: String(r.kg)
    });
  }

  // ======================
  // ACTUALIZAR
  // ======================
  actualizar(): void {
    const datos = {
      id: this.idEditar(),
      ...this.formulario()
    };

    this.http.put<{ok: boolean}>(this.api, datos).subscribe({
      next: (res) => {
        if (res.ok) {
          alert('Pesaje actualizado');
          this.cargar();
          this.cancelarEditar();
        }
      }
    });
  }

  // ======================
  // CANCELAR Y LIMPIAR
  // ======================
  cancelarEditar(): void {
    this.editando.set(false);
    this.idEditar.set(0);
    this.limpiar();
    this.mostrarFormulario.set(false);
  }

  limpiar(): void {
    this.formulario.set({ ...FORMULARIO_VACIO });
  }
}