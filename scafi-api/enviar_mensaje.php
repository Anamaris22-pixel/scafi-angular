<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

// DATOS
$remitente_id = $_POST['remitente_id'] ?? '';
$receptor_id  = $_POST['receptor_id'] ?? '';
$mensaje      = $_POST['mensaje'] ?? '';

$archivo = null;
$tipo = 'texto';

// =========================
// SUBIR ARCHIVO
// =========================

if (isset($_FILES['archivo'])) {

    $nombre =
        time() . '_' .
        $_FILES['archivo']['name'];

    $ruta =
        'uploads/chat/' .
        $nombre;

    move_uploaded_file(
        $_FILES['archivo']['tmp_name'],
        $ruta
    );

    $archivo = $ruta;

    $extension = strtolower(
        pathinfo($nombre, PATHINFO_EXTENSION)
    );

    if (
        $extension == 'jpg' ||
        $extension == 'jpeg' ||
        $extension == 'png' ||
        $extension == 'gif' ||
        $extension == 'webp'
    ) {

        $tipo = 'imagen';

    } elseif ($extension == 'pdf') {

        $tipo = 'pdf';

    } else {

        $tipo = 'archivo';

    }
}

// =========================
// GUARDAR MENSAJE
// =========================

$sqlMensaje = "

INSERT INTO mensajes
(
    remitente_id,
    receptor_id,
    mensaje,
    archivo,
    tipo
)

VALUES
(
    '$remitente_id',
    '$receptor_id',
    '$mensaje',
    " . ($archivo ? "'$archivo'" : "NULL") . ",
    '$tipo'
)

";

if ($conexion->query($sqlMensaje)) {

    // =========================
    // CREAR NOTIFICACIÓN
    // =========================

    $sqlNotificacion = "

    INSERT INTO notificaciones
    (
        usuario_id,
        titulo,
        mensaje,
        enviado_por
    )

    VALUES
    (
        '$receptor_id',
        'Nuevo mensaje',
        'Has recibido un mensaje nuevo',
        '$remitente_id'
    )

    ";

    $conexion->query($sqlNotificacion);

    echo json_encode([
        "ok" => true
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "error" => $conexion->error
    ]);

}

?>