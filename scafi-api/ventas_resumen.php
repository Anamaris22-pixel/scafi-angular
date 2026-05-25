<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'conexion.php';


// ============================
// RECIBIR MES Y AÑO
// ============================

$mes = isset($_GET['mes'])
    ? intval($_GET['mes'])
    : date('m');

$anio = isset($_GET['anio'])
    ? intval($_GET['anio'])
    : date('Y');


// ============================
// CONSULTA
// ============================

$sql = "

    SELECT

        COUNT(*) AS totalVentas,

        IFNULL(SUM(total),0) AS ventasMes

    FROM ventas

    WHERE MONTH(fecha) = $mes
    AND YEAR(fecha) = $anio

";

$resultado =
$conexion->query($sql);

$data =
$resultado->fetch_assoc();


// ============================
// RESPUESTA
// ============================

echo json_encode([

    'ok' => true,

    'ventasMes' =>
        (float)$data['ventasMes'],

    'totalVentas' =>
        (int)$data['totalVentas']

]);

$conexion->close();

?>