const router = require("express").Router();

const {
    getProfesoresPorEdad,
    getProfesoresPorRangoEdad,
    getCursosTopMatriculados,
    getMatriculasAlumnoCurso,
    getProfesoresCursoEspecialidad,
    getTotalMatriculasPorCurso,
    getCursosConMinimoMatriculas,
} = require("../controllers/consultasController");

router.get("/profesores/por-edad", getProfesoresPorEdad);
router.get("/profesores/rango", getProfesoresPorRangoEdad);
router.get("/cursos/top-matriculados", getCursosTopMatriculados);
router.get("/matriculas/alumno-curso", getMatriculasAlumnoCurso);
router.get("/profesores/curso-especialidad", getProfesoresCursoEspecialidad);
router.get("/matriculas/total-por-curso", getTotalMatriculasPorCurso);
router.get("/matriculas/cursos-con-minimo", getCursosConMinimoMatriculas);

module.exports = router;