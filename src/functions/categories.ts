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
 * }
 */
export const getAllCategories = async (fastify: FastifyInstance) => {
  const connection = await fastify["mysql"].getConnection();
  let value: any;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    value = rows;
  } finally {
    connection.release();
    return value;
  }
};

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
 *  products: any[]
 * }
 */
export const getCategoryDetailsById = async (
  fastify: FastifyInstance,
  id: number
) => {
  const connection = await fastify["mysql"].getConnection();
  let value: any;

  try {
    // id = categoryId

    const [products] = await connection.execute(
      `
        SELECT 
            c.id AS categoryId,
            c.name AS categoryName,
            c.value AS categoryValue,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'productId', p.id,
                    'productName', p.name
                )
            ) AS products
        FROM 
            categories c
        LEFT JOIN 
            productsCategories pc ON pc.categoryId = c.id
        LEFT JOIN 
            products p ON p.id = pc.productId
        WHERE 
            c.id = ?
        GROUP BY 
            c.id;

    `,
      [id]
    );

    value = products[0]?.products ?? [];

  } finally {
    connection.release();
    return value;
  }
};

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
export const createCategory = async (fastify: FastifyInstance, data: any) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    const [rows] = await connection.query(
      "SELECT name, value FROM categories"
    );

    if (rows.find((x: any) => x.name === data.name && x.value === data.value)) {
      res = {
        code: 409,
        message: "Category existed.",
      };
      return;
    }

    const [result] = await connection.execute(
      "INSERT INTO categories (name,value,sequence) VALUES (?,?,?)",
      [data.name, data.value, data.sequence || null]
    );

    res = result?.insertId
      ? {
        code: 201,
        message: `Category created. Created category Id: ${result.insertId}`,
      }
      : {
        code: 500,
        message: "Internal Server Error.",
      };
  } catch (err) {
    console.error(err);
    res = {
      code: 500,
      message: "Internal Server Error.",
    };
  } finally {
    connection.release();
    return res;
  }
};

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
export const updateCategory = async (fastify: FastifyInstance, data: any) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    let sql = `UPDATE categories SET name='${data.name}', value='${data.value}', sequence='${data.sequence}' WHERE id=${data.id}`;
    // sql = sql.replaceAll("'null'", "null");
    // sql = sql.replaceAll("'undefined'", "null");
    const [result] = await connection.execute(sql);
    res =
      result?.affectedRows > 0
        ? {
          code: 204,
          message: `Category updated.`,
        }
        : {
          code: 500,
          message: "Internal Server Error.",
        };
  } catch (err) {
    console.error(err, data);
    res = {
      code: 500,
      message: "Internal Server Error.",
    };
  } finally {
    connection.release();
    return res;
  }
};

// /**
//  *
//  * @param fastify
//  * @param data {
//  *  mainCategoryId: number
//  *  subCategories: any[]
//  * }
//  * @returns {
//  *  code: number,
//  *  message: string,
//  * }
//  */
// export const addSubCategories = async (fastify: FastifyInstance, data: any) => {
//   const connection = await fastify["mysql"].getConnection();
//   let res: { code: number; message: string } = { code: 200, message: "OK." };

//   try {
//     const [rows] = await connection.query(
//       "SELECT name, description FROM categories;"
//     );

//     const subCategories =
//       data.subCategories && data.subCategories.length > 0
//         ? data.subCategories
//             .map((y: any) => {
//               return {
//                 name: y.name,
//                 description: y.description,
//               };
//             })
//             .filter(
//               (x: any) =>
//                 !rows.find(
//                   (z: any) =>
//                     z.name === x.name && z.description === x.description
//                 )
//             )
//         : [];

//     if (subCategories.length === 0) {
//       res = {
//         code: 409,
//         message: `All sub categories existed.`,
//       };
//       return;
//     }

//     let sql =
//       "INSERT INTO categories (name,description,mainCategoryId) VALUES ";
//     for (const category of subCategories) {
//       sql += `('${category.name}','${category.description}',${data.mainCategoryId}),`;
//     }
//     sql = sql.replaceAll("'null'", "null");
//     sql = sql.replaceAll("'undefined'", "null");
//     sql = sql.substring(0, sql.length - 1);

//     // Create sub-categories
//     const [result] = await connection.execute(sql);

//     res =
//       result?.affectedRows > 0
//         ? {
//             code: 204,
//             message: `Category updated.`,
//           }
//         : {
//             code: 500,
//             message: "Internal Server Error.",
//           };
//   } catch (err) {
//     console.error(err);
//     res = {
//       code: 500,
//       message: "Internal Server Error.",
//     };
//   } finally {
//     connection.release();
//     return res;
//   }
// };

