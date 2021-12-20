// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

// Models
const Category = require('./Category');

const Item = connection.define('items', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Category.hasMany(Item);

Item.sync({ force: false })
    .then(() => console.log('Tabela de Itens criada!'))
    .catch(err => console.log(err));

module.exports = Item;