<?php

// ======================================================
// CORS
// ======================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


// ======================================================
// PREFLIGHT
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
// FUNCIÓN RESPUESTA
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
// FUNCIÓN ESTADO DEL STOCK
// ======================================================

function estadoStock($stock, $stockMinimo)
{
    $stock = floatval($stock);
    $stockMinimo = floatval($stockMinimo);

    // Stock crítico
    if ($stock <= 0) {
        return 'critico';
    }

    // Stock bajo
    if ($stock <= $stockMinimo) {
        return 'bajo';
    }

    // Stock normal
    return 'normal';
}


// ======================================================
// CREAR NOTIFICACIÓN DE STOCK
// ======================================================

function generarNotificacionStock(
    $conexion,
    $idInsumo,
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
    // SI EL ESTADO NO CAMBIÓ, NO REPETIR NOTIFICACIÓN
    // ==================================================

    if ($estadoAnterior === $estadoNuevo) {
        return;
    }


    // ==================================================
    // MENSAJE
    // ==================================================

    $titulo = '';
    $mensaje = '';


    if ($estadoNuevo === 'critico') {

        $titulo =
            'Stock crítico';

        $mensaje =
            "El insumo {$nombre} tiene stock crítico. " .
            "Stock actual: {$stockNuevo}. " .
            "Stock mínimo: {$stockMinimo}.";

    }


    elseif ($estadoNuevo === 'bajo') {

        $titulo =
            'Stock bajo';

        $mensaje =
            "El insumo {$nombre} tiene stock bajo. " .
            "Stock actual: {$stockNuevo}. " .
            "Stock mínimo: {$stockMinimo}.";

    }


    elseif ($estadoNuevo === 'normal') {

        // Solo avisamos cuando venía de bajo o crítico

        if (
            $estadoAnterior === 'bajo' ||
            $estadoAnterior === 'critico'
        ) {

            $titulo =
                'Stock normalizado';

            $mensaje =
                "El stock del insumo {$nombre} " .
                "ha vuelto a un nivel normal. " .
                "Stock actual: {$stockNuevo}.";

        } else {

            return;

        }

    }


    // ==================================================
    // OBTENER USUARIOS
    // ==================================================

    $sqlUsuarios =
        "SELECT id FROM usuario";

    $resultadoUsuarios =
        $conexion->query(
            $sqlUsuarios
        );


    if (!($resultadoUsuarios instanceof mysqli_result)) {
        return;
    }


    // ==================================================
    // CREAR NOTIFICACIÓN PARA CADA USUARIO
    // ==================================================

    while (
        $usuario =
        $resultadoUsuarios->fetch_assoc()
    ) {

        $idUsuario =
            intval($usuario['id']);


        $sqlInsert = "
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
                $sqlInsert
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
// LISTAR MOVIMIENTOS
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "

        SELECT

            m.id,
            m.idInsumo,
            i.nombre AS insumo,
            m.tipo,
            m.cantidad,
            m.observacion,
            m.fecha

        FROM movimientos m

        INNER JOIN insumos i
            ON m.idInsumo = i.idInsumo

        ORDER BY m.id DESC

    ";


    $resultado =
        $conexion->query($sql);


    if (!($resultado instanceof mysqli_result)) {

        responder([
            "ok" => false,
            "error" => mysqli_error($conexion)
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


    responder($datos);

}


// ======================================================
// POST
// CREAR MOVIMIENTO
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {


    $input =
        json_decode(
            file_get_contents("php://input"),
            true
        );


    if (!$input) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Datos inválidos."
        ], 400);

    }


    $idInsumo =
        intval(
            $input['idInsumo'] ?? 0
        );

    $tipo =
        trim(
            $input['tipo'] ?? ''
        );

    $cantidad =
        floatval(
            $input['cantidad'] ?? 0
        );

    $observacion =
        trim(
            $input['observacion'] ?? ''
        );


    // ==================================================
    // VALIDACIONES
    // ==================================================

    if ($idInsumo <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Debe seleccionar un insumo."
        ], 400);

    }


    if (
        $tipo !== 'Entrada' &&
        $tipo !== 'Salida'
    ) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El tipo de movimiento no es válido."
        ], 400);

    }


    if ($cantidad <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "La cantidad debe ser mayor que cero."
        ], 400);

    }


    // ==================================================
    // BUSCAR INSUMO
    // ==================================================

    $sqlInsumo = "
        SELECT
            idInsumo,
            nombre,
            stock,
            stockMinimo
        FROM insumos
        WHERE idInsumo = ?
        LIMIT 1
    ";


    $stmtInsumo =
        $conexion->prepare(
            $sqlInsumo
        );


    $stmtInsumo->bind_param(
        "i",
        $idInsumo
    );


    $stmtInsumo->execute();


    $resultadoInsumo =
        $stmtInsumo->get_result();


    
    /** @var mysqli_result $resultadoInsumo */
