<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$token = $_GET['token'];

$sql = "
SELECT *
FROM usuario
WHERE token_recuperacion='$token'
AND token_expira > NOW()
";

$resultado = mysqli_query($conn, $sql);

if (mysqli_num_rows($resultado) == 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Token inválido"
    ]);

    exit;
}

$usuario = mysqli_fetch_assoc($resultado);

echo json_encode([
    "ok" => true,
    "usuario" => [
        "id" => $usuario['id'],
        "nombre" => $usuario['nombre'],
        "correo" => $usuario['correo']
    ]
]);