// /**
//  * Summary
//  * Can check if there are products under the category, which might be sub-category
//  * Can check if there are products under the sub-category of the main category
//  * @param fastify
//  * @param id (mainCategoryId/categoryId)
//  * @returns boolean
//  */
// export const areProductsExistedUnderCategory = async (
//   fastify: FastifyInstance,
//   id: number
// ) => {
//   const connection = await fastify["mysql"].getConnection();
//   let value = false;

//   try {
//     const [rows] = await connection.query(
//       "SELECT id FROM productsCategories WHERE categoryId=?",
//       [id]
//     );
//     if (rows && rows.length > 0) value = true;

//     const [rows2] = await connection.query(
//       "SELECT pc.id FROM productsCategories pc JOIN categories c ON pc.categoryId = c.id WHERE c.mainCategoryId=?",
//       [id]
//     );
//     if (rows2 && rows2.length > 0) value = true;
//   } finally {
//     connection.release();
//     return value;
//   }
// };

/**
 *
 * @param fastify
 * @param id
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const deleteCategory = async (fastify: FastifyInstance, id: number) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    const checkSql = `
    SELECT COUNT(*) AS productCount
    FROM productsCategories
    WHERE categoryId = ?
  `;
    const [rows] = await connection.query(checkSql, [id]);

    if (rows && rows[0].productCount > 0) {
      res = {
        code: 400,
        message: "There are products under this category.",
      };
      return;
    }

    //   const deleteMappingSql = `
    //   DELETE FROM productsCategories WHERE categoryId = ?
    // `;
    //   await connection.query(deleteMappingSql, [id]);

    const deleteCategorySql = `
    DELETE FROM categories WHERE id = ?
  `;
    await connection.query(deleteCategorySql, [id]);

    res = {
      code: 200,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    res = {
      code: 500,
      message: "Internal server error.",
    };
  } finally {
    connection.release();
    return res;
  }
};

// /**
//  *
//  * @param fastify
//  * @param data {
//  *  categories: number[]
//  * }
//  * @returns {
//  *  code: number,
//  *  message: string,
//  * }
//  */
// export const deleteSubCategories = async (
//   fastify: FastifyInstance,
//   data: any
// ) => {
//   const connection = await fastify["mysql"].getConnection();
//   let res: { code: number; message: string } = { code: 200, message: "OK." };

//   try {
//     let args = "";
//     for (const id of data.categories) {
//       args = args.concat(`${id},`);
//     }

//     args = args.substring(0, args.length - 1);
//     const [rows] = await connection.query(
//       `SELECT categoryId FROM productsCategories WHERE categoryId IN (${args})`
//     );
//     const categories = data.categories.filter(
//       (id: number) => !rows.find((x: any) => x.categoryId === id)
//     );

//     if (categories.length === 0) {
//       res = {
//         code: 400,
//         message: "There are products under all the sub categories.",
//       };
//       return;
//     }

//     // DELETE categories
//     args = "";
//     for (const id of categories) {
//       args = args.concat(`${id},`);
//     }

//     args = args.substring(0, args.length - 1);
//     const [result] = await connection.execute(
//       `DELETE FROM categories WHERE id IN (${args})`
//     );
//     res =
//       result?.affectedRows > 0
//         ? {
//             code: 204,
//             message: "All sub categories removed.",
//           }
//         : {
//             code: 500,
//             message: "Internal Server Error.",
//           };
//   } catch (err) {
//     console.error(err);
//     res = {
//       code: 500,
//       message: "Internal Server Error.",
//     };
//   } finally {
//     connection.release();
//     return res;
//   }
// };

/**
 *
 * @param fastify
 * @param data {
 *  categoryId: number
 *  products: number[]
 * }
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const removeProductsFromCategory = async (
  fastify: FastifyInstance,
  data: any
) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    let args = "";
    for (const id of data.products) {
      args = args.concat(`${id},`);
    }

    if (args.length > 0) {
      args = args.substring(0, args.length - 1);
      let sql = "DELETE FROM productsCategories ";
      sql += `WHERE categoryId = ${data.categoryId} AND productId IN (${args});`;
      const [result] = await connection.execute(sql);
      res =
        result?.affectedRows > 0
          ? {
            code: 204,
            message: "Product Categories removed.",
          }
          : {
            code: 500,
            message: "Internal Server Error.",
          };
    }
  } catch (err) {
    console.error(err);
    res = {
      code: 500,
      message: "Internal Server Error.",
    };
  } finally {
    connection.release();
    return res;
  }
};
