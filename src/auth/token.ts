import { FastifyInstance } from 'fastify';

export interface ITokenInfo {
    id: number;
    username: string;
    lastLoginDate: string;
}

export const generateToken = (user: any, fastify: FastifyInstance) => {
    const payload: ITokenInfo = {
        lastLoginDate: user.lastLoginDate,
        username: user.username,
        id: user.id
    };
    const signOptions: any = {
        issuer: 'Maahstudio',
        subject: user.username,
        audience: 'maahstudio.com',
        algorithm: 'RS256',
        expiresIn: '8h',
    };

    // Access token
    return fastify.jwt.sign(payload, signOptions);
};
