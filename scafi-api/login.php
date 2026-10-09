<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Método no permitido"
    ]);
    exit;
}

function responder($datos, $codigoHttp = 200) {
    http_response_code($codigoHttp);
    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

try {
    require __DIR__ . '/conexion.php';

    $datos = json_decode(file_get_contents("php://input"), true);

    if (!is_array($datos)) {
        responder([
            "ok" => false,
            "mensaje" => "Solicitud inválida"
        ], 400);
    }

    $correo = trim((string)($datos['correo'] ?? ''));
    $password = (string)($datos['password'] ?? '');

    if ($correo === '' || $password === '') {
        responder([
            "ok" => false,
            "mensaje" => "Ingresa el correo y la contraseña"
        ], 400);
    }

    $sql = "
        SELECT
            u.id,
            u.nombre,
            u.correo,
            u.contrasena,
            u.idRol,
            u.foto,
            u.telefono,
            u.documento,
            u.direccion,
            r.nombreRol
        FROM usuario u
        INNER JOIN rol r ON u.idRol = r.idRol
        WHERE u.correo = ?
        LIMIT 1
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        throw new RuntimeException("Error preparando consulta");
    }

    $stmt->bind_param("s", $correo);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();
    $stmt->close();

    $valida = false;

    if ($usuario && is_string($usuario['contrasena'])) {
        $guardada = $usuario['contrasena'];
        $infoHash = password_get_info($guardada);

        if (!empty($infoHash['algo'])) {
            $valida = password_verify($password, $guardada);
        } else {
            // Compatibilidad temporal con contraseñas antiguas.
            $valida = hash_equals($guardada, $password);

            if ($valida) {
                $nuevoHash = password_hash($password, PASSWORD_DEFAULT);

                if ($nuevoHash !== false) {
                    $actualizar = $conexion->prepare(
                        "UPDATE usuario SET contrasena = ? WHERE id = ?"
                    );

                    if ($actualizar) {
                        $idUsuario = (int)$usuario['id'];
                        $actualizar->bind_param(
                            "si",
                            $nuevoHash,
                            $idUsuario
                        );

                        if ($actualizar->execute()) {
                            $usuario['contrasena'] = $nuevoHash;
                        } else {
                            error_log(
                                "SCAFI: no fue posible actualizar el hash de contraseña."
                            );
                        }

                        $actualizar->close();
                    }
                }
            }
        }
    }

    if (!$usuario || !$valida) {
        responder([
            "ok" => false,
            "mensaje" => "Correo o contraseña incorrectos"
        ], 401);
    }

    unset($usuario['contrasena']);

    responder([
        "ok" => true,
        "usuario" => [
            "id" => $usuario['id'],
            "nombre" => $usuario['nombre'],
            "correo" => $usuario['correo'],
            "idRol" => $usuario['idRol'],
            "foto" => $usuario['foto'] ?? '',
            "telefono" => $usuario['telefono'] ?? '',
            "documento" => $usuario['documento'] ?? '',
            "direccion" => $usuario['direccion'] ?? '',
            "rol" => $usuario['nombreRol']
        ]
    ]);

} catch (Throwable $e) {
    error_log("SCAFI login: " . $e->getMessage());

    responder([
        "ok" => false,
        "mensaje" => "No fue posible procesar el inicio de sesión"
    ], 500);
}