$insumo =
        $resultadoInsumo->fetch_assoc();


    $stmtInsumo->close();


    if (!$insumo) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El insumo no existe."
        ], 404);

    }


    $stockAnterior =
        floatval(
            $insumo['stock']
        );

    $stockMinimo =
        floatval(
            $insumo['stockMinimo']
        );


    // ==================================================
    // CALCULAR NUEVO STOCK
    // ==================================================

    if ($tipo === 'Entrada') {

        $stockNuevo =
            $stockAnterior +
            $cantidad;

    } else {

        $stockNuevo =
            $stockAnterior -
            $cantidad;

    }


    // ==================================================
    // NO PERMITIR STOCK NEGATIVO
    // ==================================================

    if ($stockNuevo < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "No hay suficiente stock disponible. " .
                "Stock actual: {$stockAnterior}. " .
                "Cantidad solicitada: {$cantidad}."
        ], 400);

    }


    // ==================================================
    // TRANSACCIÓN
    // ==================================================

    $conexion->begin_transaction();


    try {


        // ==================================================
        // INSERTAR MOVIMIENTO
        // ==================================================

        $sqlMovimiento = "
            INSERT INTO movimientos
            (
                idInsumo,
                tipo,
                cantidad,
                observacion
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?
            )
        ";


        $stmtMovimiento =
            $conexion->prepare(
                $sqlMovimiento
            );


        if (!($stmtMovimiento instanceof mysqli_stmt)) {

            throw new Exception(
                mysqli_error($conexion)
            );

        }


        $stmtMovimiento->bind_param(
            "isds",
            $idInsumo,
            $tipo,
            $cantidad,
            $observacion
        );


        if (
            !$stmtMovimiento->execute()
        ) {

            throw new Exception(
                $stmtMovimiento->error
            );

        }


        $idMovimiento =
            $stmtMovimiento->insert_id;


        $stmtMovimiento->close();


        // ==================================================
        // ACTUALIZAR STOCK
        // ==================================================

        $sqlStock = "
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ";


        $stmtStock =
            $conexion->prepare(
                $sqlStock
            );


        if (!($stmtStock instanceof mysqli_stmt)) {

            throw new Exception(
                mysqli_error($conexion)
            );

        }


        $stmtStock->bind_param(
            "di",
            $stockNuevo,
            $idInsumo
        );


        if (
            !$stmtStock->execute()
        ) {

            throw new Exception(
                $stmtStock->error
            );

        }


        $stmtStock->close();


        // ==================================================
        // NOTIFICACIÓN
        // ==================================================

        generarNotificacionStock(
            $conexion,
            $idInsumo,
            $insumo['nombre'],
            $stockAnterior,
            $stockNuevo,
            $stockMinimo
        );


        // ==================================================
        // CONFIRMAR
        // ==================================================

        $conexion->commit();


        responder([
            "ok" => true,
            "mensaje" =>
                "Movimiento guardado correctamente.",
            "idMovimiento" =>
                $idMovimiento,
            "stockAnterior" =>
                $stockAnterior,
            "stockNuevo" =>
                $stockNuevo
        ]);

    }


    catch (Exception $e) {

        $conexion->rollback();


        responder([
            "ok" => false,
            "mensaje" =>
                "No se pudo guardar el movimiento.",
            "error" =>
                $e->getMessage()
        ], 500);

    }

}


