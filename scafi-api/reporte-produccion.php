<?php

// =========================
// HEADERS
// =========================

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// =========================
// CONEXIÓN
// =========================

$conn = new mysqli(
    "127.0.0.1",
    "root",
    "",
    "scafi",
    3307
);

$conn->set_charset("utf8");

// =========================
// ERROR CONEXIÓN
// =========================

if ($conn->connect_error) {

    echo json_encode([
        "ok" => false,
        "mensaje" => $conn->connect_error
    ]);

    exit;
}

// =========================
// PRODUCCIÓN
// =========================
// Los datos reales de producción
// se encuentran en la tabla recoleccion.
//
// kg      -> cantidad
// idRecoleccion -> id
// =========================

$sql = "

SELECT

    rec.idRecoleccion AS id,

    r.nombre AS recolector,

    l.nombreLote AS lote,

    rec.kg AS cantidad,

    rec.fecha,

    '' AS observacion,

    '' AS responsable

FROM recoleccion rec

INNER JOIN recolectores r
    ON rec.idRecolector = r.idRecolector

LEFT JOIN lotes l
    ON rec.idLote = l.idLote

ORDER BY rec.idRecoleccion DESC

";

// =========================
// EJECUTAR
// =========================

$resultado = $conn->query($sql);

// =========================
// VALIDAR ERROR SQL
// =========================

if (!$resultado) {

    echo json_encode([
        "ok" => false,
        "mensaje" => $conn->error
    ]);

    exit;
}

// =========================
// ARRAY PRODUCCIÓN
// =========================

$produccion = [];

while ($fila = $resultado->fetch_assoc()) {

    $produccion[] = $fila;

}

// =========================
// TOP RECOLECTORES
// =========================

$sqlRecolectores = "

SELECT

    r.nombre AS recolector,

    SUM(rec.kg) AS total,

    COUNT(*) AS registros

FROM recoleccion rec

INNER JOIN recolectores r
    ON rec.idRecolector = r.idRecolector

GROUP BY r.idRecolector, r.nombre

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

if (!$resultadoRecolectores) {

    echo json_encode([
        "ok" => false,
        "mensaje" => $conn->error
    ]);

    exit;
}

// =========================
// ARRAY TOP
// =========================

$topRecolectores = [];

while ($filaRecolector =
       $resultadoRecolectores->fetch_assoc()) {

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