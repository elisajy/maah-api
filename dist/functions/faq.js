"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getAllFAQ = void 0;
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
const getAllFAQ = async (fastify) => {
    const connection = await fastify['mysql'].getConnection();
    let value;
    try {
        const [rows] = await connection.query('SELECT * FROM faq ORDER BY updatedAt DESC');
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllFAQ = getAllFAQ;
// /**
//  * 
//  * @param fastify 
//  * @returns {
// *  id: number
// *  question: string
// *  answer: string
// *  sequence: number
// *  sectionId: number
// *  sectionName: string
// *  createdAt: Date
// *  updatedAt: Date
// * }
// */
// export const getAllQuestions = async (fastify: FastifyInstance) => {
//     const connection = await fastify['mysql'].getConnection();
//     let value: any;
//     try {
//         const [rows] = await connection.query('SELECT fq.*, fs.name AS sectionName FROM faqQuestions fq join faqSections fs ON fq.sectionId = fs.id ORDER BY updatedAt DESC');
//         value = rows;
//     }
//     finally {
//         connection.release();
//         return value;
//     }
// }
// /**
//  * 
//  * @param fastify 
//  * @param id
//  * @returns {
//  *  id: number
//  *  name: string
//  *  sequence: number
//  *  createdAt: Date
//  *  updatedAt: Date
//  *  questions: any[]
//  * }
//  */
// export const getSectionDetailsById = async (fastify: FastifyInstance, id: number) => {
//     const connection = await fastify['mysql'].getConnection();
//     let value: any;
//     try {
//         const [rows] = await connection.query('SELECT * FROM faqSections WHERE id=?', [id]);
//         const [questions] = await connection.query('SELECT * FROM faqQuestions WHERE sectionId=?', [id]);
//         value = {
//             ...rows[0],
//             questions
//         };
//     }
//     finally {
//         connection.release();
//         return value;
//     }
// }
// /**
//  * 
//  * @param fastify 
//  * @param id 
//  * @returns {
//  *  id: number
//  *  question: string
//  *  answer: string
//  *  sequence: number
//  *  sectionId: number
//  *  sectionName: string
//  *  createdAt: Date
//  *  updatedAt: Date
//  * }
//  */
// export const getQuestionDetailsById = async (fastify: FastifyInstance, id: number) => {
//     const connection = await fastify['mysql'].getConnection();
//     let value: any;
//     try {
//         const [rows] = await connection.query('SELECT fq.*, fs.name AS sectionName FROM faqQuestions fq join faqSections fs ON fq.sectionId = fs.id WHERE fq.id=?', [id]);
//         value = rows[0];
//     }
//     finally {
//         connection.release();
//         return value;
//     }
// }
// /**
//  * 
//  * @param fastify 
//  * @param data { 
//  *  name: string
//  *  sequence: number
//  * }
//  * @returns {
//  *  code: number,
//  *  message: string,
//  * }
//  */
// export const createSection = async (fastify: FastifyInstance, data: any) => {
//     const connection = await fastify['mysql'].getConnection();
//     let res: { code: number, message: string } = { code: 200, message: "OK." };
//     try {
//         const [rows] = await connection.query('SELECT id FROM faqSections WHERE name=?', [data.name]);
//         if (rows && rows.length > 0) {
//             res = {
//                 code: 409,
//                 message: 'FAQ section existed.'
//             }
//             return;
//         }
//         const [result] = await connection.execute('INSERT INTO faqSections (name,sequence) VALUES (?,?)', [data.name, data.sequence]);
//         res = result?.insertId ? {
//             code: 201,
//             message: `FAQ section created. Created section Id: ${result.insertId}`
//         } : {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     catch (err) {
//         console.error(err);
//         res = {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     finally {
//         connection.release();
//         return res;
//     }
// }
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
const createFaq = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [rows] = await connection.query('SELECT id FROM faq WHERE name=?', [data.name]);
        if (rows && rows.length > 0) {
            res = {
                code: 409,
                message: 'FAQ existed.'
            };
            return res;
        }
        const [result] = await connection.execute('INSERT INTO faq (name,value,sequence) VALUES (?,?,?)', [data.name, data.value, data.sequence]);
        res = result?.insertId ? {
            code: 201,
            message: `FAQ created. Created question Id: ${result.insertId}`
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
exports.createFaq = createFaq;
// /**
//  * 
//  * @param fastify 
//  * @param data { 
//  *  id: number
//  *  name: string
//  *  sequence: number
//  * }
//  * @returns {
//  *  code: number,
//  *  message: string,
//  * }
//  */
// export const updateSection = async (fastify: FastifyInstance, data: any) => {
//     const connection = await fastify['mysql'].getConnection();
//     let res: { code: number, message: string } = { code: 200, message: "OK." };
//     try {
//         const [result] = await connection.execute('UPDATE faqSections SET name=?, sequence=? WHERE id=?',
//             [data.name, data.sequence, data.id]);
//         res = result?.affectedRows > 0 ? {
//             code: 204,
//             message: `FAQ section updated.`
//         } : {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     catch (err) {
//         console.error(err);
//         res = {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     finally {
//         connection.release();
//         return res;
//     }
// }
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
const updateFaq = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute('UPDATE faq SET name=?, value=?, sequence=? WHERE id=?', [data.name, data.value, data.sequence, data.id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `FAQ updated.`
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
exports.updateFaq = updateFaq;
// /**
//  * 
//  * @param fastify 
//  * @param id
//  * @returns {
//  *  code: number,
//  *  message: string,
//  * }
//  */
// export const deleteSection = async (fastify: FastifyInstance, id: number) => {
//     const connection = await fastify['mysql'].getConnection();
//     let res: { code: number, message: string } = { code: 200, message: "OK." };
//     try {
//         const [rows] = await connection.query('SELECT id FROM faqQuestions WHERE sectionId=?', [id]);
//         if (rows && rows.length > 0) {
//             res = {
//                 code: 409,
//                 message: 'There are FAQ questions under this section.'
//             }
//             return;
//         }
//         const [result] = await connection.execute('DELETE FROM faqSections WHERE id=?', [id]);
//         res = result?.affectedRows > 0 ? {
//             code: 204,
//             message: `FAQ section deleted.`
//         } : {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     catch (err) {
//         console.error(err);
//         res = {
//             code: 500,
//             message: "Internal Server Error."
//         };
//     }
//     finally {
//         connection.release();
//         return res;
//     }
// }
/**
 *
 * @param fastify
 * @param id number
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const deleteFaq = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute(`DELETE FROM faq WHERE id = ?`, [id]);
        res = result.affectedRows > 0
            ? { code: 204, message: "FAQ deleted." }
            : { code: 404, message: "FAQ not found." };
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
exports.deleteFaq = deleteFaq;
//# sourceMappingURL=faq.js.map