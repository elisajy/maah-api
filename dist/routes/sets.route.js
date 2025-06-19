"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setsRoute = setsRoute;
const functions_1 = require("../functions");
async function setsRoute(fastify) {
    fastify.get("/all-sets", async (request, reply) => {
        return await (0, functions_1.getAllSets)(fastify);
    });
    fastify.post("/update-set-thumbnail", async (request, reply) => {
        const result = await (0, functions_1.updateSetThumbnail)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/create-sets-without-prod", async (request, reply) => {
        const result = await (0, functions_1.createSetsWithoutProduct)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/create-sets-with-prod", async (request, reply) => {
        const result = await (0, functions_1.createSetsWithProducts)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/update-sets", async (request, reply) => {
        const result = await (0, functions_1.updateSets)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/update-set-items", async (request, reply) => {
        const result = await (0, functions_1.updateSetItems)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/remove-set-items", async (request, reply) => {
        const result = await (0, functions_1.removeSetItems)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/remove-set/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await (0, functions_1.removeSet)(fastify, id);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/get-sets-by-id/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await (0, functions_1.getSetsById)(fastify, id);
        reply.code(result?.code).send({ message: result?.message });
    });
}
//# sourceMappingURL=sets.route.js.map