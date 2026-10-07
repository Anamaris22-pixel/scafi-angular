<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';

// ==========================================
// RESPUESTA JSON
// ==========================================
function responder($ok, $mensaje = '', $extra = []) {
    echo json_encode(
        array_merge(
            [
                "ok" => $ok,
                "error" => $mensaje
            ],
            $extra
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// ==========================================
// PRE-FLIGHT CORS
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ==========================================
// OBTENER Y VALIDAR JSON
// ==========================================
function obtenerInput() {

    $contenido = file_get_contents("php://input");
    $input = json_decode($contenido, true);

    if (!is_array($input)) {
        responder(false, "Los datos enviados no tienen un formato válido.");
    }

    return $input;
}

// ==========================================
// VALIDAR CAMPOS DEL PROVEEDOR
// ==========================================
function validarProveedor($input) {

    $campos = [
        'nombre',
        'empresa',
        'telefono',
        'correo',
        'direccion',
        'estado'
    ];

    foreach ($campos as $campo) {

        if (
            !isset($input[$campo]) ||
            trim((string)$input[$campo]) === ''
        ) {
            responder(
                false,
                "El campo '" . $campo . "' es obligatorio."
            );
        }
    }

    $correo = trim((string)$input['correo']);

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        responder(false, "Ingrese un correo electrónico válido.");
    }
}

// ==========================================
// LISTAR
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT
            idProveedor,
            nombre,
            empresa,
            telefono,
            correo,
            direccion,
            estado
        FROM proveedores
        ORDER BY idProveedor DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        responder(false, "No fue posible consultar los proveedores.");
    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

// ==========================================
// INSERTAR
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = obtenerInput();

    validarProveedor($input);

    $nombre = trim((string)$input['nombre']);
    $empresa = trim((string)$input['empresa']);
    $telefono = trim((string)$input['telefono']);
    $correo = trim((string)$input['correo']);
    $direccion = trim((string)$input['direccion']);
    $estado = trim((string)$input['estado']);

    $sql = "
        INSERT INTO proveedores
        (
            nombre,
            empresa,
            telefono,
            correo,
            direccion,
            estado
        )
        VALUES (?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        responder(false, "No fue posible preparar el registro del proveedor.");
    }

    $stmt->bind_param(
        "ssssss",
        $nombre,
        $empresa,
        $telefono,
        $correo,
        $direccion,
        $estado
    );

    if ($stmt->execute()) {

        responder(
            true,
            "",
            [
                "mensaje" => "Proveedor registrado correctamente.",
                "idProveedor" => $stmt->insert_id
            ]
        );

    } else {

        responder(
            false,
            "No fue posible registrar el proveedor."
        );
    }
}

// ==========================================
// ACTUALIZAR
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = obtenerInput();

    if (
        !isset($input['idProveedor']) ||
        !is_numeric($input['idProveedor'])
    ) {
        responder(false, "El identificador del proveedor es obligatorio.");
    }

    validarProveedor($input);

    $id = (int)$input['idProveedor'];
    $nombre = trim((string)$input['nombre']);
    $empresa = trim((string)$input['empresa']);
    $telefono = trim((string)$input['telefono']);
    $correo = trim((string)$input['correo']);
    $direccion = trim((string)$input['direccion']);
    $estado = trim((string)$input['estado']);

    $sql = "
        UPDATE proveedores
        SET
            nombre = ?,
            empresa = ?,
            telefono = ?,
            correo = ?,
            direccion = ?,
            estado = ?
        WHERE idProveedor = ?
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        responder(false, "No fue posible preparar la actualización.");
    }

    $stmt->bind_param(
        "ssssssi",
        $nombre,
        $empresa,
        $telefono,
        $correo,
        $direccion,
        $estado,
        $id
    );

    if ($stmt->execute()) {

        if ($stmt->affected_rows >= 0) {
            responder(
                true,
                "",
                [
                    "mensaje" => "Proveedor actualizado correctamente."
                ]
            );
        }

    } else {

        responder(
            false,
            "No fue posible actualizar el proveedor."
        );
    }
}

// ==========================================
// ELIMINAR
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        responder(false, "El identificador del proveedor es obligatorio.");
    }

    $id = (int)$_GET['id'];

    $stmt = $conexion->prepare(
        "DELETE FROM proveedores WHERE idProveedor = ?"
    );

    if (!$stmt) {
        responder(false, "No fue posible preparar la eliminación.");
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {

        responder(
            true,
            "",
            [
                "mensaje" => "Proveedor eliminado correctamente."
            ]
        );

    } else {

        responder(false, "No fue posible eliminar el proveedor.");
    }
}

// ==========================================
// MÉTODO NO PERMITIDO
// ==========================================
http_response_code(405);

responder(false, "Método no permitido.");
?>