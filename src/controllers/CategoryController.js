// Dependencies
const status = require('http-status-codes');

// Models
const Category = require('../models/Category');

// Functions
const { existsOrError } = require('../functions/Validation');

// ENUM's
const statusKey = require('../utils/statusCode.enum');

// class CategoryController
class CategoryController {
    // Função que cria uma categoria
    async createCategory(req, res) {
        let { name, type, pre_pos } = req.body;

        try {
            await existsOrError(name, 'Nome da categoria não informada!');
            await existsOrError(type, 'Tipo da categoria não informado!');
            await existsOrError(pre_pos, 'PRE/POS Investimentos não informado!');

            let category = await Category.findOne({ where: { name } });

            if (category) {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_EXISTS,
                    message: 'Já existe uma categoria com esse nome.'
                });
            }

        } catch (err) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_NOT_INFORMED,
                message: err
            });
        }

        try {
            await Category.create({ ...req.body });

            return res.status(status.CREATED).json({
                status: res.statusCode,
                statusKey: statusKey.RECORD_SUCCESS,
                message: 'Categoria registrada.'
            });
        } catch (err) {
            console.log(err);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err
            });
        }
    }

    // Função que edita uma categoria
    async editCategory(req, res) {
        let { id, name, type, pre_pos } = req.body;

        try {
            await existsOrError(id, 'ID da Categoria não informada!');
            await existsOrError(name, 'Nome da categoria não informada!');
            await existsOrError(type, 'Tipo da categoria não informado!');
            await existsOrError(pre_pos, 'PRE/POS Investimentos não informado!');
            
            let category = await Category.findOne({ where: { id } });
            
            if (!category) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusCode: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria não encontrada!'
                });
            }
        } catch (err) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_NOT_INFORMED,
                message: err
            });
        }

        try {
            let category = await Category.findOne({ where: { name } });

            if (!category) {
                delete req.body.id;
                await Category.update({ ...req.body }, { where: { id } });

                return res.status(status.OK).json({
                    status: res.statusCode,
                    statusKey: statusKey.UPDATED_SUCCESS,
                    message: 'Categoria alterada com sucesso!'
                });
            } else {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusCode: statusKey.DATA_EXISTS,
                    message: 'Já existe uma categoria com esse nome.'
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err
            });
        }
    }
}

module.exports = new CategoryController();