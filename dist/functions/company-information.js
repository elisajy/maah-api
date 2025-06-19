"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyImg = exports.updateCompanyInfoByName = exports.getCompanyInfoByName = exports.getAllCompanyInfo = void 0;
const helpers_1 = require("../helpers");
/**
 *
 * @param fastify
 * @returns {
 *  id: number
 *  name: string
 *  value: string
 *  createdAt: Date
 *  updatedAt: Date
 *  isActive: Boolean
 *  isDeleted: Boolean
 * }
 */
const getAllCompanyInfo = async (fastify) => {
    const connection = await fastify["mysql"].getConnection();
    let value;
    try {
        const [rows] = await connection.query("SELECT * FROM companyInformation");
        value = rows;
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getAllCompanyInfo = getAllCompanyInfo;
/**
 *
 * @param fastify
 * @param name
 * @returns {
 *  id: number
 *  name: string
 *  value: string
 *  createdAt: Date
 *  updatedAt: Date
 *  isActive: Boolean
 *  isDeleted: Boolean
 * }
 */
const getCompanyInfoByName = async (fastify, name) => {
    const connection = await fastify["mysql"].getConnection();
    let value;
    try {
        const [rows] = await connection.query("SELECT * FROM companyInformation WHERE `name`=?", [name]);
        value = rows[0];
    }
    finally {
        connection.release();
        return value;
    }
};
exports.getCompanyInfoByName = getCompanyInfoByName;
/**
 *
 * @param fastify
 * @param data {
 *  key: string
 *  value: string
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const updateCompanyInfoByName = async (fastify, data) => {
    const connection = await fastify["mysql"].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute("UPDATE companyInformation SET value=? WHERE `name`=?", [data.value, data.name]);
        res =
            result?.affectedRows > 0
                ? {
                    code: 204,
                    message: `Company info - ${data.name} updated.`,
                }
                : {
                    code: 500,
                    message: "Internal Server Error.",
                };
    }
    catch (err) {
        console.error(err);
        res = {
            code: 500,
            message: "Internal Server Error.",
        };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.updateCompanyInfoByName = updateCompanyInfoByName;
/**
 *
 * @param fastify
 * @param name
 * @param image (AsyncIterableIterator<fastifyMultipart.MultipartFile>)
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const modifyImg = async (fastify, name, image) => {
    const connection = await fastify["mysql"].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [rows] = await connection.query("SELECT * FROM companyInformation WHERE name=?", [name]);
        if (!rows || rows.length === 0) {
            res = {
                code: 400,
                message: `Information not found.`,
            };
            return;
        }
        if (rows[0].value) {
            const oldFile = rows[0].value.split("/");
            (0, helpers_1.removeImageFile)(`home/${name}`, oldFile[oldFile.length - 1]);
        }
        (0, helpers_1.uploadImageFile)(`home/${name}`, image);
        const [result] = await connection.execute("UPDATE companyInformation SET value=? WHERE name=?", [(0, helpers_1.formatImageUrl)(`home/${name}`, image.filename), name]);
        res =
            result?.affectedRows > 0
                ? {
                    code: 201,
                    message: `${name} - image uploaded.`,
                }
                : {
                    code: 500,
                    message: "Internal Server Error.",
                };
    }
    catch (err) {
        console.error(err);
        res = {
            code: 500,
            message: "Internal Server Error.",
        };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.modifyImg = modifyImg;
//# sourceMappingURL=company-information.js.map