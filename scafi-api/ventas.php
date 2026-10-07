<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';


// =====================================================
// RESPUESTA JSON
// =====================================================

function responder(
    bool $ok,
    string $mensaje = '',
    array $extra = []
) {

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

    exit();

}


// =====================================================
// CORS
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'OPTIONS'
) {

    http_response_code(200);

    exit();

}


// =====================================================
// OBTENER VENTAS
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'GET'
) {

    $sql = "

        SELECT
            idVenta,
            fecha,
            cliente,
            producto,
            cantidad,
            precio,
            total,
            estado

        FROM ventas

        ORDER BY idVenta DESC

    ";


    $resultado = mysqli_query(
        $conexion,
        $sql
    );


    if (!$resultado) {

        responder(
            false,
            "No fue posible consultar las ventas."
        );

    }


    $ventas = [];


    while (
        $fila = mysqli_fetch_assoc(
            $resultado
        )
    ) {

        $ventas[] = $fila;

    }


    echo json_encode(
        [
            "ventas" => $ventas
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit();

}


// =====================================================
// GUARDAR VENTA
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'POST'
) {


    // =================================================
    // LEER DATOS JSON
    // =================================================

    $data = json_decode(
        file_get_contents(
            "php://input"
        ),
        true
    );


    if (!is_array($data)) {

        responder(
            false,
            "Los datos enviados no son válidos."
        );

    }


    // =================================================
    // OBTENER DATOS
    // =================================================

    $fecha = trim(
        (string)(
            $data['fecha'] ?? ''
        )
    );


    $cliente = trim(
        (string)(
            $data['cliente'] ?? ''
        )
    );


    $producto = trim(
        (string)(
            $data['producto'] ?? ''
        )
    );


    $cantidad = (float)(
        $data['cantidad'] ?? 0
    );


    $precio = (float)(
        $data['precio'] ?? 0
    );


    $estado = trim(
        (string)(
            $data['estado'] ?? ''
        )
    );


    // =================================================
    // VALIDAR FECHA
    // =================================================

    if ($fecha === '') {

        responder(
            false,
            "La fecha de la venta es obligatoria."
        );

    }


    // =================================================
    // VALIDAR CLIENTE
    // =================================================

    if ($cliente === '') {

        responder(
            false,
            "Debe ingresar un cliente para registrar la venta."
        );

    }


    // =================================================
    // VALIDAR PRODUCTO
    // =================================================

    if ($producto === '') {

        responder(
            false,
            "Debe seleccionar un producto."
        );

    }


    // =================================================
    // VALIDAR CANTIDAD
    // =================================================

    if ($cantidad <= 0) {

        responder(
            false,
            "La cantidad debe ser mayor que cero."
        );

    }


    // =================================================
    // VALIDAR PRECIO
    // =================================================

    if ($precio <= 0) {

        responder(
            false,
            "El precio debe ser mayor que cero."
        );

    }


    // =================================================
    // CALCULAR TOTAL
    // =================================================

    $totalCalculado =
        $cantidad * $precio;


    // =================================================
    // INICIAR TRANSACCIÓN
    // =================================================

    mysqli_begin_transaction(
        $conexion
    );


    try {


        // =================================================
        // 1. BUSCAR CLIENTE
        // =================================================

        $sqlBuscarCliente = "

            SELECT
                id

            FROM clientes

            WHERE LOWER(
                TRIM(nombre)
            )
            =
            LOWER(
                TRIM(?)
            )

            LIMIT 1

        ";


        $stmtBuscarCliente =
            mysqli_prepare(
                $conexion,
                $sqlBuscarCliente
            );


        if (!$stmtBuscarCliente) {

            throw new Exception(
                "No fue posible consultar el cliente."
            );

        }


        mysqli_stmt_bind_param(
            $stmtBuscarCliente,
            "s",
            $cliente
        );


        if (
            !mysqli_stmt_execute(
                $stmtBuscarCliente
            )
        ) {

            throw new Exception(
                "No fue posible verificar el cliente."
            );

        }


        $resultadoCliente =
            mysqli_stmt_get_result(
                $stmtBuscarCliente
            );


        $clienteExiste =
            mysqli_fetch_assoc(
                $resultadoCliente
            );


        mysqli_stmt_close(
            $stmtBuscarCliente
        );


        // =================================================
        // 2. CREAR CLIENTE SI NO EXISTE
        // =================================================

        $clienteCreado = false;


        if (!$clienteExiste) {


            /*
             * Como el cliente se está creando desde una venta,
             * todavía no tenemos sus datos completos.
             *
             * Por eso dejamos los campos pendientes.
             */

            $nit = '';

            $telefono = '';

            $correo = '';

            $ciudad = '';

            $direccion = '';

            $tipo = 'Empresa';


            $sqlCrearCliente = "

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

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )

            ";


            $stmtCrearCliente =
                mysqli_prepare(
                    $conexion,
                    $sqlCrearCliente
                );


            if (!$stmtCrearCliente) {

                throw new Exception(
                    "No fue posible preparar el registro automático del cliente."
                );

            }


            mysqli_stmt_bind_param(
                $stmtCrearCliente,
                "sssssss",
                $nit,
                $cliente,
                $telefono,
                $correo,
                $ciudad,
                $direccion,
                $tipo
            );


            if (
                !mysqli_stmt_execute(
                    $stmtCrearCliente
                )
            ) {

                throw new Exception(
                    "No fue posible registrar automáticamente el cliente."
                );

            }


            $clienteCreado = true;


            mysqli_stmt_close(
                $stmtCrearCliente
            );

        }


        // =================================================
        // 3. GUARDAR VENTA
        // =================================================

        $sqlVenta = "

            INSERT INTO ventas
            (
                fecha,
                cliente,
                producto,
                cantidad,
                precio,
                total,
                estado
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )

        ";


        $stmtVenta =
            mysqli_prepare(
                $conexion,
                $sqlVenta
            );


        if (!$stmtVenta) {

            throw new Exception(
                "No fue posible preparar el registro de la venta."
            );

        }


        mysqli_stmt_bind_param(
            $stmtVenta,
            "sssddds",
            $fecha,
            $cliente,
            $producto,
            $cantidad,
            $precio,
            $totalCalculado,
            $estado
        );


        if (
            !mysqli_stmt_execute(
                $stmtVenta
            )
        ) {

            throw new Exception(
                "No fue posible registrar la venta."
            );

        }


        // =================================================
        // ID DE LA VENTA
        // =================================================

        $idVenta =
            mysqli_insert_id(
                $conexion
            );


        mysqli_stmt_close(
            $stmtVenta
        );


        // =================================================
        // CONFIRMAR TRANSACCIÓN
        // =================================================

        mysqli_commit(
            $conexion
        );


        // =================================================
        // RESPUESTA
        // =================================================

        responder(
            true,
            "",
            [
                "mensaje" =>
                    "Venta registrada correctamente.",

                "idVenta" =>
                    $idVenta,

                "cliente" =>
                    $cliente,

                "clienteCreado" =>
                    $clienteCreado
            ]
        );

    }


    catch (Exception $e) {


        // =================================================
        // DESHACER TODO SI FALLA
        // =================================================

        mysqli_rollback(
            $conexion
        );


        responder(
            false,
            $e->getMessage()
        );

    }

}



