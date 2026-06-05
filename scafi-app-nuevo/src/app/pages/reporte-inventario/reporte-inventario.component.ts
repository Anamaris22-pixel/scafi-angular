import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Component,
  OnInit,
  AfterViewInit
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

import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({

  selector: 'app-reporte-inventario',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl:
  './reporte-inventario.component.html'

})

export class ReporteInventarioComponent
implements OnInit, AfterViewInit {

  // API

  API =
  'http://localhost/scafi-angular/scafi-api/reporte-inventario.php';

  // VARIABLES

  inventario: any[] = [];

  inventarioOriginal: any[] = [];

  buscar = '';

  fechaInicio = '';

  fechaFin = '';

  fechaActual = new Date();

  usuario = 'Administrador';

  grafica: any;

  constructor(
    private http: HttpClient
  ) {}

  // INIT

  ngOnInit(): void {

    this.cargar();

  }

  // AFTER VIEW

  ngAfterViewInit(): void {

}

  // CARGAR

  cargar() {

    this.http
      .get<any[]>(this.API)

      .subscribe({

        next: (res) => {

          this.inventario = res || [];

          this.inventarioOriginal =
          [...this.inventario];

         setTimeout(() => {

         }, 500);

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // FILTRO FECHAS

 filtrarFechas() {

  if(
    !this.fechaInicio ||
    !this.fechaFin
  ){

    this.inventario =
    [...this.inventarioOriginal];

    return;

  }

  this.inventario =
  this.inventarioOriginal.filter(i => {

    return (

      i.fechaIngreso >= this.fechaInicio &&

      i.fechaIngreso <= this.fechaFin

    );

  });

}
  // LIMPIAR FILTRO

  limpiarFiltro() {

  this.fechaInicio = '';

  this.fechaFin = '';

  this.inventario =
  [...this.inventarioOriginal];

}

  // FILTRAR TEXTO

  inventarioFiltrado() {

    return this.inventario.filter(i =>

      (i.nombre || '')
      .toLowerCase()
      .includes(
        this.buscar.toLowerCase()
      )

      ||

      (i.tipo || '')
      .toLowerCase()
      .includes(
        this.buscar.toLowerCase()
      )

    );

  }

  // TOTAL PRODUCTOS

  totalProductos() {

    return this.inventario.length;

  }

  // PRODUCTOS CRITICOS

  productosCriticos() {

    return this.inventario.filter(i =>

      Number(i.stock)
      <=
      Number(i.stockMinimo)

    ).length;

  }

  // PRODUCTOS NORMALES

  productosNormales() {

    return this.inventario.filter(i =>

      Number(i.stock)
      >
      Number(i.stockMinimo)

    ).length;

  }

  // VALOR INVENTARIO

  valorInventario() {

    return this.inventario.reduce(

      (acc, i) =>

        acc +

        (
          Number(i.stock)
          *
          Number(i.precio)
        ),

      0

    );

  }

  // LISTA CRITICOS

  listaCriticos() {

    return this.inventario.filter(i =>

      Number(i.stock)
      <=
      Number(i.stockMinimo)

    );

  }

  
  // IMPRIMIR

  imprimir() {

    window.print();

  }

  

  // EXPORTAR PDF

 exportarPDF() {
  // 1. Inicializar documento tamaño Carta
  const pdf = new jsPDF('p', 'mm', 'letter');
  const pdfWidth = pdf.internal.pageSize.getWidth();   // 215.9 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 279.4 mm
  const margenX = 15;
  let currentY = 20;

  // --- PIE DE PÁGINA AUTOMÁTICO REUTILIZABLE ---
  const agregarPieDePagina = () => {
    const totalPags = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPags; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184); // Color gris slate-400
      pdf.text('SCAFI © 2026 · DOCUMENTO OFICIAL DE INVENTARIO', margenX, pdfHeight - 10);
      pdf.text(`Página ${i} de ${totalPags}`, pdfWidth - margenX - 15, pdfHeight - 10);
    }
  };

  // --- ENCABEZADO ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(15, 23, 42); // Slate 900
  pdf.text('REPORTE DE INVENTARIO', margenX, currentY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139); // Slate 500
  const fechaStr = this.fechaActual.toLocaleDateString('es-CO');
  const horaStr = this.fechaActual.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  pdf.text('SCAFI · Software de Control Integral Cafetero', margenX, currentY + 5);
  
  // Datos alineados a la derecha
  pdf.text(`Fecha: ${fechaStr} | Hora: ${horaStr}`, pdfWidth - margenX, currentY, { align: 'right' });
  pdf.text(`Responsable: ${this.usuario}`, pdfWidth - margenX, currentY + 5, { align: 'right' });

  // Línea divisoria elegante
  pdf.setDrawColor(226, 232, 240); // Slate 200
  pdf.setLineWidth(0.5);
  pdf.line(margenX, currentY + 10, pdfWidth - margenX, currentY + 10);
  currentY += 20;

  // --- SECCIÓN: RESUMEN DE STOCK ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59); // Slate 800
  pdf.text('RESUMEN DE STOCK', margenX, currentY);
  currentY += 5;

  // Diseño de Tarjetas Estilo Tailwind (Fondo gris con borde fino)
  const kpiW = (pdfWidth - (margenX * 2) - 9) / 4; // Ancho dinámico para 4 columnas
  const kpiH = 18;
  
  const kpis = [
    { t: 'Total Productos', v: this.totalProductos().toString(), bg: [248, 250, 252], border: [226, 232, 240], text: [15, 23, 42] },
    { t: 'Prod. Críticos', v: this.productosCriticos().toString(), bg: [254, 242, 242], border: [254, 226, 226], text: [185, 28, 28] }, // Tonos Rojos
    { t: 'Estado Normal', v: this.productosNormales().toString(), bg: [240, 253, 244], border: [220, 252, 231], text: [22, 163, 74] },  // Tonos Verdes
    { t: 'Valor Total', v: `$ ${this.valorInventario().toLocaleString()}`, bg: [253, 250, 246], border: [245, 230, 211], text: [139, 92, 26] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = margenX + (idx * (kpiW + 3));
    
    // Dibujar el fondo de la tarjeta
    pdf.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    pdf.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, currentY, kpiW, kpiH, 3, 3, 'FD'); // FD significa Fill and Stroke (Fondo y Borde)
    
    // Texto superior pequeño
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 116, 139);
    pdf.text(kpi.t.toUpperCase(), x + 4, currentY + 5);
    
    // Valor numérico grande
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'black');
    pdf.setTextColor(kpi.text[0], kpi.text[1], kpi.text[2]);
    pdf.text(kpi.v, x + 4, currentY + 13);
  });

  currentY += kpiH + 12;

  // --- SECCIÓN: ALERTAS CRÍTICAS ---
  const criticos = this.listaCriticos();
  if (criticos.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(185, 28, 28); // Rojo
    pdf.text('ALERTAS CRÍTICAS', margenX, currentY);
    currentY += 4;

    // Caja de alerta contenedora
    pdf.setFillColor(254, 242, 242);
    pdf.setDrawColor(254, 202, 202);
    
    const textoCriticos = criticos.map(i => `${i.nombre} (Stock: ${i.stock} / Mín: ${i.stockMinimo})`).join('  |  ');
    const lineasCriticos = pdf.splitTextToSize(textoCriticos, pdfWidth - (margenX * 2) - 8);
    const cajaH = (lineasCriticos.length * 5) + 6;

    pdf.roundedRect(margenX, currentY, pdfWidth - (margenX * 2), cajaH, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(153, 27, 27);
    pdf.text(lineasCriticos, margenX + 4, currentY + 5);
    
    currentY += cajaH + 10;
  }

  // --- SECCIÓN: TABLA DE EXISTENCIAS ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  pdf.text('DETALLE DE EXISTENCIAS', margenX, currentY);

  const columnas = ['Producto', 'Tipo', 'Stock', 'Mínimo', 'Precio', 'Estado'];
  const filas = this.inventario.map(i => [
    i.nombre,
    i.tipo,
    i.stock,
    i.stockMinimo,
    `$ ${Number(i.precio).toLocaleString()}`,
    Number(i.stock) <= Number(i.stockMinimo) ? 'CRÍTICO' : 'NORMAL'
  ]);

  autoTable(pdf, {
    startY: currentY + 3,
    head: [columnas],
    body: filas,
    margin: { left: margenX, right: margenX, bottom: 20 },
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5, fontStyle: 'bold', halign: 'center' }, 
    bodyStyles: { fontSize: 8.5, textColor: [51, 65, 85], font: 'helvetica' },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'center' }
    },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.cell.section === 'body') {
        if (data.cell.text[0] === 'CRÍTICO') {
          data.cell.styles.textColor = [220, 38, 38]; 
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [22, 163, 74];
        }
      }
    },
    didDrawPage: (data) => {
      currentY = data.cursor ? data.cursor.y : currentY;
    }
  });

  currentY += 12;

  // --- SECCIÓN: GRÁFICO DE INVENTARIO ---
  const canvasGrafica = document.getElementById('graficaInventario') as HTMLCanvasElement;
  if (canvasGrafica) {
    if (currentY + 65 > pdfHeight - 25) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 41, 59);
    pdf.text('GRÁFICO DE INVENTARIO', margenX, currentY);
    currentY += 5;

    const imgGrafica = canvasGrafica.toDataURL('image/png');
    const anchoGrafica = pdfWidth - (margenX * 2);
    const altoGrafica = (canvasGrafica.height * anchoGrafica) / canvasGrafica.width;

    pdf.addImage(imgGrafica, 'PNG', margenX, currentY, anchoGrafica, Math.min(altoGrafica, 60));
    currentY += Math.min(altoGrafica, 60) + 15;
  }

  // --- SECCIÓN: FIRMAS ---
  if (currentY + 25 > pdfHeight - 25) {
    pdf.addPage();
    currentY = 25;
  } else {
    currentY += 5;
  }

  const anchoFirma = 50;
  const centroCol1 = margenX + 30;
  const centroCol2 = pdfWidth - margenX - 30;

  pdf.setDrawColor(30, 41, 59);
  pdf.setLineWidth(0.4);
  
  // Línea Administrador
  pdf.line(centroCol1 - (anchoFirma / 2), currentY, centroCol1 + (anchoFirma / 2), currentY);
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('ADMINISTRADOR', centroCol1, currentY + 4, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
 

  // Línea Auditoría
  pdf.line(centroCol2 - (anchoFirma / 2), currentY, centroCol2 + (anchoFirma / 2), currentY);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('REVISADO POR', centroCol2, currentY + 4, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text('Auditoría Interna', centroCol2, currentY + 8, { align: 'center' });

  // --- NUMERACIÓN FINAL Y GUARDADO ---
  agregarPieDePagina();
  pdf.save('Reporte_Inventario_SCAFI.pdf');
}
}