import { FastifyInstance } from "fastify";
import { formatImageUrl, removeImageFile, uploadImageFile } from "../helpers";

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
export const getAllCompanyInfo = async (fastify: FastifyInstance) => {
  const connection = await fastify["mysql"].getConnection();
  let value: any;

  try {
    const [rows] = await connection.query("SELECT * FROM companyInformation");
    value = rows;
  } finally {
    connection.release();
    return value;
  }
};

/**
 *
 * @param fastify
 * @param key
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
export const getCompanyInfoByKey = async (
  fastify: FastifyInstance,
  key: string
) => {
  const connection = await fastify["mysql"].getConnection();
  let value: any;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM companyInformation WHERE `key`=?",
      [key]
    );
    value = rows[0];
  } finally {
    connection.release();
    return value;
  }
};

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
export const updateCompanyInfoByKey = async (
  fastify: FastifyInstance,
  data: any
) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    const [result] = await connection.execute(
      "UPDATE companyInformation SET value=? WHERE `key`=?",
      [data.value, data.key]
    );
    res =
      result?.affectedRows > 0
        ? {
            code: 204,
            message: `Company info - ${data.key} updated.`,
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
 * @param key
 * @param image (AsyncIterableIterator<fastifyMultipart.MultipartFile>)
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const modifyImg = async (
  fastify: FastifyInstance,
  key: string,
  image: any
) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    // const [rows] = await connection.query('SELECT * FROM companyInformation WHERE key=?', [key || "OUR_STORY_IMG"]);
    const [rows] = await connection.query(
      "SELECT * FROM companyInformation WHERE key=?",
      [key]
    );

    if (!rows || rows.length === 0) {
      res = {
        code: 400,
        message: `${key} - image not found.`,
      };
      return;
    }

    if (rows[0].value) {
      const oldFile = rows[0].value.split("/");
      removeImageFile(`home/${key}`, oldFile[oldFile.length - 1]);
    }

    uploadImageFile(`home/${key}`, image);

    const [result] = await connection.execute(
      "UPDATE companyInformation SET value=? WHERE key=?",
      [formatImageUrl(`home/${key}`, image.filename), key]
    );
    res =
      result?.affectedRows > 0
        ? {
            code: 201,
            message: `${key} - image uploaded.`,
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
