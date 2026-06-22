const pool = require("../config/db");

const Consulta = {
    profesoresPorEdad: (edad) =>
        pool.query(
            `SELECT profesor_id, nombre, edad, especialidad_id
             FROM profesores
             WHERE edad = $1
             ORDER BY profesor_id`,
            [edad]
        ),
    profesoresPorRangoEdad: (min, max) =>
        pool.query(
            `SELECT profesor_id, nombre, edad, especialidad_id
         FROM profesores
         WHERE edad >= $1 AND edad <= $2
         ORDER BY edad`,
            [min, max]
        ),
    cursosTopMatriculados: () =>
    pool.query(
        `SELECT c.curso_id, c.nombre, COUNT(m.matricula_id) AS total_matriculas
         FROM curso c
         JOIN matriculas m ON c.curso_id = m.curso_id
         GROUP BY c.curso_id, c.nombre
         HAVING COUNT(m.matricula_id) = (
             SELECT MAX(total)
             FROM (
                 SELECT COUNT(*) AS total
                 FROM matriculas
                 GROUP BY curso_id
             ) AS conteos
         )
         ORDER BY c.curso_id`
    ),
    matriculasAlumnoCurso: () =>
    pool.query(
        `SELECT 
            m.matricula_id,
            a.nombre AS alumno,
            c.nombre AS curso,
            m.fecha_matricula
         FROM matriculas m
         JOIN alumnos a ON m.alumno_id = a.alumno_id
         JOIN curso c ON m.curso_id = c.curso_id
         ORDER BY m.matricula_id`
    ),
    profesoresCursoEspecialidad: () =>
    pool.query(
        `SELECT 
            p.profesor_id,
            p.nombre AS profesor,
            c.nombre AS curso,
            e.nombre AS especialidad
         FROM profesores p
         JOIN curso c ON p.profesor_id = c.profesor_id
         JOIN especialidad e ON p.especialidad_id = e.especialidad_id
         ORDER BY p.profesor_id`
    ),
    totalMatriculasPorCurso: () =>
    pool.query(
        `SELECT 
            c.curso_id,
            c.nombre AS curso,
            COUNT(m.matricula_id) AS total_matriculas
         FROM curso c
         LEFT JOIN matriculas m ON c.curso_id = m.curso_id
         GROUP BY c.curso_id, c.nombre
         ORDER BY c.curso_id`
    ),
    cursosConMinimoMatriculas: (min) =>
    pool.query(
        `SELECT 
            c.curso_id,
            c.nombre AS curso,
            COUNT(m.matricula_id) AS total_matriculas
         FROM curso c
         JOIN matriculas m ON c.curso_id = m.curso_id
         GROUP BY c.curso_id, c.nombre
         HAVING COUNT(m.matricula_id) >= $1
         ORDER BY c.curso_id`,
        [min]
    ),
};

module.exports = Consulta;