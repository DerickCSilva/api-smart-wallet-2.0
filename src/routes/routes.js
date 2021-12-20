let express = require("express");
let router = express.Router();

// Controller's
let IndexController = require("../controllers/IndexController");
let CategoryController = require("../controllers/CategoryController");

router.get('/', IndexController.index);

// Rotas Categorias
router.post('/category', CategoryController.create);

module.exports = router;