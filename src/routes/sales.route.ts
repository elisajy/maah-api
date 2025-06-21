import { FastifyInstance } from "fastify";
import { addSales, getAllSales, getSalesById, getSalesDetailsById, updateSalesStatus } from "../functions";

export async function salesRoute(fastify: FastifyInstance) {
    fastify.get("/all-sales", async (request, reply) => {
        return await getAllSales(fastify);
    });

    fastify.get("/sales-details/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await getSalesById(fastify, id);
    });

    fastify.post("/add-sales", async (request, reply) => {
        const result = await addSales(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/sales-details-by-id/:id", async (request, reply) => {
        const { id }: any = request.params;
        const result = await getSalesDetailsById(fastify, id);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-sales", async (request, reply) => {
        const result = await updateSalesStatus(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });
}