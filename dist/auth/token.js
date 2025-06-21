"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = (user, fastify) => {
    const payload = {
        lastLoginDate: user.lastLoginDate,
        username: user.username,
        id: user.id
    };
    const signOptions = {
        issuer: 'Maahstudio',
        subject: user.username,
        audience: 'maahstudio.com',
        algorithm: 'RS256',
        expiresIn: '8h',
    };
    // Access token
    return fastify.jwt.sign(payload, signOptions);
};
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map