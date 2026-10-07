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

function responder($ok, $mensaje = '', $extra = [])
{
    echo json_encode(
        array_merge(
            [
                "ok" => $ok,
                "mensaje" => $mensaje
            ],
            $extra
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit();
}

// =====================================================
// GET - CONSULTAR INSUMOS
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT
            idInsumo,
            nombre,
            idProveedor,
            tipo,
            descripcion,
            unidad,
            precio,
            stock,
            stockMinimo,
            fechaRegistro
        FROM insumos
        ORDER BY idInsumo DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        http_response_code(500);
        responder(
            false,
            "Error al consultar insumos: " . $conexion->error
        );
    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit();
}

// =====================================================
// POST - REGISTRAR INSUMO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        http_response_code(400);
        responder(false, "Los datos enviados no son válidos.");
    }

    $nombre = trim($data['nombre'] ?? '');
    $idProveedor = intval($data['idProveedor'] ?? 0);
    $tipo = trim($data['tipo'] ?? '');
    $descripcion = trim($data['descripcion'] ?? '');
    $unidad = trim($data['unidad'] ?? '');
    $precio = floatval($data['precio'] ?? 0);
    $stockMinimo = floatval($data['stockMinimo'] ?? 0);

    if (
        $nombre === '' ||
        $idProveedor <= 0 ||
        $tipo === '' ||
        $unidad === ''
    ) {
        responder(
            false,
            "Complete todos los campos obligatorios."
        );
    }

    if ($precio < 0) {
        responder(
            false,
            "El precio no puede ser negativo."
        );
    }

    if ($stockMinimo < 0) {
        responder(
            false,
            "El stock mínimo no puede ser negativo."
        );
    }

    // El stock inicial se controla desde Movimientos.
    $stockInicial = 0;

    $stmt = $conexion->prepare("
        INSERT INTO insumos
        (
            nombre,
            idProveedor,
            tipo,
            descripcion,
            unidad,
            precio,
            stock,
            stockMinimo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        http_response_code(500);
        responder(false, $conexion->error);
    }

    $stmt->bind_param(
        "sisssddi",
        $nombre,
        $idProveedor,
        $tipo,
        $descripcion,
        $unidad,
        $precio,
        $stockInicial,
        $stockMinimo
    );

    if ($stmt->execute()) {
        $stmt->close();
        responder(
            true,
            "Insumo registrado correctamente."
        );
    }

    $error = $stmt->error;
    $stmt->close();

    http_response_code(500);
    responder(false, $error);
}

// =====================================================
// PUT - ACTUALIZAR INSUMO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        http_response_code(400);
        responder(false, "Los datos enviados no son válidos.");
    }

    $id = intval($data['idInsumo'] ?? 0);
    $nombre = trim($data['nombre'] ?? '');
    $idProveedor = intval($data['idProveedor'] ?? 0);
    $tipo = trim($data['tipo'] ?? '');
    $descripcion = trim($data['descripcion'] ?? '');
    $unidad = trim($data['unidad'] ?? '');
    $precio = floatval($data['precio'] ?? 0);
    $stockMinimo = floatval($data['stockMinimo'] ?? 0);

    if ($id <= 0) {
        responder(false, "ID del insumo requerido.");
    }

    if (
        $nombre === '' ||
        $idProveedor <= 0 ||
        $tipo === '' ||
        $unidad === ''
    ) {
        responder(
            false,
            "Complete todos los campos obligatorios."
        );
    }

    if ($precio < 0) {
        responder(
            false,
            "El precio no puede ser negativo."
        );
    }

    if ($stockMinimo < 0) {
        responder(
            false,
            "El stock mínimo no puede ser negativo."
        );
    }

    // El stock NO se modifica desde Insumos.
    $stmt = $conexion->prepare("
        UPDATE insumos
        SET
            nombre = ?,
            idProveedor = ?,
            tipo = ?,
            descripcion = ?,
            unidad = ?,
            precio = ?,
            stockMinimo = ?
        WHERE idInsumo = ?
    ");

    if (!$stmt) {
        http_response_code(500);
        responder(false, $conexion->error);
    }

    $stmt->bind_param(
        "sisssddi",
        $nombre,
        $idProveedor,
        $tipo,
        $descripcion,
        $unidad,
        $precio,
        $stockMinimo,
        $id
    );

    if ($stmt->execute()) {
        $stmt->close();
        responder(
            true,
            "Insumo actualizado correctamente."
        );
    }

    $error = $stmt->error;
    $stmt->close();

    http_response_code(500);
    responder(false, $error);
}

// =====================================================
// DELETE - ELIMINAR INSUMO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = intval($_GET['id'] ?? 0);

    if ($id <= 0) {
        responder(false, "ID de insumo requerido.");
    }

    // No permitir eliminar insumos con historial.
    $stmtVerificar = $conexion->prepare("
        SELECT COUNT(*) AS total
        FROM movimientos
        WHERE idInsumo = ?
    ");

    if (!$stmtVerificar) {
        http_response_code(500);
        responder(false, $conexion->error);
    }

    $stmtVerificar->bind_param("i", $id);
    $stmtVerificar->execute();

    $resultado = $stmtVerificar->get_result();
    $fila = $resultado->fetch_assoc();

    $stmtVerificar->close();

    if (intval($fila['total']) > 0) {
        responder(
            false,
            "No se puede eliminar el insumo porque tiene movimientos registrados."
        );
    }

    $stmt = $conexion->prepare("
        DELETE FROM insumos
        WHERE idInsumo = ?
    ");

    if (!$stmt) {
        http_response_code(500);
        responder(false, $conexion->error);
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $stmt->close();
        responder(
            true,
            "Insumo eliminado correctamente."
        );
    }

    $error = $stmt->error;
    $stmt->close();

    http_response_code(500);
    responder(false, $error);
}

http_response_code(405);

responder(
    false,
    "Método no permitido."
);

$conexion->close();

?>