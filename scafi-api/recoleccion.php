<?php

// =====================================================
// CONFIGURACIÓN
// =====================================================

error_reporting(E_ALL);
ini_set('display_errors', 1);


// =====================================================
// CABECERAS
// =====================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


// =====================================================
// PETICIÓN OPTIONS / CORS
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);

    exit();

}


// =====================================================
// CONEXIÓN
// =====================================================

require_once 'conexion.php';

// =====================================================
// VALIDAR PERMISOS DE EDICIÓN
// =====================================================

function validarUsuarioEdicion($conexion, $usuarioId) {

    $usuarioId = intval($usuarioId);

    if ($usuarioId <= 0) {
        return [
            "ok" => false,
            "mensaje" => "Usuario no identificado."
        ];
    }

    $stmt = $conexion->prepare(
        "SELECT idRol FROM usuario WHERE id = ? LIMIT 1"
    );

    if (!$stmt) {
        return [
            "ok" => false,
            "mensaje" => "No fue posible validar los permisos."
        ];
    }

    $stmt->bind_param("i", $usuarioId);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    $stmt->close();

    if (!$usuario) {
        return [
            "ok" => false,
            "mensaje" => "Usuario no encontrado."
        ];
    }

    if ((int)$usuario["idRol"] === 3) {
        return [
            "ok" => false,
            "mensaje" => "Los recolectores tienen acceso de solo lectura y no pueden registrar, editar ni eliminar pesajes. Solicita el cambio al administrador."
        ];
    }

    return [
        "ok" => true
    ];
}



// =====================================================
// GET
// CONSULTAS
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {


    // =================================================
    // GET DE LOTES
    // recoleccion.php?accion=lotes
    // =================================================

    if (
        isset($_GET['accion']) &&
        $_GET['accion'] === 'lotes'
    ) {


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


        $resultadoLotes =
            $conexion->query($sqlLotes);


        // ---------------------------------------------
        // ERROR EN CONSULTA
        // ---------------------------------------------

        if (!$resultadoLotes) {

            http_response_code(500);

            echo json_encode([

                "ok" => false,

                "mensaje" =>
                    "Error al consultar los lotes: " .
                    $conexion->error

            ]);

            exit();

        }


        // ---------------------------------------------
        // ARMAR LISTA DE LOTES
        // ---------------------------------------------

        $lotes = [];


        while (
            $fila =
            $resultadoLotes->fetch_assoc()
        ) {

            $lotes[] = $fila;

        }


        // ---------------------------------------------
        // RESPUESTA
        // ---------------------------------------------

        echo json_encode(

            $lotes,

            JSON_UNESCAPED_UNICODE

        );

        exit();

    }


    // =================================================
    // GET DE RECOLECCIONES
    // =================================================

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

            ON rec.idRecolector =
               r.idRecolector

        LEFT JOIN lotes l

            ON l.idLote =
               r.idLote

        ORDER BY
            r.idRecoleccion DESC

    ";


    $resultado =
        $conexion->query($sql);


    // ---------------------------------------------
    // ERROR
    // ---------------------------------------------

    if (!$resultado) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "Error al consultar las recolecciones: " .
                $conexion->error

        ]);

        exit();

    }


    // ---------------------------------------------
    // ARMAR LISTA
    // ---------------------------------------------

    $datos = [];


    while (
        $fila =
        $resultado->fetch_assoc()
    ) {

        $datos[] = $fila;

    }


    // ---------------------------------------------
    // RESPUESTA
    // ---------------------------------------------

    echo json_encode(

        $datos,

        JSON_UNESCAPED_UNICODE

    );

    exit();

}


