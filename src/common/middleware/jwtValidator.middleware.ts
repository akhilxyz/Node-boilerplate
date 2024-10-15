import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { cryptoEngine, handleServiceResponse } from "@/common/utils";
import { JWT_MESSAGES } from "@/common/contants/activity.contants";

export const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers["api-access-token"];
  if (!token) {
    return res.status(401).json({ message: JWT_MESSAGES.INVALID_ACCESS_TOKEN });
  }
  const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload;

  if (!decoded || !decoded.header || !decoded.payload) {
    const failure = ServiceResponse.failure(JWT_MESSAGES.VARIFICATION_FAILED, null, StatusCodes.BAD_REQUEST);
    handleServiceResponse(failure, res);
  }
  const { exp } = decoded.payload;

  // Check if the token is expired
  if (exp && Date.now() >= exp * 1000) {
    const failure = ServiceResponse.failure(JWT_MESSAGES.TOKEN_EXPIRED, null, StatusCodes.GONE);
    handleServiceResponse(failure, res);
  }

  const verified: any = cryptoEngine.Jwt.verifyJwt(token);
  if (verified) {
    const { data } = verified;
    cryptoEngine.Jwt.decodeJwt(data);
    next();
  } else {
    const failure = ServiceResponse.failure(JWT_MESSAGES.VARIFICATION_FAILED, null, StatusCodes.BAD_REQUEST);
    handleServiceResponse(failure, res);
  }
};

export default validateJwtToken;
