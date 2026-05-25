import { ChangeDetectorRef } from '@angular/core';
import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  interval
} from 'rxjs';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './mensajes.component.html'
})

export class MensajesComponent implements OnInit {

  usuarios: any[] = [];

  conversaciones: any[] = [];

  mensajes: any[] = [];

  usuarioSeleccionado: any = null;

  buscarUsuario = '';

  texto = '';

  usuario: any = {};

  archivoSeleccionado: any = null;

  enviando = false;

  api =
    'http://localhost/scafi-angular/scafi-api/';

  constructor(

    private http: HttpClient,

    private router: Router

  ) {}

  ngOnInit(): void {

    const datos =
      localStorage.getItem('usuario');

    if (datos) {

      this.usuario =
        JSON.parse(datos);
        console.log('USUARIO LOGIN =>', this.usuario);

    }

    this.obtenerConversaciones();
    

    interval(1000).subscribe(() => {

  this.obtenerConversaciones();

  this.obtenerUsuariosChat();
  if (this.usuarioSeleccionado) {

    this.obtenerMensajes();

  }

});

  }
obtenerUsuariosChat() {

  this.http.get<any>(

    this.api +
    'obtener_usuarios_chat.php?usuario_id=' +
    this.usuario.id +
    '&buscar=' +
    this.buscarUsuario

  ).subscribe({

    next: (res) => {

  console.log(res);

  this.usuarios = res.usuarios || [];

},

    error: (err) => {

      console.log(err);

    }

  });

}
  // =========================
  // FILTRAR CONVERSACIONES
  // =========================

  get conversacionesFiltradas() {

    if (
      !this.buscarUsuario ||
      this.buscarUsuario.trim() === ''
    ) {

      return this.conversaciones;

    }

    return this.conversaciones.filter(

      (c: any) =>

        c.nombre
          .toLowerCase()
          .includes(
            this.buscarUsuario.toLowerCase()
          )

    );

  }

  // =========================
  // OBTENER CONVERSACIONES
  // =========================

  obtenerConversaciones() {

  this.http.get<any>(

    this.api +
    'obtener-conversaciones.php?usuario_id=' +
    this.usuario.id

  ).subscribe({

    next: (res) => {

      this.conversaciones =
      res.conversaciones || [];

    },

    error: (err) => {

      console.log(err);

    }

  });

}
  // =========================
  // SELECCIONAR CHAT
  // =========================

  seleccionarUsuario(usuario: any) {

    this.usuarioSeleccionado =
      usuario;

    this.obtenerMensajes();

  }

  // =========================
  // OBTENER MENSAJES
  // =========================

  obtenerMensajes() {

    if (!this.usuarioSeleccionado) {
      return;
    }

    this.http.get<any[]>(

      this.api +

      'obtener_mensajes.php?' +

      'remitente_id=' +

      this.usuario.id +

      '&receptor_id=' +

      this.usuarioSeleccionado.id

    ).subscribe({

      next: (res: any) => {

        this.mensajes = res;

        setTimeout(() => {

          this.scrollBottom();

        }, 100);

      },

      error: (err: any) => {

        console.log(err);

      }

    });

  }

  // =========================
  // SELECCIONAR ARCHIVO
  // =========================

  seleccionarArchivo(event: any) {

    this.archivoSeleccionado =
      event.target.files[0];

  }

  // =========================
  // ENVIAR MENSAJE
  // =========================

  enviarMensaje() {

    // VALIDAR CHAT
    if (!this.usuarioSeleccionado) {
      return;
    }

    // VALIDAR MENSAJE
    if (
      !this.texto?.trim() &&
      !this.archivoSeleccionado
    ) {
      return;
    }

    // EVITAR DOBLE CLICK
    if (this.enviando) {
      return;
    }

    this.enviando = true;

    const formData = new FormData();

    formData.append(
      'remitente_id',
      this.usuario.id
    );

    formData.append(
      'receptor_id',
      this.usuarioSeleccionado.id
    );

    formData.append(
      'mensaje',
      this.texto.trim()
    );

    // ARCHIVO
    if (this.archivoSeleccionado) {

      formData.append(
        'archivo',
        this.archivoSeleccionado
      );

    }

    // GUARDAR TEXTO
    const textoTemp = this.texto;

    // LIMPIAR RAPIDO
    this.texto = '';

    this.http.post<any>(

      this.api +

      'enviar_mensaje.php',

      formData

    ).subscribe({

      next: (res) => {

        console.log(
          'MENSAJE ENVIADO =>',
          res
        );

        this.archivoSeleccionado = null;

        this.obtenerMensajes();

        this.obtenerConversaciones();
        
        this.obtenerUsuariosChat();
        setTimeout(() => {

          this.scrollBottom();

        }, 100);

        this.enviando = false;

      },

      error: (err) => {

        console.log(err);

        // RESTAURAR TEXTO
        this.texto = textoTemp;

        this.enviando = false;

      }

    });

  }

  // =========================
  // ENTER PARA ENVIAR
  // =========================

  presionarEnter(event: KeyboardEvent) {

    if (

      event.key === 'Enter' &&

      !event.shiftKey

    ) {

      event.preventDefault();

      this.enviarMensaje();

    }

  }

  // =========================
  // AGREGAR EMOJI
  // =========================

  mostrarEmojis = false;

emojis = [

  '😀','😁','😂','🤣','😅','😊','😍','😘',
  '😎','🤩','🥳','😡','😭','😴','🤔','🙄',
  '👍','👎','👏','🙏','🔥','❤️','💔','🎉',
  '💯','🚀','☕','🌱','🌿','🐶','🐱','⚡',
  '🍀','🌻','🐸','🤑','😇','🤖','👀','💀',
  '🍕','🍔','🎵','📱','💻','📷','🧠','🎮',
  '😺','😹','🙈','🙉','🙊','🐼','🐯','🦁',
  '🐵','🐔','🌈','⭐','🌙','☀️','❄️','💧',
  '🍎','🍇','🍉','🥑','🌮','🍟','🍩','🎂',
  '⚽','🏀','🏆','🎯','🎲','🛵','🚗','✈️',
  '⌚','💡','📚','✏️','🧪','🔒','🔑','❤️‍🔥'

];

agregarEmoji(emoji: string): void {

  this.texto += emoji;

  this.mostrarEmojis = false;

}
  // =========================
  // SCROLL ABAJO
  // =========================

  scrollBottom() {

    setTimeout(() => {

      const contenedor: any =

        document.getElementById(
          'contenedorMensajes'
        );

      if (contenedor) {

        contenedor.scrollTop =

          contenedor.scrollHeight;

      }

    }, 50);

  }

  // =========================
  // VOLVER DASHBOARD
  // =========================

  volverDashboard() {

    this.router.navigate([
      '/dashboard'
    ]);

  }

}