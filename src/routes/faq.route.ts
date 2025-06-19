import { FastifyInstance } from "fastify";
import { createFaq, deleteFaq, getAllFAQ, updateFaq } from "../functions";

export async function faqRoute(fastify: FastifyInstance) {
    fastify.get("/all-faq", async (request, reply) => {
        return await getAllFAQ(fastify);
    });

    fastify.post("/add-new-faq", async (request, reply) => {
        return await createFaq(fastify, request.body);
    });

    fastify.post("/update-faq", async (request, reply) => {
        return await updateFaq(fastify, request.body);
    });

    fastify.post("/delete-faq/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await deleteFaq(fastify, id);
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