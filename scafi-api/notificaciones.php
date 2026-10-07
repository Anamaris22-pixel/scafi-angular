<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'conexion.php';

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );

    exit();
}

// ======================================================
// GET
// TRAER SOLO LAS NOTIFICACIONES DEL USUARIO ACTUAL
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $idUsuario =
        intval($_GET['usuario_id'] ?? 0);

    if ($idUsuario <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "No se recibió un usuario_id válido."
        ], 400);
    }

    $sql = "
        SELECT
            n.id,
            n.usuario_id,
            n.titulo,
            n.mensaje,
            n.fecha,
            n.visto_por,
            n.enviado_por,
            u.nombre AS nombre_remitente
        FROM notificaciones n
        LEFT JOIN usuario u
            ON u.id = n.enviado_por
        WHERE n.usuario_id = ?
        ORDER BY n.fecha DESC
    ";

    $stmt =
        $conexion->prepare($sql);

    if (!($stmt instanceof mysqli_stmt)) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Error preparando consulta.",
            "error" =>
                $conexion->error
        ], 500);
    }

    $stmt->bind_param(
        "i",
        $idUsuario
    );

    if (!$stmt->execute()) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Error consultando notificaciones.",
            "error" =>
                $stmt->error
        ], 500);
    }

    $resultado =
        $stmt->get_result();

    
    /** @var mysqli_result $resultado */
$notificaciones = [];

    while (
        $fila =
        $resultado->fetch_assoc()
    ) {
        $notificaciones[] =
            $fila;
    }

    $stmt->close();

    // SOLO LAS NO LEÍDAS DEL USUARIO ACTUAL
    $sqlTotal = "
        SELECT COUNT(*) AS total
        FROM notificaciones
        WHERE usuario_id = ?
        AND visto_por IS NULL
    ";

    $stmtTotal =
        $conexion->prepare($sqlTotal);

    $total = 0;

    if ($stmtTotal) {

        $stmtTotal->bind_param(
            "i",
            $idUsuario
        );

        $stmtTotal->execute();

        $resultadoTotal =
            $stmtTotal->get_result();

        
    /** @var mysqli_result $resultadoTotal */
$filaTotal =
            $resultadoTotal->fetch_assoc();

        $total =
            intval(
                $filaTotal['total'] ?? 0
            );

        $stmtTotal->close();
    }

    responder([
        "ok" => true,
        "usuario_id" => $idUsuario,
        "total" => $total,
        "notificaciones" => $notificaciones
    ]);
}


// ======================================================
// POST
// MARCAR UNA NOTIFICACIÓN COMO LEÍDA
// SOLO PARA EL USUARIO QUE LA ESTÁ VIENDO
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $datos =
        json_decode(
            file_get_contents("php://input"),
            true
        );

    $idNotificacion =
        intval($datos['id'] ?? 0);

    $idUsuario =
        intval($datos['usuario_id'] ?? 0);

    if (
        $idNotificacion <= 0 ||
        $idUsuario <= 0
    ) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Los datos de la notificación no son válidos."
        ], 400);
    }

    // Verificar que esa notificación pertenece
    // realmente al usuario que la está marcando.
    $sqlVerificar = "
        SELECT
            id,
            visto_por
        FROM notificaciones
        WHERE id = ?
        AND usuario_id = ?
        LIMIT 1
    ";

    $stmtVerificar =
        $conexion->prepare(
            $sqlVerificar
        );

    if (!($stmtVerificar instanceof mysqli_stmt)) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Error verificando la notificación.",
            "error" =>
                $conexion->error
        ], 500);
    }

    $stmtVerificar->bind_param(
        "ii",
        $idNotificacion,
        $idUsuario
    );

    $stmtVerificar->execute();

    $resultado =
        $stmtVerificar->get_result();

    
    /** @var mysqli_result $resultado */
$notificacion =
        $resultado->fetch_assoc();

    $stmtVerificar->close();

    if (!$notificacion) {

        responder([
            "ok" => false,
            "mensaje" =>
                "La notificación no pertenece al usuario actual."
        ], 403);
    }

    // Si ya estaba leída, no hacemos otra modificación.
    if ($notificacion['visto_por'] !== null) {

        responder([
            "ok" => true,
            "mensaje" =>
                "La notificación ya estaba leída.",
            "id" =>
                $idNotificacion,
            "usuario_id" =>
                $idUsuario,
            "visto_por" =>
                $notificacion['visto_por']
        ]);
    }

    // IMPORTANTE:
    // Solo se actualiza la fila de ESTE usuario.
    $sqlUpdate = "
        UPDATE notificaciones
        SET visto_por = ?
        WHERE id = ?
        AND usuario_id = ?
    ";

    $stmtUpdate =
        $conexion->prepare(
            $sqlUpdate
        );

    if (!($stmtUpdate instanceof mysqli_stmt)) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Error preparando actualización.",
            "error" =>
                $conexion->error
        ], 500);
    }

    $stmtUpdate->bind_param(
        "iii",
        $idUsuario,
        $idNotificacion,
        $idUsuario
    );

    if (!$stmtUpdate->execute()) {

        responder([
            "ok" => false,
            "mensaje" =>
                "No se pudo marcar la notificación.",
            "error" =>
                $stmtUpdate->error
        ], 500);
    }

    $stmtUpdate->close();

    responder([
        "ok" => true,
        "mensaje" =>
            "Notificación marcada como leída.",
        "id" =>
            $idNotificacion,
        "usuario_id" =>
            $idUsuario,
        "visto_por" =>
            $idUsuario
    ]);
}

responder([
    "ok" => false,
    "mensaje" =>
        "Método HTTP no permitido."
], 405);
?>
