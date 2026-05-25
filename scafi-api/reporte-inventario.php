<?php

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");

// =========================
// CONEXIÓN
// =========================

$conn = new mysqli(

    "localhost",

    "root",

    "",

    "scafi",

    3306

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

    idInsumo,

    nombre,

    tipo,

    stock,

    stockMinimo,

    precio

FROM insumos

ORDER BY nombre ASC

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