"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configRoute = configRoute;
const functions_1 = require("../functions");
async function configRoute(fastify) {
    fastify.get("/all-config", async (request, reply) => {
        return await (0, functions_1.getAllConfig)(fastify);
    });
    fastify.post("/add-new-config", async (request, reply) => {
        return await (0, functions_1.addConfig)(fastify, request.body);
    });
    fastify.post("/update-config", async (request, reply) => {
        return await (0, functions_1.updateConfig)(fastify, request.body);
    });
    fastify.post("/delete-config/:id", async (request, reply) => {
        const { id } = request.params;
        return await (0, functions_1.deleteConfig)(fastify, id);
    });
}
//# sourceMappingURL=frontend-config.route.js.map