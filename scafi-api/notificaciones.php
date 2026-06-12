<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// Añadimos POST y PUT por si acaso tu servicio de Angular los requiere en el handshake
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';

// Validamos que el ID sea un número entero
$idUsuario = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

$sql = "
    SELECT
        n.*,
        u.nombre AS nombre_remitente
    FROM notificaciones n
    LEFT JOIN usuario u ON u.id = n.enviado_por
    WHERE n.usuario_id = ?
    ORDER BY n.fecha DESC
";

$stmt = $conexion->prepare($sql);

if ($stmt) {
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $notificaciones = [];

    while ($fila = $resultado->fetch_assoc()) {
        $notificaciones[] = $fila;
    }

    echo json_encode([
        "ok" => true,
        "total" => count($notificaciones),
        "notificaciones" => $notificaciones
    ]);

    $stmt->close();
} else {
    echo json_encode([
        "ok" => false,
        "error" => "Error al preparar la consulta: " . $conexion->error
    ]);
}

$conexion->close();