"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorsRoute = colorsRoute;
const functions_1 = require("../functions");
async function colorsRoute(fastify) {
    fastify.get("/all-colors", async (request, reply) => {
        return await (0, functions_1.getAllColors)(fastify);
    });
    // fastify.get("/colors-no-sub", async (request, reply) => {
    //     return await getColorsNotInMenu(fastify);
    // });
    fastify.get("/color-details/:id", async (request, reply) => {
        const { id } = request.params;
        return await (0, functions_1.getColorDetailsById)(fastify, id);
    });
    // fastify.post("/add-color", async (request, reply) => {
    //     const result = await createColor(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    fastify.post("/add-colors", async (request, reply) => {
        const result = await (0, functions_1.createColors)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    fastify.post("/update-color", async (request, reply) => {
        const result = await (0, functions_1.updateColors)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
    // fastify.get("/isColorDeletable/:id", async (request, reply) => {
    //     const { id }: any = request.params;
    //     return !(await areProductsExistedUnderColor(fastify, id));
    // });
    // fastify.post("/delete-color/:id", async (request, reply) => {
    //     const { id }: any = request.params;
    //     const result = await deleteColor(fastify, id);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    fastify.post("/delete-colors", async (request, reply) => {
        const result = await (0, functions_1.deleteColors)(fastify, request.body);
        reply.code(result?.code).send({ message: result?.message });
    });
}
//# sourceMappingURL=colors.route.js.map