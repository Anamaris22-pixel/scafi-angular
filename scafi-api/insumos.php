<?php

// ======================================================
// CORS
// ======================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


// ======================================================
// OPTIONS
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);

    exit();

}


// ======================================================
// CONEXIÓN
// ======================================================

include 'conexion.php';


// ======================================================
// RESPUESTA
// ======================================================

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
// ESTADO STOCK
// ======================================================

function estadoStock($stock, $stockMinimo)
{
    $stock =
        floatval($stock);

    $stockMinimo =
        floatval($stockMinimo);


    if ($stock <= 0) {

        return 'critico';

    }


    if ($stock <= $stockMinimo) {

        return 'bajo';

    }


    return 'normal';
}


// ======================================================
// GENERAR NOTIFICACIÓN
// ======================================================

function generarNotificacionStock(
    $conexion,
    $nombre,
    $stockAnterior,
    $stockNuevo,
    $stockMinimo
) {


    $estadoAnterior =
        estadoStock(
            $stockAnterior,
            $stockMinimo
        );


    $estadoNuevo =
        estadoStock(
            $stockNuevo,
            $stockMinimo
        );


    // ==================================================
    // SI NO CAMBIÓ EL ESTADO
    // ==================================================

    if (
        $estadoAnterior ===
        $estadoNuevo
    ) {

        return;

    }


    $titulo = '';

    $mensaje = '';


    // ==================================================
    // CRÍTICO
    // ==================================================

    if (
        $estadoNuevo ===
        'critico'
    ) {

        $titulo =
            'Stock crítico';

        $mensaje =
            "El insumo {$nombre} tiene stock crítico. " .
            "Stock actual: {$stockNuevo}. " .
            "Stock mínimo: {$stockMinimo}.";

    }


    // ==================================================
    // BAJO
    // ==================================================

    elseif (
        $estadoNuevo ===
        'bajo'
    ) {

        $titulo =
            'Stock bajo';

        $mensaje =
            "El insumo {$nombre} tiene stock bajo. " .
            "Stock actual: {$stockNuevo}. " .
            "Stock mínimo: {$stockMinimo}.";

    }


    // ==================================================
    // NORMALIZADO
    // ==================================================

    elseif (
        $estadoNuevo ===
        'normal'
    ) {


        if (
            $estadoAnterior !== 'bajo' &&
            $estadoAnterior !== 'critico'
        ) {

            return;

        }


        $titulo =
            'Stock normalizado';

        $mensaje =
            "El stock del insumo {$nombre} " .
            "ha vuelto a un nivel normal. " .
            "Stock actual: {$stockNuevo}.";

    }


    // ==================================================
    // OBTENER USUARIOS
    // ==================================================

    $resultadoUsuarios =
        $conexion->query(
            "SELECT id FROM usuario"
        );


    if (!($resultadoUsuarios instanceof mysqli_result)) {

        return;

    }


    // ==================================================
    // CREAR NOTIFICACIONES
    // ==================================================

    while (
        $usuario =
        $resultadoUsuarios->fetch_assoc()
    ) {

        $idUsuario =
            intval(
                $usuario['id']
            );


        $sql = "
            INSERT INTO notificaciones
            (
                usuario_id,
                titulo,
                mensaje,
                fecha,
                visto_por,
                enviado_por
            )
            VALUES
            (
                ?,
                ?,
                ?,
                NOW(),
                NULL,
                NULL
            )
        ";


        $stmt =
            $conexion->prepare(
                $sql
            );


        if (!($stmt instanceof mysqli_stmt)) {

            continue;

        }


        $stmt->bind_param(
            "iss",
            $idUsuario,
            $titulo,
            $mensaje
        );


        $stmt->execute();

        $stmt->close();

    }

}


// ======================================================
// GET
// LISTAR INSUMOS
// ======================================================

if (
    $_SERVER['REQUEST_METHOD'] ===
    'GET'
) {


    $sql = "
        SELECT *
        FROM insumos
        ORDER BY idInsumo DESC
    ";


    $resultado =
        $conexion->query(
            $sql
        );


    if (!($resultado instanceof mysqli_result)) {

        responder([
            "ok" => false,
            "error" =>
                $conexion->error
        ], 500);

    }


    $datos = [];


    while (
        $fila =
        $resultado->fetch_assoc()
    ) {

        $datos[] =
            $fila;

    }


    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );


    exit();

}


// ======================================================
// POST
// CREAR INSUMO
// ======================================================

