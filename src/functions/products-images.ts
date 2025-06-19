import { FastifyInstance } from "fastify";
import { pipeline } from "node:stream/promises";
import fs from 'node:fs';
import { imagesFolder, removeImageFile } from "../helpers/image.helper";

/**
 * 
 * @param fastify 
 * @param id
 * @param images (AsyncIterableIterator<fastifyMultipart.MultipartFile>)
 * @returns {
 *  code: number,
 *  message: string,
 * }
 **/
export const uploadProductsImages = async (fastify: FastifyInstance, id: number, images: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const imgs: any[] = [];
        const [products] = await connection.query('SELECT p.id, p.name, p.code, MAX(pi.sequence) AS sequence FROM products p LEFT JOIN productsImages pi ON pi.productId = p.id WHERE p.id=? GROUP BY p.id, p.name, p.code', [id]);

        if (!products || products.length === 0) {
            res = {
                code: 400,
                message: "Product not found."
            };
            return;
        }

        let sequence = products[0].sequence ? products[0].sequence : 0;
        for await (const i of images) {
            if (i.type === 'file') {
                const path = `${imagesFolder}/products/${products[0].name}`;
                const type = i.filename.split('.');
                sequence += 1;

                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }

                pipeline(i.file, fs.createWriteStream(`${path}/${products[0].code}-${sequence}.${type[type.length - 1].toLowerCase()}`, { highWaterMark: 10 * 1024 * 1024 }))
                imgs.push({
                    sequence,
                    type: type[type.length - 1].toLowerCase(),
                    isMocked: 0,
                });
            }
        }

        let sql = "INSERT INTO productsImages (productId, imageUrl, sequence, type) VALUES ";
        for (const p of imgs) {
            const imageUrl = formatImageUrl(products[0].name, products[0].code, p.sequence, p.type);

            sql += `(${products[0].id},'${imageUrl}',${p.sequence},'${p.type}'),`;
        }

        sql = sql.replaceAll("'null'", "null");
        sql = sql.replaceAll("'undefined'", "null");
        sql = sql.substring(0, sql.length - 1);
        const [result] = await connection.execute(sql);
        res = result?.affectedRows > 0 ? {
            code: 201,
            message: `Product images uploaded.`
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
 *  productId: number
 *  imageUrls: string[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const removeProductsImages = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [rows] = await connection.query(
            `SELECT pi.*, p.name, p.code
            FROM productsImages pi
            JOIN products p ON p.id = pi.productId
            WHERE pi.productId = ?`,
            [data.productId]
        );
        if (!rows || rows.length === 0) {
            res = {
                code: 400,
                message: 'Product images not found.'
            }
            return;
        }

        const removed: number[] = [];
        for (const row of rows) {
            const url = formatImageUrl(row.name, row.code, row.sequence, row.type);
            if (data.imageUrls.find((x: string) => x === url)) {
                removeImageFile(`products/${row.name}`, `${row.code}-${row.sequence}.${row.type}`);
                removed.push(row.sequence);
            }
        }

        let args = '';
        for (const id of removed) {
            args = args.concat(`${id},`);
        }

        args = args.substring(0, args.length - 1);
        const [result] = await connection.execute(`DELETE FROM productsImages WHERE productId = ${data.productId} AND sequence IN (${args})`);
        res = result?.affectedRows > 0 ? {
            code: 204,
            message: "Product images removed."
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

export const formatImageUrl = (name: string, code: string, sequence: number, type: string) => {
    return encodeURI(`https://maahstud.com/images/products/${name}/${code}-${sequence}.${type}`);
}