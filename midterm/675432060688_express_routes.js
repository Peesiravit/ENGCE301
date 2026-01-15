// 1. ROUTER LAYER (routes/booking.route.js)
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const RoomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/auth');

router.get('/rooms', RoomController.getAllRooms);
router.post('/bookings', authMiddleware, BookingController.createBooking);
router.delete('/bookings/:id', authMiddleware, BookingController.cancelBooking);

// 2. CONTROLLER LAYER (controllers/booking.controller.js)
class BookingController {
    static async createBooking(req, res) {
        try {
            const { room_id, start_time, end_time, purpose } = req.body;
            const user_id = req.user.id;
            if (!room_id || !start_time || !end_time) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const booking = await BookingService.createBooking({
                user_id, room_id, start_time, end_time, purpose
            });

            return res.status(201).json(booking);
        } catch (error) {

            if (error.message === 'Room not available') {
                return res.status(409).json({ error: 'ช่วงเวลานี้มีการจองแล้ว' });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    static async cancelBooking(req, res) {
        try {
            const booking_id = req.params.id;
            const user_id = req.user.id;
            await BookingService.cancelBooking(booking_id, user_id);
            return res.status(200).json({ message: 'Cancelled successfully' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

// 3. SERVICE LAYER (services/booking.service.js)
class BookingService {
    static async createBooking(data) {
        const start = new Date(data.start_time);
        const end = new Date(data.end_time);
        const maxAdvanceDate = new Date();
        maxAdvanceDate.setDate(maxAdvanceDate.getDate() + 30);
        if (start > maxAdvanceDate) {
            throw new Error('ไม่สามารถจองล่วงหน้าเกิน 30 วัน');
        }
        const duration = (end - start) / (1000 * 60 * 60);
        if (duration > 3 || duration <= 0) {
            throw new Error('ระยะเวลาการจองต้องไม่เกิน 3 ชั่วโมง');
        }
        const isOverlap = await BookingDB.checkOverlapping(data.room_id, data.start_time, data.end_time);
        if (isOverlap) {
            throw new Error('Room not available');
        }
        return await BookingDB.insert({ ...data, status: 'pending' });
    }

    static async cancelBooking(id, user_id) {
        const booking = await BookingDB.findById(id);
        if (!booking || booking.user_id !== user_id) {
            throw new Error('Unauthorized or booking not found');
        }
        return await BookingDB.updateStatus(id, 'cancelled');
    }
}

// 4. DATABASE LAYER (database/booking.db.js)
class BookingDB {
    static async checkOverlapping(room_id, new_start, new_end) {
        const sql = `
            SELECT * FROM bookings 
            WHERE room_id = ? 
            AND status NOT IN ('rejected', 'cancelled')
            AND (start_time < ? AND end_time > ?)
        `;
        const result = await db.query(sql, [room_id, new_end, new_start]);
        return result.length > 0;
    }

    static async insert(data) {
        const sql = `INSERT INTO bookings SET ?`;
        const result = await db.query(sql, data);
        return { id: result.insertId, ...data };
    }

    static async updateStatus(id, status) {
        const sql = `UPDATE bookings SET status = ? WHERE id = ?`;
        return await db.query(sql, [status, id]);
    }

    static async findById(id) {
        const sql = `SELECT * FROM bookings WHERE id = ?`;
        const rows = await db.query(sql, [id]);
        return rows[0];
    }
}