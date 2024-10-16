import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { cryptoEngine, handleServiceResponse } from "@/common/utils";
import { JWT_MESSAGES } from "@/common/contants/activity.contants";


/**
 * Validates the JWT token in the request headers.
 * If the token is valid, it continues to the next middleware.
 * If the token is invalid or expired, it returns an appropriate HTTP response.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 */
export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers["api-access-token"];
  if (!token) {
    return res.status(401).json({ message: JWT_MESSAGES.INVALID_ACCESS_TOKEN });  // Added return here
  }
  const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;

  if (!decoded || !decoded.header || !decoded.payload) {
    const failure = ServiceResponse.failure(JWT_MESSAGES.VARIFICATION_FAILED, null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(failure, res);  // Added return here
  }

  const { exp } = decoded.payload;

  // Check if the token is expired
  if (exp && Date.now() >= exp * 1000) {
    const failure = ServiceResponse.failure(JWT_MESSAGES.TOKEN_EXPIRED, null, StatusCodes.GONE);
    return handleServiceResponse(failure, res);  // Added return here
  }

  const verified: any = cryptoEngine.Jwt.verifyJwt(token);

  if (verified) {
    const { data } = verified;
    const decryptedData = cryptoEngine.decryptEngine(data);
    req.user = decryptedData;
    return next();  // Continue to the next middleware
  } else {
    const failure = ServiceResponse.failure(JWT_MESSAGES.VARIFICATION_FAILED, null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(failure, res);  // Added return here
  }
};

export default validateJwtToken;
