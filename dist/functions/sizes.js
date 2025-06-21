"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizeDetailsById = exports.deleteSizes = exports.updateSizes = exports.createSizes = exports.getAllSizes = void 0;
/**
 *
 * @param fastify
 * @returns {
 *  id: number
 *  name: string
 *  value: string
 *  sequence: number
 *  createdAt: Date
 *  updatedAt: Date
 *  isActive: Boolean
 *  isDeleted: Boolean
 * }
*/
const getAllSizes = async (fastify) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM sizes ORDER BY sequence ASC'); //assuming sequence 1=S, 2=M, 3=L, 4=XL, 5=XXL, 6=FREE SIZE
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllSizes = getAllSizes;
/**
 *
 * @param fastify
 * @param data {
 *  name: string
 *  value: string
 *  sequence: number
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const createSizes = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [rows] = await connection.query('SELECT id FROM sizes WHERE name=?', [data.name]);
        if (rows && rows.length > 0) {
            res = {
                code: 409,
                message: 'Size category existed.'
            };
            return res;
        }
        const [result] = await connection.execute('INSERT INTO sizes (name,value,sequence) VALUES (?,?,?)', [data.name, data.value, data.sequence]);
        res = result?.insertId ? {
            code: 201,
            message: `Size created. Created size Id: ${result.insertId}`
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
exports.createSizes = createSizes;
/**
 *
 * @param fastify
 * @param data {
 *  id: number
 *  name: string
 *  value: string
 *  sequence: number
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const updateSizes = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute('UPDATE sizes SET name=?, value=?, sequence=? WHERE id=?', [data.name, data.value, data.sequence, data.id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Size updated.`
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
exports.updateSizes = updateSizes;
/**
 *
 * @param fastify
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const deleteSizes = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [checkRows] = await connection.query(`SELECT COUNT(*) AS productCount FROM productsSizes WHERE sizeId = ?`, [id]);
        if (checkRows && checkRows[0].productCount > 0) {
            res = {
                code: 400,
                message: "Cannot delete. This size is still assigned to products."
            };
            return res;
        }
        const [deleteSizeMapping] = await connection.execute(`DELETE FROM productsSizes WHERE sizeId = ?`, [id]);
        const [result] = await connection.execute(`DELETE FROM sizes WHERE id = ?`, [id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Size deleted.`
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
exports.deleteSizes = deleteSizes;
/**
 *
 * @param fastify
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const getSizeDetailsById = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query(`SELECT * from sizes WHERE sizeId = ?`, [id]);
        value = rows;
    }
    catch (err) {
        console.error(err);
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getSizeDetailsById = getSizeDetailsById;
//# sourceMappingURL=sizes.js.map