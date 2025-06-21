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
export const getAllConfig = async (fastify: FastifyInstance) => {
    const connection = await fastify['mysql'].getConnection();
    let value: any;

    try {
        const [rows] = await connection.query('SELECT * FROM frontendConfiguration ORDER BY sequence ASC');

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
export const addConfig = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [rows] = await connection.query('SELECT name FROM frontendConfiguration WHERE name=?', [data.name]);

        if (rows && rows.length > 0) {
            res = {
                code: 409,
                message: 'Configuration existed.'
            }
            return res;
        }

        const [result] = await connection.execute('INSERT INTO frontendConfiguration (name,value,sequence) VALUES (?,?,?)',
            [data.name, data.value, data.sequence]);

        res = result?.insertId ? {
            code: 201,
            message: `Cpnfiguration added.`,
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
export const updateConfig = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [result] = await connection.execute('UPDATE frontendConfiguration SET name=?, value=?, sequence=? WHERE id=?',
            [data.name, data.value, data.sequence, data.id]);

        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Configuration updated.`
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
 * @param id number
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const deleteConfig = async (fastify: FastifyInstance, id: number) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };

    try {
        const [result] = await connection.execute(`DELETE FROM frontendConfiguration WHERE id = ?`, [id]);

        res = result.affectedRows > 0
            ? { code: 204, message: "Configuration deleted." }
            : { code: 404, message: "Configuration not found." }

    } catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    } finally {
        connection.release();
        return res;
    }
}