// ======================================================
// PUT
// EDITAR MOVIMIENTO
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {


    $input =
        json_decode(
            file_get_contents("php://input"),
            true
        );


    $id =
        intval(
            $input['id'] ?? 0
        );

    $nuevoIdInsumo =
        intval(
            $input['idInsumo'] ?? 0
        );

    $nuevoTipo =
        trim(
            $input['tipo'] ?? ''
        );

    $nuevaCantidad =
        floatval(
            $input['cantidad'] ?? 0
        );

    $observacion =
        trim(
            $input['observacion'] ?? ''
        );


    if ($id <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Movimiento inválido."
        ], 400);

    }


    if ($nuevaCantidad <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "La cantidad debe ser mayor que cero."
        ], 400);

    }


    if (
        $nuevoTipo !== 'Entrada' &&
        $nuevoTipo !== 'Salida'
    ) {

        responder([
            "ok" => false,
            "mensaje" =>
                "Tipo de movimiento inválido."
        ], 400);

    }


    // ==================================================
    // BUSCAR MOVIMIENTO ORIGINAL
    // ==================================================

    $sqlAnterior = "
        SELECT
            m.id,
            m.idInsumo,
            m.tipo,
            m.cantidad
        FROM movimientos m
        WHERE m.id = ?
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
$movAnterior =
        $resultadoAnterior->fetch_assoc();


    $stmtAnterior->close();


    if (!$movAnterior) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El movimiento no existe."
        ], 404);

    }


    // ==================================================
    // TRANSACCIÓN
    // ==================================================

    $conexion->begin_transaction();


    try {


        // ==================================================
        // DEVOLVER EFECTO DEL MOVIMIENTO ANTERIOR
        // ==================================================

        $idInsumoAnterior =
            intval(
                $movAnterior['idInsumo']
            );

        $cantidadAnterior =
            floatval(
                $movAnterior['cantidad']
            );


        if (
            $movAnterior['tipo'] === 'Entrada'
        ) {

            $sqlRevertir = "
                UPDATE insumos
                SET stock = stock - ?
                WHERE idInsumo = ?
            ";

        } else {

            $sqlRevertir = "
                UPDATE insumos
                SET stock = stock + ?
                WHERE idInsumo = ?
            ";

        }


        $stmtRevertir =
            $conexion->prepare(
                $sqlRevertir
            );


        $stmtRevertir->bind_param(
            "di",
            $cantidadAnterior,
            $idInsumoAnterior
        );


        if (
            !$stmtRevertir->execute()
        ) {

            throw new Exception(
                $stmtRevertir->error
            );

        }


        $stmtRevertir->close();


        // ==================================================
        // OBTENER STOCK DEL NUEVO INSUMO
        // ==================================================

        $sqlNuevoInsumo = "
            SELECT
                idInsumo,
                nombre,
                stock,
                stockMinimo
            FROM insumos
            WHERE idInsumo = ?
            LIMIT 1
        ";


        $stmtNuevoInsumo =
            $conexion->prepare(
                $sqlNuevoInsumo
            );


        $stmtNuevoInsumo->bind_param(
            "i",
            $nuevoIdInsumo
        );


        $stmtNuevoInsumo->execute();


        $resultadoNuevoInsumo =
            $stmtNuevoInsumo->get_result();


        
    /** @var mysqli_result $resultadoNuevoInsumo */
$nuevoInsumo =
            $resultadoNuevoInsumo->fetch_assoc();


        $stmtNuevoInsumo->close();


        if (!$nuevoInsumo) {

            throw new Exception(
                "El nuevo insumo no existe."
            );

        }


        $stockAntesNuevo =
            floatval(
                $nuevoInsumo['stock']
            );

        $stockMinimoNuevo =
            floatval(
                $nuevoInsumo['stockMinimo']
            );


        // ==================================================
        // APLICAR NUEVO MOVIMIENTO
        // ==================================================

        if ($nuevoTipo === 'Entrada') {

            $stockDespuesNuevo =
                $stockAntesNuevo +
                $nuevaCantidad;

        } else {

            $stockDespuesNuevo =
                $stockAntesNuevo -
                $nuevaCantidad;

        }


        if ($stockDespuesNuevo < 0) {

            throw new Exception(
                "El movimiento dejaría el stock en negativo."
            );

        }


        // ==================================================
        // ACTUALIZAR STOCK
        // ==================================================

        $sqlActualizarStock = "
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ";


        $stmtActualizarStock =
            $conexion->prepare(
                $sqlActualizarStock
            );


        $stmtActualizarStock->bind_param(
            "di",
            $stockDespuesNuevo,
            $nuevoIdInsumo
        );


        if (
            !$stmtActualizarStock->execute()
        ) {

            throw new Exception(
                $stmtActualizarStock->error
            );

        }


        $stmtActualizarStock->close();


        // ==================================================
        // ACTUALIZAR MOVIMIENTO
        // ==================================================

        $sqlActualizarMovimiento = "
            UPDATE movimientos
            SET
                idInsumo = ?,
                tipo = ?,
                cantidad = ?,
                observacion = ?
            WHERE id = ?
        ";


        $stmtActualizarMovimiento =
            $conexion->prepare(
                $sqlActualizarMovimiento
            );


        $stmtActualizarMovimiento->bind_param(
            "isdsi",
            $nuevoIdInsumo,
            $nuevoTipo,
            $nuevaCantidad,
            $observacion,
            $id
        );


        if (
            !$stmtActualizarMovimiento->execute()
        ) {

            throw new Exception(
                $stmtActualizarMovimiento->error
            );

        }


        $stmtActualizarMovimiento->close();


        // ==================================================
        // GENERAR NOTIFICACIÓN
        // ==================================================

        generarNotificacionStock(
            $conexion,
            $nuevoIdInsumo,
            $nuevoInsumo['nombre'],
            $stockAntesNuevo,
            $stockDespuesNuevo,
            $stockMinimoNuevo
        );


        // ==================================================
        // COMMIT
        // ==================================================

        $conexion->commit();


        responder([
            "ok" => true,
            "mensaje" =>
                "Movimiento actualizado correctamente.",
            "stockNuevo" =>
                $stockDespuesNuevo
        ]);

    }


    catch (Exception $e) {

        $conexion->rollback();


        responder([
            "ok" => false,
            "mensaje" =>
                "No se pudo actualizar el movimiento.",
            "error" =>
                $e->getMessage()
        ], 500);

    }

}


