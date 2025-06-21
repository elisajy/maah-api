"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalesStatus = exports.getSalesDetailsById = exports.addSales = exports.getSalesById = exports.getAllSales = void 0;
/**
 *
 * @param fastify
 * @returns {
 *  id: number
 *  customerEmail: string
 *  customerPhone: string
 *  createdAt: Date
 *  customerName: string
 *  customerAddress: string
 *  priceBeforeDiscount: number
 *  totalPrice: number
 *  voucherCode: string
 *  status: string
 * }
*/
const getAllSales = async (fastify) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM sales ORDER BY createdAt ASC');
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllSales = getAllSales;
/**
 *
 * @param fastify
 * @param id
 * @returns {
 *  id: number
 *  customerEmail: string
 *  customerPhone: string
 *  createdAt: Date
 *  customerName: string
 *  customerAddress: string
 *  priceBeforeDiscount: number
 *  totalPrice: number
 *  voucherCode: string
 *  status: string
 * }
*/
const getSalesById = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM sales  WHERE id=?', [id]);
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getSalesById = getSalesById;
/**
 *
 * @param fastify
 * @param data {
 *  name: string
 *  email: string
 *  address: string
 *  phone: string
 *  priceBeforeDiscount: number
 *  totalPrice: number
 *  voucherCode: string
 *  status: string
 *  items: Array<{ productId: number, quantity: number, price: number, size: string, color: string }>
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const addSales = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    //sample items
    //       "items": [
    //     { "productId": 1, "quantity": 2, "unitPrice": 20.00... },
    //     { "productId": 3, "quantity": 1, "unitPrice": 50.00... }
    //   ]
    try {
        const [result] = await connection.execute(`INSERT INTO sales 
            (customerEmail, customerPhone, customerName, customerAddress, priceBeforeDiscount, totalPrice, voucherCode, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [data.email, data.phone, data.name, data.address, data.priceBeforeDiscount ?? 0, data.totalPrice, data.voucherCode || null, data.status]);
        const saleId = result.insertId;
        for (const item of data.items) {
            await connection.execute(`INSERT INTO salesItems (salesId, productId, quantity, price, size, color)
                VALUES (?, ?, ?, ?)`, [saleId, item.productId, item.quantity, item.price, item.size, item.color]);
        }
        res = {
            code: 201,
            message: `Sales created successfully. Created sales ID: ${saleId}`
        };
    }
    catch (err) {
        console.error(err);
        res = {
            code: 500,
            message: "Internal Server Error."
        };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.addSales = addSales;
/**
 *
 * @param fastify
 * @param id
 * @returns {
 *    id: number
 *    customerName: string
 *    customerEmail: string
 *    customerPhone: string
 *    customerAddress: string
 *    priceBeforeDiscount: number
 *    totalPrice: number
 *    voucherCode: string
 *    status: string
 *    items: Array<{
 *          salesItemId: number
 *          productId: number
 *          productName: string
 *          quantity: number
 *          price: number
 *          size: string
 *          color: string
 *         }>
 *   code: number,
 *   message: string,
 *   If no sale found, returns:
 *  {
 *     code: 500,
 *      message: "Internal Server Error."
 *   }
 * }
 */
const getSalesDetailsById = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    let sale;
    try {
        const [rows] = await connection.query(`SELECT 
         s.id AS saleId,
         s.customerName,
         s.customerEmail,
         s.customerPhone,
         s.customerAddress,
         s.priceBeforeDiscount,
         s.totalPrice,
         s.voucherCode,
         s.status,
         si.id AS salesItemId,
         si.productId,
         p.name AS productName,
         si.quantity,
         si.price
       FROM sales s
       LEFT JOIN salesItems si ON si.salesId = s.id
       LEFT JOIN products p ON p.id = si.productId
       WHERE s.id = ?`, [id]);
        if (rows.length === 0) {
            res = {
                code: 500,
                message: "Internal Server Error."
            };
        }
        sale = {
            id: rows[0].saleId,
            customerName: rows[0].customerName,
            customerEmail: rows[0].customerEmail,
            customerPhone: rows[0].customerPhone,
            customerAddress: rows[0].customerAddress,
            priceBeforeDiscount: rows[0].priceBeforeDiscount,
            totalPrice: rows[0].totalPrice,
            voucherCode: rows[0].voucherCode,
            status: rows[0].status,
            items: rows.map(row => ({
                salesItemId: row.salesItemId,
                productId: row.productId,
                productName: row.productName,
                quantity: row.quantity,
                price: row.price,
                size: row.size,
                color: row.color
            }))
        };
        return sale;
    }
    catch (err) {
        console.error(err);
        res = {
            code: 500,
            message: "Internal Server Error."
        };
    }
    finally {
        connection.release();
        return sale;
    }
};
exports.getSalesDetailsById = getSalesDetailsById;
/**
 *
 * @param fastify
 * @param data {
 *  id: number
 *  status: string
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const updateSalesStatus = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute('UPDATE sales SET status=? WHERE id=?', [data.status, data.id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Sales status updated.`
        } : {
            code: 500,
            message: "Internal Server Error."
        };
    }
    catch (err) {
        console.error(err);
        res = {
            code: 500,
            message: "Internal Server Error."
        };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.updateSalesStatus = updateSalesStatus;
//# sourceMappingURL=sales.js.map