<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';

function responder($ok, $mensaje = '', $extra = [])
{
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function obtenerInput()
{
    $contenido = file_get_contents("php://input");
    $input = json_decode($contenido, true);

    if (!is_array($input)) {
        responder(false, "Los datos enviados no son válidos.");
    }

    return $input;
}

function validarCliente($input)
{
    $campos = [
        'nit',
        'nombre',
        'telefono',
        'correo',
        'ciudad',
        'direccion',
        'tipo'
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT
            id,
            nit,
            nombre,
            telefono,
            correo,
            ciudad,
            direccion,
            tipo,
            fechaRegistro
        FROM clientes
        ORDER BY id DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        responder(false, "No fue posible consultar los clientes.");
    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = obtenerInput();
    validarCliente($input);

    $nit = trim((string)$input['nit']);
    $nombre = trim((string)$input['nombre']);
    $telefono = trim((string)$input['telefono']);
    $correo = trim((string)$input['correo']);
    $ciudad = trim((string)$input['ciudad']);
    $direccion = trim((string)$input['direccion']);
    $tipo = trim((string)$input['tipo']);

    $sql = "
        INSERT INTO clientes
        (
            nit,
            nombre,
            telefono,
            correo,
            ciudad,
            direccion,
            tipo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        responder(false, "No fue posible preparar el registro del cliente.");
    }

    $stmt->bind_param(
        "sssssss",
        $nit,
        $nombre,
        $telefono,
        $correo,
        $ciudad,
        $direccion,
        $tipo
    );

    if ($stmt->execute()) {
        responder(
            true,
            "",
            [
                "mensaje" => "Cliente registrado correctamente.",
                "id" => $stmt->insert_id
            ]
        );
    }

    responder(false, "No fue posible registrar el cliente.");
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = obtenerInput();

    if (
        !isset($input['id']) ||
        !is_numeric($input['id'])
    ) {
        responder(false, "El ID del cliente es obligatorio.");
    }

    validarCliente($input);

    $id = (int)$input['id'];
    $nit = trim((string)$input['nit']);
    $nombre = trim((string)$input['nombre']);
    $telefono = trim((string)$input['telefono']);
    $correo = trim((string)$input['correo']);
    $ciudad = trim((string)$input['ciudad']);
    $direccion = trim((string)$input['direccion']);
    $tipo = trim((string)$input['tipo']);

    $sql = "
        UPDATE clientes
        SET
            nit = ?,
            nombre = ?,
            telefono = ?,
            correo = ?,
            ciudad = ?,
            direccion = ?,
            tipo = ?
        WHERE id = ?
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        responder(false, "No fue posible preparar la actualización.");
    }

    $stmt->bind_param(
        "sssssssi",
        $nit,
        $nombre,
        $telefono,
        $correo,
        $ciudad,
        $direccion,
        $tipo,
        $id
    );

    if ($stmt->execute()) {
        responder(
            true,
            "",
            [
                "mensaje" => "Cliente actualizado correctamente."
            ]
        );
    }

    responder(false, "No fue posible actualizar el cliente.");
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    if (
        !isset($_GET['id']) ||
        !is_numeric($_GET['id'])
    ) {
        responder(false, "El ID del cliente es obligatorio.");
    }

    $id = (int)$_GET['id'];

    $stmt = $conexion->prepare(
        "DELETE FROM clientes WHERE id = ?"
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
                "mensaje" => "Cliente eliminado correctamente."
            ]
        );
    }

    responder(false, "No fue posible eliminar el cliente.");
}

http_response_code(405);
responder(false, "Método no permitido.");

?>