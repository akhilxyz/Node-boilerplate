import { Request, Response, NextFunction } from 'express';

export const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
    const offset = (page - 1) * limit;
    // Attach pagination info to the request object
    req.pagination = {
        limit,
        offset,
    };
    next();
};
