// Dependencies
const status = require('http-status-codes');

// Models
const Category = require('../models/Category');

// Functions
const { existsOrError } = require('../functions/Validation');

// class CategoryController
class CategoryController {
    // Função que cria uma categoria
    async create(req, res) {
        let { name, type, pre_pos } = req.body;

        try {
            await existsOrError(name, 'Nome da categoria não informada!');
            await existsOrError(type, 'Tipo da categoria não informado!');
            await existsOrError(pre_pos, 'Nome do produto não informado!');

            let category = await Category.findOne({ where: { name }});

            if(category) {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    message: 'Já existe uma categoria com esse nome.'
                });
            }

        } catch (err) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                message: err
            });
        }

        try {
            await Category.create({ ...req.body });

            return res.status(status.CREATED).json({
                status: res.statusCode,
                message: 'Categoria registrada.'
            });
        } catch (err) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ 
                status: res.statusCode,
                message: err
            });
        }
    }
}

module.exports = new CategoryController();