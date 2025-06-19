import { FastifyInstance } from "fastify";

/**
 * 
 * @param fastify 
 * @returns {
 *  code: number,
 *  message: string,
 *  data?: {
 *    id: number,
 *    name: string,
 *    description: string,
 *    price: number,
 *    items: number[]
 *  }[]
 * }
 */
export const getAllSets = async (fastify: FastifyInstance) => {
    const connection = await fastify['mysql'].getConnection();
    let res: {
        code: number,
        message: string,
        data?: any[]
    } = { code: 200, message: "OK" };

    try {
        //only basic set information is fetched
        const [sets] = await connection.query(
            'SELECT id, name, description, price FROM sets ORDER BY name ASC'
        );

        if (!sets || sets.length === 0) {
            res = { code: 404, message: "No sets found." };
            return res;
        }

        const setIds = sets.map((s: any) => s.id);

        const [items] = await connection.query(
            'SELECT setId, productId FROM setItems WHERE setId IN (?)',
            [setIds]
        );

        const itemMap: Record<number, number[]> = {};
        items.forEach((item: any) => {
            if (!itemMap[item.id]) {
                itemMap[item.id] = [];
            }
            itemMap[item.id].push(item.productId);
        });

        const result = sets.map((set: any) => ({
            id: set.id,
            name: set.name,
            description: set.description,
            price: Number(set.price),
            items: itemMap[set.id] || []
        }));

        res = {
            code: 200,
            message: "Success",
            data: result
        };
    } catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    } finally {
        connection.release();
        return res;
    }
}

/**
 * 
 * @param fastify 
 *  @param data { 
 *  setId: string
 *  productId: string
 * }
 * @returns {
 *  code: number,
 *  message: string
 * }
 */
export const updateSetThumbnail = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: {
        code: number,
        message: string,
    } = { code: 200, message: "OK" };

    try {
        const productId = data.productId;

        const [targetSetItems] = await connection.query(
            'SELECT setId FROM setItems WHERE productId = ?',
            [productId]
        );

        if (!targetSetItems || targetSetItems.length === 0) {
            res = { code: 404, message: "This product is not in any set." };
            return res;
        }

        for (const { setId } of targetSetItems) {
            await connection.execute(
                'UPDATE setItems SET thumbnail = FALSE WHERE setId = ?',
                [setId]
            );

            await connection.execute(
                'UPDATE setItems SET thumbnail = TRUE WHERE setId = ? AND productId = ?',
                [setId, productId]
            );
        }

        res = {
            code: 200,
            message: "Success",
        };
    } catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    } finally {
        connection.release();
        return res;
    }
}

/**
 * 
 * @param fastify 
 * @param data { 
 *  name: string
 *  description: string
 *  price: number
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const createSetsWithoutProduct = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {

        const [result] = await connection.execute(
            'INSERT INTO sets (name, description, price) VALUES (?, ?, ?)',
            [data.name, data.description, data.price]
        );

        const setId = result?.insertId;

        if (!setId) {
            res = { code: 500, message: `Failed to insert set.` };
            return res;
        }

        res = {
            code: 201,
            message: `Set created. Created Set Id: ${setId}`
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
}

/**
 * 
 * @param fastify 
 * @param data { 
 *  name: string
 *  description: string
 *  price: number
 *  items: number[]  // product ids
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const createSetsWithProducts = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute(
            'INSERT INTO sets (name, description, price) VALUES (?, ?, ?)',
            [data.name, data.description, data.price]
        );

        const setId = result?.insertId;

        if (!setId) {
            await connection.rollback();
            res = { code: 500, message: `Failed to insert set.` };
            return res;
        }

        if (data.items && data.items.length > 0) {
            const values = data.items.map((productId: number) => [setId, productId]);

            await connection.query(
                'INSERT INTO setItems (setId, productId) VALUES ?',
                [values]
            );
        }

        await connection.commit();

        res = {
            code: 201,
            message: `Set created. Created Set Id: ${setId}`
        };
    }
    catch (err) {
        console.error(err);
        await connection.rollback();
        res = { code: 500, message: "Internal Server Error." };
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
 *  description: string
 *  price: number
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const updateSets = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        const [result] = await connection.execute(
            'UPDATE sets SET name=?, description=?, price=? WHERE id=?',
            [data.name, data.description, data.price, data.id]
        );

        res = result?.affectedRows > 0
            ? { code: 204, message: `Set updated.` }
            : { code: 500, message: "Failed to update set." };
    }
    catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
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
 *  setId: number
 *  items: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const updateSetItems = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        await connection.beginTransaction();

        if (data.items && data.items.length > 0) {
            const [existingRows]: any = await connection.query(
                'SELECT productId FROM setItems WHERE setId = ?',
                [data.setId]
            );
            const existingProductIds = existingRows.map((row: any) => row.productId);

            const newProductIds = data.items.filter(
                (productId: number) => !existingProductIds.includes(productId)
            );

            if (newProductIds.length > 0) {
                const insertValues = newProductIds.map((productId: number) => [data.setId, productId]);

                await connection.query(
                    'INSERT INTO setItems (setId, productId) VALUES ?',
                    [insertValues]
                );
            }
        }

        await connection.commit();
        res = { code: 204, message: "Set items updated." };
    }
    catch (err) {
        console.error(err);
        await connection.rollback();
        res = { code: 500, message: "Internal Server Error." };
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
 *   setId: number,
 *   items: number[]
 * }
 * @returns {
 *   code: number,
 *   message: string
 * }
 */
