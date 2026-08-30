<?php

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");

require 'conexion.php';

$sql = "

SELECT

idVenta,
fecha,
cliente,
producto,
cantidad,
precio,
total,
estado

FROM ventas

ORDER BY idVenta DESC

";

$resultado = $conexion->query($sql);

$data = [];

while($fila = $resultado->fetch_assoc()){

    $data[] = $fila;

}

echo json_encode($data);

$conexion->close();

?>