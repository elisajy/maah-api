import { FastifyInstance } from "fastify";
import { addVouchers, deleteVoucher, getAllVouchers, updateVoucher } from "../functions";

export async function voucherRoute(fastify: FastifyInstance) {
    fastify.get("/all-voucher", async (request, reply) => {
        return await getAllVouchers(fastify);
    });

    fastify.post("/add-new-voucher", async (request, reply) => {
        return await addVouchers(fastify, request.body);
    });

    fastify.post("/update-voucher", async (request, reply) => {
        return await updateVoucher(fastify, request.body);
    });

    fastify.post("/delete-voucher/:id", async (request, reply) => {
        const { id }: any = request.params;
        return await deleteVoucher(fastify, id);
    });
}