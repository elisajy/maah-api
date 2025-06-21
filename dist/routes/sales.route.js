"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRoute = salesRoute;
const functions_1 = require("../functions");
async function salesRoute(fastify) {
    fastify.get("/all-sales", async (request, reply) => {
        return await (0, functions_1.getAllSales)(fastify);
    });
    fastify.get("/sales-details/:id", async (request, reply) => {
        const { id } = request.params;
        return await (0, functions_1.getSalesById)(fastify, id);
    });
    fastify.post("/add-sales", async (request, reply) => {
        const result = await (0, functions_1.addSales)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/sales-details-by-id/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await (0, functions_1.getSalesDetailsById)(fastify, id);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/update-sales", async (request, reply) => {
        const result = await (0, functions_1.updateSalesStatus)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
}
//# sourceMappingURL=sales.route.js.map