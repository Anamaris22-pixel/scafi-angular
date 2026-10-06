<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['accion']) && $_GET['accion'] === 'lotes') {

        $sqlLotes = "
            SELECT
                idLote,
                nombreLote,
                ubicacion,
                hectareas,
                estado
            FROM lotes
            WHERE estado = 'Activo'
            ORDER BY idLote ASC
        ";

        $resultadoLotes = $conexion->query($sqlLotes);

        if (!$resultadoLotes) {
            http_response_code(500);
            echo json_encode([
                "ok" => false,
                "mensaje" => "Error al consultar los lotes: " . $conexion->error
            ]);
            exit();
        }

        $lotes = [];

        while ($fila = $resultadoLotes->fetch_assoc()) {
            $lotes[] = $fila;
        }

        echo json_encode($lotes, JSON_UNESCAPED_UNICODE);
        exit();
    }

    $sql = "
        SELECT
            r.idRecoleccion,
            r.idRecolector,
            r.idLote,
            rec.nombre AS recolector,
            l.nombreLote,
            l.ubicacion,
            r.variedad,
            r.estado,
            r.fecha,
            r.kg
        FROM recoleccion r
        LEFT JOIN recolectores rec
            ON rec.idRecolector = r.idRecolector
        LEFT JOIN lotes l
            ON l.idLote = r.idLote
        ORDER BY r.idRecoleccion DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "Error al consultar las recolecciones: " . $conexion->error
        ]);
        exit();
    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $idRecolector = $_POST['idRecolector'] ?? '';
    $idLote       = $_POST['idLote'] ?? '';
    $variedad     = trim($_POST['variedad'] ?? '');
    $estado       = trim($_POST['estado'] ?? '');
    $fecha        = $_POST['fecha'] ?? '';
    $kg           = $_POST['kg'] ?? '';

    if (
        empty($idRecolector) ||
        empty($idLote) ||
        empty($variedad) ||
        empty($estado) ||
        empty($fecha) ||
        $kg === ''
    ) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Todos los campos son obligatorios."
        ]);
        exit();
    }

    if (!is_numeric($kg) || floatval($kg) <= 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "La cantidad de kilogramos debe ser mayor que cero."
        ]);
        exit();
    }

    $verificarRecolector = $conexion->prepare("
        SELECT idRecolector
        FROM recolectores
        WHERE idRecolector = ?
    ");

    if (!$verificarRecolector) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => $conexion->error
        ]);
        exit();
    }

    $verificarRecolector->bind_param("i", $idRecolector);
    $verificarRecolector->execute();
    $resultadoRecolector = $verificarRecolector->get_result();

    if ($resultadoRecolector->num_rows === 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "El recolector seleccionado no existe."
        ]);
        $verificarRecolector->close();
        exit();
    }

    $verificarRecolector->close();

    $verificarLote = $conexion->prepare("
        SELECT idLote
        FROM lotes
        WHERE idLote = ?
        AND estado = 'Activo'
    ");

    if (!$verificarLote) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => $conexion->error
        ]);
        exit();
    }

    $verificarLote->bind_param("i", $idLote);
    $verificarLote->execute();
    $resultadoLote = $verificarLote->get_result();

    if ($resultadoLote->num_rows === 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "El lote seleccionado no existe o está inactivo."
        ]);
        $verificarLote->close();
        exit();
    }

    $verificarLote->close();

    $stmt = $conexion->prepare("
        INSERT INTO recoleccion
        (
            idRecolector,
            idLote,
            variedad,
            estado,
            fecha,
            kg
        )
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo preparar el registro: " . $conexion->error
        ]);
        exit();
    }

    $stmt->bind_param(
        "iisssd",
        $idRecolector,
        $idLote,
        $variedad,
        $estado,
        $fecha,
        $kg
    );

    if ($stmt->execute()) {
        echo json_encode([
            "ok" => true,
            "mensaje" => "Pesaje guardado correctamente."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo guardar el pesaje: " . $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(file_get_contents("php://input"), true);

    $id           = $input['id'] ?? 0;
    $idRecolector = $input['idRecolector'] ?? '';
    $idLote       = $input['idLote'] ?? '';
    $variedad     = trim($input['variedad'] ?? '');
    $estado       = trim($input['estado'] ?? '');
    $fecha        = $input['fecha'] ?? '';
    $kg           = $input['kg'] ?? '';

    if (
        empty($id) ||
        empty($idRecolector) ||
        empty($idLote) ||
        empty($variedad) ||
        empty($estado) ||
        empty($fecha) ||
        $kg === ''
    ) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Todos los campos son obligatorios."
        ]);
        exit();
    }

    if (!is_numeric($kg) || floatval($kg) <= 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "La cantidad de kilogramos debe ser mayor que cero."
        ]);
        exit();
    }

    $verificarLote = $conexion->prepare("
        SELECT idLote
        FROM lotes
        WHERE idLote = ?
        AND estado = 'Activo'
    ");

    if (!$verificarLote) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => $conexion->error
        ]);
        exit();
    }

    $verificarLote->bind_param("i", $idLote);
    $verificarLote->execute();
    $resultadoLote = $verificarLote->get_result();

    if ($resultadoLote->num_rows === 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "El lote seleccionado no existe o está inactivo."
        ]);
        $verificarLote->close();
        exit();
    }

    $verificarLote->close();

    $stmt = $conexion->prepare("
        UPDATE recoleccion
        SET
            idRecolector = ?,
            idLote = ?,
            variedad = ?,
            estado = ?,
            fecha = ?,
            kg = ?
        WHERE idRecoleccion = ?
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo preparar la actualización: " . $conexion->error
        ]);
        exit();
    }

    $stmt->bind_param(
        "iisssdi",
        $idRecolector,
        $idLote,
        $variedad,
        $estado,
        $fecha,
        $kg,
        $id
    );

    if ($stmt->execute()) {
        echo json_encode([
            "ok" => true,
            "mensaje" => "Registro actualizado correctamente."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo actualizar el registro: " . $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'] ?? 0;

    if (empty($id)) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "ID de registro requerido."
        ]);
        exit();
    }

    $stmt = $conexion->prepare("
        DELETE FROM recoleccion
        WHERE idRecoleccion = ?
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo preparar la eliminación: " . $conexion->error
        ]);
        exit();
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode([
            "ok" => true,
            "mensaje" => "Registro eliminado correctamente."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo eliminar el registro: " . $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

http_response_code(405);

echo json_encode([
    "ok" => false,
    "mensaje" => "Método no permitido."
]);

$conexion->close();
?>