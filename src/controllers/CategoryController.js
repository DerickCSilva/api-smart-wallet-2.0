// Dependencies
const status = require('http-status-codes');

// Models
const Category = require('../models/Category');
const Item = require('../models/Item');

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
            await existsOrError(name, 'Nome da categoria não informada.');
            await existsOrError(type, 'Tipo da categoria não informado.');
            await existsOrError(pre_pos, 'PRE/POS Investimentos não informado.');

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
                message: err.message
            });
        }
    }

    // Função que edita uma categoria
    async editCategory(req, res) {
        let { id, name, type, pre_pos } = req.body;

        try {
            await existsOrError(id, 'ID da Categoria não informada.');
            await existsOrError(name, 'Nome da categoria não informada.');
            await existsOrError(type, 'Tipo da categoria não informado.');
            await existsOrError(pre_pos, 'PRE/POS Investimentos não informado.');

            let category = await Category.findOne({ where: { id } });

            if (!category) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusCode: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria não encontrada.'
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
                    message: 'Categoria alterada com sucesso.'
                });
            } else {
                return res.status(status.BAD_REQUEST).json({
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
                message: err.message
            });
        }
    }

    // Função que deleta uma categoria
    async deleteCategory(req, res) {
        let { id } = req.params;

        try {
            await existsOrError(id, 'ID da categoria não informado.');
        } catch (err) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_NOT_INFORMED,
                message: err
            });
        }

        try {
            let category = await Category.findOne({ where: { id }, include: [{ model: Item }] });

            if (category) {
                let items = category.items;

                if (items.length == 0) {
                    await Category.destroy({ where: { id } });

                    return res.status(status.OK).json({
                        status: res.statusCode,
                        statusKey: statusKey.DATA_DELETED,
                        message: 'Categoria deletada com sucessso.'
                    });
                } else {
                    return res.status(status.CONFLICT).json({
                        status: res.statusCode,
                        statusKey: statusKey.DATA_CONFLICT,
                        message: 'Existe Itens inclusos nessa categoria. Apagá-la pode fazer com que dê conflito no sistema.',
                        items
                    });
                }
            } else {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria inexistente.'
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    }

    // Função que busca todas as categorias
    async getAllCategories(req, res) {
        let { page } = req.params || 1;

        if (!(page >= 1)) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_INVALID,
                message: 'Número da página inválida.'
            });
        }

        try {
            // Definindo a partir de qual registro da tabela será feito a busca
            let limit = 10;
            let offset = isNaN(page) || page == 1 ? 0 : (parseInt(page) - 1) * limit;

            let categories = await Category.findAll({
                limit,
                offset,
                order: [
                    ['id', 'desc']
                ],
                attributes: ['id', 'name', 'type', 'pre_pos']
            });

            let nextCategories = await Category.findAll({
                limit,
                offset: offset + 10,
                order: [
                    ['id', 'desc']
                ]
            });

            let hasNextPage = nextCategories.length > 0 ? true : false;

            return res.status(status.OK).json({
                status: res.statusCode,
                statusKey: statusKey.REQUEST_SUCCESS,
                categories,
                nextPage: parseInt(page) + 1,
                hasNextPage,
                message: `Categorias da página ${page}.`
            });
        } catch (err) {
            console.error(err);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    }

    // Função que busca apenas uma categoria
    async getCategoryById(req, res) {
        let { id } = req.params;
        let category;

        if (!(id >= 1)) {
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_INVALID,
                message: 'ID da Categoria inválido.'
            });
        }

        try {
            category = await Category.findOne({
                where: { id },
                attributes: ['id', 'name', 'type', 'pre_pos'],
                include: [
                    {
                        model: Item,
                        attributes: ['id', 'name']
                    }
                ]
            });

            if (category) {
                return res.status(status.OK).json({
                    status: res.statusCode,
                    statusKey: statusKey.REQUEST_SUCCESS,
                    category,
                    message: 'Busca realizada com sucesso.'
                });
            } else {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria inexistente.'
                });
            }
        } catch (err) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    }
}

module.exports = new CategoryController();