if (
    $_SERVER['REQUEST_METHOD'] ===
    'POST'
) {


    $data =
        json_decode(
            file_get_contents(
                "php://input"
            ),
            true
        );


    if (!$data) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Datos inválidos."
        ], 400);

    }


    $nombre =
        trim(
            $data['nombre'] ?? ''
        );

    $idProveedor =
        intval(
            $data['idProveedor'] ?? 0
        );

    $tipo =
        trim(
            $data['tipo'] ?? ''
        );

    $descripcion =
        trim(
            $data['descripcion'] ?? ''
        );

    $unidad =
        trim(
            $data['unidad'] ?? ''
        );

    $precio =
        floatval(
            $data['precio'] ?? 0
        );

    $stock =
        floatval(
            $data['stock'] ?? 0
        );

    $minimo =
        floatval(
            $data['minimo'] ?? 0
        );


    // ==================================================
    // VALIDACIONES
    // ==================================================

    if ($nombre === '') {

        responder([
            "ok" => false,
            "mensaje" =>
                "El nombre del insumo es obligatorio."
        ], 400);

    }


    if ($stock < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El stock no puede ser negativo."
        ], 400);

    }


    if ($minimo < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El stock mínimo no puede ser negativo."
        ], 400);

    }


    // ==================================================
    // INSERTAR
    // ==================================================

    $sql = "
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
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    ";


    $stmt =
        $conexion->prepare(
            $sql
        );


    if (!($stmt instanceof mysqli_stmt)) {

        responder([
            "ok" => false,
            "error" =>
                $conexion->error
        ], 500);

    }


    $stmt->bind_param(
        "sisssddd",
        $nombre,
        $idProveedor,
        $tipo,
        $descripcion,
        $unidad,
        $precio,
        $stock,
        $minimo
    );


    if (
        !$stmt->execute()
    ) {

        responder([
            "ok" => false,
            "error" =>
                $stmt->error
        ], 500);

    }


    $idNuevo =
        $stmt->insert_id;


    $stmt->close();


    // ==================================================
    // NOTIFICACIÓN SI NACE CON STOCK BAJO/CRÍTICO
    // ==================================================

    // Se considera que antes tenía stock normal.
    generarNotificacionStock(
        $conexion,
        $nombre,
        $minimo + 1,
        $stock,
        $minimo
    );


    responder([
        "ok" => true,
        "mensaje" =>
            "Insumo guardado correctamente.",
        "idInsumo" =>
            $idNuevo
    ]);

}


// ======================================================
// PUT
// ACTUALIZAR INSUMO
// ======================================================

if (
    $_SERVER['REQUEST_METHOD'] ===
    'PUT'
) {


    $data =
        json_decode(
            file_get_contents(
                "php://input"
            ),
            true
        );


    $id =
        intval(
            $data['idInsumo'] ?? 0
        );


    if ($id <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "ID de insumo inválido."
        ], 400);

    }


    // ==================================================
    // BUSCAR DATOS ANTERIORES
    // ==================================================

    $sqlAnterior = "
        SELECT
            nombre,
            stock,
            stockMinimo
        FROM insumos
        WHERE idInsumo = ?
        LIMIT 1
    ";


    $stmtAnterior =
        $conexion->prepare(
            $sqlAnterior
        );


    $stmtAnterior->bind_param(
        "i",
        $id
    );


    $stmtAnterior->execute();


    $resultadoAnterior =
        $stmtAnterior->get_result();


    
    /** @var mysqli_result $resultadoAnterior */
$anterior =
        $resultadoAnterior->fetch_assoc();


    $stmtAnterior->close();


    if (!$anterior) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El insumo no existe."
        ], 404);

    }


    // ==================================================
    // DATOS NUEVOS
    // ==================================================

    $nombre =
        trim(
            $data['nombre'] ?? ''
        );

    $idProveedor =
        intval(
            $data['idProveedor'] ?? 0
        );

    $tipo =
        trim(
            $data['tipo'] ?? ''
        );

    $descripcion =
        trim(
            $data['descripcion'] ?? ''
        );

    $unidad =
        trim(
            $data['unidad'] ?? ''
        );

    $precio =
        floatval(
            $data['precio'] ?? 0
        );

    $stock =
        floatval(
            $data['stock'] ?? 0
        );

    $minimo =
        floatval(
            $data['minimo'] ?? 0
        );


    if ($nombre === '') {

        responder([
            "ok" => false,
            "mensaje" =>
                "El nombre del insumo es obligatorio."
        ], 400);

    }


    if ($stock < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El stock no puede ser negativo."
        ], 400);

    }


    if ($minimo < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El stock mínimo no puede ser negativo."
        ], 400);

    }


    // ==================================================
    // ACTUALIZAR
    // ==================================================

    $sql = "
        UPDATE insumos
        SET
            nombre = ?,
            idProveedor = ?,
            tipo = ?,
            descripcion = ?,
            unidad = ?,
            precio = ?,
            stock = ?,
            stockMinimo = ?
        WHERE idInsumo = ?
    ";


    $stmt =
        $conexion->prepare(
            $sql
        );


    if (!($stmt instanceof mysqli_stmt)) {

        responder([
            "ok" => false,
            "error" =>
                $conexion->error
        ], 500);

    }


    $stmt->bind_param(
        "sisssdddi",
        $nombre,
        $idProveedor,
        $tipo,
        $descripcion,
        $unidad,
        $precio,
        $stock,
        $minimo,
        $id
    );


    if (
        !$stmt->execute()
    ) {

        responder([
            "ok" => false,
            "error" =>
                $stmt->error
        ], 500);

    }


    $stmt->close();


    // ==================================================
    // GENERAR ALERTA
    // ==================================================

    generarNotificacionStock(
        $conexion,
        $nombre,
        floatval(
            $anterior['stock']
        ),
        $stock,
        $minimo
    );


    responder([
        "ok" => true,
        "mensaje" =>
            "Insumo actualizado correctamente."
    ]);

}


// ======================================================
// DELETE
// ======================================================

if (
    $_SERVER['REQUEST_METHOD'] ===
    'DELETE'
) {


    $id =
        intval(
            $_GET['id'] ?? 0
        );


    if ($id <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "ID inválido."
        ], 400);

    }


    $sql = "
        DELETE FROM insumos
        WHERE idInsumo = ?
    ";


    $stmt =
        $conexion->prepare(
            $sql
        );


    $stmt->bind_param(
        "i",
        $id
    );


    if (
        !$stmt->execute()
    ) {

        responder([
            "ok" => false,
            "error" =>
                $stmt->error
        ], 500);

    }


    $stmt->close();


    responder([
        "ok" => true,
        "mensaje" =>
            "Insumo eliminado correctamente."
    ]);

}


responder([
    "ok" => false,
    "mensaje" =>
        "Método no permitido."
], 405);

?>