// =====================================================
// ACTUALIZAR VENTA
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'PUT'
) {

    $id = $_GET['id'] ?? null;

    if (
        !$id ||
        !is_numeric($id)
    ) {

        responder(
            false,
            "El ID de la venta es obligatorio."
        );

    }

    $id = (int)$id;

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {

        responder(
            false,
            "Los datos enviados no son válidos."
        );

    }

    $fecha = trim(
        (string)($data['fecha'] ?? '')
    );

    $cliente = trim(
        (string)($data['cliente'] ?? '')
    );

    $producto = trim(
        (string)($data['producto'] ?? '')
    );

    $cantidad = (float)(
        $data['cantidad'] ?? 0
    );

    $precio = (float)(
        $data['precio'] ?? 0
    );

    $estado = trim(
        (string)($data['estado'] ?? '')
    );

    if ($fecha === '') {

        responder(
            false,
            "La fecha de la venta es obligatoria."
        );

    }

    if ($cliente === '') {

        responder(
            false,
            "Debe ingresar un cliente para actualizar la venta."
        );

    }

    if ($producto === '') {

        responder(
            false,
            "Debe seleccionar un producto."
        );

    }

    if ($cantidad <= 0) {

        responder(
            false,
            "La cantidad debe ser mayor que cero."
        );

    }

    if ($precio <= 0) {

        responder(
            false,
            "El precio debe ser mayor que cero."
        );

    }

    $totalCalculado = $cantidad * $precio;

    $sqlExiste = "
        SELECT idVenta
        FROM ventas
        WHERE idVenta = ?
        LIMIT 1
    ";

    $stmtExiste = mysqli_prepare(
        $conexion,
        $sqlExiste
    );

    if (!$stmtExiste) {

        responder(
            false,
            "No fue posible verificar la venta."
        );

    }

    mysqli_stmt_bind_param(
        $stmtExiste,
        "i",
        $id
    );

    if (!mysqli_stmt_execute($stmtExiste)) {

        mysqli_stmt_close($stmtExiste);

        responder(
            false,
            "No fue posible verificar la venta."
        );

    }

    $resultadoExiste = mysqli_stmt_get_result(
        $stmtExiste
    );

    $ventaExiste = mysqli_fetch_assoc(
        $resultadoExiste
    );

    mysqli_stmt_close($stmtExiste);

    if (!$ventaExiste) {

        responder(
            false,
            "La venta que intenta actualizar no existe."
        );

    }

    $sqlActualizar = "
        UPDATE ventas
        SET
            fecha = ?,
            cliente = ?,
            producto = ?,
            cantidad = ?,
            precio = ?,
            total = ?,
            estado = ?
        WHERE idVenta = ?
    ";

    $stmtActualizar = mysqli_prepare(
        $conexion,
        $sqlActualizar
    );

    if (!$stmtActualizar) {

        responder(
            false,
            "No fue posible preparar la actualización de la venta."
        );

    }

    mysqli_stmt_bind_param(
        $stmtActualizar,
        "sssdddsi",
        $fecha,
        $cliente,
        $producto,
        $cantidad,
        $precio,
        $totalCalculado,
        $estado,
        $id
    );

    if (!mysqli_stmt_execute($stmtActualizar)) {

        mysqli_stmt_close($stmtActualizar);

        responder(
            false,
            "No fue posible actualizar la venta."
        );

    }

    mysqli_stmt_close($stmtActualizar);

    responder(
        true,
        "",
        [
            "mensaje" => "Venta actualizada correctamente.",
            "idVenta" => $id,
            "cliente" => $cliente
        ]
    );

}

// =====================================================
// ELIMINAR VENTA
// =====================================================

if (
    $_SERVER['REQUEST_METHOD'] === 'DELETE'
) {


    // =================================================
    // OBTENER ID
    // =================================================

    $id =
        $_GET['id'] ?? null;


    if (
        !$id ||
        !is_numeric($id)
    ) {

        responder(
            false,
            "El ID de la venta es obligatorio."
        );

    }


    $id =
        (int)$id;


    // =================================================
    // PREPARAR ELIMINACIÓN
    // =================================================

    $stmt =
        mysqli_prepare(
            $conexion,
            "
                DELETE FROM ventas
                WHERE idVenta = ?
            "
        );


    if (!$stmt) {

        responder(
            false,
            "No fue posible preparar la eliminación."
        );

    }


    mysqli_stmt_bind_param(
        $stmt,
        "i",
        $id
    );


    // =================================================
    // EJECUTAR
    // =================================================

    if (
        mysqli_stmt_execute(
            $stmt
        )
    ) {

        responder(
            true,
            "",
            [
                "mensaje" =>
                    "Venta eliminada correctamente."
            ]
        );

    }


    responder(
        false,
        "No fue posible eliminar la venta."
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

?>