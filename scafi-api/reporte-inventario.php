<?php

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");

require 'conexion.php';

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

$resultado = $conexion->query($sql);

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