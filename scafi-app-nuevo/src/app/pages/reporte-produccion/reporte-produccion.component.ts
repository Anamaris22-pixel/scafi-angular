import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  RouterModule
} from '@angular/router';

@Component({

  selector: 'app-reporte-produccion',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl:
  './reporte-produccion.component.html'

})

export class ReporteProduccionComponent
implements OnInit {

  // =========================
  // API
  // =========================

  API =
  'http://localhost/scafi-angular/scafi-api/reporte-produccion.php';

  // =========================
  // VARIABLES
  // =========================

  produccion: any[] = [];

  produccionOriginal: any[] = [];

  topRecolectores: any[] = [];

  cargando = false;

  fechaActual = new Date();

  usuario = 'Administrador';

  fechaInicio = '';

  fechaFin = '';

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.cargar();

  }

  // =========================
  // CARGAR
  // =========================

  cargar() {

    this.cargando = true;

    this.http
      .get<any>(this.API)

      .subscribe({

        next: (res) => {

          console.log(res);

          this.produccion =
          res.produccion || [];

          this.produccionOriginal =
          [...this.produccion];

          this.topRecolectores =
          res.topRecolectores || [];

          this.cargando = false;

        },

        error: (err) => {

          console.log(err);

          this.cargando = false;

        }

      });

  }

  // =========================
  // FILTRAR FECHAS
  // =========================

  filtrarFechas() {

    if(
      !this.fechaInicio ||

      !this.fechaFin
    ){

      this.produccion =
      [...this.produccionOriginal];

      return;

    }

    this.produccion =
    this.produccionOriginal.filter(

      item => {

        return (

          item.fecha >= this.fechaInicio &&

          item.fecha <= this.fechaFin

        );

      }

    );

  }

  // =========================
  // LIMPIAR FILTRO
  // =========================

  limpiarFiltro() {

    this.fechaInicio = '';

    this.fechaFin = '';

    this.produccion =
    [...this.produccionOriginal];

  }

  // =========================
  // TOTAL REGISTROS
  // =========================

  totalRegistros() {

    return this.produccion.length;

  }

  // =========================
  // TOTAL PRODUCCIÓN
  // =========================

  totalProduccion() {

    return this.produccion.reduce(

      (acc, item) =>

        acc +

        Number(
          item.cantidad || 0
        ),

      0

    );

  }

  // =========================
  // PROMEDIO
  // =========================

  promedioProduccion() {

    if(this.produccion.length === 0){

      return 0;

    }

    return (

      this.totalProduccion()

      /

      this.produccion.length

    ).toFixed(1);

  }

  // =========================
  // PRODUCCIÓN ALTA
  // =========================

  produccionAlta() {

    return this.produccion.filter(

      item =>

      Number(
        item.cantidad || 0
      ) >= 100

    ).length;

  }

  // =========================
  // MEJOR RECOLECTOR
  // =========================

  mejorRecolector() {

    if(this.topRecolectores.length === 0){

      return 'Sin datos';

    }

    return (

      this.topRecolectores[0]
      .recolector +

      ' (' +

      this.topRecolectores[0]
      .total +

      ' KG)'

    );

  }

    // =========================
  // EXPORTAR PDF
  // =========================

  exportarPDF() {
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pdfWidth = pdf.internal.pageSize.getWidth();   
      const pdfHeight = pdf.internal.pageSize.getHeight(); 
      const margenX = 15;
      let currentY = 20;
    
      const agregarPieDePagina = () => {
        const totalPags = pdf.internal.pages.length - 1;
        for (let i = 1; i <= totalPags; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(148, 163, 184); 
          pdf.text(
            'SCAFI © 2026 · DOCUMENTO OFICIAL DE PRODUCCIÓN',
            pdfWidth - margenX, pdfHeight - 10, { align: 'right' }
          );
        }
      };
  
      // Encabezado alineado exactamente como Inventario
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42); 
      pdf.text('REPORTE DE PRODUCCIÓN', margenX, currentY);
  
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139); 
      pdf.text('SCAFI · Software de Control Integral Cafetero', margenX, currentY + 5);
    
      const fechaStr = this.fechaActual.toLocaleDateString('es-CO');
      const horaStr = this.fechaActual.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      pdf.text(`Fecha: ${fechaStr} | Hora: ${horaStr}`, pdfWidth - margenX, currentY, { align: 'right' });
      pdf.text(`Responsable: ${this.usuario}`, pdfWidth - margenX, currentY + 5, { align: 'right' });
  
      pdf.setDrawColor(241, 245, 249); 
      pdf.setLineWidth(0.5);
      pdf.line(margenX, currentY + 10, pdfWidth - margenX, currentY + 10);
      currentY += 20;
      pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  
  pdf.text(
    'RESUMEN DE OPERACIONES',
    margenX,
    currentY
  );
  
  currentY += 5;
  
  const kpiW = (pdfWidth - (margenX * 2) - 9) / 4;
  const kpiH = 18;
  
  const kpis = [

  {
    t: 'Total Registros',
    v: this.totalRegistros().toString(),
    bg: [248,250,252],
    border: [226,232,240],
    text: [15,23,42]
  },

  {
    t: 'Producción Total',
    v: this.totalProduccion() + ' KG',
    bg: [240,253,244],
    border: [220,252,231],
    text: [22,163,74]
  },

  {
    t: 'Promedio',
    v: this.promedioProduccion().toString(),
    bg: [239,246,255],
    border: [191,219,254],
    text: [37,99,235]
  },

  {
    t: 'Prod. Alta',
    v: this.produccionAlta().toString(),
    bg: [255,251,235],
    border: [253,230,138],
    text: [180,83,9]
  }

];
  kpis.forEach((kpi, idx) => {
  
    const x = margenX + (idx * (kpiW + 3));
  
    pdf.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    pdf.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
  
    pdf.roundedRect(
      x,
      currentY,
      kpiW,
      kpiH,
      3,
      3,
      'FD'
    );
  
    pdf.setFontSize(7);
    pdf.setTextColor(100,116,139);
    pdf.text(
      kpi.t.toUpperCase(),
      x + 3,
      currentY + 5
    );
  
    pdf.setFontSize(11);
    pdf.setTextColor(
      kpi.text[0],
      kpi.text[1],
      kpi.text[2]
    );
  
    pdf.text(
      kpi.v,
      x + 3,
      currentY + 13
    );
  
  });
  
  currentY += kpiH + 12;
  // =====================================
