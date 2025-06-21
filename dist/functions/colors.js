"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColors = exports.updateColors = exports.createColors = exports.getColorDetailsById = exports.getAllColors = void 0;
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
const getAllColors = async (fastify) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM colors ORDER BY sequence ASC');
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllColors = getAllColors;
/**
 *
 * @param fastify
 * @param id
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
const getColorDetailsById = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM colors WHERE id=?', [id]);
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getColorDetailsById = getColorDetailsById;
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
const createColors = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [rows] = await connection.query('SELECT id FROM colors WHERE name=?', [data.name]);
        if (rows && rows.length > 0) {
            res = {
                code: 409,
                message: 'Color existed.'
            };
            return res;
        }
        const [result] = await connection.execute('INSERT INTO colors (name,value,sequence) VALUES (?,?,?)', [data.name, data.value, data.sequence]);
        res = result?.insertId ? {
            code: 201,
            message: `Color created. Created color Id: ${result.insertId}`
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
exports.createColors = createColors;
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
const updateColors = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute('UPDATE colors SET name=?, value=?, sequence=? WHERE id=?', [data.name, data.value, data.sequence, data.id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Color updated.`
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
exports.updateColors = updateColors;
/**
 *
 * @param fastify
 * @param data {
 *  name: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const deleteColors = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [checkRows] = await connection.query(`SELECT COUNT(*) AS productCount FROM productColors WHERE colorId = ?`, [data.id]);
        if (checkRows && checkRows[0].productCount > 0) {
            res = {
                code: 400,
                message: "Cannot delete. This color is still assigned to products."
            };
            return res;
        }
        // const [deleteMapping] = await connection.execute(
        //     `DELETE FROM productColors WHERE colorId = ?`,
        //     [data.id]
        // );
        const [deleteColor] = await connection.execute(`DELETE FROM colors WHERE id = ?`, [data.id]);
        res = deleteColor?.affectedRows > 0 ?
            {
                code: 204,
                message: `Color deleted successfully.`
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
exports.deleteColors = deleteColors;
//# sourceMappingURL=colors.js.map