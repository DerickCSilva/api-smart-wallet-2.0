// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

const Objective = connection.define('objectives', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    },
    priority: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Objective.sync({ force: false })
    .then(() => console.log('Tabela de Objetivos criada!'))
    .catch(err => console.log(err));

module.exports = Objective;