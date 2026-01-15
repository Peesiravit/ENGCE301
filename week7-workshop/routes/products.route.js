// ============================================
// ROUTER LAYER - Products
// ============================================

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

// ===== ROUTES =====

// GET /api/products - Get all products
router.get('/', ProductController.getAllProducts);

// GET /api/products/search?q=keyword - Search products
router.get('/search', ProductController.searchProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', ProductController.getProductById);

// POST /api/products - Create product
// ✅ เชื่อมต่อกับ method createProduct ใน Controller
router.post('/', ProductController.createProduct);

// PUT /api/products/:id - Update product
// ✅ เชื่อมต่อกับ method updateProduct โดยรับ id ผ่าน params
router.put('/:id', ProductController.updateProduct);

// DELETE /api/products/:id - Delete product
// ✅ เชื่อมต่อกับ method deleteProduct โดยรับ id ผ่าน params
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;