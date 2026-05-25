<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$token = $data['token'];
$nuevaPassword = $data['nuevaPassword'];

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
        "mensaje" => "Token inválido o expirado"
    ]);

    exit;
}

$usuario = mysqli_fetch_assoc($resultado);

$idUsuario = $usuario['id'];

$update = "
UPDATE usuario
SET
contrasena='$nuevaPassword',
token_recuperacion=NULL,
token_expira=NULL
WHERE id='$idUsuario'
";

if (mysqli_query($conn, $update)) {

    echo json_encode([
        "ok" => true,
        "mensaje" => "Contraseña actualizada"
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al actualizar"
    ]);
}