// =====================================================
// POST
// CREAR NUEVA RECOLECCIÓN
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {


    // ---------------------------------------------
    // RECIBIR DATOS
    // ---------------------------------------------

    $idRecolector =
        $_POST['idRecolector'] ?? '';


    $idLote =
        $_POST['idLote'] ?? '';


    $variedad =
        trim(
            $_POST['variedad'] ?? ''
        );


    $estado =
        trim(
            $_POST['estado'] ?? ''
        );


    $fecha =
        $_POST['fecha'] ?? '';


    $kg =
        $_POST['kg'] ?? '';

    $usuarioId =
        $_POST['usuario_id'] ?? 0;

    $permiso = validarUsuarioEdicion($conexion, $usuarioId);

    if (!$permiso["ok"]) {
        http_response_code(403);
        echo json_encode($permiso);
        exit();
    }


    // ---------------------------------------------
    // VALIDAR CAMPOS OBLIGATORIOS
    // ---------------------------------------------

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

            "mensaje" =>
                "Todos los campos son obligatorios."

        ]);

        exit();

    }


    // ---------------------------------------------
    // VALIDAR KG
    // ---------------------------------------------

    if (
        !is_numeric($kg) ||
        floatval($kg) <= 0
    ) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "La cantidad de kilogramos debe ser mayor que cero."

        ]);

        exit();

    }


    // ---------------------------------------------
    // VERIFICAR RECOLECTOR
    // ---------------------------------------------

    $verificarRecolector =
        $conexion->prepare("

            SELECT idRecolector

            FROM recolectores

            WHERE idRecolector = ?

        ");


    if (!$verificarRecolector) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                $conexion->error

        ]);

        exit();

    }


    $verificarRecolector->bind_param(

        "i",

        $idRecolector

    );


    $verificarRecolector->execute();


    $resultadoRecolector =
        $verificarRecolector->get_result();


    if (
        $resultadoRecolector->num_rows === 0
    ) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "El recolector seleccionado no existe."

        ]);

        $verificarRecolector->close();

        exit();

    }


    $verificarRecolector->close();


    // ---------------------------------------------
    // VERIFICAR LOTE
    // ---------------------------------------------

    $verificarLote =
        $conexion->prepare("

            SELECT
                idLote

            FROM lotes

            WHERE idLote = ?

            AND estado = 'Activo'

        ");


    if (!$verificarLote) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                $conexion->error

        ]);

        exit();

    }


    $verificarLote->bind_param(

        "i",

        $idLote

    );


    $verificarLote->execute();


    $resultadoLote =
        $verificarLote->get_result();


    if (
        $resultadoLote->num_rows === 0
    ) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "El lote seleccionado no existe o está inactivo."

        ]);

        $verificarLote->close();

        exit();

    }


    $verificarLote->close();


    // ---------------------------------------------
    // INSERTAR RECOLECCIÓN
    // ---------------------------------------------

    $stmt =
        $conexion->prepare("

            INSERT INTO recoleccion

            (
                idRecolector,
                idLote,
                variedad,
                estado,
                fecha,
                kg
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

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo preparar el registro: " .
                $conexion->error

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


    // ---------------------------------------------
    // EJECUTAR INSERT
    // ---------------------------------------------

    if ($stmt->execute()) {

        echo json_encode([

            "ok" => true,

            "mensaje" =>
                "Pesaje guardado correctamente."

        ]);

    } else {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo guardar el pesaje: " .
                $stmt->error

        ]);

    }


    $stmt->close();

    exit();

}


