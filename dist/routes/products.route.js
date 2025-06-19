"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoute = productsRoute;
const functions_1 = require("../functions");
async function productsRoute(fastify) {
    fastify.post("/add-product", async (request, reply) => {
        const result = await (0, functions_1.addProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message, id: result?.id });
    });
    fastify.post("/set-sold-out-status", async (request, reply) => {
        const result = await (0, functions_1.setSoldOutStatus)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/update-product", async (request, reply) => {
        const result = await (0, functions_1.updateProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/delete-product/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await (0, functions_1.removeProduct)(fastify, id);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/assign-product-categories", async (request, reply) => {
        const result = await (0, functions_1.assignProductToCategories)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/assign-product-colors", async (request, reply) => {
        const result = await (0, functions_1.assignProductToColors)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/assign-product-sizes", async (request, reply) => {
        const result = await (0, functions_1.assignProductToSizes)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/remove-product-categories", async (request, reply) => {
        const result = await (0, functions_1.removeCategoriesForProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/remove-product-sizes", async (request, reply) => {
        const result = await (0, functions_1.removeSizesForProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/remove-product-colors", async (request, reply) => {
        const result = await (0, functions_1.removeColorsForProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
}
//# sourceMappingURL=products.route.js.map