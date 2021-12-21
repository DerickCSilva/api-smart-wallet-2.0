// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

// Models
const Item = require('./Item');

const RegItems = connection.define('reg_items', {
    value: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }
});

Item.hasMany(RegItems);

RegItems.sync({ force: false })
    .then(() => console.log('Tabela de registros dos itens criada!'))
    .catch(err => console.log(err));

module.exports = RegItems;