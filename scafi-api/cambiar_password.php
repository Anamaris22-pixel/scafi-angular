<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

function responder($datos, $estado = 200) {
    http_response_code($estado);
    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder([
        "ok" => false,
        "mensaje" => "Método no permitido"
    ], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    responder([
        "ok" => false,
        "mensaje" => "Solicitud inválida"
    ], 400);
}

$token = trim((string)($data['token'] ?? ''));
$nuevaPassword = (string)($data['nuevaPassword'] ?? '');

if ($token === '' || $nuevaPassword === '') {
    responder([
        "ok" => false,
        "mensaje" => "Datos incompletos"
    ], 400);
}

if (strlen($nuevaPassword) < 8) {
    responder([
        "ok" => false,
        "mensaje" => "La contraseña debe tener al menos 8 caracteres"
    ], 400);
}

if (strlen($nuevaPassword) > 72) {
    responder([
        "ok" => false,
        "mensaje" => "La contraseña es demasiado larga"
    ], 400);
}

try {
    require __DIR__ . '/conexion.php';

    $consulta = $conexion->prepare(
        "SELECT id FROM usuario
         WHERE token_recuperacion = ?
           AND token_expira > NOW()
         LIMIT 1"
    );

    if (!$consulta) {
        throw new RuntimeException("No se pudo preparar la consulta");
    }

    $consulta->bind_param("s", $token);
    $consulta->execute();

    $resultado = $consulta->get_result();
    $usuario = $resultado->fetch_assoc();
    $consulta->close();

    if (!$usuario) {
        responder([
            "ok" => false,
            "mensaje" => "Token inválido o expirado"
        ], 400);
    }

    $hash = password_hash($nuevaPassword, PASSWORD_DEFAULT);

    if ($hash === false) {
        throw new RuntimeException("No se pudo generar el hash");
    }

    $id = (int)$usuario['id'];

    $actualizar = $conexion->prepare(
        "UPDATE usuario
         SET contrasena = ?,
             token_recuperacion = NULL,
             token_expira = NULL
         WHERE id = ?
           AND token_recuperacion = ?
           AND token_expira > NOW()"
    );

    if (!$actualizar) {
        throw new RuntimeException("No se pudo preparar la actualización");
    }

    $actualizar->bind_param("sis", $hash, $id, $token);
    $actualizar->execute();

    $cambios = $actualizar->affected_rows;
    $actualizar->close();

    if ($cambios !== 1) {
        responder([
            "ok" => false,
            "mensaje" => "El token ya no es válido. Solicita uno nuevo."
        ], 400);
    }

    responder([
        "ok" => true,
        "mensaje" => "Contraseña actualizada correctamente"
    ]);

} catch (Throwable $e) {
    error_log("SCAFI cambiar_password: " . $e->getMessage());

    responder([
        "ok" => false,
        "mensaje" => "No fue posible actualizar la contraseña"
    ], 500);
}