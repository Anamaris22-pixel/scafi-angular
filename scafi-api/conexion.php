<?php
$conexion = new mysqli(
    "db", 
    "root", 
    "rootpassword", 
    "scafi", 
    3307
);

// Si hay error, devolvemos JSON y detenemos la ejecución
if ($conexion->connect_error) {
    header("Content-Type: application/json");
    echo json_encode([
        "error" => "Error conexión: " . $conexion->connect_error
    ]);
    exit;
}

$conexion->set_charset("utf8mb4");
?>