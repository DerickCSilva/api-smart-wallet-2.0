// Modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const connection = require('./src/database/connection');

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Routes
const routes = require('./src/routes/routes');

// Models
const Category = require('./src/models/Category');
const Item = require('./src/models/Item');
const RegItem = require('./src/models/RegItem');
const Objective = require('./src/models/Objective');
const RegObjective = require('./src/models/RegObjective');
const RegInvestment = require('./src/models/RegInvestment');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection with database
connection
    .authenticate()
    .then(() => console.log('Conexão feita com sucesso!'))
    .catch(err => console.log(err));

// Using Cors, Morgan, Routes ans Swagger
app.use(cors());
app.use(morgan('dev'));
app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Listen on port 3434
app.listen(3000, () => {
    setTimeout(() => {
        console.log('Backend rodando: http://localhost:3000/ 🚀...');        
    }, 400);
});