export const removeSetItems = async (fastify: FastifyInstance, data: any) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        await connection.beginTransaction();

        if (data.items && data.items.length > 0) {
            await connection.query(
                `DELETE FROM setItems 
                 WHERE setId = ? AND productId IN (?)`,
                [data.setId, data.items]
            );
        }

        await connection.commit();
        res = { code: 204, message: "Set items removed." };
    }
    catch (err) {
        console.error(err);
        await connection.rollback();
        res = { code: 500, message: "Internal Server Error." };
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
export const removeSet = async (fastify: FastifyInstance, id: number) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string } = { code: 200, message: "OK." };

    try {
        await connection.beginTransaction();

        await connection.execute(
            'DELETE FROM setItems WHERE id = ?',
            [id]
        );

        const [result] = await connection.execute(
            'DELETE FROM sets WHERE id = ?',
            [id]
        );

        await connection.commit();

        res = result?.affectedRows > 0
            ? { code: 204, message: `Set deleted.` }
            : { code: 404, message: "Set not found." };
    }
    catch (err) {
        console.error(err);
        await connection.rollback();
        res = { code: 500, message: "Internal Server Error." };
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
 *  data?: {
 *    id: number,
 *    name: string,
 *    description: string,
 *    price: number,
 *    items: ProductVariant[]
 *  }
 * }
 */
export const getSetsById = async (fastify: FastifyInstance, id: number) => {
    const connection = await fastify['mysql'].getConnection();
    let res: { code: number, message: string, data?: any } = { code: 200, message: "OK." };

    try {
        const [sets] = await connection.query(
            'SELECT id, name, description, price FROM sets WHERE id = ?',
            [id]
        );

        if (!sets || sets.length === 0) {
            return { code: 404, message: "Set not found." };
        }

        const set = sets[0];

        const [products] = await connection.query(
            `SELECT p.id, p.name, p.productDescription, p.price, p.isSoldOut, p.discountPrice, p.onSales, si.thumbnail
             FROM setItems si
             JOIN products p ON si.productId = p.id
             WHERE si.setId = ?`,
            [id]
        );

        const productIds = products.map((p: any) => p.id);
        if (productIds.length === 0) {
            return {
                code: 200,
                message: "Success",
                data: { ...set, items: [] }
            };
        }

        const [images] = await connection.query(
            `SELECT id, productId, imageUrl FROM productsImages WHERE productId IN (?)`,
            [productIds]
        );

        const [colors] = await connection.query(
            `SELECT pc.productId, c.id, c.name, c.value
                FROM productColors pc
                JOIN colors c ON pc.colorId = c.id
                WHERE pc.productId IN (?)`,
            [productIds]
        );

        const [sizes] = await connection.query(
            `SELECT ps.productId, s.id, s.name AS size, s.value AS sizeValue
                FROM productsSizes ps
                JOIN sizes s ON ps.sizeId = s.id
                WHERE ps.productId IN (?)`,
            [productIds]
        );

        const groupByProduct = (arr: any[], key: string) =>
            arr.reduce((acc, cur) => {
                if (!acc[cur[key]]) acc[cur[key]] = [];
                acc[cur[key]].push(cur);
                return acc;
            }, {} as Record<number, any[]>);

        const colorsMap = groupByProduct(colors, 'productId');
        const sizesMap = groupByProduct(sizes, 'productId');
        const imagesMap = groupByProduct(images, 'productId');

        let formattedProducts = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: `RM ${parseFloat(p.price).toFixed(2)}`,
            description: p.description,
            isSoldOut: !!p.isSoldOut, //to check if sold out
            isThumbnail: !!p.thumbnail, //to check if this product is the thumbnail
            discountPrice: `RM ${parseFloat(p.discountPrice).toFixed(2)}`,
            onSales: !!p.onSales, //to check whether to use discount price or not
            images: (imagesMap[p.id] || []).map((img: { id: string; imageUrl: string; }) => ({
                id: img.id,
                url: img.imageUrl
            })),
            colorOptions: (colorsMap[p.id] || []).map(c => ({
                id: c.name.toLowerCase().replace(/\s+/g, '-'),
                name: c.name,
                value: c.value
            })),
            sizeOptions: (sizesMap[p.id] || []).map(s => ({
                id: s.sizeValue,
                name: s.size,
                value: s.sizeValue
            }))
        }));

        const thumbIndex = formattedProducts.findIndex(p => p.setThumbnail);
        if (thumbIndex !== -1) {
            const [thumbProduct] = formattedProducts.splice(thumbIndex, 1);
            formattedProducts = [thumbProduct, ...formattedProducts];
        }

        res = {
            code: 200,
            message: "Success",
            data: {
                id: set.id,
                name: set.name,
                description: set.description,
                price: `RM ${parseFloat(set.price).toFixed(2)}`,
                items: formattedProducts
            }
        };
    } catch (err) {
        console.error(err);
        res = { code: 500, message: "Internal Server Error." };
    } finally {
        connection.release();
        return res;
    }
}
