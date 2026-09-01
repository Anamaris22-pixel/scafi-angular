<?php

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");

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

// =========================
// ERROR
// =========================

if ($conn->connect_error) {

    echo json_encode([

        "ok" => false,

        "msg" => $conn->connect_error

    ]);

    exit;

}

// =========================
// SQL
// =========================

$sql = "

SELECT

    i.idInsumo,

    i.nombre,

    i.tipo,

    i.stock,

    i.stockMinimo,

    i.precio,

    (
        SELECT MAX(m.fecha)
        FROM movimientos m
        WHERE m.idInsumo = i.idInsumo
    ) AS fechaIngreso

FROM insumos i

ORDER BY i.nombre ASC

";

// =========================
// CONSULTA
// =========================

$resultado = $conn->query($sql);

$data = [];

// =========================
// RECORRER
// =========================

while (

    $fila = $resultado->fetch_assoc()

) {

    $data[] = $fila;

}

// =========================
// RESPUESTA
// =========================

echo json_encode($data);

?>