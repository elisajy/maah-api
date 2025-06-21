import { FastifyInstance } from "fastify";
import { addConfig, deleteConfig, getAllConfig, updateConfig } from "../functions";

export async function configRoute(fastify: FastifyInstance) {
    fastify.get("/all-config", async (request, reply) => {
        return await getAllConfig(fastify);
    });

    fastify.post("/add-new-config", async (request, reply) => {
        return await addConfig(fastify, request.body);
    });

    fastify.post("/update-config", async (request, reply) => {
        return await updateConfig(fastify, request.body);
    });

    fastify.post("/delete-config/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await deleteConfig(fastify, id);
    });
}