import { FastifyInstance } from "fastify";

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
export const getAllSizes = async (fastify: FastifyInstance) => {
    const connection = await fastify['mysql'].getConnection();
    let value: any;

    try {
        const [rows] = await connection.query('SELECT * FROM sizes ORDER BY sequence ASC'); //assuming sequence 1=S, 2=M, 3=L, 4=XL, 5=XXL, 6=FREE SIZE

        value = rows
    }
    finally {
        connection.release();
        return value;
    }
}

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
export const createSizes = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [rows] = await connection.query('SELECT id FROM sizes WHERE name=?', [data.name]);

        if (rows && rows.length > 0) {
            res = {
                code: 409,
                message: 'Size category existed.'
            }
            return res;
        }

        const [result] = await connection.execute('INSERT INTO sizes (name,value,sequence) VALUES (?,?,?)',
            [data.name, data.value, data.sequence]);

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
}

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
export const updateSizes = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [result] = await connection.execute('UPDATE sizes SET name=?, value=?, sequence=? WHERE id=?',
            [data.name, data.value, data.sequence, data.id]);

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
}

/**
 * 
 * @param fastify 
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const deleteSizes = async (fastify: FastifyInstance, id: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [checkRows] = await connection.query(
            `SELECT COUNT(*) AS productCount FROM productsSizes WHERE sizeId = ?`,
            [id]
        );

        if (checkRows && checkRows[0].productCount > 0) {
            res = {
                code: 400,
                message: "Cannot delete. This size is still assigned to products."
            };
            return res;
        }

        const [deleteSizeMapping] = await connection.execute(
            `DELETE FROM productsSizes WHERE sizeId = ?`,
            [id]
        );

        const [result] = await connection.execute(
            `DELETE FROM sizes WHERE id = ?`,
            [id]
        );

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
}

/**
 * 
 * @param fastify 
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const getSizeDetailsById = async (fastify: FastifyInstance, id: any) => {
    const connection = await fastify['mysql'].getConnection();
    let value: any;

    try {
        const [rows] = await connection.query(
            `SELECT * from sizes WHERE sizeId = ?`,
            [id]
        );
        value = rows;
    }
    catch (err) {
        console.error(err);
    }
    finally {
        connection.release();
        return value;
    }
}