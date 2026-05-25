<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$remitente_id = $_GET['remitente_id'] ?? 0;
$receptor_id = $_GET['receptor_id'] ?? 0;

$sql = "

SELECT *

FROM mensajes

WHERE

(
    remitente_id = '$remitente_id'
    AND receptor_id = '$receptor_id'
)

OR

(
    remitente_id = '$receptor_id'
    AND receptor_id = '$remitente_id'
)

ORDER BY fecha ASC

";

$resultado = $conexion->query($sql);

$mensajes = [];

while ($fila = $resultado->fetch_assoc()) {

    $mensajes[] = $fila;

}

echo json_encode($mensajes);