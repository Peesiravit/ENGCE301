// ============================================
// DATABASE LAYER - Products
// ============================================

const db = require('./connection');

class ProductDatabase {
    // ===== CREATE =====
    // ✅ ให้โค้ดสมบูรณ์
    static create(productData) {
        const sql = `
            INSERT INTO products (name, category_id, price, stock, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [
                    productData.name,
                    productData.category_id,
                    productData.price,
                    productData.stock,
                    productData.description || ''
                ],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            ...productData
                        });
                    }
                }
            );
        });
    }

    // ===== READ ALL =====
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // ===== READ ONE =====
    // ✅ เติม SQL query ให้ JOIN กับ categories
    static findById(id) {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;

        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // ===== UPDATE =====
    // ✅ เติม SQL UPDATE query และ db.run
    static update(id, productData) {
        const sql = `
            UPDATE products
            SET name = ?,
                category_id = ?,
                price = ?,
                stock = ?,
                description = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [
                    productData.name,
                    productData.category_id,
                    productData.price,
                    productData.stock,
                    productData.description,
                    id
                ],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                }
            );
        });
    }

    // ===== DELETE =====
    // ✅ เติม SQL DELETE query และ db.run
    static delete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';

        return new Promise((resolve, reject) => {
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // ===== SEARCH =====
    // ✅ เติมโค้ด db.all
    static search(keyword) {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.name LIKE ? OR p.description LIKE ?
            ORDER BY p.id DESC
        `;

        return new Promise((resolve, reject) => {
            const searchTerm = `%${keyword}%`;
            db.all(sql, [searchTerm, searchTerm], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = ProductDatabase;