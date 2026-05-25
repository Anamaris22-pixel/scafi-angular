<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';


$sql = "

SELECT *

FROM insumos

WHERE stock <= stockMinimo

";

$resultado =
$conn->query($sql);


while (
  $fila =
  $resultado->fetch_assoc()
) {

    $nombre =
    $fila['nombre'];

    $stock =
    $fila['stock'];

    $mensaje =

    "El insumo $nombre tiene stock bajo. Quedan $stock unidades.";


    /* VALIDAR DUPLICADOS */

    $buscar = "

    SELECT *

    FROM notificaciones

    WHERE mensaje = '$mensaje'

    ";

    $existe =
    $conn->query($buscar);


    if (
      $existe->num_rows == 0
    ) {

        $titulo =
        'Stock Bajo';

        $usuario_id = 1;


        $insertar = "

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            fecha
        )

        VALUES
        (
            '$usuario_id',
            '$titulo',
            '$mensaje',
            NOW()
        )

        ";

        $conn->query($insertar);

    }

}

echo json_encode([
  "ok" => true
]);

?>