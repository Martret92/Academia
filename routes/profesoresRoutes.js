const router = require("express").Router();

const {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
} = require("../controllers/profesoresController");

const authMiddleware = require("../controllers/middlewares/authMiddleware");
const handleValidation = require("../controllers/middlewares/handleValidation");
const profesorValidator = require("../controllers/middlewares/validators/profesorValidator");

router.get("/", authMiddleware, getProfesores);
router.get("/:id", authMiddleware, getProfesor);

module.exports = router;