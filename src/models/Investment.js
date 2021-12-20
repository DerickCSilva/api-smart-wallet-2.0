// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

const Investment = connection.define('investments', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    priority: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Investment.sync({ force: false })
    .then(() => console.log('Tabela de Investimentos criada!'))
    .catch(err => console.log(err));

module.exports = Investment;