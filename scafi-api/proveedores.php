<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


// =====================================================
// CORS OPTIONS
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);

    exit();

}


require_once 'conexion.php';


// =====================================================
// FUNCIÓN RESPUESTA
// =====================================================

function responder(
    $ok,
    $mensaje = '',
    $extra = []
) {

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
// GET - LISTAR PROVEEDORES
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'GET'
) {

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


    $resultado =
        $conexion->query($sql);


    if (!$resultado) {

        http_response_code(500);

        responder(
            false,
            "Error al consultar proveedores: "
            . $conexion->error
        );

    }


    $datos = [];


    while (
        $fila =
        $resultado->fetch_assoc()
    ) {

        $datos[] = $fila;

    }


    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );

    exit();

}


// =====================================================
// POST - REGISTRAR PROVEEDOR
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'POST'
) {


    $input = json_decode(

        file_get_contents(
            "php://input"
        ),

        true

    );


    // -------------------------------------------------
    // VALIDAR JSON
    // -------------------------------------------------

    if (!is_array($input)) {

        http_response_code(400);

        responder(
            false,
            "Los datos enviados no son válidos."
        );

    }


    // -------------------------------------------------
    // RECIBIR DATOS
    // -------------------------------------------------

    $nombre =
        trim(
            $input['nombre'] ?? ''
        );

    $empresa =
        trim(
            $input['empresa'] ?? ''
        );

    $telefono =
        trim(
            $input['telefono'] ?? ''
        );

    $correo =
        trim(
            $input['correo'] ?? ''
        );

    $direccion =
        trim(
            $input['direccion'] ?? ''
        );

    $estado =
        trim(
            $input['estado'] ?? ''
        );


    // -------------------------------------------------
    // VALIDAR CAMPOS OBLIGATORIOS
    // -------------------------------------------------

    $faltantes = [];


    if ($nombre === '') {

        $faltantes[] =
            'nombre';

    }


    if ($empresa === '') {

        $faltantes[] =
            'empresa';

    }


    if ($telefono === '') {

        $faltantes[] =
            'teléfono';

    }


    if ($correo === '') {

        $faltantes[] =
            'correo';

    }


    if ($direccion === '') {

        $faltantes[] =
            'dirección';

    }


    if ($estado === '') {

        $faltantes[] =
            'estado';

    }


    // -------------------------------------------------
    // SI FALTAN CAMPOS NO GUARDA
    // -------------------------------------------------

    if (
        count($faltantes) > 0
    ) {

        http_response_code(400);

        responder(

            false,

            "Complete los campos obligatorios.",

            [
                "camposFaltantes" =>
                    $faltantes
            ]

        );

    }


    // -------------------------------------------------
    // VALIDAR CORREO
    // -------------------------------------------------

    if (
        !filter_var(
            $correo,
            FILTER_VALIDATE_EMAIL
        )
    ) {

        http_response_code(400);

        responder(
            false,
            "Ingrese un correo electrónico válido."
        );

    }


    // -------------------------------------------------
    // INSERTAR
    // -------------------------------------------------

    $stmt =
        $conexion->prepare("

            INSERT INTO proveedores

            (
                nombre,
                empresa,
                telefono,
                correo,
                direccion,
                estado
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )

        ");


    if (!$stmt) {

        http_response_code(500);

        responder(
            false,
            "Error preparando el registro: "
            . $conexion->error
        );

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


    if (
        $stmt->execute()
    ) {

        $idNuevo =
            $conexion->insert_id;

        $stmt->close();


        responder(

            true,

            "Proveedor registrado correctamente.",

            [
                "idProveedor" =>
                    $idNuevo
            ]

        );

    }


    $error =
        $stmt->error;

    $stmt->close();


    http_response_code(500);


    responder(
        false,
        "No fue posible registrar el proveedor: "
        . $error
    );

}


// =====================================================
// PUT - ACTUALIZAR PROVEEDOR
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'PUT'
) {


    $input = json_decode(

        file_get_contents(
            "php://input"
        ),

        true

    );


    if (!is_array($input)) {

        http_response_code(400);

        responder(
            false,
            "Los datos enviados no son válidos."
        );

    }


    // -------------------------------------------------
    // DATOS
    // -------------------------------------------------

    $id =
        intval(
            $input['idProveedor'] ?? 0
        );

    $nombre =
        trim(
            $input['nombre'] ?? ''
        );

    $empresa =
        trim(
            $input['empresa'] ?? ''
        );

    $telefono =
        trim(
            $input['telefono'] ?? ''
        );

    $correo =
        trim(
            $input['correo'] ?? ''
        );

    $direccion =
        trim(
            $input['direccion'] ?? ''
        );

    $estado =
        trim(
            $input['estado'] ?? ''
        );


    // -------------------------------------------------
    // VALIDAR ID
    // -------------------------------------------------

    if (
        $id <= 0
    ) {

        http_response_code(400);

        responder(
            false,
            "ID del proveedor requerido."
        );

    }


    // -------------------------------------------------
    // VALIDAR CAMPOS
    // -------------------------------------------------

    $faltantes = [];


    if ($nombre === '') {

        $faltantes[] =
            'nombre';

    }


    if ($empresa === '') {

        $faltantes[] =
            'empresa';

    }


    if ($telefono === '') {

        $faltantes[] =
            'teléfono';

    }


    if ($correo === '') {

        $faltantes[] =
            'correo';

    }


    if ($direccion === '') {

        $faltantes[] =
            'dirección';

    }


    if ($estado === '') {

        $faltantes[] =
            'estado';

    }


    if (
        count($faltantes) > 0
    ) {

        http_response_code(400);

        responder(

            false,

            "Complete los campos obligatorios.",

            [
                "camposFaltantes" =>
                    $faltantes
            ]

        );

    }


    // -------------------------------------------------
    // VALIDAR CORREO
    // -------------------------------------------------

    if (
        !filter_var(
            $correo,
            FILTER_VALIDATE_EMAIL
        )
    ) {

        http_response_code(400);

        responder(
            false,
            "Ingrese un correo electrónico válido."
        );

    }


    // -------------------------------------------------
    // ACTUALIZAR
    // -------------------------------------------------

    $stmt =
        $conexion->prepare("

            UPDATE proveedores

            SET

                nombre = ?,
                empresa = ?,
                telefono = ?,
                correo = ?,
                direccion = ?,
                estado = ?

            WHERE
                idProveedor = ?

        ");


    if (!$stmt) {

        http_response_code(500);

        responder(
            false,
            "Error preparando la actualización: "
            . $conexion->error
        );

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


    if (
        $stmt->execute()
    ) {

        $stmt->close();


        responder(
            true,
            "Proveedor actualizado correctamente."
        );

    }


    $error =
        $stmt->error;

    $stmt->close();


    http_response_code(500);


    responder(

        false,

        "No fue posible actualizar el proveedor: "
        . $error

    );

}


// =====================================================
// DELETE - ELIMINAR
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'DELETE'
) {


    $id =
        intval(
            $_GET['id'] ?? 0
        );


    if (
        $id <= 0
    ) {

        responder(
            false,
            "ID de proveedor requerido."
        );

    }


    // -------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------

    $stmt =
        $conexion->prepare("

            DELETE FROM proveedores

            WHERE idProveedor = ?

        ");


    if (!$stmt) {

        http_response_code(500);

        responder(
            false,
            "Error preparando eliminación: "
            . $conexion->error
        );

    }


    $stmt->bind_param(
        "i",
        $id
    );


    if (
        $stmt->execute()
    ) {

        if (
            $stmt->affected_rows > 0
        ) {

            $stmt->close();

            responder(
                true,
                "Proveedor eliminado correctamente."
            );

        }


        $stmt->close();


        responder(
            false,
            "El proveedor no existe."
        );

    }


    $error =
        $stmt->error;

    $stmt->close();


    http_response_code(500);


    responder(
        false,
        "No fue posible eliminar el proveedor: "
        . $error
    );

}


// =====================================================
// MÉTODO NO PERMITIDO
// =====================================================

http_response_code(405);

responder(
    false,
    "Método no permitido."
);


$conexion->close();

?>