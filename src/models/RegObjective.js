// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

// Models
const Objective = require('../models/Objective');

const RegObjective = connection.define('reg_objective', {
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Objective.hasMany(RegObjective);

RegObjective.sync({ force: false })
    .then(() => console.log('Tabela de registros dos objetivos criada!'))
    .catch(err => console.log(err));

module.exports = RegObjective;