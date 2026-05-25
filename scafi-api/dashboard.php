<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


// =============================
// PRODUCCION ACUMULADA
// =============================

$sqlProduccion = "

    SELECT
    IFNULL(SUM(kg),0) AS total
    FROM recoleccion

";

$resProduccion =
$conexion->query($sqlProduccion);

$produccion =
$resProduccion->fetch_assoc()['total'];


// =============================
// VENTAS DEL MES
// =============================

$sqlVentas = "

    SELECT
    IFNULL(SUM(total),0) AS total

    FROM ventas

    WHERE MONTH(fecha)=MONTH(CURDATE())
    AND YEAR(fecha)=YEAR(CURDATE())

";

$resVentas =
$conexion->query($sqlVentas);

$ventas =
$resVentas->fetch_assoc()['total'];


// =============================
// RECOLECTORES ACTIVOS
// =============================

$sqlRecolectores = "

    SELECT
    COUNT(*) AS total
    FROM recolectores
    WHERE estado = 'Activo'

";

$resRecolectores =
$conexion->query($sqlRecolectores);

$recolectores =
$resRecolectores->fetch_assoc()['total'];


// =============================
// LOTES REGISTRADOS
// =============================

$sqlLotes = "

    SELECT
    COUNT(*) AS total
    FROM lotes

";

$resLotes =
$conexion->query($sqlLotes);

$lotes =
$resLotes->fetch_assoc()['total'];


// =============================
// INSUMOS BAJO STOCK
// =============================

$sqlAlertas = "

    SELECT
    COUNT(*) AS total
    FROM insumos
    WHERE stock <= stockMinimo

";

$resAlertas =
$conexion->query($sqlAlertas);

$alertas =
$resAlertas->fetch_assoc()['total'];


// =============================
// VENTAS REGISTRADAS HOY
// =============================

$sqlVentasHoy = "

    SELECT
    IFNULL(SUM(total),0) AS total
    FROM ventas
    WHERE DATE(fecha)=CURDATE()

";

$resVentasHoy =
$conexion->query($sqlVentasHoy);

$ventasHoy =
$resVentasHoy->fetch_assoc()['total'];


// =============================
// LOTES ACTIVOS
// =============================

$sqlActivos = "

    SELECT
    COUNT(*) AS total
    FROM lotes
    WHERE estado = 'Activo'

";

$resActivos =
$conexion->query($sqlActivos);

$activos =
$resActivos->fetch_assoc()['total'];


// =============================
// ULTIMOS MOVIMIENTOS
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
            '%b %Y'
        ) AS mes,

        SUM(total) AS ventas

    FROM ventas

    WHERE fecha <= CURDATE()

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