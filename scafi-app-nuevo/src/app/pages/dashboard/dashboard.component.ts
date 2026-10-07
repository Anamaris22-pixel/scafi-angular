import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],

  templateUrl:
  './dashboard.component.html'

})

export class DashboardComponent
implements OnInit, AfterViewInit, OnDestroy {

  // ==========================================
  // API
  // ==========================================

  private readonly API =
'http://localhost/scafi-angular/scafi-api/dashboard.php';

  // ==========================================
  // SIDEBAR
  // ==========================================

  sidebarAbierto = true;

  menuProductividad = false;

  menuInventario = false;

  menuVentas = false;

  menuReportes = false;

  // ==========================================
  // ESTADO
  // ==========================================

  cargando: boolean = true;

  // ==========================================
  // TARJETAS
  // ==========================================

  totalProduccionKG: number = 0;

  totalVentasMes: number = 0;

  totalRecolectores: number = 0;

  totalCultivos: number = 0;

  // ==========================================
  // ALERTAS
  // ==========================================

  inventarioBajoCount: number = 0;

  ventasHoy: number = 0;

  cultivosActivosCount: number = 0;

  // ==========================================
  // TABLA
  // ==========================================

  ultimosMovimientos: any[] = [];

  // ==========================================
  // GRAFICA
  // ==========================================

  datosGraficaVentas: number[] = [];

  mesesGraficaLabels: string[] = [];

  // Histórico completo recibido de la API.
  graficaHistorica: any[] = [];

  // Años disponibles para consultar desde la gráfica.
  aniosGrafica: number[] = [];

  // Por defecto se muestra únicamente el año actual.
  anioGraficaSeleccionado: number = new Date().getFullYear();

  graficaInstance: any;

  private intervaloActualizacion: any;
  private vistaLista = false;

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // CARGA INICIAL

    this.obtenerDatosDashboard();

    // AUTO ACTUALIZAR

    this.intervaloActualizacion = setInterval(() => {
      if (!document.hidden) {
        this.obtenerDatosDashboard();
      }
    }, 30000);

  }

  // ==========================================
  // AFTER VIEW
  // ==========================================

  ngOnDestroy(): void {
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion);
    }
  }

  ngAfterViewInit(): void {

    this.vistaLista = true;
    this.inicializarGrafica();
    this.actualizarGraficaReal();

  }

  // ==========================================
  // PERMISOS
  // ==========================================

  esRecolector(): boolean {
    const usuario = localStorage.getItem('usuario') || localStorage.getItem('user');

    if (!usuario) {
      return false;
    }

    try {
      return Number(JSON.parse(usuario)?.idRol) === 3;
    } catch {
      return false;
    }
  }

  // ==========================================
  // OBTENER DATOS
  // ==========================================

  obtenerDatosDashboard(): void {

    this.http
    .get<any>(this.API)

    .subscribe({

      next: (res) => {

        this.totalProduccionKG =
        Number(res.tarjetas?.produccion || 0);

        this.totalVentasMes =
        Number(res.tarjetas?.ventas || 0);

        this.totalRecolectores =
        Number(res.tarjetas?.recolectores || 0);

        this.totalCultivos =
        Number(res.tarjetas?.lotes || 0);

        this.inventarioBajoCount =
        Number(res.alertas?.bajo_stock || 0);

        this.ventasHoy =
        Number(res.alertas?.ventas_hoy || 0);

        this.cultivosActivosCount =
        Number(res.alertas?.lotes_activos || 0);

        this.ultimosMovimientos =
        res.ultimos_movimientos || [];

        // Guardamos todo el histórico, pero la gráfica inicia mostrando
        // solamente el año actual.
        this.graficaHistorica = Array.isArray(res.grafica)
          ? res.grafica
          : [];

        this.aniosGrafica = [
          ...new Set(
            this.graficaHistorica
              .map((item: any) => Number(item.anio))
              .filter((anio: number) => Number.isFinite(anio))
          )
        ].sort((a, b) => b - a);

        // Si el año actual no tiene ventas, mostramos el año más reciente
        // disponible para que la gráfica no aparezca vacía.
        if (
          !this.aniosGrafica.includes(this.anioGraficaSeleccionado) &&
          this.aniosGrafica.length > 0
        ) {
          this.anioGraficaSeleccionado = this.aniosGrafica[0];
        }

        this.aplicarFiltroGrafica();

        this.cargando = false;

        // Forzar la actualización inmediata de las tarjetas.
        // Esto evita que el usuario tenga que hacer clic para que Angular
        // pinte los datos recibidos por HTTP.
        this.cdr.detectChanges();

        // La gráfica puede haber sido creada antes de que llegara la API.
        this.actualizarGraficaReal();

      },

      error: (err) => {

        console.error('Error cargando dashboard:', err);

        this.cargando = false;
        this.cdr.detectChanges();

      }

    });

  }

  // ==========================================
  // FILTRO DE AÑO DE LA GRÁFICA
  // ==========================================

  aplicarFiltroGrafica(): void {

    const datos = this.graficaHistorica
      .filter(
        (item: any) =>
          Number(item.anio) === Number(this.anioGraficaSeleccionado)
      )
      .sort(
        (a: any, b: any) =>
          Number(a.mes_numero) - Number(b.mes_numero)
      );

    const nombresMeses: Record<string, string> = {
      Jan: 'Ene',
      Feb: 'Feb',
      Mar: 'Mar',
      Apr: 'Abr',
      May: 'May',
      Jun: 'Jun',
      Jul: 'Jul',
      Aug: 'Ago',
      Sep: 'Sep',
      Oct: 'Oct',
      Nov: 'Nov',
      Dec: 'Dic'
    };

    this.mesesGraficaLabels = datos.map(
      (item: any) =>
        nombresMeses[item.mes] || item.mes
    );

    this.datosGraficaVentas = datos.map(
      (item: any) => Number(item.ventas || 0)
    );

    this.actualizarGraficaReal();
    this.cdr.detectChanges();
  }

  // ==========================================
  // INICIALIZAR GRAFICA
  // ==========================================

  inicializarGrafica() {

    const ctx =
      document.getElementById(
        'graficaVentas'
      ) as HTMLCanvasElement;

    if (!ctx) {
      return;
    }

    // Evita crear más de una instancia de Chart.js.
    if (this.graficaInstance) {
      return;
    }

    this.graficaInstance = new Chart(

      ctx,

      {

        type: 'bar',

        data: {

          labels:
          this.mesesGraficaLabels,

          datasets: [

            {

              label:
              'Ventas Mensuales',

              data:
              this.datosGraficaVentas,

              backgroundColor:
              '#16a34a',

              borderRadius: 12,

              borderSkipped: false

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            y: {

              beginAtZero: true,

              grid: {

                color: '#f1f5f9'

              }

            },

            x: {

              grid: {

                display: false

              }

            }

          }

        }

      }

    );

  }

  // ==========================================
  // ACTUALIZAR GRAFICA
  // ==========================================

  actualizarGraficaReal() {

    if (this.graficaInstance) {

      this.graficaInstance
      .data
      .labels =

      this.mesesGraficaLabels;

      this.graficaInstance
      .data
      .datasets[0]
      .data =

      this.datosGraficaVentas;

      this.graficaInstance.update();

    }

  }

  // ==========================================
  // SIDEBAR
  // ==========================================

  toggleSidebar() {

    this.sidebarAbierto =
    !this.sidebarAbierto;

  }

  toggleProductividad() {

    this.menuProductividad =
    !this.menuProductividad;

  }

  toggleInventario() {

    this.menuInventario =
    !this.menuInventario;

  }

  toggleVentas() {

    this.menuVentas =
    !this.menuVentas;

  }

  toggleReportes() {

    this.menuReportes =
    !this.menuReportes;

  }

}