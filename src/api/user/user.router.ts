import { createApiResponse } from "@/api-docs/openAPI.ResponseBuilders";
import { userController } from "@/api/user/user.controller";
import { AddUserSchemaBody, GetUserSchema, LoginSchemaBody, UserSchema } from "@/api/user/user.schema";
import { API, MESSAGE, METHODS } from "@/common/contants";
import { validateJwtToken } from "@/common/middleware";
import { paginationMiddleware } from "@/common/middleware/pagination.middleware";
import { HeadersSchema, expressRouter, validateRequest } from "@/common/utils";
import { paginationSchema } from "@/common/utils/utils.commonValidation";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";

// Define user-related API endpoints and schemas
const { ROUTE, TAGS } = API.USER;
const { GET, POST } = METHODS;

// Define the Zod schemas
const userRouter: Router = Router();
const userRegistry = new OpenAPIRegistry();
userRegistry.register(ROUTE, UserSchema);

// Define API paths and request/response schemas separately
// NOTE:: Apply validation middleware before handler
const userApiPaths = [
  {
    method: POST,
    path: `/${ROUTE}/register`,
    tags: TAGS,
    request: { body: AddUserSchemaBody.shape.body },
    responses: createApiResponse(UserSchema, MESSAGE.SUCCESS),
    middleware: [validateRequest(AddUserSchemaBody)],
    handler: userController.addUser,
  },
  {
    method: POST,
    path: `/${ROUTE}/sign-in`,
    tags: TAGS,
    request: { body: LoginSchemaBody.shape.body },
    responses: createApiResponse(UserSchema, MESSAGE.SUCCESS),
    middleware: [validateRequest(LoginSchemaBody)],
    handler: userController.logIn,
  },
  {
    method: GET,
    path: `/${ROUTE}/list`,
    tags: TAGS,
    request: { query: paginationSchema, headers: HeadersSchema },
    responses: createApiResponse(z.array(UserSchema), MESSAGE.SUCCESS),
    middleware: [validateJwtToken, paginationMiddleware],
    handler: userController.getUsers,
  },
  {
    method: GET,
    path: `/${ROUTE}/details/{id}`,
    tags: TAGS,
    request: { params: GetUserSchema.shape.params, headers: HeadersSchema },
    responses: createApiResponse(UserSchema, MESSAGE.SUCCESS),
    middleware: [validateRequest(GetUserSchema), validateJwtToken],
    handler: userController.getUser,
  },
];

expressRouter(userApiPaths, userRegistry, userRouter);

export { userRouter, userRegistry };
