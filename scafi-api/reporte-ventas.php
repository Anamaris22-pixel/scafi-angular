<?php

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");

$conn = new mysqli(
    "127.0.0.1",
    "root",
    "",
    "scafi",
    3307
);

if ($conn->connect_error) {

    echo json_encode([
        "error" => $conn->connect_error
    ]);

    exit;

}

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

$resultado = $conn->query($sql);

$data = [];

while($fila = $resultado->fetch_assoc()){

    $data[] = $fila;

}

echo json_encode($data);

$conn->close();

?>