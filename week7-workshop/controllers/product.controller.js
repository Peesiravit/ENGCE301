// ============================================
// CONTROLLER LAYER - Products
// ============================================

const ProductService = require('../services/product.service');

class ProductController {
    // ===== GET ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            
            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ===== GET BY ID =====
    // ✅ เติม Error Handling: แยก 404 และ 500
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== CREATE =====
    // ✅ รับข้อมูลจาก body และส่ง Response 201
    static async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await ProductService.createProduct(productData);
            
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            // ตรวจสอบว่าเป็น Client Error (Validation) หรือ Server Error
            if (error.message.includes('required') || error.message.includes('must')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== UPDATE =====
    // ✅ เขียนโค้ดรับ id และ body พร้อมจัดการ Error
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            
            const updatedProduct = await ProductService.updateProduct(id, productData);
            
            res.json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else if (error.message.includes('required') || error.message.includes('must')) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== DELETE =====
    // ✅ เขียนโค้ดสั่งลบและส่ง Response
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductService.deleteProduct(id);
            
            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    // ===== SEARCH =====
    // ✅ ให้โค้ดสมบูรณ์
    static async searchProducts(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    error: 'Search keyword is required'
                });
            }

            const products = await ProductService.searchProducts(q);
            
            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ProductController;