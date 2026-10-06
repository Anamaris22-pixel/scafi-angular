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

export interface Recoleccion {
  idRecoleccion: number;
  idRecolector: string | number;
  idLote: string | number;
  recolector?: string;
  nombreLote?: string;
  ubicacion?: string;
  variedad: string;
  estado: string;
  fecha: string;
  kg: string | number;
}

export interface Recolector {
  idRecolector: string | number;
  nombre: string;
}

export interface Lote {
  idLote: number;
  nombreLote: string;
  ubicacion: string;
  hectareas: number;
  estado: string;
}

export interface PesajePayload {
  idRecolector: string;
  idLote: string;
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
  idRecolector: '',
  idLote: '',
  variedad: '',
  estado: '',
  fecha: '',
  kg: '' 
};

@Component({
  selector: 'app-recoleccion',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recoleccion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoleccionComponent implements OnInit {
  
  private readonly http = inject(HttpClient);
  
  private readonly api = 'http://localhost/scafi-angular/scafi-api/recoleccion.php';
  private readonly apiRecolectores = 'http://localhost/scafi-angular/scafi-api/recolectores.php';

  readonly recolecciones = signal<Recoleccion[]>([]);
  readonly recolectores = signal<Recolector[]>([]);
  readonly lotes = signal<Lote[]>([]);
  readonly buscar = signal<string>('');
  readonly mostrarFormulario = signal<boolean>(false);
  readonly editando = signal<boolean>(false);
  readonly idEditar = signal<number>(0);
  readonly user = signal<User | null>(null);

  readonly formulario = signal<PesajePayload>({ ...FORMULARIO_VACIO });

  readonly recoleccionesFiltradas = computed(() => {
    const termino = this.buscar().toLowerCase().trim();
    const lista = this.recolecciones();
    
    if (!termino) return lista;

    return lista.filter(r => {
      const recolector = (r.recolector || '').toLowerCase();
      const variedad = (r.variedad || '').toLowerCase();
      const lote = (r.nombreLote || '').toLowerCase();
      return recolector.includes(termino) ||
             variedad.includes(termino) ||
             lote.includes(termino);
    });
  });

  readonly totalKg = computed(() => {
    return this.recolecciones().reduce((total, r) => total + Number(r.kg || 0), 0);
  });

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    if (data) {
      try {
        this.user.set(JSON.parse(data));
      } catch {
        console.error('Error leyendo usuario.');
      }
    }

    this.cargar();
    this.cargarRecolectores();
    this.cargarLotes();
  }

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

  cargarLotes(): void {
    this.http.get<Lote[]>(`${this.api}?accion=lotes`).subscribe({
      next: (res) => this.lotes.set(res || []),
      error: (err) => console.error('Error lotes:', err)
    });
  }

  guardarPesaje(): void {
    const payload = this.formulario();

    if (!payload.idRecolector || !payload.idLote ||
        !payload.variedad || !payload.estado ||
        !payload.fecha || !payload.kg) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('idRecolector', payload.idRecolector);
    formData.append('idLote', payload.idLote);
    formData.append('variedad', payload.variedad);
    formData.append('estado', payload.estado);
    formData.append('fecha', payload.fecha);
    formData.append('kg', payload.kg);

    this.http.post<{ok: boolean, mensaje?: string}>(this.api, formData).subscribe({
      next: (res) => {
        if (res.ok) {
          alert('Pesaje guardado correctamente.');
          this.cargar();
          this.limpiar();
          this.mostrarFormulario.set(false);
        } else {
          alert('Error del servidor: ' + (res.mensaje || 'No se pudo registrar.'));
        }
      },
      error: (err) => {
        console.error('Error en la petición POST:', err);
        alert('No se pudo conectar con el servidor o hubo un error interno en la red.');
      }
    });
  }

  eliminar(id: number): void {
    if (!window.confirm('¿Eliminar registro?')) return;

    this.http.delete<{ok: boolean}>(`${this.api}?id=${id}`).subscribe({
      next: (res) => {
        if (res.ok) this.cargar();
      }
    });
  }

  editar(r: Recoleccion): void {
    this.editando.set(true);
    this.mostrarFormulario.set(true);
    this.idEditar.set(r.idRecoleccion);
    
    this.formulario.set({
      idRecolector: String(r.idRecolector),
      idLote: String(r.idLote),
      variedad: r.variedad,
      estado: r.estado,
      fecha: r.fecha,
      kg: String(r.kg)
    });
  }

  actualizar(): void {
    const datos = {
      id: this.idEditar(),
      ...this.formulario()
    };

    this.http.put<{ok: boolean, mensaje?: string}>(this.api, datos).subscribe({
      next: (res) => {
        if (res.ok) {
          alert('Pesaje actualizado');
          this.cargar();
          this.cancelarEditar();
        } else {
          alert(res.mensaje || 'No se pudo actualizar.');
        }
      },
      error: (err) => console.error('Error PUT:', err)
    });
  }

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