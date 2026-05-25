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

// =========================
// CONEXION
// =========================

$conn = new mysqli(

    "localhost",
    "root",
    "",
    "scafi",
    3306

);

// UTF8

$conn->set_charset("utf8");

// =========================
// ERROR CONEXION
// =========================

if ($conn->connect_error) {

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        $conn->connect_error

    ]);

    exit;

}

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
$conn->query($sql);

// =========================
// VALIDAR ERROR SQL
// =========================

if(!$resultado){

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        $conn->error

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
$conn->query($sqlRecolectores);

// =========================
// VALIDAR ERROR TOP
// =========================

if(!$resultadoRecolectores){

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        $conn->error

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

$conn->close();

?>