// TOP RECOLECTORES
// =====================================

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(11);
pdf.setTextColor(30, 41, 59);

pdf.text(
  'TOP RECOLECTORES',
  margenX,
  currentY
);

currentY += 8;

this.topRecolectores.slice(0, 5).forEach((r, index) => {

  pdf.setDrawColor(226, 232, 240);

  pdf.roundedRect(
    margenX,
    currentY,
    pdfWidth - (margenX * 2),
    10,
    2,
    2
  );

  pdf.setFontSize(9);

  pdf.text(
    `${index + 1}. ${r.recolector}`,
    margenX + 4,
    currentY + 6
  );

  pdf.text(
    `${r.total} KG`,
    pdfWidth - margenX - 20,
    currentY + 6
  );

  currentY += 12;

});

currentY += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      pdf.text(
  'DETALLE DE PRODUCCIÓN',
  margenX,
  currentY
);

const columnas = [
  'ID',
  'Recolector',
  'Lote',
  'Cantidad',
  'Fecha',
  'Observación'
];

const filas = this.produccion.map(p => [

  '#' + p.id,

  p.recolector,

  p.lote,

  p.cantidad + ' KG',

  p.fecha,

  p.observacion

]);  
      autoTable(pdf, {
        startY: currentY + 4,
        head: [columnas],
        body: filas,
        margin: { left: margenX, right: margenX, bottom: 20 },
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [51, 65, 85]
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [37, 99, 235] },
          1: { fontStyle: 'bold' },
          3: { halign: 'center' },
          4: { halign: 'right', fontStyle: 'bold' }
        }
      });
  
            agregarPieDePagina();
       const finalY = (pdf as any).lastAutoTable.finalY + 15;

// =====================================
// FIRMAS
// =====================================

pdf.line(
  margenX + 10,
  finalY,
  margenX + 60,
  finalY
);

pdf.line(
  pdfWidth - 75,
  finalY,
  pdfWidth - 20,
  finalY
);

pdf.setFontSize(10);
pdf.setFont('helvetica', 'bold');

pdf.text(
  'ADMINISTRADOR',
  margenX + 22,
  finalY + 7
);

pdf.text(
  'REVISADO POR',
  pdfWidth - 60,
  finalY + 7
);

pdf.setFont(
  'helvetica',
  'normal'
);

pdf.text(
  'Auditoría Interna',
  pdfWidth - 55,
  finalY + 13
);

// =====================================
// PIE DE PAGINA
// =====================================

agregarPieDePagina();

// =====================================
// GUARDAR PDF
// =====================================

pdf.save(
  'Reporte_Produccion_SCAFI.pdf'
);

}

}