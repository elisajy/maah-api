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
export const getCompanyInfoByName = async (
  fastify: FastifyInstance,
  name: string
) => {
  const connection = await fastify["mysql"].getConnection();
  let value: any;

  try {
    const [rows] = await connection.query(
      "SELECT * FROM companyInformation WHERE `name`=?",
      [name]
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
export const updateCompanyInfoByName = async (
  fastify: FastifyInstance,
  data: any
) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    const [result] = await connection.execute(
      "UPDATE companyInformation SET value=? WHERE `name`=?",
      [data.value, data.name]
    );
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
 * @param name
 * @param image (AsyncIterableIterator<fastifyMultipart.MultipartFile>)
 * @returns {
 *  code: number,
 *  message: string,
 * }
 */
export const modifyImg = async (
  fastify: FastifyInstance,
  name: string,
  image: any
) => {
  const connection = await fastify["mysql"].getConnection();
  let res: { code: number; message: string } = { code: 200, message: "OK." };

  try {
    const [rows] = await connection.query(
      "SELECT * FROM companyInformation WHERE name=?",
      [name]
    );

    if (!rows || rows.length === 0) {
      res = {
        code: 400,
        message: `Information not found.`,
      };
      return;
    }

    if (rows[0].value) {
      const oldFile = rows[0].value.split("/");
      removeImageFile(`home/${name}`, oldFile[oldFile.length - 1]);
    }

    uploadImageFile(`home/${name}`, image);

    const [result] = await connection.execute(
      "UPDATE companyInformation SET value=? WHERE name=?",
      [formatImageUrl(`home/${name}`, image.filename), name]
    );
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
