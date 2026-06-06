<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$token = $_GET['token'] ?? '';

if (!$token) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Token requerido"
    ]);

    exit;
}

$sql = "
SELECT id, nombre, correo
FROM usuario
WHERE token_recuperacion = '$token'
AND token_expira > NOW()
LIMIT 1
";

$resultado = mysqli_query($conn, $sql);

if (!$resultado) {

    echo json_encode([
        "ok" => false,
        "mensaje" => mysqli_error($conn)
    ]);

    exit;
}

if (mysqli_num_rows($resultado) == 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Token inválido o expirado"
    ]);

    exit;
}

$usuario = mysqli_fetch_assoc($resultado);

echo json_encode([
    "ok" => true,
    "usuario" => $usuario
]);