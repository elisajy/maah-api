"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherRoute = voucherRoute;
const functions_1 = require("../functions");
async function voucherRoute(fastify) {
    fastify.get("/all-voucher", async (request, reply) => {
        return await (0, functions_1.getAllVouchers)(fastify);
    });
    fastify.post("/add-new-voucher", async (request, reply) => {
        return await (0, functions_1.addVouchers)(fastify, request.body);
    });
    fastify.post("/update-voucher", async (request, reply) => {
        return await (0, functions_1.updateVoucher)(fastify, request.body);
    });
    fastify.post("/delete-voucher/:id", async (request, reply) => {
        const { id } = request.params;
        return await (0, functions_1.deleteVoucher)(fastify, id);
    });
}
//# sourceMappingURL=vouchers.route.js.map