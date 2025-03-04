import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Express Request için özel interface ekleyelim (typesciprt desteği için)
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Authorization header'ını kontrol et
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Not authorized, no token', false);
        }

        // Token'ı al
        const token = authHeader.split(' ')[1];

        // Token'ı doğrula
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;

        // Doğrulanmış kullanıcı bilgilerini al
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
            },
        });

        if (!user) {
            throw new ApiError(401, 'Not authorized, user does not exist', false);
        }

        if (user.status !== 'ACTIVE') {
            throw new ApiError(401, 'User account is not active', false);
        }

        // Request nesnesine kullanıcı bilgilerini ekle
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, 'Invalid token', false);
        }

        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, 'Token expired', false);
        }

        next(error);
    }
};

// Sadece belirli rollere erişimi sınırla
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, 'Not authorized', false);
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                'You do not have permission to perform this action',
                false
            );
        }

        next();
    };
}; 