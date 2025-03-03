import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    logger.error(`${err.name}: ${err.message}`);

    // Özel API hataları
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    // Validation hatası (express-validator)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: err.message,
        });
    }

    // Prisma hataları
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Database error',
        });
    }

    // JWT hataları
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            statusCode: 401,
            message: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            statusCode: 401,
            message: 'Token expired',
        });
    }

    // Diğer beklenmeyen hatalar
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
}; 