// ======================================================
// DELETE
// ELIMINAR MOVIMIENTO
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {


    $id =
        intval(
            $_GET['id'] ?? 0
        );


    if ($id <= 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "ID de movimiento inválido."
        ], 400);

    }


    // ==================================================
    // BUSCAR MOVIMIENTO
    // ==================================================

    $sqlMovimiento = "
        SELECT
            id,
            idInsumo,
            tipo,
            cantidad
        FROM movimientos
        WHERE id = ?
        LIMIT 1
    ";


    $stmtMovimiento =
        $conexion->prepare(
            $sqlMovimiento
        );


    $stmtMovimiento->bind_param(
        "i",
        $id
    );


    $stmtMovimiento->execute();


    $resultado =
        $stmtMovimiento->get_result();


    
    /** @var mysqli_result $resultado */
$movimiento =
        $resultado->fetch_assoc();


    $stmtMovimiento->close();


    if (!$movimiento) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El movimiento no existe."
        ], 404);

    }


    $idInsumo =
        intval(
            $movimiento['idInsumo']
        );

    $cantidad =
        floatval(
            $movimiento['cantidad']
        );


    // ==================================================
    // OBTENER INSUMO
    // ==================================================

    $sqlInsumo = "
        SELECT
            nombre,
            stock,
            stockMinimo
        FROM insumos
        WHERE idInsumo = ?
        LIMIT 1
    ";


    $stmtInsumo =
        $conexion->prepare(
            $sqlInsumo
        );


    $stmtInsumo->bind_param(
        "i",
        $idInsumo
    );


    $stmtInsumo->execute();


    $resultadoInsumo =
        $stmtInsumo->get_result();


    
    /** @var mysqli_result $resultadoInsumo */
$insumo =
        $resultadoInsumo->fetch_assoc();


    $stmtInsumo->close();


    if (!$insumo) {

        responder([
            "ok" => false,
            "mensaje" =>
                "El insumo no existe."
        ], 404);

    }


    $stockAnterior =
        floatval(
            $insumo['stock']
        );

    $stockMinimo =
        floatval(
            $insumo['stockMinimo']
        );


    // ==================================================
    // CALCULAR STOCK RESTAURADO
    // ==================================================

    if (
        $movimiento['tipo'] === 'Entrada'
    ) {

        $stockNuevo =
            $stockAnterior -
            $cantidad;

    } else {

        $stockNuevo =
            $stockAnterior +
            $cantidad;

    }


    if ($stockNuevo < 0) {

        responder([
            "ok" => false,
            "mensaje" =>
                "No se puede eliminar porque el stock resultante sería negativo."
        ], 400);

    }


    $conexion->begin_transaction();


    try {


        // ==================================================
        // ACTUALIZAR STOCK
        // ==================================================

        $sqlStock = "
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ";


        $stmtStock =
            $conexion->prepare(
                $sqlStock
            );


        $stmtStock->bind_param(
            "di",
            $stockNuevo,
            $idInsumo
        );


        if (
            !$stmtStock->execute()
        ) {

            throw new Exception(
                $stmtStock->error
            );

        }


        $stmtStock->close();


        // ==================================================
        // ELIMINAR MOVIMIENTO
        // ==================================================

        $sqlDelete = "
            DELETE FROM movimientos
            WHERE id = ?
        ";


        $stmtDelete =
            $conexion->prepare(
                $sqlDelete
            );


        $stmtDelete->bind_param(
            "i",
            $id
        );


        if (
            !$stmtDelete->execute()
        ) {

            throw new Exception(
                $stmtDelete->error
            );

        }


        $stmtDelete->close();


        // ==================================================
        // NOTIFICACIÓN
        // ==================================================

        generarNotificacionStock(
            $conexion,
            $idInsumo,
            $insumo['nombre'],
            $stockAnterior,
            $stockNuevo,
            $stockMinimo
        );


        // ==================================================
        // CONFIRMAR
        // ==================================================

        $conexion->commit();


        responder([
            "ok" => true,
            "mensaje" =>
                "Movimiento eliminado correctamente.",
            "stockNuevo" =>
                $stockNuevo
        ]);

    }


    catch (Exception $e) {

        $conexion->rollback();


        responder([
            "ok" => false,
            "mensaje" =>
                "No se pudo eliminar el movimiento.",
            "error" =>
                $e->getMessage()
        ], 500);

    }

}


responder([
    "ok" => false,
    "mensaje" =>
        "Método no permitido."
], 405);

?>