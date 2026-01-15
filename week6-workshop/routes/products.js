// ============================================
// Product Routes - นักศึกษาเติมโค้ดส่วนที่ขาด
// ============================================

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

// ===== HELPER FUNCTIONS =====

// อ่านข้อมูลจากไฟล์
async function readProducts() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

// เขียนข้อมูลลงไฟล์
async function writeProducts(products) {
    try {
        await fs.writeFile(
            dataPath, 
            JSON.stringify(products, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error writing products:', error);
        return false;
    }
}

// ===== GET ALL PRODUCTS =====
// ✅ ให้โค้ดสมบูรณ์
router.get('/', async (req, res) => {
    try {
        const products = await readProducts();
        
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
});

// ===== GET PRODUCT BY ID =====
// ⚠️ นักศึกษาเติมโค้ด 30%
router.get('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const id = parseInt(req.params.id);
        
        // TODO: ค้นหา product ที่มี id ตรงกับที่ส่งมา
        const product = products.find(p => p.id === id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== POST (CREATE) PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดทั้งหมด
router.post('/', async (req, res) => {
    try {
        const products = await readProducts();
        const { name, category, price, stock, description } = req.body;
        
        if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
        success: false,
        error: 'Missing required fields'
    });
}
        const maxId = products.length > 0 
    ? Math.max(...products.map(p => p.id)) 
    : 0;
const newId = maxId + 1;
        // TODO: 3. สร้าง product object ใหม่
       
        const newProduct = {
                id: newId,
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    description: description || ''
        };
        
        // TODO: 4. เพิ่มเข้า array
        products.push(newProduct);
await writeProducts(products);
        
        // TODO: 5. บันทึกลงไฟล์
        
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== PUT (UPDATE) PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดส่วนสำคัญ
router.put('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const id = parseInt(req.params.id);
        const { name, category, price, stock, description } = req.body;
        
        // TODO: 1. หา index ของ product ที่ต้องการแก้ไข
        const productIndex = products.findIndex(p => p.id === id);
        
        // TODO: 2. ตรวจสอบว่าเจอหรือไม่
        if (productIndex === -1) {
    return res.status(404).json({
        success: false,
        error: 'Product not found'
    });
}
        
        // TODO: 3. อัปเดตข้อมูล
        products[productIndex] = {
    id,
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    description: description || products[productIndex].description
};
        
        // TODO: 4. บันทึกลงไฟล์
        await writeProducts(products);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== DELETE PRODUCT =====
// ⚠️ นักศึกษาเติมโค้ดทั้งหมด
router.delete('/:id', async (req, res) => {
    try {
        const products = await readProducts();
const id = parseInt(req.params.id);

const productIndex = products.findIndex(p => p.id === id);

if (productIndex === -1) {
    return res.status(404).json({
        success: false,
        error: 'Product not found'
    });
}

products.splice(productIndex, 1);
await writeProducts(products);
        
        
        
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;