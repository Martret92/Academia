const pool = require("../config/db");

const Profesor = {
    findAll: () =>
        pool.query(`
            SELECT p.*, e.nombre AS especialidad
            FROM profesores p
            LEFT JOIN especialidad e ON p.especialidad_id = e.especialidad_id
            ORDER BY profesor_id
        `),

    findById: (id) =>
        pool.query(
            "SELECT * FROM profesores WHERE profesor_id = $1",
            [id]
        ),

    create: (nombre, edad, especialidad_id) =>
        pool.query(
            `INSERT INTO profesores (nombre, edad, especialidad_id)
             VALUES ($1, $2, $3) RETURNING *`,
            [nombre, edad, especialidad_id]
        ),

    update: (id, nombre, edad, especialidad_id) =>
        pool.query(
            `UPDATE profesores
             SET nombre = $1, edad = $2, especialidad_id = $3
             WHERE profesor_id = $4 RETURNING *`,
            [nombre, edad, especialidad_id, id]
        ),

    remove: (id) =>
        pool.query(
            "DELETE FROM profesores WHERE profesor_id = $1",
            [id]
        ),
};

module.exports = Profesor;