// =====================================================
// PUT
// ACTUALIZAR RECOLECCIÓN
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {


    // ---------------------------------------------
    // LEER JSON
    // ---------------------------------------------

    $input =
        json_decode(

            file_get_contents(
                "php://input"
            ),

            true

        );


    // ---------------------------------------------
    // RECIBIR DATOS
    // ---------------------------------------------

    $id =
        $input['id'] ?? 0;


    $idRecolector =
        $input['idRecolector'] ?? '';


    $idLote =
        $input['idLote'] ?? '';


    $variedad =
        trim(
            $input['variedad'] ?? ''
        );


    $estado =
        trim(
            $input['estado'] ?? ''
        );


    $fecha =
        $input['fecha'] ?? '';


    $kg =
        $input['kg'] ?? '';

    $usuarioId =
        $input['usuario_id'] ?? 0;

    $permiso = validarUsuarioEdicion($conexion, $usuarioId);

    if (!$permiso["ok"]) {
        http_response_code(403);
        echo json_encode($permiso);
        exit();
    }


    // ---------------------------------------------
    // VALIDAR
    // ---------------------------------------------

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

            "mensaje" =>
                "Todos los campos son obligatorios."

        ]);

        exit();

    }


    // ---------------------------------------------
    // VALIDAR KG
    // ---------------------------------------------

    if (
        !is_numeric($kg) ||
        floatval($kg) <= 0
    ) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "La cantidad de kilogramos debe ser mayor que cero."

        ]);

        exit();

    }


    // ---------------------------------------------
    // VERIFICAR LOTE
    // ---------------------------------------------

    $verificarLote =
        $conexion->prepare("

            SELECT
                idLote

            FROM lotes

            WHERE idLote = ?

            AND estado = 'Activo'

        ");


    if (!$verificarLote) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                $conexion->error

        ]);

        exit();

    }


    $verificarLote->bind_param(

        "i",

        $idLote

    );


    $verificarLote->execute();


    $resultadoLote =
        $verificarLote->get_result();


    if (
        $resultadoLote->num_rows === 0
    ) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "El lote seleccionado no existe o está inactivo."

        ]);

        $verificarLote->close();

        exit();

    }


    $verificarLote->close();


    // ---------------------------------------------
    // ACTUALIZAR
    // ---------------------------------------------

    $stmt =
        $conexion->prepare("

            UPDATE recoleccion

            SET

                idRecolector = ?,

                idLote = ?,

                variedad = ?,

                estado = ?,

                fecha = ?,

                kg = ?

            WHERE
                idRecoleccion = ?

        ");


    if (!$stmt) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo preparar la actualización: " .
                $conexion->error

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


    // ---------------------------------------------
    // EJECUTAR
    // ---------------------------------------------

    if ($stmt->execute()) {

        echo json_encode([

            "ok" => true,

            "mensaje" =>
                "Registro actualizado correctamente."

        ]);

    } else {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo actualizar el registro: " .
                $stmt->error

        ]);

    }


    $stmt->close();

    exit();

}


// =====================================================
// DELETE
// ELIMINAR RECOLECCIÓN
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {


    // ---------------------------------------------
    // RECIBIR ID
    // ---------------------------------------------

    $id =
        $_GET['id'] ?? 0;

    $usuarioId =
        $_GET['usuario_id'] ?? 0;

    $permiso = validarUsuarioEdicion($conexion, $usuarioId);

    if (!$permiso["ok"]) {
        http_response_code(403);
        echo json_encode($permiso);
        exit();
    }


    // ---------------------------------------------
    // VALIDAR ID
    // ---------------------------------------------

    if (empty($id)) {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "ID de registro requerido."

        ]);

        exit();

    }


    // ---------------------------------------------
    // PREPARAR DELETE
    // ---------------------------------------------

    $stmt =
        $conexion->prepare("

            DELETE FROM recoleccion

            WHERE idRecoleccion = ?

        ");


    if (!$stmt) {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo preparar la eliminación: " .
                $conexion->error

        ]);

        exit();

    }


    $stmt->bind_param(

        "i",

        $id

    );


    // ---------------------------------------------
    // EJECUTAR DELETE
    // ---------------------------------------------

    if ($stmt->execute()) {

        echo json_encode([

            "ok" => true,

            "mensaje" =>
                "Registro eliminado correctamente."

        ]);

    } else {

        http_response_code(500);

        echo json_encode([

            "ok" => false,

            "mensaje" =>
                "No se pudo eliminar el registro: " .
                $stmt->error

        ]);

    }


    $stmt->close();

    exit();

}


// =====================================================
// MÉTODO NO PERMITIDO
// =====================================================

http_response_code(405);

echo json_encode([

    "ok" => false,

    "mensaje" =>
        "Método no permitido."

]);


// =====================================================
// CERRAR CONEXIÓN
// =====================================================

$conexion->close();

?>