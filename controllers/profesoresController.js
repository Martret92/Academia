const Profesor = require("../models/Profesor");

const getProfesores = async (req, res) => {
    try {
        const resultado = await Profesor.findAll();
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Profesor.findById(id);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createProfesor = async (req, res) => {
    try {
        const { nombre, edad, especialidad_id } = req.body;
        const resultado = await Profesor.create(nombre, edad, especialidad_id);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, especialidad_id } = req.body;
        const resultado = await Profesor.update(id, nombre, edad, especialidad_id);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        await Profesor.remove(id);
        res.json({ mensaje: "Profesor eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
};