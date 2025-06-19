import { FastifyInstance } from "fastify";
import { createSetsWithoutProduct, createSetsWithProducts, getAllSets, getSetsById, removeSet, removeSetItems, updateSetItems, updateSets, updateSetThumbnail } from "../functions";

export async function setsRoute(fastify: FastifyInstance) {
    fastify.get("/all-sets", async (request, reply) => {
        return await getAllSets(fastify);
    });

    fastify.post("/update-set-thumbnail", async (request, reply) => {
        const result = await updateSetThumbnail(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/create-sets-without-prod", async (request, reply) => {
        const result = await createSetsWithoutProduct(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/create-sets-with-prod", async (request, reply) => {
        const result = await createSetsWithProducts(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-sets", async (request, reply) => {
        const result = await updateSets(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-set-items", async (request, reply) => {
        const result = await updateSetItems(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/remove-set-items", async (request, reply) => {
        const result = await removeSetItems(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/remove-set/:id", async (request, reply) => {
        const { id }: any = request.params;
        const result = await removeSet(fastify, id);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/get-sets-by-id/:id", async (request, reply) => {
        const { id }: any = request.params;
        const result = await getSetsById(fastify, id);
        reply.code(result?.code!).send({ message: result?.message });
    });
}