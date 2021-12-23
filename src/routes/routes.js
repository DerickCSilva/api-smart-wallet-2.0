let express = require("express");
let router = express.Router();

// Controller's
let IndexController = require("../controllers/IndexController");
let CategoryController = require("../controllers/CategoryController");
let ItemController = require("../controllers/ItemController");

// Rotas index.html
router.get('/', IndexController.index);

// Rotas Categorias
router.post('/category', CategoryController.createCategory);
router.put('/category', CategoryController.editCategory);

// Rotas Items
router.post('/item', ItemController.createItem);
router.post('/item/record', ItemController.createRecord);
router.put('/item', ItemController.editItem);

module.exports = router;