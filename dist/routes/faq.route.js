"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRoute = faqRoute;
const functions_1 = require("../functions");
async function faqRoute(fastify) {
    fastify.get("/all-faq", async (request, reply) => {
        return await (0, functions_1.getAllFAQ)(fastify);
    });
    fastify.get("/add-new-faq", async (request, reply) => {
        return await (0, functions_1.createFaq)(fastify, request.body);
    });
    fastify.get("/update-faq", async (request, reply) => {
        // const { id }: any = request.params;
        return await (0, functions_1.updateFaq)(fastify, request.body);
    });
    fastify.get("/delete-faq/:id", async (request, reply) => {
        const { id } = request.params;
        return await (0, functions_1.deleteFaq)(fastify, id);
    });
    // fastify.post("/add-faq-section", async (request, reply) => {
    //     const result = await createSection(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    // fastify.post("/add-faq-question", async (request, reply) => {
    //     const result = await createQuestion(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    // fastify.post("/update-faq-section", async (request, reply) => {
    //     const result = await updateSection(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    // fastify.post("/update-faq-question", async (request, reply) => {
    //     const result = await updateQuestion(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    // fastify.post("/delete-faq-section/:id", async (request, reply) => {
    //     const { id }: any = request.params;
    //     const result = await deleteSection(fastify, id);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
    // fastify.post("/delete-faq-questions", async (request, reply) => {
    //     const result = await deleteQuestions(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });
}
//# sourceMappingURL=faq.route.js.map