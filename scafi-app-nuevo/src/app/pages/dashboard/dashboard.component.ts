import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
    HttpClientModule
  ],

  templateUrl:
  './dashboard.component.html'

})

export class DashboardComponent
implements OnInit, AfterViewInit {

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

  graficaInstance: any;

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

    setInterval(() => {

      this.obtenerDatosDashboard();

    }, 30000);

  }

  // ==========================================
  // AFTER VIEW
  // ==========================================

  ngAfterViewInit(): void {

    this.inicializarGrafica();

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

        this.mesesGraficaLabels = [];

        this.datosGraficaVentas = [];

       if (res.grafica) {

  const ordenMeses = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  res.grafica.sort(

    (a: any, b: any) =>

      ordenMeses.indexOf(a.mes)
      -
      ordenMeses.indexOf(b.mes)

  );

  res.grafica.forEach((item: any) => {

    this.mesesGraficaLabels.push(
      item.mes
    );

    this.datosGraficaVentas.push(
      Number(item.ventas)
    );

  });

}

        setTimeout(() => {

          this.actualizarGraficaReal();

        }, 300);

        this.cargando = false;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

        this.cargando = false;

      }

    });

  }

  // ==========================================
  // INICIALIZAR GRAFICA
  // ==========================================

  inicializarGrafica() {

    const ctx =

    document.getElementById(
      'graficaVentas'
    ) as HTMLCanvasElement;

    if (!ctx) return;

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