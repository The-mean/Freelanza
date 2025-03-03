import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ApiError } from './errorHandler';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((error: ValidationError) => {
            return {
                param: error.path,
                message: error.msg,
            };
        });

        throw new ApiError(400, 'Validation error', true);
    }
    next();
}; 