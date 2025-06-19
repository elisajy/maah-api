import { FastifyInstance } from "fastify";
import { createColors, deleteColors, getAllColors, getColorDetailsById, updateColors } from "../functions";

export async function colorsRoute(fastify: FastifyInstance) {
    fastify.get("/all-colors", async (request, reply) => {
        return await getAllColors(fastify);
    });

    // fastify.get("/colors-no-sub", async (request, reply) => {
    //     return await getColorsNotInMenu(fastify);
    // });

    fastify.get("/color-details/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await getColorDetailsById(fastify, id);
    });

    // fastify.post("/add-color", async (request, reply) => {
    //     const result = await createColor(fastify, request.body);
    //     reply.code(result?.code!).send({ message: result?.message });
    // });

    fastify.post("/add-colors", async (request, reply) => {
        const result = await createColors(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });

    fastify.post("/update-color", async (request, reply) => {
        const result = await updateColors(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
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
        const result = await deleteColors(fastify, request.body);
        reply.code(result?.code!).send({ message: result?.message });
    });
}