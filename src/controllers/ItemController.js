// Dependencies
const status = require('http-status-codes');

// Models
const Item = require('../models/Item');
const Category = require('../models/Category');

// Functions
const { existsOrError } = require('../functions/Validation');

// class ItemController
class ItemController {
    // Função que cria um item
    async create(req, res) {
        let { categoryId, name } = req.body;

        try {
            await existsOrError(categoryId, 'ID da Categoria não informado!');
            await existsOrError(name, 'Nome do item não informado!');

            let item = await Item.findOne({ where: { name } });
            let category = await Category.findOne({ where: { id: categoryId } });

            if (item) {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    message: 'Já existe um item com esse nome.'
                });
            } else if (!category) {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    message: 'Categoria inexistente.'
                });
            }

        } catch (err) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                message: err
            });
        }

        try {
            await Item.create({ ...req.body });

            return res.status(status.CREATED).json({
                status: res.statusCode,
                message: 'Item registrado.'
            });
        } catch (err) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                message: err
            });
        }
    }
}

module.exports = new ItemController();