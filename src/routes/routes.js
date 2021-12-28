let express = require("express");
let router = express.Router();

// Controller's
let IndexController = require("../controllers/IndexController");
let CategoryController = require("../controllers/CategoryController");
let ItemController = require("../controllers/ItemController");

// Rotas index.html
router.get('/', IndexController.index);

// Rotas Categorias
router.get('/categories/:page', CategoryController.getAllCategories);
router.get('/category/:id', CategoryController.getCategoryById);
router.post('/category', CategoryController.createCategory);
router.put('/category', CategoryController.editCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

// Rotas Items
router.get('/records/:date', ItemController.getAllRecords);
router.get('/items', ItemController.getAllItems);
router.get('/item/:id', ItemController.getItemById);
router.get('/item/record/:id', ItemController.getRecordById);
router.post('/item', ItemController.createItem);
router.post('/item/record', ItemController.createRecord);
router.put('/item', ItemController.editItem);
router.put('/item/record', ItemController.editRecord);
router.delete('/item/:id', ItemController.deleteItem);
router.delete('/item/record/:id', ItemController.deleteRecord);

module.exports = router;