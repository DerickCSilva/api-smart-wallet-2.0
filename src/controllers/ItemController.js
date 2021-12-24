// Dependencies
const status = require('http-status-codes');

// Models
const Item = require('../models/Item');
const RegItem = require('../models/RegItem');
const Category = require('../models/Category');

// Functions
const { existsOrError } = require('../functions/Validation');

// ENUM's
const statusKey = require('../utils/statusCode.enum');

// class ItemController
class ItemController {
    // Função que cria um item
    async createItem(req, res) {
        let { categoryId, name } = req.body;

        try {
            await existsOrError(categoryId, 'ID da Categoria não informado.');
            await existsOrError(name, 'Nome do item não informado.');

            let item = await Item.findOne({ where: { name } });
            let category = await Category.findOne({ where: { id: categoryId } });

            if (item) {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_EXISTS,
                    message: `Já existe um item com esse nome na categoria ${category.name}.`
                });
            } else if (!category) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria inexistente.'
                });
            }

        } catch (err) {
            console.log(err);
            return res.status(status.BAD_REQUEST).json({
                status: res.statusCode,
                statusKey: statusKey.DATA_NOT_INFORMED,
                message: err
            });
        }

        try {
            await Item.create({ ...req.body });

            return res.status(status.CREATED).json({
                status: res.statusCode,
                statusKey: statusKey.RECORD_SUCCESS,
                message: 'Item registrado.'
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

    // Função que cria um registro em um item
    async createRecord(req, res) {
        let { itemId, value, desc, date } = req.body;

        try {
            await existsOrError(itemId, 'ID do Item não informado.');
            await existsOrError(value, 'Valor do registro não informado.');
            await existsOrError(desc, 'Descrição do registro não informado.');
            await existsOrError(date, 'Data do registro não informado.');

            let item = await Item.findOne({ where: { id: itemId } });

            if (!item) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Item inexistente.'
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
            await RegItem.create({ ...req.body });

            return res.status(status.CREATED).json({
                status: res.statusCode,
                statusKey: statusKey.RECORD_SUCCESS,
                message: 'Registro incluso com sucesso.'
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

    // Função que edita um item
    async editItem(req, res) {
        let { id, categoryId, name } = req.body;

        let category = await Category.findOne({ where: { id: categoryId } });

        try {
            await existsOrError(id, 'ID do Item não informado.');
            await existsOrError(categoryId, 'ID da Categoria não informado.');
            await existsOrError(name, 'Nome do item não informado.');

            let item = await Item.findOne({ where: { id } });

            if (!item) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusCode: statusKey.DATA_NOT_FOUND,
                    message: 'Item não encontrado.'
                });
            } else if (!category) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Categoria inexistente.'
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
            let item = await Item.findOne({ where: { name } });

            if (!item) {
                delete req.body.id;
                await Item.update({ ...req.body }, { where: { id } });

                return res.status(status.OK).json({
                    status: res.statusCode,
                    statusKey: statusKey.UPDATED_SUCCESS,
                    message: 'Item alterado com sucesso.'
                });
            } else {
                return res.status(status.BAD_REQUEST).json({
                    status: res.statusCode,
                    statusCode: statusKey.DATA_EXISTS,
                    message: `Já existe um item com esse nome na categoria ${category.name}.`
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

    // Função que edita um registro de um item
    async editRecord(req, res) {
        let { id, value, desc, date } = req.body;
        let record;

        try {
            await existsOrError(id, 'ID do registro não informado.');
            await existsOrError(value, 'Valor do registro não informado.');
            await existsOrError(desc, 'Descrição do registro não informado.');
            await existsOrError(date, 'Data do registro não informado.');

            record = await RegItem.findOne({ where: { id } });

            if (!record) {
                return res.status(status.NOT_FOUND).json({
                    status: res.statusCode,
                    statusKey: statusKey.DATA_NOT_FOUND,
                    message: 'Registro inexistente.'
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
            let item = await Item.findOne({ where: { id: record.itemId } });

            await RegItem.update({ ...req.body }, { where: { id } });

            return res.status(status.OK).json({
                status: res.statusCode,
                statusKey: statusKey.UPDATED_SUCCESS,
                message: `Registro do Item ${item.name} alterado com sucessso.`
            })
        } catch (err) {
            console.log(err);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                status: res.statusCode,
                statusKey: statusKey.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    }
}

module.exports = new ItemController();