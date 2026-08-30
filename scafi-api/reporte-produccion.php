<?php

// =========================
// HEADERS
// =========================

header(
  "Access-Control-Allow-Origin: *"
);

header(
  "Content-Type: application/json; charset=UTF-8"
);

require 'conexion.php';

// =========================
// PRODUCCION
// =========================

$sql = "

SELECT

    p.id,

    r.nombre AS recolector,

    l.nombreLote AS lote,

    p.cantidad,

    p.fecha,

    p.observacion,

    p.responsable

FROM produccion p

INNER JOIN recolectores r
ON p.idRecolector = r.idRecolector

INNER JOIN lotes l
ON p.idLote = l.idLote

ORDER BY p.id DESC

";

// =========================
// EJECUTAR
// =========================

$resultado =
$conexion->query($sql);

// =========================
// VALIDAR ERROR SQL
// =========================

if(!$resultado){

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        $conexion->error

    ]);

    exit;

}

// =========================
// ARRAY PRODUCCION
// =========================

$produccion = [];

while(
    $fila =
    $resultado->fetch_assoc()
){

    $produccion[] = $fila;

}

// =========================
// TOP RECOLECTORES
// =========================

$sqlRecolectores = "

SELECT

    r.nombre AS recolector,

    SUM(p.cantidad) AS total,

    COUNT(*) AS registros

FROM produccion p

INNER JOIN recolectores r
ON p.idRecolector = r.idRecolector

GROUP BY r.nombre

ORDER BY total DESC

LIMIT 5

";

// =========================
// EJECUTAR TOP
// =========================

$resultadoRecolectores =
$conexion->query($sqlRecolectores);

// =========================
// VALIDAR ERROR TOP
// =========================

if(!$resultadoRecolectores){

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        $conexion->error

    ]);

    exit;

}

// =========================
// ARRAY TOP
// =========================

$topRecolectores = [];

while(

    $filaRecolector =

    $resultadoRecolectores
    ->fetch_assoc()

){

    $topRecolectores[] =
    $filaRecolector;

}

// =========================
// RESPUESTA FINAL
// =========================

echo json_encode([

    "ok" => true,

    "produccion" =>
    $produccion,

    "topRecolectores" =>
    $topRecolectores

], JSON_UNESCAPED_UNICODE);

// =========================
// CERRAR
// =========================

$conexion->close();

?>