<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


// =============================
// DATOS PRINCIPALES DEL DASHBOARD
// Una sola consulta obtiene las tarjetas y alertas.
// Antes se ejecutaban 7 consultas independientes.
// =============================

$sqlResumen = "

    SELECT

        (SELECT IFNULL(SUM(kg),0)
         FROM recoleccion) AS produccion,

        (SELECT IFNULL(SUM(total),0)
         FROM ventas
         WHERE fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
           AND MONTH(fecha)=MONTH(CURDATE())
           AND YEAR(fecha)=YEAR(CURDATE())) AS ventas_mes,

        (SELECT COUNT(*)
         FROM recolectores
         WHERE estado = 'Activo') AS recolectores,

        (SELECT COUNT(*)
         FROM lotes) AS lotes,

        (SELECT COUNT(*)
         FROM insumos
         WHERE stock <= stockMinimo) AS bajo_stock,

        (SELECT IFNULL(SUM(total),0)
         FROM ventas
         WHERE DATE(fecha)=CURDATE()) AS ventas_hoy,

        (SELECT COUNT(*)
         FROM lotes
         WHERE estado = 'Activo') AS lotes_activos

";

$resumen = $conexion->query($sqlResumen);
$resumenData = $resumen->fetch_assoc();

$produccion = (float)($resumenData['produccion'] ?? 0);
$ventas = (float)($resumenData['ventas_mes'] ?? 0);
$recolectores = (int)($resumenData['recolectores'] ?? 0);
$lotes = (int)($resumenData['lotes'] ?? 0);
$alertas = (int)($resumenData['bajo_stock'] ?? 0);
$ventasHoy = (float)($resumenData['ventas_hoy'] ?? 0);
$activos = (int)($resumenData['lotes_activos'] ?? 0);


// =============================
// ULTIMOS MOVIMIENTOS
// =============================

// =============================

$sqlMovimientos = "

    SELECT

        DATE(m.fecha) AS fecha,

        CONCAT(
            i.nombre,
            ' - ',
            m.observacion
        ) AS movimiento,

        UPPER(m.tipo) AS usuario,

        'COMPLETADO' AS estado

    FROM movimientos m

    INNER JOIN insumos i
    ON m.idInsumo = i.idInsumo

    ORDER BY m.fecha DESC

    LIMIT 5

";

$resMovimientos =
$conexion->query($sqlMovimientos);

$movimientos = [];

while (
    $fila =
    $resMovimientos->fetch_assoc()
) {

    $movimientos[] = $fila;

}


// =============================
// GRAFICA VENTAS
// =============================

$sqlGrafica = "

    SELECT

        DATE_FORMAT(
            fecha,
            '%b'
        ) AS mes,

        YEAR(fecha) AS anio,

        MONTH(fecha) AS mes_numero,

        SUM(total) AS ventas

    FROM ventas

    WHERE fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)

    GROUP BY
    YEAR(fecha),
    MONTH(fecha)

    ORDER BY
    YEAR(fecha),
    MONTH(fecha)

";
$resGrafica =
$conexion->query($sqlGrafica);

$grafica = [];

while (
    $fila =
    $resGrafica->fetch_assoc()
) {

    $grafica[] = [

        "mes" => $fila['mes'],

        "anio" => (int)$fila['anio'],

        "mes_numero" => (int)$fila['mes_numero'],

        "ventas" =>
        (float)$fila['ventas']

    ];

}


// =============================
// RESPUESTA JSON
// =============================

echo json_encode([

    "ok" => true,

    "tarjetas" => [

        "produccion" => $produccion,
        "ventas" => $ventas,
        "recolectores" => $recolectores,
        "lotes" => $lotes

    ],

    "alertas" => [

        "bajo_stock" => $alertas,
        "ventas_hoy" => $ventasHoy,
        "lotes_activos" => $activos

    ],

    "ultimos_movimientos" => $movimientos,

    "grafica" => $grafica

]);

$conexion->close();

?>