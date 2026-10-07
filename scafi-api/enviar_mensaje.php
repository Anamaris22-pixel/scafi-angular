<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder([
        "ok" => false,
        "mensaje" => "Método HTTP no permitido."
    ], 405);
}

// ======================================================
// DATOS DEL MENSAJE
// ======================================================

$remitente_id = intval($_POST['remitente_id'] ?? 0);
$receptor_id  = intval($_POST['receptor_id'] ?? 0);
$mensaje      = trim($_POST['mensaje'] ?? '');

if ($remitente_id <= 0 || $receptor_id <= 0) {
    responder([
        "ok" => false,
        "mensaje" => "El remitente o receptor no es válido."
    ], 400);
}

$archivo = null;
$tipo = 'texto';

// ======================================================
// SUBIR ARCHIVO
// ======================================================

if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {

    $nombreOriginal = basename($_FILES['archivo']['name']);

    $nombre = time() . '_' . $nombreOriginal;

    $directorio = __DIR__ . '/uploads/chat/';

    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true);
    }

    $rutaFisica = $directorio . $nombre;
    $rutaBD = 'uploads/chat/' . $nombre;

    if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $rutaFisica)) {
        responder([
            "ok" => false,
            "mensaje" => "No fue posible guardar el archivo."
        ], 500);
    }

    $archivo = $rutaBD;

    $extension = strtolower(
        pathinfo($nombre, PATHINFO_EXTENSION)
    );

    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $tipo = 'imagen';
    } elseif ($extension === 'pdf') {
        $tipo = 'pdf';
    } else {
        $tipo = 'archivo';
    }
}

// ======================================================
// GUARDAR MENSAJE
// ======================================================

$sqlMensaje = "
    INSERT INTO mensajes
    (
        remitente_id,
        receptor_id,
        mensaje,
        archivo,
        tipo
    )
    VALUES (?, ?, ?, ?, ?)
";

$stmtMensaje = $conexion->prepare($sqlMensaje);

if (!($stmtMensaje instanceof mysqli_stmt)) {
    responder([
        "ok" => false,
        "mensaje" => "No fue posible preparar el mensaje.",
        "error" => $conexion->error
    ], 500);
}

$stmtMensaje->bind_param(
    "iisss",
    $remitente_id,
    $receptor_id,
    $mensaje,
    $archivo,
    $tipo
);

if (!$stmtMensaje->execute()) {
    responder([
        "ok" => false,
        "mensaje" => "No fue posible guardar el mensaje.",
        "error" => $stmtMensaje->error
    ], 500);
}

$stmtMensaje->close();

// ======================================================
// OBTENER NOMBRE DEL REMITENTE
// ======================================================

$nombreRemitente = 'Usuario';

$sqlRemitente = "
    SELECT nombre
    FROM usuario
    WHERE id = ?
    LIMIT 1
";

$stmtRemitente = $conexion->prepare($sqlRemitente);

if ($stmtRemitente instanceof mysqli_stmt) {

    $stmtRemitente->bind_param(
        "i",
        $remitente_id
    );

    if ($stmtRemitente->execute()) {

        $resultadoRemitente = $stmtRemitente->get_result();

        if ($fila = $resultadoRemitente->fetch_assoc()) {
            $nombreRemitente =
                trim($fila['nombre'] ?? '') ?: 'Usuario';
        }
    }

    $stmtRemitente->close();
}

// ======================================================
// CREAR NOTIFICACIÓN PARA EL RECEPTOR
// ======================================================

$tituloNotificacion =
    'Nuevo mensaje de ' . $nombreRemitente;

$mensajeNotificacion =
    $nombreRemitente .
    ' te ha enviado un mensaje nuevo.';

$sqlNotificacion = "
    INSERT INTO notificaciones
    (
        usuario_id,
        titulo,
        mensaje,
        enviado_por
    )
    VALUES (?, ?, ?, ?)
";

$stmtNotificacion =
    $conexion->prepare($sqlNotificacion);

$notificacionCreada = false;

if ($stmtNotificacion instanceof mysqli_stmt) {

    $stmtNotificacion->bind_param(
        "issi",
        $receptor_id,
        $tituloNotificacion,
        $mensajeNotificacion,
        $remitente_id
    );

    $notificacionCreada =
        $stmtNotificacion->execute();

    $stmtNotificacion->close();
}

responder([
    "ok" => true,
    "mensaje" => "Mensaje enviado correctamente.",
    "notificacion_creada" => $notificacionCreada,
    "receptor_id" => $receptor_id,
    "remitente_id" => $remitente_id
]);
?>