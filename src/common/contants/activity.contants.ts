export enum USER_MESSAGES {
  NO_USER_FOUND = "No Users found",
  USER_FOUND = "Users found",
  EMAI_EXIST = "email already exists",
  USER_CREATED = "User created successfully",
  ERROR_TO_CREATE_USER = "error to create user",
  EMAIL_NOT_EXIST = "email does not exists",
  INCORRECT_PASSWORD = "Incorrect Password",
  LOGIN = "Logged in",
  LOGOUT = "Logout",
  FILE_UPLOAD = "File Uploaded Successfully",
}

export enum JWT_MESSAGES {
  INVALID_ACCESS_TOKEN = "Access token is missing or invalid",
  VARIFICATION_FAILED = "JWT verification failed: invalid token",
  TOKEN_EXPIRED = "JWT token is expired"
}