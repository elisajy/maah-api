"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProduct = exports.updateProduct = exports.removeColorsForProduct = exports.removeSizesForProduct = exports.removeCategoriesForProduct = exports.assignProductToSizes = exports.assignProductToColors = exports.assignProductToCategories = exports.setSoldOutStatus = exports.addProduct = void 0;
const helpers_1 = require("../helpers");
/**
 *
 * @param fastify
 * @param data {
 *  name: string
 *  code: string
 *  description: string
 *  price: number
 *  remarks: string
 *  sequence: number
 *
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const addProduct = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    // let sizeStr = null;
    // let finishStr = null;
    try {
        let checkSql = `SELECT id FROM products WHERE name = \'${data.name}\' AND code = \'${data.code}\';`;
        const [rows] = await connection.query(checkSql);
        if (rows && rows.length > 0) {
            if (rows[0].id) {
                res = {
                    code: 409,
                    message: 'Product with the same name and code existed.'
                };
                return;
            }
        }
        let sql = "INSERT INTO products (name,code,productDescription,sequence,remarks,price) VALUES ";
        sql += `('${data.name}','${data.code}','${data.description}','${data.sequence}','${data.remarks}',${data.price});`;
        // result
        // {
        //      fieldCount, affectedRows, insertId, info, serverStatus, warningStatus, changesRows
        // }
        const [result] = await connection.execute(sql);
        // // Assign categories
        // if (data.categories && data.categories.length > 0) {
        //     await assignProductToCategories(fastify, { productId: result.insertId, categories: data.categories });
        // }
        // // Assign colors
        // if (data.tags && data.tags.length > 0) {
        //     await assignProductToTags(fastify, { productId: result.insertId, tags: data.tags });
        // }
        res = result?.insertId ? {
            code: 201,
            message: `Product created. Created product Id: ${result.insertId}`,
            id: result?.insertId,
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
exports.addProduct = addProduct;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  isSoldOut: boolean
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
*/
const setSoldOutStatus = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [result] = await connection.execute('UPDATE products SET soldOut = ? WHERE id = ?', [data.soldOut ? 1 : 0, data.productId]);
        res = result.affectedRows > 0
            ? { code: 204, message: "Product sold out status updated." }
            : { code: 404, message: "Product not found." };
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
exports.setSoldOutStatus = setSoldOutStatus;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  categories: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
*/
const assignProductToCategories = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [existingRows] = await connection.query('SELECT categoryId FROM productsCategories WHERE productId = ?', [data.productId]);
        const existingCategoryIds = existingRows.map((row) => row.categoryId);
        const newCategories = data.categories.filter((id) => !existingCategoryIds.includes(id));
        if (newCategories.length > 0) {
            const values = newCategories.map((categoryId) => [data.productId, categoryId]);
            const [result] = await connection.query('INSERT INTO productsCategories (productId, categoryId) VALUES ?', [values]);
            res = result?.affectedRows > 0 ? {
                code: 201,
                message: "Product categories assigned."
            } : {
                code: 500,
                message: "Internal Server Error."
            };
        }
        else {
            res = {
                code: 200,
                message: "No new categories to assign."
            };
        }
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
exports.assignProductToCategories = assignProductToCategories;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  colors: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const assignProductToColors = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [existing] = await connection.query('SELECT colorId FROM productColors WHERE productId = ?', [data.productId]);
        const existingIds = existing.map((row) => row.colorId);
        const newColors = data.colors.filter((id) => !existingIds.includes(id));
        if (newColors.length === 0) {
            res = { code: 200, message: "No new colors to assign." };
        }
        else {
            const values = newColors.map((colorId) => [data.productId, colorId]);
            const [result] = await connection.query('INSERT INTO productColors (productId, colorId) VALUES ?', [values]);
            res = result?.affectedRows > 0
                ? { code: 201, message: "Product Colors assigned." }
                : { code: 500, message: "Internal Server Error." };
        }
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
exports.assignProductToColors = assignProductToColors;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  sizes: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const assignProductToSizes = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [existing] = await connection.query('SELECT sizeId FROM productsSizes WHERE productId = ?', [data.productId]);
        const existingIds = existing.map((row) => row.sizeId);
        const newSizes = data.sizes.filter((id) => !existingIds.includes(id));
        if (newSizes.length === 0) {
            res = { code: 200, message: "No new sizes to assign." };
        }
        else {
            const values = newSizes.map((sizeId) => [data.productId, sizeId]);
            const [result] = await connection.query('INSERT INTO productsSizes (productId, sizeId) VALUES ?', [values]);
            res = result?.affectedRows > 0
                ? { code: 201, message: "Product Sizes assigned." }
                : { code: 500, message: "Internal Server Error." };
        }
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
exports.assignProductToSizes = assignProductToSizes;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  categories: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
*/
const removeCategoriesForProduct = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        if (data.categories.length === 0) {
            res = { code: 400, message: "No categories provided." };
            return res;
        }
        const args = data.categories.join(',');
        const sql = `
            DELETE FROM productsCategories
            WHERE productId = ? AND categoryId IN (${args})
        `;
        const [result] = await connection.execute(sql, [data.productId]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: "Selected categories removed from product."
        } : {
            code: 500,
            message: "No categories were removed."
        };
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
exports.removeCategoriesForProduct = removeCategoriesForProduct;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  sizes: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const removeSizesForProduct = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        if (!data.sizes || data.sizes.length === 0) {
            res = { code: 400, message: "No sizes provided." };
            return res;
        }
        const args = data.sizes.map(() => '?').join(',');
        const sql = `
            DELETE FROM productsSizes
            WHERE productId = ? AND sizeId IN (${args})
        `;
        const params = [data.productId, ...data.sizes];
        const [result] = await connection.execute(sql, params);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: "Product sizes removed."
        } : {
            code: 500,
            message: "No sizes were removed."
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
exports.removeSizesForProduct = removeSizesForProduct;
/**
 *
 * @param fastify
 * @param data {
 *  productId: number
 *  colors: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const removeColorsForProduct = async (fastify, data) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        if (!data.colors || data.colors.length === 0) {
            res = { code: 400, message: "No colors provided." };
            return res;
        }
        const args = data.colors.map(() => '?').join(',');
        const sql = `
            DELETE FROM productColors
            WHERE productId = ? AND colorId IN (${args})
        `;
        const params = [data.productId, ...data.colors];
        const [result] = await connection.execute(sql, params);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: "Product colors removed."
        } : {
            code: 500,
            message: "No colors were removed."
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
exports.removeColorsForProduct = removeColorsForProduct;
/**
 *
 * @param fastify
 * @param data {
 *  id: number
 *  name: string
 *  code: string
 *  description: string
 *  isSoldOut: boolean
 *  colors: number[]
 *  price: number
 *  remarks: string
 *  sizes: number[]
 *  categories: number[]
 *  sequence: number
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
*/
const updateProduct = async (fastify, data) => {
    // to update product's size, colors and categories at once
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(`
            UPDATE products SET 
                name=?, code=?, productDescription=?, price=?, remarks=?, isSoldOut=?, sequence=?
            WHERE id=?
        `, [
            data.name || null,
            data.code || null,
            data.description || null,
            data.price || null,
            data.remarks || null,
            data.isSoldOut || false,
            data.sequence || null,
            data.id
        ]);
        if (!result || result.affectedRows === 0) {
            throw new Error('Product not found or update failed.');
        }
        await connection.execute(`DELETE FROM productsCategories WHERE productId=?`, [data.id]);
        if (data.categories && data.categories.length > 0) {
            const catValues = data.categories.map((cid) => [data.id, cid]);
            await connection.query(`INSERT INTO productsCategories (productId, categoryId) VALUES ?`, [catValues]);
        }
        await connection.execute(`DELETE FROM productColors WHERE productId=?`, [data.id]);
        if (data.colors && data.colors.length > 0) {
            const colorValues = data.colors.map((colorId) => [data.id, colorId]);
            await connection.query(`INSERT INTO productColors (productId, colorId) VALUES ?`, [colorValues]);
        }
        await connection.execute(`DELETE FROM productsSizes WHERE productId=?`, [data.id]);
        if (data.sizes && data.sizes.length > 0) {
            const sizeValues = data.sizes.map((sizeId) => [data.id, sizeId]);
            await connection.query(`INSERT INTO productsSizes (productId, sizeId) VALUES ?`, [sizeValues]);
        }
        await connection.commit();
        res = { code: 204, message: 'Product updated.' };
    }
    catch (err) {
        await connection.rollback();
        console.error(err);
        res = { code: 500, message: 'Internal Server Error.' };
    }
    finally {
        connection.release();
        return res;
    }
};
exports.updateProduct = updateProduct;
/**
 *
 * @param fastify
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
const removeProduct = async (fastify, id) => {
    const connection = await fastify['mysql'].getConnection();
    let res = { code: 200, message: "OK." };
    try {
        const [images] = await connection.query('SELECT * FROM productsImages WHERE productId=?', [id]);
        for (const i of images) {
            (0, helpers_1.removeImageFile)(`products/${i.productName}`, `${i.productCode}-${i.sequence}.${i.type}`);
        }
        await connection.execute('DELETE FROM productsCategories WHERE productId=?', [id]);
        await connection.execute('DELETE FROM productColors WHERE productId=?', [id]);
        await connection.execute('DELETE FROM productsSizes WHERE productId=?', [id]);
        await connection.execute('DELETE FROM setItems WHERE setId=? OR productId=?', [id, id]);
        await connection.execute('DELETE FROM productsImages WHERE productId=?', [id]);
        await connection.execute('DELETE FROM sales WHERE productId=?', [id]);
        const [result] = await connection.execute('DELETE FROM products WHERE id=?', [id]);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: `Product deleted.`
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
exports.removeProduct = removeProduct;
// /**
//  *
//  * @param fastify
//  * @returns {
//  *  id: number
//  *  name: string
//  *  code?: string
//  *  description?: string
//  *  remarks?: string
//  *  price?: number
//  *  isSoldOut?: boolean
//  *  sequence?: number
//  *  createdAt: Date
//  *  images: string[]
//  *  categories: {
//  *      categoryId: number,
//  *      productId: number,
//  *      name: string
//  *  }[]
//  * }
// */
// export const getProducts = async (fastify: FastifyInstance) => {
//     const connection = await fastify['mysql'].getConnection();
//     let value: any = [];
//     try {
//         const [rows] = await connection.execute(`
//                 SELECT id, name, productDescription, price, remarks, sequence, code, createdAt, updatedAt, isSoldOut
//                 FROM products
//                 ORDER BY updatedAt DESC
//             `);
//         if (rows.length > 0) {
//             const productIds: number[] = rows.map((x: any) => x.id);
//             const args = productIds.join(',');
//             const [images] = await connection.query(`
//                 SELECT * FROM productsImages WHERE productId IN (${args}) ORDER BY productId
//             `);
//             // categories
//             const [categories] = await connection.query(`
//                 SELECT pc.categoryId, pc.productId, c.name
//                 FROM productsCategories pc
//                 JOIN categories c ON c.id = pc.categoryId
//                 WHERE pc.productId IN (${args}) ORDER BY productId
//             `);
//             value = rows.map((x: any) => {
//                 const imgs = images.filter((y: any) => y.productId === x.id);
//                 const imgList = imgs.map((z: any) => formatImageUrl(z.productName, z.productCode, z.sequence, z.type));
//                 const prdCats = categories.filter((y: any) => y.productId === x.id);
//                 const categoryList = prdCats.length > 0 ? prdCats : [];
//                 return {
//                     id: x.id,
//                     name: x.name,
//                     description: x.productDescription,
//                     price: x.price,
//                     remarks: x.remarks,
//                     sequence: x.sequence,
//                     isSoldOut: x.isSoldOut,
//                     code: x.code,
//                     createdAt: x.createdAt,
//                     images: imgList,
//                     categories: categoryList,
//                 }
//             });
//         }
//     }
//     catch (err) {
//         console.error(err);
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
//  *  code?: string
//  *  description?: string
//  *  variation?: string
//  *  color?: string
//  *  colorId?: number
//  *  size?: number
//  *  sequence?: number
//  *  images: string[]
//  *  categories: number[] (id)
//  * }
// */
// export const getProductDetailsById = async (fastify: FastifyInstance, id: number) => {
//     const connection = await fastify['mysql'].getConnection();
//     let value: any;
//     try {
//         const [rows] = await connection.query(`
//             SELECT DISTINCT p.id, p.name, p.productDescription, p.price, p.remarks, p.sequence, p.code, p.isSoldOut, p.createdAt, p.updatedAt
//             FROM products p
//             WHERE p.id = ?
//         `, [id]);
//         if (!rows || rows.length === 0) {
//             return null;
//         }
//         const product = rows[0];
//         const [images] = await connection.query(`
//             SELECT id AS imageId, imageUrl, thumbnail
//             FROM productsImages
//             WHERE productId = ?
//         `, [id]);
//         const imageList = images.map((img: any) => ({
//             id: img.imageId,
//             url: formatImageUrl(img.productName, img.productCode, img.sequence, img.type),
//             alt: `${product.name} Image ${img.sequence}`
//         }));
//         const [colors] = await connection.query(`
//             SELECT c.id AS colorId, c.name AS color, c.value AS hexCode
//             FROM productColors pc
//             JOIN colors c ON c.id = pc.colorId
//             WHERE pc.productId = ?
//         `, [id]);
//         const colorOptions = colors.map((c: any) => ({
//             id: c.colorId,
//             name: c.color,
//             value: c.hexCode
//         }));
//         const [sizes] = await connection.query(`
//             SELECT s.id AS sizeId, s.name AS sizeName, s.value AS sizeValue
//             FROM productsSizes ps
//             JOIN sizes s ON s.id = ps.sizeId
//             WHERE ps.productId = ?
//         `, [id]);
//         const sizeOptions = sizes.map((s: any) => ({
//             id: s.sizeId,
//             name: s.sizeName,
//             value: s.sizeValue
//         }));
//         value = {
//             id: product.id,
//             name: product.name,
//             price: `RM ${product.price.toFixed(2)}`,
//             description: product.productDescription,
//             images: imageList,
//             colorOptions,
//             sizeOptions
//         };
//     }
//     catch (err) {
//         console.error(err);
//     }
//     finally {
//         connection.release();
//         return value;
//     }
// }
//# sourceMappingURL=products.js.map