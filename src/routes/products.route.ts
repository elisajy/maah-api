import { FastifyInstance } from "fastify";
import { addProduct, assignProductToCategories, assignProductToColors, assignProductToSizes, removeCategoriesForProduct, removeColorsForProduct, removeProduct, removeSizesForProduct, setSoldOutStatus, updateDiscountPrice, updateOnSalesStatus, updateProduct } from "../functions";

export async function productsRoute(fastify: FastifyInstance) {
    fastify.post("/add-product", async (request, reply) => {
        const result = await addProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message, id: result?.id });
    });

    fastify.post("/set-sold-out-status", async (request, reply) => {
        const result = await setSoldOutStatus(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-product", async (request, reply) => {
        const result = await updateProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/delete-product/:id", async (request, reply) => {
        const { id }: any = request.params;
        const result = await removeProduct(fastify, id);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/assign-product-categories", async (request, reply) => {
        const result = await assignProductToCategories(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/assign-product-colors", async (request, reply) => {
        const result = await assignProductToColors(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/assign-product-sizes", async (request, reply) => {
        const result = await assignProductToSizes(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/remove-product-categories", async (request, reply) => {
        const result = await removeCategoriesForProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/remove-product-sizes", async (request, reply) => {
        const result = await removeSizesForProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/remove-product-colors", async (request, reply) => {
        const result = await removeColorsForProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-on-sales", async (request, reply) => {
        const { id, status } = request.body as { id: number; status: boolean | number };
        const result = await updateOnSalesStatus(fastify, id, status);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-discount-price", async (request, reply) => {
        const result = await updateDiscountPrice(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });
}