import { FastifyInstance } from "fastify";
import { createSizes, deleteSizes, getAllSizes, getSizeDetailsById, updateSizes } from "../functions";

export async function sizesRoute(fastify: FastifyInstance) {
    fastify.get("/all-sizes", async (request, reply) => {
        return await getAllSizes(fastify);
    });

    fastify.get("/size-details/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await getSizeDetailsById(fastify, id);
    });

    fastify.post("/add-size", async (request, reply) => {
        const result = await createSizes(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-size", async (request, reply) => {
        const result = await updateSizes(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/delete-size/:id", async (request, reply) => {
        const { id }: any = request.params;
        const result = await deleteSizes(fastify, id);
        reply.code(result?.code!).send({ message: result?.message });
    });
}