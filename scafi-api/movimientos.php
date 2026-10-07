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
// GET - CONSULTAR MOVIMIENTOS
// =====================================================

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

    $resultado = $conexion->query($sql);

    if (!$resultado) {
        http_response_code(500);
        responder(
            false,
            "Error al consultar movimientos: " . $conexion->error
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
// POST - REGISTRAR MOVIMIENTO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($input)) {
        http_response_code(400);
        responder(false, "Los datos enviados no son válidos.");
    }

    $idInsumo = intval($input['idInsumo'] ?? 0);
    $tipo = trim($input['tipo'] ?? '');
    $cantidad = floatval($input['cantidad'] ?? 0);
    $observacion = trim($input['observacion'] ?? '');

    if ($idInsumo <= 0) {
        responder(false, "Debe seleccionar un insumo.");
    }

    if ($tipo !== 'Entrada' && $tipo !== 'Salida') {
        responder(false, "El tipo de movimiento no es válido.");
    }

    if ($cantidad <= 0) {
        responder(false, "La cantidad debe ser mayor que cero.");
    }

    $conexion->begin_transaction();

    try {

        $stmtInsumo = $conexion->prepare("
            SELECT idInsumo, nombre, stock
            FROM insumos
            WHERE idInsumo = ?
            FOR UPDATE
        ");

        if (!$stmtInsumo) {
            throw new Exception($conexion->error);
        }

        $stmtInsumo->bind_param("i", $idInsumo);
        $stmtInsumo->execute();

        $resultadoInsumo = $stmtInsumo->get_result();

        if ($resultadoInsumo->num_rows === 0) {
            $stmtInsumo->close();
            throw new Exception("El insumo seleccionado no existe.");
        }

        $insumo = $resultadoInsumo->fetch_assoc();
        $stockActual = floatval($insumo['stock']);

        $stmtInsumo->close();

        if ($tipo === 'Salida' && $cantidad > $stockActual) {
            throw new Exception(
                "Stock insuficiente. Stock disponible: "
                . $stockActual
                . " | Cantidad solicitada: "
                . $cantidad
            );
        }

        if ($tipo === 'Entrada') {
            $nuevoStock = $stockActual + $cantidad;
        } else {
            $nuevoStock = $stockActual - $cantidad;
        }

        $stmtMovimiento = $conexion->prepare("
            INSERT INTO movimientos
            (
                idInsumo,
                tipo,
                cantidad,
                observacion
            )
            VALUES (?, ?, ?, ?)
        ");

        if (!$stmtMovimiento) {
            throw new Exception($conexion->error);
        }

        $stmtMovimiento->bind_param(
            "isds",
            $idInsumo,
            $tipo,
            $cantidad,
            $observacion
        );

        if (!$stmtMovimiento->execute()) {
            $error = $stmtMovimiento->error;
            $stmtMovimiento->close();
            throw new Exception($error);
        }

        $stmtMovimiento->close();

        $stmtStock = $conexion->prepare("
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ");

        if (!$stmtStock) {
            throw new Exception($conexion->error);
        }

        $stmtStock->bind_param(
            "di",
            $nuevoStock,
            $idInsumo
        );

        if (!$stmtStock->execute()) {
            $error = $stmtStock->error;
            $stmtStock->close();
            throw new Exception($error);
        }

        $stmtStock->close();

        $conexion->commit();

        responder(
            true,
            "Movimiento registrado correctamente.",
            [
                "stockAnterior" => $stockActual,
                "stockNuevo" => $nuevoStock
            ]
        );

    } catch (Exception $e) {

        $conexion->rollback();
        http_response_code(400);

        responder(false, $e->getMessage());
    }
}

// =====================================================
// PUT - EDITAR MOVIMIENTO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($input)) {
        http_response_code(400);
        responder(false, "Los datos enviados no son válidos.");
    }

    $id = intval($input['id'] ?? 0);
    $nuevoIdInsumo = intval($input['idInsumo'] ?? 0);
    $nuevoTipo = trim($input['tipo'] ?? '');
    $nuevaCantidad = floatval($input['cantidad'] ?? 0);
    $nuevaObservacion = trim($input['observacion'] ?? '');

    if ($id <= 0) {
        responder(false, "ID del movimiento requerido.");
    }

    if ($nuevoIdInsumo <= 0) {
        responder(false, "Debe seleccionar un insumo.");
    }

    if ($nuevoTipo !== 'Entrada' && $nuevoTipo !== 'Salida') {
        responder(false, "El tipo de movimiento no es válido.");
    }

    if ($nuevaCantidad <= 0) {
        responder(false, "La cantidad debe ser mayor que cero.");
    }

    $conexion->begin_transaction();

    try {

        $stmtAnterior = $conexion->prepare("
            SELECT id, idInsumo, tipo, cantidad
            FROM movimientos
            WHERE id = ?
            FOR UPDATE
        ");

        if (!$stmtAnterior) {
            throw new Exception($conexion->error);
        }

        $stmtAnterior->bind_param("i", $id);
        $stmtAnterior->execute();

        $resultadoAnterior = $stmtAnterior->get_result();

        if ($resultadoAnterior->num_rows === 0) {
            $stmtAnterior->close();
            throw new Exception("El movimiento no existe.");
        }

        $anterior = $resultadoAnterior->fetch_assoc();
        $stmtAnterior->close();

        $idInsumoAnterior = intval($anterior['idInsumo']);
        $tipoAnterior = $anterior['tipo'];
        $cantidadAnterior = floatval($anterior['cantidad']);

        $stmtStockAnterior = $conexion->prepare("
            SELECT stock
            FROM insumos
            WHERE idInsumo = ?
            FOR UPDATE
        ");

        if (!$stmtStockAnterior) {
            throw new Exception($conexion->error);
        }

        $stmtStockAnterior->bind_param(
            "i",
            $idInsumoAnterior
        );

        $stmtStockAnterior->execute();

        $resultadoStockAnterior =
            $stmtStockAnterior->get_result();

        if ($resultadoStockAnterior->num_rows === 0) {
            $stmtStockAnterior->close();
            throw new Exception(
                "El insumo del movimiento anterior no existe."
            );
        }

        $filaStockAnterior =
            $resultadoStockAnterior->fetch_assoc();

        $stockAnteriorActual =
            floatval($filaStockAnterior['stock']);

        $stmtStockAnterior->close();

        if ($tipoAnterior === 'Entrada') {
            $stockRevertido =
                $stockAnteriorActual - $cantidadAnterior;
        } else {
            $stockRevertido =
                $stockAnteriorActual + $cantidadAnterior;
        }

        if ($stockRevertido < 0) {
            throw new Exception(
                "No es posible modificar el movimiento porque el stock actual no permite revertir el movimiento anterior."
            );
        }

        if ($idInsumoAnterior !== $nuevoIdInsumo) {

            $stmtRevertir = $conexion->prepare("
                UPDATE insumos
                SET stock = ?
                WHERE idInsumo = ?
            ");

            if (!$stmtRevertir) {
                throw new Exception($conexion->error);
            }

            $stmtRevertir->bind_param(
                "di",
                $stockRevertido,
                $idInsumoAnterior
            );

            if (!$stmtRevertir->execute()) {
                $error = $stmtRevertir->error;
                $stmtRevertir->close();
                throw new Exception($error);
            }

            $stmtRevertir->close();

            $stmtNuevo = $conexion->prepare("
                SELECT stock
                FROM insumos
                WHERE idInsumo = ?
                FOR UPDATE
            ");

            if (!$stmtNuevo) {
                throw new Exception($conexion->error);
            }

            $stmtNuevo->bind_param(
                "i",
                $nuevoIdInsumo
            );

            $stmtNuevo->execute();

            $resultadoNuevo = $stmtNuevo->get_result();

            if ($resultadoNuevo->num_rows === 0) {
                $stmtNuevo->close();
                throw new Exception(
                    "El nuevo insumo seleccionado no existe."
                );
            }

            $filaNuevo = $resultadoNuevo->fetch_assoc();

            $stockNuevoActual =
                floatval($filaNuevo['stock']);

            $stmtNuevo->close();

        } else {

            $stockNuevoActual = $stockRevertido;
        }

        if (
            $nuevoTipo === 'Salida' &&
            $nuevaCantidad > $stockNuevoActual
        ) {
            throw new Exception(
                "Stock insuficiente para el nuevo movimiento. "
                . "Stock disponible: "
                . $stockNuevoActual
                . " | Cantidad solicitada: "
                . $nuevaCantidad
            );
        }

        if ($nuevoTipo === 'Entrada') {
            $stockFinal =
                $stockNuevoActual + $nuevaCantidad;
        } else {
            $stockFinal =
                $stockNuevoActual - $nuevaCantidad;
        }

        if ($stockFinal < 0) {
            throw new Exception(
                "El movimiento dejaría el stock en un valor negativo."
            );
        }

        $stmtActualizar = $conexion->prepare("
            UPDATE movimientos
            SET
                idInsumo = ?,
                tipo = ?,
                cantidad = ?,
                observacion = ?
            WHERE id = ?
        ");

        if (!$stmtActualizar) {
            throw new Exception($conexion->error);
        }

        $stmtActualizar->bind_param(
            "isdsi",
            $nuevoIdInsumo,
            $nuevoTipo,
            $nuevaCantidad,
            $nuevaObservacion,
            $id
        );

        if (!$stmtActualizar->execute()) {
            $error = $stmtActualizar->error;
            $stmtActualizar->close();
            throw new Exception($error);
        }

        $stmtActualizar->close();

        $stmtStockFinal = $conexion->prepare("
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ");

        if (!$stmtStockFinal) {
            throw new Exception($conexion->error);
        }

        $stmtStockFinal->bind_param(
            "di",
            $stockFinal,
            $nuevoIdInsumo
        );

        if (!$stmtStockFinal->execute()) {
            $error = $stmtStockFinal->error;
            $stmtStockFinal->close();
            throw new Exception($error);
        }

        $stmtStockFinal->close();

        $conexion->commit();

        responder(
            true,
            "Movimiento actualizado correctamente.",
            [
                "stockNuevo" => $stockFinal
            ]
        );

    } catch (Exception $e) {

        $conexion->rollback();
        http_response_code(400);

        responder(false, $e->getMessage());
    }
}

// =====================================================
// DELETE - ELIMINAR MOVIMIENTO
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = intval($_GET['id'] ?? 0);

    if ($id <= 0) {
        responder(false, "ID de movimiento requerido.");
    }

    $conexion->begin_transaction();

    try {

        $stmt = $conexion->prepare("
            SELECT idInsumo, tipo, cantidad
            FROM movimientos
            WHERE id = ?
            FOR UPDATE
        ");

        if (!$stmt) {
            throw new Exception($conexion->error);
        }

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $resultado = $stmt->get_result();

        if ($resultado->num_rows === 0) {
            $stmt->close();
            throw new Exception("El movimiento no existe.");
        }

        $movimiento = $resultado->fetch_assoc();
        $stmt->close();

        $idInsumo =
            intval($movimiento['idInsumo']);

        $tipo =
            $movimiento['tipo'];

        $cantidad =
            floatval($movimiento['cantidad']);

        $stmtStock = $conexion->prepare("
            SELECT stock
            FROM insumos
            WHERE idInsumo = ?
            FOR UPDATE
        ");

        if (!$stmtStock) {
            throw new Exception($conexion->error);
        }

        $stmtStock->bind_param(
            "i",
            $idInsumo
        );

        $stmtStock->execute();

        $resultadoStock =
            $stmtStock->get_result();

        if ($resultadoStock->num_rows === 0) {
            $stmtStock->close();
            throw new Exception(
                "El insumo asociado no existe."
            );
        }

        $filaStock =
            $resultadoStock->fetch_assoc();

        $stockActual =
            floatval($filaStock['stock']);

        $stmtStock->close();

        if ($tipo === 'Entrada') {
            $nuevoStock =
                $stockActual - $cantidad;
        } else {
            $nuevoStock =
                $stockActual + $cantidad;
        }

        if ($nuevoStock < 0) {
            throw new Exception(
                "No es posible eliminar el movimiento porque el stock resultante sería negativo."
            );
        }

        $stmtEliminar = $conexion->prepare("
            DELETE FROM movimientos
            WHERE id = ?
        ");

        if (!$stmtEliminar) {
            throw new Exception($conexion->error);
        }

        $stmtEliminar->bind_param("i", $id);

        if (!$stmtEliminar->execute()) {
            $error = $stmtEliminar->error;
            $stmtEliminar->close();
            throw new Exception($error);
        }

        $stmtEliminar->close();

        $stmtActualizarStock = $conexion->prepare("
            UPDATE insumos
            SET stock = ?
            WHERE idInsumo = ?
        ");

        if (!$stmtActualizarStock) {
            throw new Exception($conexion->error);
        }

        $stmtActualizarStock->bind_param(
            "di",
            $nuevoStock,
            $idInsumo
        );

        if (!$stmtActualizarStock->execute()) {
            $error = $stmtActualizarStock->error;
            $stmtActualizarStock->close();
            throw new Exception($error);
        }

        $stmtActualizarStock->close();

        $conexion->commit();

        responder(
            true,
            "Movimiento eliminado correctamente.",
            [
                "stockNuevo" => $nuevoStock
            ]
        );

    } catch (Exception $e) {

        $conexion->rollback();
        http_response_code(400);

        responder(false, $e->getMessage());
    }
}

http_response_code(405);

responder(false, "Método no permitido.");

$conexion->close();

?>