let express = require("express");
let router = express.Router();

// Controller's
let IndexController = require("../controllers/IndexController");
let CategoryController = require("../controllers/CategoryController");
let ItemController = require("../controllers/ItemController");

router.get('/', IndexController.index);

// Rotas Categorias
router.post('/category', CategoryController.createCategory);

// Rotas Items
router.post('/item', ItemController.createItem);
router.post('/item/registro', ItemController.createRecord);

module.exports = router;