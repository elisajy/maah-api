"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoucher = exports.updateVoucher = exports.addVouchers = exports.getAllVouchers = void 0;
/**
 *
 * @param fastify
 * @returns {
 *  code: string
 *  description: string
 *  discountType: string
 *  discountValue: number
 *  expiresAt: Date
 *  usageLimit: number
 *  timeUsed: number
 * }
*/
const getAllVouchers = async (fastify) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM vouchers ORDER BY code ASC');
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllVouchers = getAllVouchers;
/**
 * Create a voucher
 *
 * @param fastify
 * @param data {
 *   code: string,
 *   description: string,
 *   discountType: 'percentage' | 'fixed', //maybe need to be enhance
 *   discountValue: number,
 *   expiresAt?: Date,
 *   usageLimit?: number,
 *   timesUsed?: number
 * }
 *
 * @returns {
 * code: number,
 * message: string
 * }
 */
const addVouchers = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const { code, description, discountType, discountValue, expiresAt = null, usageLimit = null, timesUsed = null, } = data;
        const [existing] = await connection.query(`SELECT code FROM vouchers WHERE code = ?`, [code]);
        if (existing.length > 0) {
            res = { code: 409, message: "Voucher code already exists." };
            return res;
        }
        const [result] = await connection.execute(`INSERT INTO vouchers (code, description, discountType, discountValue, expiresAt, usageLimit, timesUsed)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [code, description, discountType, discountValue, expiresAt, usageLimit, timesUsed]);
        res = result?.insertId
            ? { code: 201, message: `Voucher '${code}' created.` }
            : { code: 500, message: "Failed to create voucher." };
    }
    catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.addVouchers = addVouchers;
/**
 * Update a voucher
 *
 * @param fastify
 * @param data {
 *  code: string,
 *  description?: string,
 *  discountType?: 'percentage' | 'fixed',
 *  discountValue?: number,
 *  expiresAt?: Date,
 *  usageLimit?: number,
 *  timesUsed?: number
 * }
 *
 * @returns { code: number, message: string }
 */
const updateVoucher = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const { code, description, discountType, discountValue, expiresAt = null, usageLimit = null, timesUsed = null } = data;
        const [result] = await connection.execute(`UPDATE vouchers SET 
                description = ?, 
                discountType = ?, 
                discountValue = ?, 
                expiresAt = ?, 
                usageLimit = ?, 
                timesUsed = ?
             WHERE code = ?`, [description, discountType, discountValue, expiresAt, usageLimit, timesUsed, code]);
        res = result?.affectedRows > 0
            ? { code: 204, message: `Voucher '${code}' updated.` }
            : { code: 404, message: `Voucher '${code}' not found.` };
    }
    catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.updateVoucher = updateVoucher;
/**
 *
 * @param fastify
 * @param id string
 *
 * @returns {
 *  code: number,
 *  message: string
 * }
 */
const deleteVoucher = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [sales] = await connection.execute(`SELECT COUNT(*) AS count FROM sales WHERE voucherCode = ?`, [id]);
        const usageCount = sales[0]?.count || 0;
        if (usageCount > 0) {
            res = {
                code: 409,
                message: `Cannot delete. Voucher '${id}' is used in ${usageCount} sale(s).`
            };
            return res;
        }
        const [result] = await connection.execute(`DELETE FROM vouchers WHERE code = ?`, [id]);
        res = result?.affectedRows > 0
            ? { code: 204, message: `Voucher '${id}' deleted.` }
            : { code: 404, message: `Voucher '${id}' not found.` };
    }
    catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.deleteVoucher = deleteVoucher;
//# sourceMappingURL=vouchers.js.map