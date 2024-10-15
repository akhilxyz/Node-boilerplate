// In a new file, e.g., `src/types/express.d.ts`

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            pagination?: {
                limit: number;
                offset: number;
            };
        }
    }
}