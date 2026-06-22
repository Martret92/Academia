const Consulta = require("../models/Consulta");

const getProfesoresPorEdad = async (req, res) => {
    try {
        const { edad } = req.query;

        if (!edad || isNaN(edad)) {
            return res.status(400).json({
                mensaje: "El parámetro edad es obligatorio y debe ser numérico"
            });
        }

        const resultado = await Consulta.profesoresPorEdad(Number(edad));

        res.json({
            sql: "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad = $1 ORDER BY profesor_id",
            request: "/api/consultas/profesores/por-edad?edad=35",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getProfesoresPorRangoEdad = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max || isNaN(min) || isNaN(max)) {
            return res.status(400).json({
                mensaje: "Los parámetros min y max son obligatorios y deben ser numéricos"
            });
        }

        if (Number(min) > Number(max)) {
            return res.status(400).json({
                mensaje: "El parámetro min no puede ser mayor que max"
            });
        }

        const resultado = await Consulta.profesoresPorRangoEdad(Number(min), Number(max));

        res.json({
            sql: "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad >= $1 AND edad <= $2 ORDER BY edad",
            request: "/api/consultas/profesores/rango?min=30&max=45",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getCursosTopMatriculados = async (req, res) => {
    try {
        const resultado = await Consulta.cursosTopMatriculados();

        res.json({
            sql: `SELECT c.curso_id, c.nombre, COUNT(m.matricula_id) AS total_matriculas
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
ORDER BY c.curso_id`,
            request: "/api/consultas/cursos/top-matriculados",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getMatriculasAlumnoCurso = async (req, res) => {
    try {
        const resultado = await Consulta.matriculasAlumnoCurso();

        res.json({
            sql: `SELECT 
    m.matricula_id,
    a.nombre AS alumno,
    c.nombre AS curso,
    m.fecha_matricula
FROM matriculas m
JOIN alumnos a ON m.alumno_id = a.alumno_id
JOIN curso c ON m.curso_id = c.curso_id
ORDER BY m.matricula_id`,
            request: "/api/consultas/matriculas/alumno-curso",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getProfesoresCursoEspecialidad = async (req, res) => {
    try {
        const resultado = await Consulta.profesoresCursoEspecialidad();

        res.json({
            sql: `SELECT 
    p.profesor_id,
    p.nombre AS profesor,
    c.nombre AS curso,
    e.nombre AS especialidad
FROM profesores p
JOIN curso c ON p.profesor_id = c.profesor_id
JOIN especialidad e ON p.especialidad_id = e.especialidad_id
ORDER BY p.profesor_id`,
            request: "/api/consultas/profesores/curso-especialidad",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getTotalMatriculasPorCurso = async (req, res) => {
    try {
        const resultado = await Consulta.totalMatriculasPorCurso();

        res.json({
            sql: `SELECT 
    c.curso_id,
    c.nombre AS curso,
    COUNT(m.matricula_id) AS total_matriculas
FROM curso c
LEFT JOIN matriculas m ON c.curso_id = m.curso_id
GROUP BY c.curso_id, c.nombre
ORDER BY c.curso_id`,
            request: "/api/consultas/matriculas/total-por-curso",
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getCursosConMinimoMatriculas = async (req, res) => {
    try {
        const { min } = req.query;

        if (!min || isNaN(min)) {
            return res.status(400).json({
                mensaje: "El parámetro min es obligatorio y debe ser numérico"
            });
        }

        if (Number(min) < 0) {
            return res.status(400).json({
                mensaje: "El parámetro min no puede ser negativo"
            });
        }

        const resultado = await Consulta.cursosConMinimoMatriculas(Number(min));

        res.json({
            sql: `SELECT 
    c.curso_id,
    c.nombre AS curso,
    COUNT(m.matricula_id) AS total_matriculas
FROM curso c
JOIN matriculas m ON c.curso_id = m.curso_id
GROUP BY c.curso_id, c.nombre
HAVING COUNT(m.matricula_id) >= $1
ORDER BY c.curso_id`,
            request: `/api/consultas/matriculas/cursos-con-minimo?min=${min}`,
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    getProfesoresPorEdad,
    getProfesoresPorRangoEdad,
    getCursosTopMatriculados,
    getMatriculasAlumnoCurso,
    getProfesoresCursoEspecialidad,
    getTotalMatriculasPorCurso,
    getCursosConMinimoMatriculas,
};