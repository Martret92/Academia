-- UF2177_TA01
-- Ejercicio Programación Procedural DB relacionales

DROP TABLE IF EXISTS logs_cambios;
DROP TABLE IF EXISTS productos;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    precio NUMERIC(10,2),
    categoria VARCHAR(50)
);

INSERT INTO productos (nombre, precio, categoria)
VALUES
('Lápiz', 10.00, 'Papelería'),
('Cuaderno', 60.00, 'Papelería'),
('Calculadora', 120.00, 'Papelería');

CREATE TABLE logs_cambios (
    id SERIAL PRIMARY KEY,
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------
-- Ejercicio 1: Función SQL Básica
----------------------------------
CREATE OR REPLACE FUNCTION obtener_precio_neto(p_id INT)
RETURNS NUMERIC AS $$
    SELECT precio * 1.21
    FROM productos
    WHERE id = p_id;
$$ LANGUAGE SQL;

------------------------------------------------------
-- Ejercicio 2: Función PL/pgSQL con Variables y RAISE
------------------------------------------------------
CREATE OR REPLACE FUNCTION validar_y_actualizar(
    p_id INT,
    p_nuevo_precio NUMERIC
)
RETURNS TEXT
AS $$
DECLARE
    v_nombre_producto VARCHAR(100);
BEGIN
    SELECT nombre
    INTO v_nombre_producto
    FROM productos
    WHERE id = p_id;

    IF p_nuevo_precio <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser mayor que cero';
    END IF;

    UPDATE productos
    SET precio = p_nuevo_precio
    WHERE id = p_id;

    RETURN 'Producto "' || v_nombre_producto || '" actualizado correctamente';
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- Ejercicio 3: Función PL/pgSQL con FOR LOOP y CASE
----------------------------------------------------
CREATE OR REPLACE FUNCTION clasificar_y_ajustar_precios(
    p_categoria VARCHAR
)
RETURNS TEXT
AS $$
DECLARE
    v_producto RECORD;
    v_nuevo_precio NUMERIC;

BEGIN

    FOR v_producto IN
        SELECT *
        FROM productos
        WHERE categoria = p_categoria

    LOOP

        v_nuevo_precio :=
            CASE
                WHEN v_producto.precio < 50
                    THEN v_producto.precio * 1.10

                WHEN v_producto.precio BETWEEN 50 AND 100
                    THEN v_producto.precio * 1.05

                ELSE
                    v_producto.precio
            END;

        UPDATE productos
        SET precio = ROUND(v_nuevo_precio, 2)
        WHERE id = v_producto.id;

    END LOOP;

    RETURN 'Precios ajustados correctamente';

END;
$$ LANGUAGE plpgsql;

-----------
-- Pruebas:
-----------

-- SELECT * FROM productos;
-- SELECT obtener_precio_neto(1);
-- SELECT validar_y_actualizar(1, 25);
-- SELECT validar_y_actualizar(1, -10);
-- SELECT clasificar_y_ajustar_precios('Papelería');
-- SELECT * FROM productos;