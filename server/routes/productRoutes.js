const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.post(
  '/products',
  productController.upload.array('images', 10),
  productController.createProduct
);
router.put(
  '/products/:id',
  productController.upload.array('images', 10),
  productController.updateProduct
);
router.get('/products/total-in-stock', productController.getTotalInStock);
router.get('/products/out-of-stock-count', productController.getOutOfStockCount);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
