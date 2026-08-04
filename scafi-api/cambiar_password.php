<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "No llegaron datos"
    ]);
    exit;
}

$token = $data['token'] ?? '';
$nuevaPassword = $data['nuevaPassword'] ?? '';

if ($token == '' || $nuevaPassword == '') {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Datos incompletos"
    ]);
    exit;
}

$sql = "
SELECT *
FROM usuario
WHERE token_recuperacion='$token'
AND token_expira > NOW()
LIMIT 1
";

$resultado = mysqli_query($conexion, $sql);

if (!$resultado) {
    echo json_encode([
        "ok" => false,
        "mensaje" => mysqli_error($conexion)
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
$id = $usuario['id'];

$update = "
UPDATE usuario
SET
contrasena='$nuevaPassword',
token_recuperacion=NULL,
token_expira=NULL
WHERE id='$id'
";

if (mysqli_query($conexion, $update)) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Contraseña actualizada"
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "mensaje" => mysqli_error($conexion)
    ]);
}