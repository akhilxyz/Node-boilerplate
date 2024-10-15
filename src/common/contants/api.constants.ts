export const API = {
  BASE_URL: "/v1",
  USER: {
    ROUTE: "users",
    TAGS: ["User"]
  }
}

export enum METHODS {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export enum MESSAGE {
  SUCCESS = 'success',
  FAILURE = 'failure'
}