<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

if (!isset($_GET['correo'])) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Correo requerido"
    ]);

    exit;
}

$correo = $_GET['correo'];

$sql = "
SELECT id, nombre, correo
FROM usuario
WHERE correo = '$correo'
LIMIT 1
";

$resultado = mysqli_query($conexion, $sql);

if (mysqli_num_rows($resultado) > 0) {

    $usuario = mysqli_fetch_assoc($resultado);

    echo json_encode([
        "ok" => true,
        "usuario" => $usuario
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Usuario no encontrado"
    ]);
}