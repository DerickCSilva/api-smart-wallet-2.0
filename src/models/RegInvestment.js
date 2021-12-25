// Dependencies
const Sequelize = require('sequelize');
const connection = require('../database/connection');

// Models
const Investment = require('../models/Investment');

const RegInvestment = connection.define('reg_investment', {
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Investment.hasMany(RegInvestment);
RegInvestment.belongsTo(Investment);

RegInvestment.sync({ force: false })
    .then(() => console.log('Tabela de registros dos investimentos criada!'))
    .catch(err => console.log(err));

module.exports = RegInvestment;